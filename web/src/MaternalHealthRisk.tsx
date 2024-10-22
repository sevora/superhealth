import { useEffect, useState } from 'react';
import { convertToHeartDiseaseModelInput, convertToMaternalHealthRiskModelInput } from './utilities/model-input-conversion';

import ort from 'onnxruntime-web/wasm';
import useHealthSurveyStore from './hooks/health-survey-store';
import { indexOfMax } from './utilities/indexer';

function MaternalHealthRisk() {
    const store = useHealthSurveyStore();
    const [open, setOpen] = useState<boolean>(false);
    const [results, setResults] = useState<[number, number, number] | null>(null);
    
    const outputClasses = ["High Risk", "Low Risk", "Medium Risk"];
    const outputClassIndex = results ? indexOfMax(results) : -1;

    async function computeOutcome() {
        const session = await ort.InferenceSession.create('/onnx/maternal_health_risk_model.onnx', { executionProviders: ['wasm'] });
        const input = new ort.Tensor('float32', Float32Array.from(convertToMaternalHealthRiskModelInput(store)));
        const output = await session.run({ [session.inputNames[0]]: input });
        const results = Object.values(Object.values(output)[0].data) as [number, number, number];
        // RiskLevel_high risk,  RiskLevel_low risk,  RiskLevel_mid risk
        console.log(results)
        setResults([
            Math.max(0, results[0] * 100),
            Math.max(0, results[1] * 100),
            Math.max(0, results[2] * 100)
        ]);
    }

    useEffect(() => {
        computeOutcome()
    }, []);

    return (
        <div className="border rounded-md">
            <div className="text-xl p-3 font-medium cursor-pointer hover:bg-neutral-200" onClick={() => setOpen(!open)}>
                Maternal Health Risk
            </div>

            <div className={`flex flex-col gap-3 px-3 overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-[600px]' : 'max-h-0'}`}>
                {results &&
                    <div className="my-2 p-3 border rounded-md">
                        <div className="text-lg font-medium">Results</div>
                        <div>Low Risk: {results[1].toFixed(2)}%</div>
                        <div>Medium Risk: {results[2].toFixed(2)}%</div>
                        <div>High Risk: {results[0].toFixed(2)}%</div>
                        <div>Verdict: {outputClasses[outputClassIndex]}</div>
                        <div>
                            <div className="font-medium">Recommendations:</div>
                            {
                                results[0] > results[1] ?
                                    <div>
                                        The model predicts the absence of the possibility of heart disease. It is recommended that you maintain:
                                        <ul className="list-disc px-5">
                                            <li>by having a healthy diet</li>
                                            <li>getting enough sleep</li>
                                            <li>managing stress</li>
                                            <li>controlling your cholesterol, and blood pressure</li>
                                        </ul>
                                    </div>
                                    :
                                    <div>

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

                <button className="px-5 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-800 transition-colors" onClick={computeOutcome}>
                    Run predictor
                </button>
            </div>
        </div>
    )

}

export default MaternalHealthRisk;