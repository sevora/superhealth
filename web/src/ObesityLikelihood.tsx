import { useState } from 'react';
import { convertToObesityLikelihoodModelInput } from './utilities/model-input-conversion';
import { indexOfMax } from './utilities/indexer';

import ort from 'onnxruntime-web/wasm';
import useHealthSurveyStore from './hooks/health-survey-store';

function ObesityLikelihood() {
    const store = useHealthSurveyStore();
    const [open, setOpen] = useState<boolean>(false);
    const [results, setResults] = useState< [number, number, number, number, number, number, number] | null>(null);

    const outputClasses = ["Underweight", "Normal Weight", "Obesity I", "Obesity II", "Obesity III", "Overweight I", "Overweight 2"];
    const outputClassIndex = results ? indexOfMax(results) : -1;

    async function computeOutcome() {
        const session = await ort.InferenceSession.create('/onnx/obesity_likelihood_model.onnx', { executionProviders: ['wasm'] });
        const input = new ort.Tensor('float32', Float32Array.from(convertToObesityLikelihoodModelInput(store)));
        const output = await session.run({ [session.inputNames[0]]: input });
        
        /**
         * The results shape and meaning can also be found in the notebook.
         * In this case it is: underweight, normal weight, obesity I, obesity II, obesity III, overweight I, and overweight II.
         */
        const results = Object.values(Object.values(output)[0].data) as [number, number, number, number, number, number, number];
    
        setResults([
            Math.max(0, results[0] * 100),
            Math.max(0, results[1] * 100),
            Math.max(0, results[2] * 100),
            Math.max(0, results[3] * 100),
            Math.max(0, results[4] * 100),
            Math.max(0, results[5] * 100),
            Math.max(0, results[6] * 100),
        ]);
    }

    return (
        <div className="border rounded-md">
            <div className="text-xl p-3 font-medium cursor-pointer hover:bg-neutral-200" onClick={() => setOpen(!open)}>
                Obesity Likelihood Predictor
            </div>

            <div className={`flex flex-col gap-3 px-3 overflow-hidden ${open ? 'block' : 'hidden'}}`}>
                {results &&
                    <div className="my-2 p-3 border rounded-md">
                        <div className="text-lg font-medium">Results</div>
                        <div>Underweight: {results[0].toFixed(2)}%</div>
                        <div>Normal Weight: {results[1].toFixed(2)}%</div>
                        <div>Overweight Type I: {results[5].toFixed(2)}%</div>
                        <div>Overweight Type II: {results[6].toFixed(2)}%</div>
                        <div>Obese Type I: {results[2].toFixed(2)}%</div>
                        <div>Obese Type II: {results[3].toFixed(2)}%</div>
                        <div>Obese Type III: {results[4].toFixed(2)}%</div>
                        <div>Verdict: {outputClasses[outputClassIndex]}</div>
                        <div>
                            <div className="font-semibold">Recommendations:</div>
                            {
                                outputClassIndex === 0 ?
                                    <div>
                                        The model predicts that you likely will be underweight:
                                        <ul className="list-disc px-5">
                                           <li>it is recommended to maintain a normal weight range</li>
                                           <li>engage more in physical exercise</li>
                                           <li>have a healthy and balanced diet</li>
                                           <li>boost your calories and add healthy fats</li>
                                        </ul>
                                        <a className="text-blue-600" href="https://www.eatthis.com/how-to-gain-weight-if-underweight/" target='_blank'>Source</a>
                                    </div>
                                    :
                                outputClassIndex === 1 ?
                                    <div>
                                        The model predicts that you likely will be normal weight:
                                        <ul className="list-disc px-5">
                                            <li>it is recommended to maintain a normal weight range</li>
                                            <li>continue engaging in physical exercise</li>
                                            <li>continue having a healthy and balanced diet</li>
                                        </ul>
                                        <a className="text-blue-600" href="https://www.eatthis.com/how-to-gain-weight-if-underweight/" target='_blank'>Source</a>
                                    </div>
                                    :
                                outputClassIndex === 2 ?
                                <div>
                                     The model predicts that you likely will be obese (type I):
                                    <ul className="list-disc px-5">
                                        <li>it is recommended to seek advice from a healthcare professional</li>
                                        <li>avoid processed foods</li>
                                        <li>limit your sugar intake</li>
                                        <li>reduce saturated fat intake</li>
                                    </ul>
                                    <a className="text-blue-600" href="https://www.verywellhealth.com/obesity-prevention-4014175" target='_blank'>Source</a>
                                </div>
                                  :
                                  outputClassIndex === 3 ?
                                <div>
                                    The model predicts that you likely will be obese (type II):
                                    <ul className="list-disc px-5">
                                        <li>it is recommended to seek advice from a healthcare professional</li>
                                        <li>avoid processed foods</li>
                                        <li>limit your sugar intake</li>
                                        <li>reduce saturated fat intake</li>
                                    </ul>
                                    <a className="text-blue-600" href="https://www.verywellhealth.com/obesity-prevention-4014175" target='_blank'>Source</a>
                                </div>
                                  :
                                  outputClassIndex === 4 ?
                                <div>
                                    The model predicts that you likely will be obese (type III):
                                    <ul className="list-disc px-5">
                                        <li>it is recommended to seek advice from a healthcare professional</li>
                                        <li>avoid processed foods</li>
                                        <li>limit your sugar intake</li>
                                        <li>reduce saturated fat intake</li>
                                    </ul>
                                    <a className="text-blue-600" href="https://www.verywellhealth.com/obesity-prevention-4014175" target='_blank'>Source</a>
                                </div>
                                 :
                                 outputClassIndex === 5 ?
                               <div>
                                   The model predicts that you likely will be overweight (type I):
                                   <ul className="list-disc px-5">
                                        <li>it is recommended to seek advice from a healthcare professional</li>
                                        <li>avoid processed foods</li>
                                        <li>limit your sugar intake</li>
                                        <li>reduce saturated fat intake</li>
                                    </ul>
                                    <a className="text-blue-600" href="https://www.verywellhealth.com/obesity-prevention-4014175" target='_blank'>Source</a>
                               </div>
                               :
                               <div>
                                   The model predicts that you likely will be overweight (type II):
                                   <ul className="list-disc px-5">
                                        <li>it is recommended to seek advice from a healthcare professional</li>
                                        <li>avoid processed foods</li>
                                        <li>limit your sugar intake</li>
                                        <li>reduce saturated fat intake</li>
                                    </ul>
                                    <a className="text-blue-600" href="https://www.verywellhealth.com/obesity-prevention-4014175" target='_blank'>Source</a>
                               </div>
                            }
                        </div>

                        <button className="px-5 mt-3 py-1 text-white bg-purple-500 rounded-full hover:bg-purple-700 transition-colors" onClick={() => setResults(null)}>
                            Clear Results
                        </button>
                    </div>
                }
                {/* Question: Sex */}
                <div className="flex flex-col gap-1">
                    <div>Sex</div>
                    <select className="px-5 py-1 border rounded-full" value={store.sex} onChange={event => store.update({ sex: event.currentTarget.value as any })}>    
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                
                {/* Question: History Overweight */}
                <div className="flex flex-col gap-1">
                    <div>Does your family have a history of being overweight?</div>
                    <select className="px-5 py-1 border rounded-full" value={store.hasFamilyHistoryOverweight ? 1 : 0} onChange={event => store.update({ hasFamilyHistoryOverweight: !!parseInt(event.currentTarget.value) })}>    
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </div>

                {/* Question: High Calorie Food */}
                <div className="flex flex-col gap-1">
                    <div>Do you frequently eat high calorie food?</div>
                    <select className="px-5 py-1 border rounded-full" value={store.frequentHighCalorieFood ? 1 : 0} onChange={event => store.update({ frequentHighCalorieFood: !!parseInt(event.currentTarget.value) })}>    
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </div>

                {/* Question: Eat Between Meals */}
                <div className="flex flex-col gap-1">
                    <div>Do you frequently eat between meals?</div>
                    <select className="px-5 py-1 border rounded-full" value={store.frequentEatBetweenMeals ? 1 : 0} onChange={event => store.update({ frequentEatBetweenMeals: !!parseInt(event.currentTarget.value) })}>    
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </div>

                {/* Question: Monitor High Calorie */}
                <div className="flex flex-col gap-1">
                    <div>Do you monitor your calories?</div>
                    <select className="px-5 py-1 border rounded-full" value={store.hasMonitorCalories ? 1 : 0} onChange={event => store.update({ hasMonitorCalories: !!parseInt(event.currentTarget.value) })}>    
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </div>

                {/* Question: Alcohol */}
                <div className="flex flex-col gap-1">
                    <div>Do you frequently drink alcohol?</div>
                    <select className="px-5 py-1 border rounded-full" value={store.frequentDrinkAlcohol ? 1 : 0} onChange={event => store.update({ frequentDrinkAlcohol: !!parseInt(event.currentTarget.value) })}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </div>

                {/* Question: Transportation */}
                <div className="flex flex-col gap-1">
                    <div>What is your usual mode of transportation?</div>
                    <select className="px-5 py-1 border rounded-full" value={store.usualTransportation} onChange={event => store.update({ usualTransportation: event.currentTarget.value as any })}>    
                        <option value="car">Car</option>
                        <option value="bicycle">Bicycle</option>
                        <option value="motorcycle">Motorcycle</option>
                        <option value="public">Public Transportation</option>
                    </select>
                </div>

                <button className="px-5 py-1 mb-2 bg-blue-500 text-white rounded-full hover:bg-blue-800 transition-colors" onClick={computeOutcome}>
                    Run model
                </button>
            </div>
        </div>
    )

}

export default ObesityLikelihood;