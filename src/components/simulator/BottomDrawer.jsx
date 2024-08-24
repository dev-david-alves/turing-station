import { Icon } from "@iconify/react/dist/iconify.js";
import Input from "../Input";
import { useState } from "react";
import { cn } from "../../utils/cn";

const navButtons = [
  {
    id: "test-tab",
    icon: "hugeicons:test-tube-01",
  },
];

const simulationButtons = [
  {
    id: "fast-reset",
    icon: "ri:skip-back-fill",
  },
  {
    id: "step-back",
    icon: "ion:chevron-back-outline",
  },
  {
    id: "step-forward",
    icon: "ion:chevron-forward-outline",
  },
  {
    id: "fast-simulation",
    icon: "ri:skip-forward-fill",
  },
];

function TestTab({ id }) {
  const [value, setValue] = useState("");

  return (
    <>
      <div className="flex w-full max-w-full items-center gap-2">
        <p className="font-semibold text-white">Entrada</p>
        <Input type="text" placeholder="0101..." value={value} setValue={setValue} id={`simulation-input-${id}`} />
        {simulationButtons.map((button, index) => (
          <button
            id={`simulation-${button.id}-${id}`}
            key={index}
            className="disabled:bg-disabledButton flex h-[2rem] w-14 items-center justify-center rounded-[5px] bg-primary text-white outline-none transition-colors duration-200 hover:bg-primaryHover disabled:cursor-not-allowed"
            disabled={button.id === "fast-reset"}
          >
            <Icon icon={button.icon} className="icon h-5 w-5" />
          </button>
        ))}
      </div>
      <div id={`erros-container-${id}`} className="flex w-full flex-col items-center justify-center gap-2">
        <div id={`error-${id}`} className="flex w-full items-center justify-center rounded-sm bg-danger py-1">
          <p className="font-semibold text-white">Defina um estado inicial!</p>
        </div>
        <div id={`error-${id}`} className="flex w-full items-center justify-center rounded-sm bg-danger py-1">
          <p className="font-semibold text-white">Defina pelo menos um estado final!</p>
        </div>
      </div>

      <div
        id={`tape-container-${id}`}
        className="flex w-full flex-col items-center justify-center gap-2 overflow-x-auto"
      ></div>
    </>
  );
}

function BottomDrawer({ id }) {
  const [selectedNavButton, setSelectedNavButton] = useState(undefined);

  const handleSelectNavButton = (index) => {
    if (selectedNavButton === index) {
      setSelectedNavButton(undefined);
    } else {
      setSelectedNavButton(index);
    }
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-2 rounded-t-md bg-main px-4 pt-2 transition-all duration-200",
        selectedNavButton !== undefined && "pb-2",
      )}
    >
      <div className="flex w-full items-center justify-center gap-2">
        {navButtons.map((button, index) => (
          <button
            key={index}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border-[1px] border-white text-white outline-none transition-colors duration-200",
              selectedNavButton === button.id && "border-primary bg-primary",
              selectedNavButton === undefined && "h-7 w-7",
            )}
            onClick={() => handleSelectNavButton(button.id)}
          >
            <Icon icon={button.icon} className={cn("icon h-5 w-5", selectedNavButton === undefined && "h-4 w-4")} />
          </button>
        ))}
      </div>
      {selectedNavButton === "test-tab" && <TestTab id={id} />}
    </div>
  );
}

export default BottomDrawer;
