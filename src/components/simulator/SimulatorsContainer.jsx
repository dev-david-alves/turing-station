import { useState } from "react";
import { TMSimulator } from "../../p5-turing-machines/TMSimulator";
import { useSimulator } from "../../providers/simulator";
import Simulator from "./Simulator";

function SimulatorsContainer() {
  const { simulatorInfo } = useSimulator();
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);

  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
      {simulatorInfo.map((item) => (
        <Simulator
          key={item.id}
          id={item.id}
          bottomDrawerOpen={bottomDrawerOpen}
          setBottomDrawerOpen={setBottomDrawerOpen}
        >
          <TMSimulator id={item.id} setBottomDrawerOpen={setBottomDrawerOpen} />
        </Simulator>
      ))}
    </div>
  );
}

export default SimulatorsContainer;
