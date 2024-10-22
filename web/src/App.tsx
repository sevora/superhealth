import DiabetesLikelihood from "./DiabetesLikelihood"
import GeneralInput from "./GeneralInput"
import HeartDiseaseRisk from "./HeartDiseaseRisk"
import MaternalHealthRisk from "./MaternalHealthRisk"
import ObesityLikelihood from "./ObesityLikelihood"

function App() {
  return (
    <div className="w-screen h-screen flex justify-center overflow-x-hidden">
      <div className="p-10 flex flex-col gap-3 w-[700px]">
        <div>
          <div className="text-2xl font-medium">Superhealth</div>
          The models in this web-application are ran directly on your browser. No data is sent to an external server that may track
          your inputs and results. The model results are not substitute for professional healthcare advice.
        </div>
        <GeneralInput />
        <HeartDiseaseRisk />
        <MaternalHealthRisk />
        <ObesityLikelihood />
        <DiabetesLikelihood />
      </div>
    </div>
  )
}

export default App
