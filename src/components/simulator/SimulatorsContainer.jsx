import { useSimulator } from "../../providers/simulator";
import Simulator from "./Simulator";

function SimulatorsContainer() {
  const { simulatorInfo } = useSimulator();

  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
      {simulatorInfo.map((item) => (
        <Simulator key={item.id} id={item.id}></Simulator>
      ))}
    </div>
  );
}

export default SimulatorsContainer;
