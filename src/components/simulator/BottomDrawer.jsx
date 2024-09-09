import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "../Input";
import { useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../Tooltip";
import { useSimulator } from "../../providers/simulator";
import { useClickOuside } from "../../hooks/useClickDetection";

const navButtons = [
  {
    id: "test-tab",
    icon: "hugeicons:test-tube-01",
    tip: "Teste a máquina de turing com uma entrada específica",
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

function TestTab({ id, className }) {
  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <div className="flex w-full max-w-full items-center gap-1">
        <p className="font-semibold text-white">Entrada</p>
        <Input type="text" placeholder="0101..." id={`simulation-input-${id}`} value="acccb" onChange={() => {}} />
        {simulationButtons.map((button, index) => (
          <button
            id={`simulation-${button.id}-${id}`}
            key={index}
            className="flex h-[2rem] w-14 items-center justify-center rounded-[5px] bg-primary text-white outline-none transition-colors duration-200 hover:bg-primaryHover disabled:cursor-not-allowed disabled:bg-disabledButton"
          >
            <Icon icon={button.icon} className="icon h-5 w-5" />
          </button>
        ))}
      </div>
      {/* <div id={`erros-container-${id}`} className="flex w-full flex-col items-center justify-center gap-2">
        <div id={`error-${id}`} className="flex w-full items-center justify-center rounded-sm bg-danger py-1">
          <p className="font-semibold text-white">Defina um estado inicial!</p>
        </div>
        <div id={`error-${id}`} className="flex w-full items-center justify-center rounded-sm bg-danger py-1">
          <p className="font-semibold text-white">Defina pelo menos um estado final!</p>
        </div>
      </div> */}

      <div
        id={`tape-container-${id}`}
        className="flex h-fit w-full flex-col items-center justify-center gap-2 overflow-x-auto overflow-y-hidden rounded-md"
      ></div>
    </div>
  );
}

function Navgation({ id, selectedNavButton, setSelectedNavButton }) {
  const handleSelectNavButton = (index) => {
    if (selectedNavButton === index) {
      setSelectedNavButton(undefined);
    } else {
      setSelectedNavButton(index);
    }
  };

  const { getOne } = useSimulator();
  const { showTooltips } = getOne(id);

  return (
    <>
      {navButtons.map((button, index) => (
        <div className="flex w-full items-center justify-center gap-2" key={index}>
          {showTooltips ? (
            <TooltipProvider>
              <Tooltip delayDuration={200} sideOffset={5}>
                <TooltipTrigger asChild>
                  <button
                    id={`simulation-nav-${button.id}-${id}`}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md border-[1px] border-white text-white outline-none transition-colors duration-200",
                      selectedNavButton === button.id && "border-primary bg-primary",
                      selectedNavButton === undefined && "h-7 w-7",
                    )}
                    onClick={() => handleSelectNavButton(button.id)}
                  >
                    <Icon
                      icon={button.icon}
                      className={cn("icon h-5 w-5", selectedNavButton === undefined && "h-4 w-4")}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-56 rounded-md bg-main text-white shadow-4xl">
                  <div className="w-full px-4 py-2">
                    <p className="text-xs font-bold text-darkGreen">Dica!</p>
                    <hr className="my-1 border-infoDark opacity-20" />
                    <p>{button.tip}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <button
              id={`simulation-nav-${button.id}-${id}`}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md border-[1px] border-white text-white outline-none transition-colors duration-200",
                selectedNavButton === button.id && "border-primary bg-primary",
                selectedNavButton === undefined && "h-7 w-7",
              )}
              onClick={() => handleSelectNavButton(button.id)}
            >
              <Icon icon={button.icon} className={cn("icon h-5 w-5", selectedNavButton === undefined && "h-4 w-4")} />
            </button>
          )}
        </div>
      ))}
    </>
  );
}

function BottomDrawer({ id }) {
  const [selectedNavButton, setSelectedNavButton] = useState("test-tab");

  const bottomRef = useRef(null);
  useClickOuside(bottomRef, () => setSelectedNavButton("test-tab"));

  return (
    <div
      id={`bottom-drawer-${id}`}
      ref={bottomRef}
      className={cn(
        "flex w-full flex-col items-center gap-2 rounded-t-md bg-main px-4 pt-2 transition-all duration-200",
        selectedNavButton !== undefined && `opened-${selectedNavButton} pb-2`,
      )}
    >
      <Navgation id={id} selectedNavButton={selectedNavButton} setSelectedNavButton={setSelectedNavButton} />
      <TestTab id={id} className={cn(selectedNavButton !== "test-tab" && "max-h-0")} />
    </div>
  );
}

export default BottomDrawer;
