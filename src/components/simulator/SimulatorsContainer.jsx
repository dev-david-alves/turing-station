import { useState } from "react";
import { TMSimulator } from "../../p5-turing-machines/TMSimulator";
import { useSimulator } from "../../providers/simulator";
import Simulator from "./Simulator";
import { Button } from "../Button";
import Empty from "/assets/empty.svg";
import { cn } from "../../utils/cn";

function SimulatorsContainer() {
  const { simulatorInfo } = useSimulator();
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(simulatorInfo.map((item) => ({ id: item.id, open: false })));

  return (
    <div
      className={cn(
        "flex min-h-full w-full flex-grow flex-col gap-4 px-1 sm:px-8",
        simulatorInfo.length === 0 && "px-4",
      )}
    >
      <div className="flex w-full items-center justify-between px-4 sm:px-0">
        <h1 className="text-center text-3xl font-bold text-white">Simulador</h1>
        <Button className="text-white">Adicionar MT</Button>
      </div>
      {simulatorInfo.length > 0 ? (
        simulatorInfo.map((item, index) => (
          <Simulator
            key={item.id}
            id={item.id}
            bottomDrawerOpen={bottomDrawerOpen[index].open}
            setBottomDrawerOpen={setBottomDrawerOpen}
          >
            <TMSimulator id={item.id} setBottomDrawerOpen={setBottomDrawerOpen} />
          </Simulator>
        ))
      ) : (
        <div className="flex min-h-full w-full flex-grow flex-col items-center justify-center gap-6">
          <p className="text-center text-2xl font-semibold text-darkVariant">Você ainda não criou um simulador!</p>
          <img src={Empty} alt="Empty" className="w-1/4 min-w-40 max-w-64" />
        </div>
      )}
    </div>
  );
}

export default SimulatorsContainer;
