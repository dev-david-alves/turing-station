import { SimulatorProvider } from "../providers/simulator";
import SimulatorsContainer from "../components/simulator/SimulatorsContainer";

function Home() {
  return (
    <SimulatorProvider>
      <SimulatorsContainer />
    </SimulatorProvider>
  );
}

export default Home;
