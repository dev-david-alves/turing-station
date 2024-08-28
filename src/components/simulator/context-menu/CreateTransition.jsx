import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { cn } from "../../../utils/cn";
import { buttonVariants } from "../../Button";
import { texMap } from "../../../p5-turing-machines/utils/getTexMaps";
import { CustomDataList } from "../../Datalist";

const CustomDirectionButton = ({ direction, className, ...props }) => {
  return (
    <button
      {...props}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border-2 border-primary bg-gray-800 font-semibold text-white",
        className,
      )}
    >
      {direction}
    </button>
  );
};

function CreateTransition({ id, className }) {
  const [selectedDirection, setSelectedDirection] = useState("L");

  return (
    <div
      className={cn(
        "absolute z-[200] flex translate-x-[-50%] translate-y-[-50%] flex-col items-center justify-center gap-2",
        className,
      )}
    >
      <div className="flex max-w-[220px] flex-col gap-2 rounded-md bg-main p-3 shadow-lg">
        <div className="flex w-full items-center gap-2">
          <CustomDataList type="text" id={`transition-read-${id}`} placeholder="Lê" data={texMap} />
          <CustomDataList type="text" id={`transition-write-${id}`} placeholder="Escreve" data={texMap} />
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center gap-1">
            <CustomDirectionButton
              direction="E"
              id={`transition-direction-L-${id}`}
              onClick={() => setSelectedDirection("L")}
              className={cn(selectedDirection === "L" && "selected bg-primary")}
            />
            <CustomDirectionButton
              direction="D"
              id={`transition-direction-R-${id}`}
              onClick={() => setSelectedDirection("R")}
              className={cn(selectedDirection === "R" && "selected bg-primary")}
            />
            <CustomDirectionButton
              direction="P"
              id={`transition-direction-S-${id}`}
              onClick={() => setSelectedDirection("S")}
              className={cn(selectedDirection === "S" && "selected bg-primary")}
            />
          </div>

          <button
            className={cn(
              buttonVariants({ variant: "popoverMenu" }),
              "flex max-w-9 items-center justify-center rounded-md border-none bg-none p-0 text-white",
            )}
            id={`transition-create-${id}`}
          >
            <Icon icon="uil:check" className="icon h-5 w-5 max-w-full" />
          </button>
        </div>
      </div>

      <div
        className="flex w-fit items-center gap-2 rounded-md bg-main px-3 py-1 italic text-white shadow-lg"
        id={`transition-result-${id}`}
      >
        A <Icon icon="solar:arrow-right-outline" className="icon h-5 w-5 max-w-full" /> B, E
      </div>
    </div>
  );
}

export default CreateTransition;
