import { useState } from 'react';
import { convertToDiabetesLikelihoodModelInput } from './utilities/model-input-conversion';
import { indexOfMax } from './utilities/indexer';

import ort from 'onnxruntime-web/wasm';
import useHealthSurveyStore from './hooks/health-survey-store';
import Loader from './Loader';

/**
 * The component for diabetes likelihood prediction.
 */
function DiabetesLikelihood() {
    const store = useHealthSurveyStore();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<[number, number, number] | null>(null);

    const outputClasses = ["No diabetes", "Prediabetes", "Diabetes"];
    const outputClassIndex = results ? indexOfMax(results) : -1;

    async function computeOutcome() {
        setLoading(true);
        setOpen(true);
        setResults(null);
        
        const session = await ort.InferenceSession.create('/onnx/diabetes_likelihood_model.onnx', { executionProviders: ['wasm'] });
        const input = new ort.Tensor('float32', Float32Array.from(convertToDiabetesLikelihoodModelInput(store)));
        const output = await session.run({ [session.inputNames[0]]: input });

        /**
         * The results shape and meaning can also be found in the notebook.
         * In this case it is: no diabetes, pre-diabetes, and diabetes likelihood.
         */
        const results = Object.values(Object.values(output)[0].data) as [number, number, number];

        setResults([
            Math.max(0, results[0] * 100),
            Math.max(0, results[1] * 100),
            Math.max(0, results[2] * 100)
        ]);
        setOpen(true);
        setLoading(false);
    }

    

    return (
        <div className="border rounded-md">
            <div className="text-xl p-3 font-medium cursor-pointer hover:bg-neutral-200" onClick={() => setOpen(!open || results != null)}>
                Diabetes Likelihood Predictor
            </div>

            {results &&
                <div className="m-2 p-3 border rounded-md">
                    <div className="text-lg font-medium">Results</div>
                    <div>No Diabetes: {results[0].toFixed(2)}%</div>
                    <div>Prediabetes: {results[1].toFixed(2)}%</div>
                    <div>Diabetes: {results[2].toFixed(2)}%</div>
                    <div>Verdict: {outputClasses[outputClassIndex]}</div>
                    <div>
                        <div className="font-semibold">Recommendations</div>
                        {
                            outputClassIndex === 0 ?
                                <div>
                                    The model predicts that you likely have no diabetes:
                                    <ul className="list-disc px-5">
                                        <li>maintain your weight</li>
                                        <li>maintain physical exercise</li>
                                        <li>regularly eat healthy fats</li>
                                    </ul>
                                    <a className="text-blue-600" href="https://www.mayoclinic.org/diseases-conditions/type-2-diabetes/in-depth/diabetes-prevention/art-20047639" target='_blank'>Source</a>
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
                                        <a className="text-blue-600" href="https://www.mayoclinic.org/diseases-conditions/diabetes/in-depth/diabetes-management/ART-20045803" target='_blank'>Source</a>
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
                                        <a className="text-blue-600" href="https://www.mayoclinic.org/diseases-conditions/diabetes/in-depth/diabetes-management/ART-20045803" target='_blank'>Source</a>
                                    </div>
                        }
                    </div>
                    <button className="px-5 mt-3 py-1 text-white bg-purple-500 rounded-full hover:bg-purple-700 transition-colors" onClick={() => setResults(null)}>
                        Clear Results
                    </button>
                </div>
            }

            { loading && <Loader/> }

            {(!loading && !results) &&
                <div className={`flex-col gap-3 px-3 overflow-hidden ${open ? 'flex' : 'max-h-0 hidden'}}`}>
                    {/* Question: Weight */}
                    <div className="flex flex-col gap-1">
                        <div>Weight (in kilorams)</div>
                        <input type="number" step=".01" className="px-5 py-1 border rounded-full" value={store.weight} onChange={(event) => store.update({ weight: Math.max(parseFloat(event.currentTarget.value) || 1, 1) })} />
                    </div>


                    {/* Question: Height */}
                    <div className="flex flex-col gap-1">
                        <div>Height (in meters)</div>
                        <input type="number" step=".01" className="px-5 py-1 border rounded-full" value={store.height} onChange={(event) => store.update({ height: Math.max(parseFloat(event.currentTarget.value) || 1, 1) })} />
                    </div>

                    {/* Question: Sex */}
                    <div className="flex flex-col gap-1">
                        <div>Sex</div>
                        <select className="px-5 py-1 border rounded-full" value={store.sex} onChange={event => store.update({ sex: event.currentTarget.value as any })}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    {/* Question: General Health Evaluation */}
                    <div className="flex flex-col gap-1">
                        <div>From a scale of 1-5, how would you rate your health?</div>
                        <input type="number" className="px-5 py-1 border rounded-full" value={store.generalHealthEvaluation} onChange={(event) => store.update({ generalHealthEvaluation: Math.min(Math.max(1, parseInt(event.currentTarget.value) || 1), 5) })} />
                    </div>

                    {/* Question: Mental Health Decline */}
                    <div className="flex flex-col gap-1">
                        <div>From the last 30 days, how many days (0-30) have you felt your mental health decline?</div>
                        <input type="number" className="px-5 py-1 border rounded-full" value={store.mentalHealthMonthDecline} onChange={(event) => store.update({ mentalHealthMonthDecline: Math.min(Math.max(0, parseInt(event.currentTarget.value) || 0), 30) })} />
                    </div>

                    {/* Question: Physical Health Decline */}
                    <div className="flex flex-col gap-1">
                        <div>From the last 30 days, how many days (0-30) have you felt your physical health decline?</div>
                        <input type="number" className="px-5 py-1 border rounded-full" value={store.physicalHealthMonthDecline} onChange={(event) => store.update({ physicalHealthMonthDecline: Math.min(Math.max(0, parseInt(event.currentTarget.value) || 0), 30) })} />
                    </div>

                    {/* Question: Systolic Blood Pressure */}
                    <div className="flex flex-col gap-1">
                        <div>Systolic Blood Pressure (in mmHg)</div>
                        <input type="number" className="px-5 py-1 border rounded-full" value={store.systolicBloodPressure} onChange={(event) => store.update({ systolicBloodPressure: Math.max(parseInt(event.currentTarget.value) || 1, 1) })} />
                    </div>

                    {/* Question: Diastolic Blood Pressure */}
                    <div className="flex flex-col gap-1">
                        <div>Diastolic Blood Pressure  (in mmHg)</div>
                        <input type="number" className="px-5 py-1 border rounded-full" value={store.diastolicBloodPressure} onChange={(event) => store.update({ diastolicBloodPressure: Math.max(parseInt(event.currentTarget.value) || 1, 1) })} />
                    </div>

                    {/* Question: Cholesterol */}
                    <div className="flex flex-col gap-1">
                        <div>Cholesterol (LDL mg/dL)</div>
                        <input type="number" step=".01" className="px-5 py-1 border rounded-full" value={store.cholesterol} onChange={(event) => store.update({ cholesterol: Math.max(parseFloat(event.currentTarget.value) || 1, 1) })} />
                    </div>

                    {/* Question: Cholesterol Check */}
                    <div className="flex flex-col gap-1">
                        <div>Have you had your cholesterol checked during the last 5 years?</div>
                        <select className="px-5 py-1 border rounded-full" value={store.hasCholesterolChecked ? 1 : 0} onChange={event => store.update({ hasCholesterolChecked: !!parseInt(event.currentTarget.value) })}>
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                        </select>
                    </div>

                    {/* Question: Frequent Smoke */}
                    <div className="flex flex-col gap-1">
                        <div>Do you smoke frequently?</div>
                        <select className="px-5 py-1 border rounded-full" value={store.frequentSmoke ? 1 : 0} onChange={event => store.update({ frequentSmoke: !!parseInt(event.currentTarget.value) })}>
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                        </select>
                    </div>

                    {/* Question: Stroke */}
                    <div className="flex flex-col gap-1">
                        <div>Have you had a stroke?</div>
                        <select className="px-5 py-1 border rounded-full" value={store.hasHadStroke ? 1 : 0} onChange={event => store.update({ hasHadStroke: !!parseInt(event.currentTarget.value) })}>
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                        </select>
                    </div>

                    {/* Question: Heart Disease */}
                    <div className="flex flex-col gap-1">
                        <div>Do you currently have a heart disease?</div>
                        <select className="px-5 py-1 border rounded-full" value={store.hasHeartDisease ? 1 : 0} onChange={event => store.update({ hasHeartDisease: !!parseInt(event.currentTarget.value) })}>
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                        </select>
                    </div>

                    {/* Question: Physical Activity */}
                    <div className="flex flex-col gap-1">
                        <div>Do you frequently have physical activity?</div>
                        <select className="px-5 py-1 border rounded-full" value={store.frequentPhysicalActivity ? 1 : 0} onChange={event => store.update({ frequentPhysicalActivity: !!parseInt(event.currentTarget.value) })}>
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                        </select>
                    </div>

                    {/* Question: Fruits */}
                    <div className="flex flex-col gap-1">
                        <div>Do you frequently eat fruits?</div>
                        <select className="px-5 py-1 border rounded-full" value={store.frequentEatFruits ? 1 : 0} onChange={event => store.update({ frequentEatFruits: !!parseInt(event.currentTarget.value) })}>
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                        </select>
                    </div>

                    {/* Question: Vegetables */}
                    <div className="flex flex-col gap-1">
                        <div>Do you frequently eat vegetables?</div>
                        <select className="px-5 py-1 border rounded-full" value={store.frequentEatVegetables ? 1 : 0} onChange={event => store.update({ frequentEatVegetables: !!parseInt(event.currentTarget.value) })}>
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

                    {/* Question: Health Care Coverage */}
                    <div className="flex flex-col gap-1">
                        <div>Do you have any kind of health care coverage or insurance?</div>
                        <select className="px-5 py-1 border rounded-full" value={store.hasHealthcare ? 1 : 0} onChange={event => store.update({ hasHealthcare: !!parseInt(event.currentTarget.value) })}>
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                        </select>
                    </div>

                    {/* Question: Difficulty Climbing */}
                    <div className="flex flex-col gap-1">
                        <div>Do you have difficulty climbing or walking up stairs?</div>
                        <select className="px-5 py-1 border rounded-full" value={store.hasDifficultyClimbing ? 1 : 0} onChange={event => store.update({ hasDifficultyClimbing: !!parseInt(event.currentTarget.value) })}>
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                        </select>
                    </div>

                    <button className="px-5 py-1 mb-2 mt-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors" onClick={computeOutcome}>
                        Run model
                    </button>
                </div>
            }
        </div>
    )

}

export default DiabetesLikelihood;