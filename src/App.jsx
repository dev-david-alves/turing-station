import { SimulatorProvider } from "./providers/simulator";
import SimulatorsContainer from "./components/simulator/SimulatorsContainer";

export default function App() {
  return (
    <main className="dark-mode-variables flex h-full min-h-screen flex-col items-center justify-center bg-background px-[5px] py-10">
      <SimulatorProvider>
        <SimulatorsContainer />
      </SimulatorProvider>
    </main>
  );
}
