import { TMSimulator } from "../../p5-turing-machines/TMSimulator";
import { useSimulator } from "../../providers/simulator";
import Simulator from "./Simulator";
import Empty from "/assets/empty.svg";
import { cn } from "../../utils/cn";
import CreateSimulatorModal from "../CreateSimulatorModal";

function SimulatorsContainer() {
  const { simulatorInfo } = useSimulator();

  return (
    <div
      className={cn(
        "flex min-h-full w-full flex-grow flex-col gap-4 px-1 sm:px-8",
        simulatorInfo.length === 0 && "px-4",
      )}
    >
      <div className="flex w-full items-center justify-between px-4 sm:px-0">
        <h1 className="text-left text-2xl font-bold text-white sm:text-3xl">Simulador</h1>
        <CreateSimulatorModal />
      </div>
      {simulatorInfo.length > 0 ? (
        simulatorInfo.map((item, index) => (
          <Simulator key={item.id} id={item.id}>
            <TMSimulator id={item.id} />
          </Simulator>
        ))
      ) : (
        <div className="flex min-h-full w-full flex-grow flex-col items-center justify-center gap-6">
          <p className="text-center text-lg font-semibold text-darkVariant sm:text-2xl">
            Você ainda não criou um simulador!
          </p>
          <img src={Empty} alt="No simulators created yet." className="w-1/4 min-w-40 max-w-64" />
        </div>
      )}
    </div>
  );
}

export default SimulatorsContainer;
