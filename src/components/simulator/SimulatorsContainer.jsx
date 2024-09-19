import { useState } from "react";
import { TMSimulator } from "../../p5-turing-machines/TMSimulator";
import { useSimulator } from "../../providers/simulator";
import Simulator from "./Simulator";

function SimulatorsContainer() {
  const { simulatorInfo } = useSimulator();
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(simulatorInfo.map((item) => ({ id: item.id, open: false })));

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 px-1 sm:px-8">
      {simulatorInfo.map((item, index) => (
        <Simulator
          key={item.id}
          id={item.id}
          bottomDrawerOpen={bottomDrawerOpen[index].open}
          setBottomDrawerOpen={setBottomDrawerOpen}
        >
          <TMSimulator id={item.id} setBottomDrawerOpen={setBottomDrawerOpen} />
        </Simulator>
      ))}
    </div>
  );
}

export default SimulatorsContainer;
