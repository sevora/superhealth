import { useEffect, useState } from 'react';
import { convertToDiabetesLikelihoodModelInput } from './utilities/model-input-conversion';
import { indexOfMax } from './utilities/indexer';

import ort from 'onnxruntime-web/wasm';
import useHealthSurveyStore from './hooks/health-survey-store';

function DiabetesLikelihood() {
    const store = useHealthSurveyStore();
    const [open, setOpen] = useState<boolean>(false);
    const [results, setResults] = useState<[number, number, number] | null>(null);

    const outputClasses = ["No diabetes", "Prediabetes", "Diabetes"];
    const outputClassIndex = results ? indexOfMax(results) : -1;

    async function computeOutcome() {
        const session = await ort.InferenceSession.create('/onnx/diabetes_likelihood_model.onnx', { executionProviders: ['wasm'] });
        const input = new ort.Tensor('float32', Float32Array.from(convertToDiabetesLikelihoodModelInput(store)));
        const output = await session.run({ [session.inputNames[0]]: input });
        const results = Object.values(Object.values(output)[0].data) as [number, number, number];
        
        setResults([
            Math.max(0, results[0] * 100),
            Math.max(0, results[1] * 100),
            Math.max(0, results[2] * 100)
        ]);
    }

    return (
        <div className="border rounded-md">
            <div className="text-xl p-3 font-medium cursor-pointer hover:bg-neutral-200" onClick={() => setOpen(!open)}>
                Diabetes Likelihood Predictor
            </div>

            <div className={`flex flex-col gap-3 px-3 overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-[9999px]' : 'max-h-0'}`}>
                {results &&
                    <div className="my-2 p-3 border rounded-md">
                        <div className="text-lg font-medium">Results</div>
                        <div>No Diabetes: {results[0].toFixed(2)}%</div>
                        <div>Prediabetes: {results[1].toFixed(2)}%</div>
                        <div>Diabetes: {results[2].toFixed(2)}%</div>
                        <div>Verdict: {outputClasses[outputClassIndex]}</div>
                        <div>
                            <div className="font-semibold">
                                Recommendations
                            </div>
                            <a className="text-blue-600" href="https://www.mayoclinic.org/diseases-conditions/diabetes/in-depth/diabetes-management/ART-20045803" target='_blank'>Source</a>
                            {
                                outputClassIndex === 0 ?
                                    <div>
                                        The model predicts that you likely have no diabetes:
                                        <ul className="list-disc px-5">
                                           <li>maintain your weight</li>
                                           <li>maintain physical exercise</li>  
                                           <li>regularly eat healthy fats</li>  
                                        </ul>
                                    </div>
                                    :
                                outputClassIndex === 1 ?
                                    <div>
                                        The model predicts that you are likely to undergo prediabetes:
                                        <ul className="list-disc px-5">
                                            <li>seek advice from a healthcare professional</li>
                                            <li>it is recommended to avoid smoking</li>
                                            <li>reduce stress</li>
                                            <li>ensure you get regular physical exams</li>
                                            <li>keep vaccines up to date</li>
                                        </ul>
                                    </div>
                                    :
                                    <div>
                                        The model predicts that you are likely to have diabetes:
                                        <ul className="list-disc px-5">
                                            <li>seek advice from a healthcare professional</li>
                                            <li>do not smoke</li>
                                            <li>keep your blood pressure and cholesterol under control</li>
                                            <li>schedule regular physical exams</li>
                                            <li>keep vaccines up to date</li>
                                            <li>pay attention to yourself</li>
                                        </ul>
                                    </div>
                            }
                        </div>
                        <button className="px-5 mt-3 py-1 text-white bg-purple-500 rounded-full hover:bg-purple-700 transition-colors" onClick={() => setResults(null)}>
                            Clear Results
                        </button>
                    </div>
                }
                <div className="flex flex-col gap-1">
                    <div>Weight (in kilograms)</div>
                    <input type="number" step=".01" className="px-5 py-1 border rounded-full" value={store.weight} onChange={(event) => store.update({ weight: parseFloat(event.currentTarget.value) })} />
                </div>

                <div className="flex flex-col gap-1">
                    <div>Height (in meters)</div>
                    <input type="number" step=".01" className="px-5 py-1 border rounded-full" value={store.height} onChange={(event) => store.update({ height: parseFloat(event.currentTarget.value) })} />
                </div>

                <div className="flex flex-col gap-1">
                    <div>Sex</div>
                    <select className="px-5 py-1 border rounded-full" value={store.sex} onChange={event => store.update({ sex: event.currentTarget.value as any })}>    
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <div>Systolic Blood Pressure (in mmHg)</div>
                    <input type="number" className="px-5 py-1 border rounded-full" value={store.systolicBloodPressure} onChange={(event) => store.update({ systolicBloodPressure: parseInt(event.currentTarget.value) })} />
                </div>

                <div className="flex flex-col gap-1">
                    <div>Diastolic Blood Pressure  (in mmHg)</div>
                    <input type="number" className="px-5 py-1 border rounded-full" value={store.diastolicBloodPressure} onChange={(event) => store.update({ diastolicBloodPressure: parseInt(event.currentTarget.value) })} />
                </div>

                <div className="flex flex-col gap-1">
                    <div>Cholesterol (LDL mg/dL)</div>
                    <input type="number" step=".01" className="px-5 py-1 border rounded-full" value={store.cholesterol} onChange={(event) => store.update({ cholesterol: parseFloat(event.currentTarget.value) })} />
                </div>

                <div className="flex flex-col gap-1">
                    <div>Do you smoke frequently?</div>
                    <select className="px-5 py-1 border rounded-full" value={store.frequentSmoke ? 1 : 0} onChange={event => store.update({ frequentSmoke: !!parseInt(event.currentTarget.value) })}>    
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <div>Have you had a stroke?</div>
                    <select className="px-5 py-1 border rounded-full" value={store.hasHadStroke ? 1 : 0} onChange={event => store.update({ hasHadStroke: !!parseInt(event.currentTarget.value) })}>    
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <div>Do you currently have a heart disease?</div>
                    <select className="px-5 py-1 border rounded-full" value={store.hasHeartDisease ? 1 : 0} onChange={event => store.update({ hasHeartDisease: !!parseInt(event.currentTarget.value) })}>    
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <div>Do you frequently have physical activity?</div>
                    <select className="px-5 py-1 border rounded-full" value={store.frequentPhysicalActivity ? 1 : 0} onChange={event => store.update({ frequentPhysicalActivity: !!parseInt(event.currentTarget.value) })}>    
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <div>Do you frequently eat fruits?</div>
                    <select className="px-5 py-1 border rounded-full" value={store.frequentEatFruits ? 1 : 0} onChange={event => store.update({ frequentEatFruits: !!parseInt(event.currentTarget.value) })}>    
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <div>Do you frequently eat vegetables?</div>
                    <select className="px-5 py-1 border rounded-full" value={store.frequentEatVegetables ? 1 : 0} onChange={event => store.update({ frequentEatVegetables: !!parseInt(event.currentTarget.value) })}>    
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </div>
                
                <div className="flex flex-col gap-1">
                    <div>Do you frequently drink alcohol?</div>
                    <select className="px-5 py-1 border rounded-full" value={store.frequentDrinkAlcohol ? 1 : 0} onChange={event => store.update({ frequentDrinkAlcohol: !!parseInt(event.currentTarget.value) })}>    
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <div>Do you have any kind of health care coverage or insurance?</div>
                    <select className="px-5 py-1 border rounded-full" value={store.hasHealthcare ? 1 : 0} onChange={event => store.update({ hasHealthcare: !!parseInt(event.currentTarget.value) })}>    
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <div>Do you have difficulty climbing or walking up stairs?</div>
                    <select className="px-5 py-1 border rounded-full" value={store.hasDifficultyClimbing ? 1 : 0} onChange={event => store.update({ hasDifficultyClimbing: !!parseInt(event.currentTarget.value) })}>    
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                    </select>
                </div>
                
                <button className="px-5 py-1 mb-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors" onClick={computeOutcome}>
                    Run model
                </button>
            </div>
        </div>
    )

}

export default DiabetesLikelihood;