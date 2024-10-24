import useHealthSurveyStore from './hooks/health-survey-store';

function GeneralInput() {
    const store = useHealthSurveyStore();

    return (
        <div className="p-3 border rounded-md">
            <div className="text-xl mb-3 font-medium">General Inputs</div>
            <div className="flex flex-col gap-3">
                {/* Question: Age */}
                <div className="flex flex-col gap-1">
                    <div>Age</div>
                    <input type="number" className="px-5 py-1 border rounded-full" value={store.age} onChange={(event) => store.update({ age: Math.max(parseInt(event.currentTarget.value) || 0, 1) }) }/>
                </div>

                {/* Question: Sex */}
                <div className="flex flex-col gap-1">
                    <div>Sex</div>
                    <select className="px-5 py-1 border rounded-full" value={store.sex} onChange={event => store.update({ sex: event.currentTarget.value as any })}>    
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                {/* Question: Height */}
                <div className="flex flex-col gap-1">
                    <div>Height (in meters)</div>
                    <input type="number" step=".01" className="px-5 py-1 border rounded-full" value={store.height} onChange={(event) => store.update({ height: Math.max(parseFloat(event.currentTarget.value) || 0, 1) })} />
                </div>

                {/* Question: Weight */}
                <div className="flex flex-col gap-1">
                    <div>Weight (in kilorams)</div>
                    <input type="number" step=".01" className="px-5 py-1 border rounded-full" value={store.weight} onChange={(event) => store.update({ weight: Math.max(parseFloat(event.currentTarget.value) || 0, 1) })} />
                </div>

                {/* Question: Max Heart Rate  */}
                <div className="flex flex-col gap-1">
                    <div>Maximum Heart Rate Achieved (bpm)</div>
                    <input type="number" className="px-5 py-1 border rounded-full" value={store.maximumHeartRate} onChange={(event) => store.update({ maximumHeartRate: Math.max(parseInt(event.currentTarget.value) || 0, 1) })} />
                </div>
            </div>
        </div>
    )
}

export default GeneralInput;