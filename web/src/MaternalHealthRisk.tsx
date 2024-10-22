import { useState } from 'react';
import { convertToMaternalHealthRiskModelInput } from './utilities/model-input-conversion';

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
        setResults([
            Math.max(0, results[0] * 100),
            Math.max(0, results[1] * 100),
            Math.max(0, results[2] * 100)
        ]);
    }

    return (
        <div className="border rounded-md">
            <div className="text-xl p-3 font-medium cursor-pointer hover:bg-neutral-200" onClick={() => setOpen(!open)}>
                Maternal Health Risk
            </div>

            <div className={`flex flex-col gap-3 px-3 overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-[9999px]' : 'max-h-0'}`}>
                {results &&
                    <div className="my-2 p-3 border rounded-md">
                        <div className="text-lg font-medium">Results</div>
                        <div>Low Risk: {results[1].toFixed(2)}%</div>
                        <div>Medium Risk: {results[2].toFixed(2)}%</div>
                        <div>High Risk: {results[0].toFixed(2)}%</div>
                        <div>Verdict: {outputClasses[outputClassIndex]}</div>
                        <div>
                            <div className="font-medium">Recommendations:</div>
                            <a className="text-blue-600" href="https://www.signatureperinatal.com/blog/7-tips-for-managing-a-high-risk-pregnancy" target='_blank'>Source</a>   
                            {
                                outputClassIndex === 0 ?
                                    <div>
                                        The model predicts high risk of adverse health effects during pregnancy. Be cautious:
                                        <ul className="list-disc px-5">
                                            <li>it is recommended to create a plan with professional healthcare providers</li>
                                            <li>managing one's mindset may help through this likely difficult process</li>
                                            <li>ensure that you always listen to your body</li>
                                        </ul>
                                    </div>
                                    :
                                outputClassIndex === 1 ?
                                <div>
                                    The model predicts a low risk of adverse health effects during pregnancy. Please maintain your health as best as you can.
                                    <ul className="list-disc px-5">
                                        <li>getting moderate exercise helps through pilates and yoga</li>
                                        <li>eliminating toxins are a good idea as well</li>
                                        <li>checking your medication and intake to ensure that it doesn't affect the baby</li>
                                        <li>drinking more water helps in maintaining the health</li>
                                    </ul>
                                </div>
                                    :
                                <div>
                                    The model predicts medium risk of adverse health effects during pregnancy. The recommendations is to:
                                    <ul className="list-disc px-5">
                                        <li>seek advice from a healthcare professional</li>
                                        <li>get moderate exercise such as pilates and yoha</li>
                                        <li>eliminating toxins such as alcohols and cigarettes</li>
                                        <li>checking your medication and intake to ensure that it doesn't affect the baby</li>
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
                    <div>Systolic Blood Pressure (in mmHg)</div>
                    <input type="number" className="px-5 py-1 border rounded-full" value={store.systolicBloodPressure} onChange={(event) => store.update({ systolicBloodPressure: parseInt(event.currentTarget.value) })} />
                </div>

                <div className="flex flex-col gap-1">
                    <div>Diastolic Blood Pressure  (in mmHg)</div>
                    <input type="number" className="px-5 py-1 border rounded-full" value={store.diastolicBloodPressure} onChange={(event) => store.update({ diastolicBloodPressure: parseInt(event.currentTarget.value) })} />
                </div>

                <div className="flex flex-col gap-1">
                    <div>Blood Glucose Level (mg/dL)</div>
                    <input type="number" className="px-5 py-1 border rounded-full" value={store.bloodGlucoseLevel} onChange={(event) => store.update({ bloodGlucoseLevel: parseFloat(event.currentTarget.value) })} />
                </div>

                <div className="flex flex-col gap-1">
                    <div>Body Temperature (Farenheit)</div>
                    <input type="number" className="px-5 py-1 border rounded-full" value={store.bodyTemperature} onChange={(event) => store.update({ bodyTemperature: parseInt(event.currentTarget.value) })} />
                </div>

                <div className="flex flex-col gap-1">
                    <div>Resting Heart Rate (bpm)</div>
                    <input type="number" className="px-5 py-1 border rounded-full" value={store.restingHeartRate} onChange={(event) => store.update({ restingHeartRate: parseInt(event.currentTarget.value) })} />
                </div>

                <button className="px-5 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-800 transition-colors" onClick={computeOutcome}>
                    Run predictor
                </button>
            </div>
        </div>
    )

}

export default MaternalHealthRisk;