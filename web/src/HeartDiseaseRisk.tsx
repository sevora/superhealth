import { useState } from 'react';
import { convertToHeartDiseaseModelInput } from './utilities/model-input-conversion';
import { indexOfMax } from './utilities/indexer';

import ort from 'onnxruntime-web/wasm';
import useHealthSurveyStore from './hooks/health-survey-store';
import Loader from './Loader';

/***
 * This is the component for 
 * heart disease prediction.
 */
function HeartDiseaseRisk() {
    const store = useHealthSurveyStore();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<[number, number] | null>(null);

    const outputClasses = ["Low Risk", "High Risk"];
    const outputClassIndex = results ? indexOfMax(results) : -1;

    async function computeOutcome() {
        setLoading(true);
        setOpen(true);
        setResults(null);

        const session = await ort.InferenceSession.create('/onnx/heart_disease_model.onnx', { executionProviders: ['wasm'] });
        const input = new ort.Tensor('float32', Float32Array.from(convertToHeartDiseaseModelInput(store)));
        const output = await session.run({ [session.inputNames[0]]: input });

        /**
         * The results shape and meaning can also be found in the notebook.
         * In this case it is: absence, and presence of heart disease likelihood.
         */
        const results = Object.values(Object.values(output)[0].data) as [number, number];

        setResults([
            Math.max(0, results[0] * 100),
            Math.max(0, results[1] * 100),
        ]);
        setOpen(true);
        setLoading(false);
    }

    return (
        <div className="border rounded-md">
            <div className="text-xl p-3 font-medium cursor-pointer hover:bg-neutral-200" onClick={() => setOpen(!open || results != null)}>
                Heart Disease Prediction
            </div>

            {results &&
                <div className="m-2 p-3 border rounded-md">
                    <div className="text-lg font-medium">Results</div>
                    <div>Absence: {results[0].toFixed(2)}%</div>
                    <div>Presence: {results[1].toFixed(2)}%</div>
                    <div>Verdict: {outputClasses[outputClassIndex]}</div>
                    <div>
                        <div className="font-semibold">Recommendations:</div>
                        {
                            outputClassIndex === 0 ?
                                <div>
                                    The model predicts the absence of the possibility of heart disease. It is recommended that you maintain your health:
                                    <ul className="list-disc px-5">
                                        <li>by having a healthy diet</li>
                                        <li>getting enough sleep</li>
                                        <li>managing stress</li>
                                        <li>controlling your cholesterol, and blood pressure</li>
                                    </ul>
                                    <a className="text-blue-600" href="https://www.healthline.com/health/healthy-heart-tips" target='_blank'>Source</a>
                                </div>
                                :
                                <div>
                                    The model predicts the presence of the possibility of heart disease. It is recommended that you improve your lifestyle:
                                    <ul className="list-disc px-5">
                                        <li>by having a healthy diet and eating nutritious breakfast every day can help you maintain a healthy diet and weight</li>
                                        <li>getting enough sleep</li>
                                        <li>managing stress</li>
                                        <li>cutting on salt intake</li>
                                        <li>reducing the saturated fat intake</li>
                                        <li>controlling your cholesterol, and blood pressure</li>
                                    </ul>
                                    <a className="text-blue-600" href="https://www.healthline.com/health/healthy-heart-tips" target='_blank'>Source</a>
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
                    {/* Question: Age */}
                    <div className="flex flex-col gap-1">
                        <div>Age</div>
                        <input type="number" className="px-5 py-1 border rounded-full" value={store.age} onChange={(event) => store.update({ age: Math.max(parseInt(event.currentTarget.value) || 0, 0) }) }/>
                    </div>
                    
                    {/* Question: Sex */}
                    <div className="flex flex-col gap-1">
                        <div>Sex</div>
                        <select className="px-5 py-1 border rounded-full" value={store.sex} onChange={event => store.update({ sex: event.currentTarget.value as any })}>    
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    {/* Question: Resting Blood Pressure */}
                    <div className="flex flex-col gap-1">
                        <div>Resting blood pressure (in mmHg)</div>
                        <input type="number" className="px-5 py-1 border rounded-full" value={store.restingBloodPressure} onChange={(event) => store.update({ restingBloodPressure: parseInt(event.currentTarget.value) || 0 })} />
                    </div>

                    {/* Question: Cholesterol */}
                    <div className="flex flex-col gap-1">
                        <div>Cholesterol (LDL mg/dL)</div>
                        <input type="number" step=".01" className="px-5 py-1 border rounded-full" value={store.cholesterol} onChange={(event) => store.update({ cholesterol: Math.max(parseFloat(event.currentTarget.value) || 0, 0) })} />
                    </div>

                    {/* Question: Maximum Heart Rate */}
                    <div className="flex flex-col gap-1">
                        <div>Maximum Heart Rate Achieved (bpm)</div>
                        <input type="number" className="px-5 py-1 border rounded-full" value={store.maximumHeartRate} onChange={(event) => store.update({ maximumHeartRate: Math.max(parseInt(event.currentTarget.value) || 0, 0) })} />
                    </div>

                    {/* Question: Blood Glucose Level */}
                    <div className="flex flex-col gap-1">
                        <div>Blood Glucose Level (mg/dL)</div>
                        <input type="number" step=".01" className="px-5 py-1 border rounded-full" value={store.bloodGlucoseLevel} onChange={(event) => store.update({ bloodGlucoseLevel: Math.max(parseFloat(event.currentTarget.value) || 0, 0) })} />
                    </div>

                    {/* Question: Exercise Induced Angina */}
                    <div className="flex flex-col gap-1">
                        <div>Do you have exercise induced angina?</div>
                        <select className="px-5 py-1 border rounded-full" value={store.hasExercisedInducedAngena ? 1 : 0} onChange={event => store.update({ hasExercisedInducedAngena: !!parseInt(event.currentTarget.value) })}>    
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                        </select>
                    </div>
                    
                    {/* Question: Chest Pain Type */}
                    <div className="flex flex-col gap-1">
                        <div>What is your chest pain type?</div>
                        <select className="px-5 py-1 border rounded-full" value={store.chestPainType} onChange={event => store.update({ chestPainType: event.currentTarget.value as any })}>    
                            <option value="typical angina">Typical angina</option>
                            <option value="atypical angina">Atypical angina</option>
                            <option value="non-anginal">Non-anginal</option>
                            <option value="asymptomatic">Asymptomatic</option>
                        </select>
                    </div>

                    <button className="px-5 py-1 mb-2 mt-2 bg-red-500 text-white rounded-full hover:bg-red-800 transition-colors" onClick={computeOutcome}>
                        Run model
                    </button>
                </div>
            }
        </div>
    )

}

export default HeartDiseaseRisk;