import Header from './Header';
import GeneralInput from './GeneralInput';
import HeartDiseaseRisk from './HeartDiseaseRisk';
import MaternalHealthRisk from './MaternalHealthRisk';
import ObesityLikelihood from './ObesityLikelihood';
import DiabetesLikelihood from './DiabetesLikelihood';

/**
 * This is the application overview. As you can see, the model interfaces
 * are separated across multiple components. 
 */
function App() {
  return (
    <div className="w-screen h-screen flex justify-center overflow-x-hidden">
      <div className="p-10 flex flex-col gap-3 w-[700px]">
        <Header />
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
