import SimulatorsContainer from "../components/simulator/SimulatorsContainer";
import { SimulatorFilterProvider } from "../providers/simulatorFilters";

function Home() {
  return (
    <SimulatorFilterProvider>
      <SimulatorsContainer />
    </SimulatorFilterProvider>
  );
}

export default Home;
