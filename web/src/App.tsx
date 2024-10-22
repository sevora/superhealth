import GeneralInput from "./GeneralInput"
import HeartDiseaseRisk from "./HeartDiseaseRisk"
import MaternalHealthRisk from "./MaternalHealthRisk"

function App() {
  return (
    <div className="w-screen h-screen flex justify-center overflow-x-hidden">
      <div className="p-10 flex flex-col gap-3 w-[700px]">
        <GeneralInput />
        <HeartDiseaseRisk />
        <MaternalHealthRisk />
      </div>
    </div>
  )
}

export default App
