import { useSimulator } from "../../providers/simulator";
import Simulator from "./Simulator";

function SimulatorsContainer() {
  const { data } = useSimulator();

  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
      {data.map((item) => (
        <Simulator key={item.id} id={item.id}></Simulator>
      ))}
    </div>
  );
}

export default SimulatorsContainer;
