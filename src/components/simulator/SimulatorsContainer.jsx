import { TMSimulator } from "../../p5-turing-machines/TMSimulator";
import { useSimulator } from "../../providers/simulator";
import Simulator from "./Simulator";
import Empty from "/assets/empty.svg";
import { cn } from "../../utils/cn";
import CreateSimulatorModal from "../CreateSimulatorModal";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DialogFilter from "../filters/dialogFilter";

function SimulatorsContainer() {
  const { simulatorInfo } = useSimulator();
  const [searchParams] = useSearchParams();
  const [finalData, setFinalData] = useState([]);

  useEffect(() => {
    const filterBy = searchParams.get("filterBy") || "all";
    const sortBy = searchParams.get("sortBy") || "name";
    const direction = searchParams.get("direction") === "asc";

    let data = [];
    if (simulatorInfo.length > 0) {
      data = [...simulatorInfo].sort((a, b) => {
        if (sortBy === "name") {
          if (direction) {
            return a.name.localeCompare(b.name);
          } else {
            return b.name.localeCompare(a.name);
          }
        } else if (sortBy === "createdAt") {
          if (direction) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          } else {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
        } else {
          if (direction) {
            return new Date(a.lastModified) - new Date(b.lastModified);
          } else {
            return new Date(b.lastModified) - new Date(a.lastModified);
          }
        }
      });

      if (filterBy !== "all") {
        data = data.filter((item) => item.tm_variant === filterBy);
      }
    }

    setFinalData(data);
  }, [searchParams, simulatorInfo]);

  return (
    <div
      className={cn("flex min-h-full w-full flex-grow flex-col gap-4 px-1 sm:px-8", finalData.length === 0 && "px-4")}
    >
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full justify-between px-4 sm:px-0">
          <div className="flex flex-col">
            <h1 className="text-left text-2xl font-bold text-white sm:text-3xl">Simulador</h1>
            <DialogFilter />
          </div>
          <CreateSimulatorModal />
        </div>
      </div>

      {finalData.length > 0 ? (
        finalData.map((item) => {
          if (simulatorInfo.some((simulator) => simulator.id === item.id)) {
            return (
              <Simulator key={item.id} id={item.id}>
                <TMSimulator id={item.id} />
              </Simulator>
            );
          }

          return null;
        })
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
