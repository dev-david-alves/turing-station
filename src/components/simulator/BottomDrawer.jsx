import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "../Input";
import { cn } from "../../utils/cn";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../Tooltip";
import { useSimulator } from "../../providers/simulator";

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
    <div id={`test-tab-${id}`} className={cn("w-full overflow-hidden", className)}>
      <div className="flex w-full max-w-full items-center gap-1">
        <p className="font-semibold text-white">Entrada</p>
        <Input type="text" placeholder="0101..." id={`simulation-input-${id}`} />
        {simulationButtons.map((button, index) => (
          <button
            id={`simulation-${button.id}-${id}`}
            key={index}
            className={`flex h-[2rem] w-14 items-center justify-center rounded-[5px] bg-primary text-white outline-none transition-colors duration-200 hover:bg-primaryHover disabled:cursor-not-allowed disabled:bg-disabledButton simulation-bottom-buttons-${id}`}
          >
            <Icon icon={button.icon} className="icon h-5 w-5" />
          </button>
        ))}
      </div>

      <div id={`erros-container-${id}`} className="mt-2 flex w-full flex-col items-center justify-center gap-2">
        <div className="flex w-full items-center justify-center rounded-md bg-danger py-1">
          <p id={`start-link-error-${id}`} className="font-semibold text-white">
            Defina um estado inicial!
          </p>
        </div>
      </div>

      <div
        id={`tape-container-${id}`}
        className="mt-2 flex h-fit w-full flex-col items-center justify-center gap-2 overflow-x-auto overflow-y-hidden rounded-md"
      ></div>
    </div>
  );
}

function Navgation({ id }) {
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
                      "flex h-7 w-7 items-center justify-center rounded-md border-[1px] border-white text-white outline-none transition-colors duration-200",
                    )}
                  >
                    <Icon icon={button.icon} className={cn("icon h-4 w-4")} />
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
                "flex h-7 w-7 items-center justify-center rounded-md border-[1px] border-white text-white outline-none transition-colors duration-200",
              )}
            >
              <Icon icon={button.icon} className={cn("icon h-4 w-4")} />
            </button>
          )}
        </div>
      ))}
    </>
  );
}

function BottomDrawer({ id }) {
  return (
    <div
      id={`bottom-drawer-${id}`}
      className={cn(
        "flex w-full flex-col items-center gap-2 rounded-t-md bg-main px-4 pt-2 transition-all duration-200",
      )}
    >
      <Navgation id={id} />
      <TestTab id={id} />
    </div>
  );
}

export default BottomDrawer;
