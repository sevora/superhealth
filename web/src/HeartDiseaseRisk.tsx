import { useState } from 'react';
import { convertToHeartDiseaseModelInput } from './utilities/model-input-conversion';
import { indexOfMax } from './utilities/indexer';

import ort from 'onnxruntime-web/wasm';
import useHealthSurveyStore from './hooks/health-survey-store';

function HeartDiseaseRisk() {
    const store = useHealthSurveyStore();
    const [open, setOpen] = useState<boolean>(false);
    const [results, setResults] = useState<[number, number] | null>(null);

    const outputClasses = ["Low Risk", "High Risk"];
    const outputClassIndex = results ? indexOfMax(results) : -1;

    async function computeOutcome() {
        const session = await ort.InferenceSession.create('/onnx/heart_disease_model.onnx', { executionProviders: ['wasm'] });
        const input = new ort.Tensor('float32', Float32Array.from(convertToHeartDiseaseModelInput(store)));
        const output = await session.run({ [session.inputNames[0]]: input });
        const results = Object.values(Object.values(output)[0].data) as [number, number];

        setResults([
            Math.max(0, results[0] * 100),
            Math.max(0, results[1] * 100),
        ]);
    }

    return (
        <div className="border rounded-md">
            <div className="text-xl p-3 font-medium cursor-pointer hover:bg-neutral-200" onClick={() => setOpen(!open)}>
                Heart Disease Prediction
            </div>

            <div className={`flex flex-col gap-3 px-3 overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-[9999px]' : 'max-h-0'}`}>
                {results &&
                    <div className="my-2 p-3 border rounded-md">
                        <div className="text-lg font-medium">Results</div>
                        <div>Absence: {results[0].toFixed(2)}%</div>
                        <div>Presence: {results[1].toFixed(2)}%</div>
                        <div>Verdict: {outputClasses[outputClassIndex]}</div>
                        <div>
                            <div className="font-semibold">Recommendations:</div>
                            <a className="text-blue-600" href="https://www.healthline.com/health/healthy-heart-tips" target='_blank'>Source</a>
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
                                    </div>
                            }
                        </div>
                    </div>
                }
                <div className="flex flex-col gap-1">
                    <div>Age</div>
                    <input type="number" className="px-5 py-1 border rounded-full" value={store.age} onChange={(event) => store.update({ age: parseInt(event.currentTarget.value) })} />
                </div>

                <div className="flex flex-col gap-1">
                    <div>Resting blood pressure (in mmHg)</div>
                    <input type="number" className="px-5 py-1 border rounded-full" value={store.restingBloodPressure} onChange={(event) => store.update({ restingBloodPressure: parseInt(event.currentTarget.value) })} />
                </div>

                <div className="flex flex-col gap-1">
                    <div>Cholesterol (LDL mg/dL)</div>
                    <input type="number" step=".01" className="px-5 py-1 border rounded-full" value={store.cholesterol} onChange={(event) => store.update({ cholesterol: parseFloat(event.currentTarget.value) })} />
                </div>

                <div className="flex flex-col gap-1">
                    <div>Maximum Heart Rate Achieved (bpm)</div>
                    <input type="number" className="px-5 py-1 border rounded-full" value={store.maximumHeartRate} onChange={(event) => store.update({ maximumHeartRate: parseInt(event.currentTarget.value) })} />
                </div>

                <button className="px-5 py-1 bg-red-500 text-white rounded-full hover:bg-red-800 transition-colors" onClick={computeOutcome}>
                    Run model
                </button>
            </div>
        </div>
    )

}

export default HeartDiseaseRisk;