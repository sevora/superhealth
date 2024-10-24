import { useState } from 'react';
import { convertToMaternalHealthRiskModelInput } from './utilities/model-input-conversion';
import { indexOfMax } from './utilities/indexer';

import ort from 'onnxruntime-web/wasm';
import useHealthSurveyStore from './hooks/health-survey-store';
import Loader from './Loader';

/**
 * This is the maternal health risk component.
 */
function MaternalHealthRisk() {
    const store = useHealthSurveyStore();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<[number, number, number] | null>(null);
    
    const outputClasses = ["High Risk", "Low Risk", "Medium Risk"];
    const outputClassIndex = results ? indexOfMax(results) : -1;

    async function computeOutcome() {
        setLoading(true);
        setOpen(true);
        setResults(null);

        const session = await ort.InferenceSession.create('/onnx/maternal_health_risk_model.onnx', { executionProviders: ['wasm'] });
        const input = new ort.Tensor('float32', Float32Array.from(convertToMaternalHealthRiskModelInput(store)));
        const output = await session.run({ [session.inputNames[0]]: input });

        /**
         * The results shape and meaning can also be found in the notebook.
         * In this case it is: high risk, low risk, and medium risk during maternity.
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
                Maternal Health Risk
            </div>

            {results &&
                <div className="m-2 p-3 border rounded-md">
                    <div className="text-lg font-medium">Results</div>
                    <div>Low Risk: {results[1].toFixed(2)}%</div>
                    <div>Medium Risk: {results[2].toFixed(2)}%</div>
                    <div>High Risk: {results[0].toFixed(2)}%</div>
                    <div>Verdict: {outputClasses[outputClassIndex]}</div>
                    <div>
                        <div className="font-medium">Recommendations:</div>
                        {
                            outputClassIndex === 0 ?
                                <div>
                                    The model predicts high risk of adverse health effects during pregnancy. Be cautious:
                                    <ul className="list-disc px-5">
                                        <li>it is recommended to create a plan with professional healthcare providers</li>
                                        <li>managing one's mindset may help through this likely difficult process</li>
                                        <li>ensure that you always listen to your body</li>
                                    </ul>
                                    <a className="text-blue-600" href="https://www.signatureperinatal.com/blog/7-tips-for-managing-a-high-risk-pregnancy" target='_blank'>Source</a>   
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
                                <a href="https://www.ultalabtests.com/blog/pregnancy-and-fertility/healthy-pregnancy-key-steps-to-ensure-a-healthy-pregnancy/" target='_blank'>Source</a>
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
                                <a className="text-blue-600" href="https://www.signatureperinatal.com/blog/7-tips-for-managing-a-high-risk-pregnancy" target='_blank'>Source</a>   
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
                        <input type="number" className="px-5 py-1 border rounded-full" value={store.age} onChange={(event) => store.update({ age: Math.max(parseInt(event.currentTarget.value) || 0, 1) }) }/>
                    </div>

                    {/* Question: Systolic Blood Pressure */}
                    <div className="flex flex-col gap-1">
                        <div>Systolic Blood Pressure (in mmHg)</div>
                        <input type="number" className="px-5 py-1 border rounded-full" value={store.systolicBloodPressure} onChange={(event) => store.update({ systolicBloodPressure: Math.max(parseInt(event.currentTarget.value) || 0, 1) })} />
                    </div>
                    
                    {/* Question: Diastolic Blood Pressure */}
                    <div className="flex flex-col gap-1">
                        <div>Diastolic Blood Pressure  (in mmHg)</div>
                        <input type="number" className="px-5 py-1 border rounded-full" value={store.diastolicBloodPressure} onChange={(event) => store.update({ diastolicBloodPressure: Math.max(parseInt(event.currentTarget.value) || 0, 1) })} />
                    </div>

                    {/* Question: Blood Glucose Level */}
                    <div className="flex flex-col gap-1">
                        <div>Blood Glucose Level (mg/dL)</div>
                        <input type="number" step=".01" className="px-5 py-1 border rounded-full" value={store.bloodGlucoseLevel} onChange={(event) => store.update({ bloodGlucoseLevel: Math.max(parseFloat(event.currentTarget.value) || 0, 1) })} />
                    </div>

                    {/* Question: Body Temperature */}
                    <div className="flex flex-col gap-1">
                        <div>Body Temperature (Farenheit)</div>
                        <input type="number" className="px-5 py-1 border rounded-full" value={store.bodyTemperature} onChange={(event) => store.update({ bodyTemperature: parseInt(event.currentTarget.value) || 0 })} />
                    </div>

                    {/* Question: Resting Heart Rate */}
                    <div className="flex flex-col gap-1">
                        <div>Resting Heart Rate (bpm)</div>
                        <input type="number" className="px-5 py-1 border rounded-full" value={store.restingHeartRate} onChange={(event) => store.update({ restingHeartRate: Math.max(parseInt(event.currentTarget.value) || 0, 1) })} />
                    </div>

                    <button className="px-5 py-1 mb-2 mt-2 bg-green-500 text-white rounded-full hover:bg-green-800 transition-colors" onClick={computeOutcome}>
                        Run model
                    </button>
                </div>
            }
        </div>
        
    )

}

export default MaternalHealthRisk;