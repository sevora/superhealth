import useHealthSurveyStore from './hooks/health-survey-store';

function GeneralInput() {
    const store = useHealthSurveyStore();

    return (
        <div className="p-3 border rounded-md">
            <div className="text-xl mb-3 font-medium">General Inputs</div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <div>Age</div>
                    <input type="number" className="px-5 py-1 border rounded-full" value={store.age} onChange={(event) => store.update({ age: parseInt(event.currentTarget.value) }) }/>
                </div>

                <div className="flex flex-col gap-1">
                  <div>Height (in meters)</div>
                    <input type="number" step=".01" className="px-5 py-1 border rounded-full" value={store.height} onChange={(event) => store.update({ height: parseFloat(event.currentTarget.value) })} />
                </div>

                <div className="flex flex-col gap-1">
                  <div>Weight (in kilorams)</div>
                    <input type="number" step=".01" className="px-5 py-1 border rounded-full" value={store.weight} onChange={(event) => store.update({ weight: parseFloat(event.currentTarget.value) })} />
                </div>

                <div className="flex flex-col gap-1">
                  <div>Maximum Heart Rate Achieved (bpm)</div>
                    <input type="number" className="px-5 py-1 border rounded-full" value={store.maximumHeartRate} onChange={(event) => store.update({ maximumHeartRate: parseInt(event.currentTarget.value) })} />
                </div>
            </div>
        </div>
    )
}

export default GeneralInput;