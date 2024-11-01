import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "../Input";
import { cn } from "../../utils/cn";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../Tooltip";
import { useSimulator } from "../../providers/simulator";
import { useEffect, useRef, useState } from "react";
import { texMap } from "../../p5-turing-machines/utils/getTexMaps";
import { Button } from "../Button";
import { texMapMatch } from "../../p5-turing-machines/utils/transformInputText";
import { useQuestionSimulator } from "../../providers/question";

const navButtons = [
  {
    id: "test-tab",
    icon: "hugeicons:test-tube-01",
    tip: "Teste a máquina de turing com uma entrada específica",
  },
  {
    id: "multitest-tab",
    icon: "fluent-mdl2:test-plan",
    tip: "Teste a máquina de turing com várias entradas",
  },
];

const simulationButtons = [
  {
    id: "fast-reset",
    icon: "ant-design:fast-backward-outlined",
  },
  {
    id: "step-back",
    icon: "ri:skip-back-fill",
  },
  {
    id: "step-forward",
    icon: "ri:skip-forward-fill",
  },
  {
    id: "fast-simulation",
    icon: "ant-design:fast-forward-outlined",
  },
];

function MultiTestTab({ id, className }) {
  const generateRandomId = () => Math.random().toString(36).substring(7);
  const [testInputs, setTestInputs] = useState([generateRandomId(), generateRandomId(), generateRandomId()]);
  const [inputValues, setInputValues] = useState({});

  return (
    <div id={`multitest-tab-${id}`} className={cn("w-full", className)}>
      <div className="w-full bg-background px-4 py-1">
        <p className="font-semibold text-white">Multiteste</p>
      </div>
      {testInputs.map((value) => (
        <div
          key={value}
          id={`multitest-input-container-${value}-${id}`}
          className="mt-2 flex w-full max-w-full items-center gap-2 overflow-hidden px-4 py-1"
        >
          <Icon
            id={`accepted-testIcon-${value}-${id}`}
            icon="solar:check-circle-outline"
            className="icon hidden h-8 min-h-8 w-8 min-w-8 text-lightGreen"
          />
          <Icon
            id={`rejected-testIcon-${value}-${id}`}
            icon="icon-park-outline:close-one"
            className="icon hidden h-8 min-h-8 w-8 min-w-8 text-lightDanger"
          />
          <Input
            id={`multitest-input-${value}-${id}`}
            type="text"
            placeholder={texMap["\\Blank"]}
            className={cn(`multitest-input-${id} min-h-full w-full py-1.5 outline-none focus-visible:ring-0`)}
            data-randomid={value}
            value={inputValues.hasOwnProperty(value) ? inputValues[value] : ""}
            onChange={(e) => {
              let value = texMapMatch([e.target.value], texMap)[0];
              setInputValues((prev) => ({ ...prev, [e.target.dataset.randomid]: value }));
            }}
          />
          <Button
            id={`delete-multitest-input-${value}-${id}`}
            variant="default"
            onClick={() => {
              if (testInputs.length === 1) return;
              setTestInputs(testInputs.filter((v) => v !== value));
            }}
            className={cn("hidden h-8 w-12 items-center justify-center bg-danger text-white")}
            disabled={testInputs.length === 1}
          >
            <Icon icon="ri:delete-bin-2-line" className="icon h-5 w-5" />
          </Button>
        </div>
      ))}
      <div className="mt-2 flex w-full items-center justify-between px-4">
        <Button
          id={`add-multitest-input-${id}`}
          variant="default"
          onClick={() => setTestInputs([...testInputs, generateRandomId()])}
          className="w-20 bg-zinc-700 text-white"
        >
          <Icon icon="ri:add-line" className="icon h-5 w-5" />
        </Button>

        <Button id={`run-multitest-${id}`} variant="default" className="w-20 text-white">
          Testar
        </Button>
      </div>
    </div>
  );
}

function TestTab({ id, className }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    let value = texMapMatch([e.target.value], texMap)[0];
    setInputValue(value);
  };

  return (
    <div id={`test-tab-${id}`} className={cn("w-full px-4", className)}>
      <div className="flex w-full max-w-full flex-col gap-1 sm:flex-row sm:items-center">
        <p className="font-semibold text-white">Entrada</p>
        <Input
          type="text"
          placeholder="0101..."
          id={`simulation-input-${id}`}
          className="flex-grow"
          value={inputValue}
          onChange={handleInputChange}
        />
        <div className="flex items-center justify-center gap-1">
          {simulationButtons.map((button, index) => (
            <button
              key={index}
              id={`simulation-${button.id}-${id}`}
              className={`flex h-10 w-10 max-w-10 items-center justify-center rounded-[5px] bg-primary text-white outline-none transition-colors duration-200 hover:bg-primaryHover disabled:cursor-not-allowed disabled:bg-disabledButton simulation-bottom-buttons-${id}`}
              disabled={true}
            >
              <Icon icon={button.icon} className="icon h-5 w-5" />
            </button>
          ))}
        </div>
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
        className="mt-2 flex min-h-full w-full flex-col items-center justify-center gap-2 overflow-y-auto overflow-x-hidden rounded-md"
      ></div>
    </div>
  );
}

function Navgation({ id, selectedTab, setSelectedTab, whichProvider = "simulator" }) {
  const { getOne, setSimulatorInfo } = whichProvider === "simulator" ? useSimulator() : useQuestionSimulator();
  const { showTooltips, bottomDrawerOpen } = getOne(id);

  const handleClick = (buttonID) => {
    if (selectedTab === buttonID) {
      setSelectedTab(undefined);
      setSimulatorInfo((prev) => prev.map((item) => (item.id === id ? { ...item, bottomDrawerOpen: false } : item)));
    } else {
      setSelectedTab(buttonID);
      setSimulatorInfo((prev) => prev.map((item) => (item.id === id ? { ...item, bottomDrawerOpen: true } : item)));
    }
  };

  useEffect(() => {
    if (!bottomDrawerOpen) setSelectedTab(undefined);
    else if (selectedTab === undefined) setSelectedTab("test-tab");
  }, [bottomDrawerOpen]);

  return (
    <div id={`simulation-nav-${id}`} className="flex w-full items-center justify-center gap-2">
      {navButtons.map((button, index) => (
        <div key={index}>
          <TooltipProvider>
            <Tooltip delayDuration={200} sideOffset={5}>
              <TooltipTrigger asChild>
                <button
                  id={`simulation-nav-${button.id}-${id}`}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md border-[1px] border-white text-white outline-none transition-colors duration-200",
                    selectedTab === button.id && `selected-bottom-tab-button opened-${button.id}-${id}`,
                  )}
                  onClick={() => handleClick(button.id)}
                >
                  <Icon icon={button.icon} className={cn("icon h-4 w-4")} />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className={cn(
                  "max-w-56 rounded-md bg-main text-white shadow-4xl",
                  showTooltips ? "visible" : "invisible",
                )}
              >
                <div className="w-full px-4 py-2">
                  <p className="text-xs font-bold text-darkGreen">Dica!</p>
                  <hr className="my-1 border-infoDark opacity-20" />
                  <p>{button.tip}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
    </div>
  );
}

function BottomDrawer({ id, parentHeight, whichProvider = "simulator" }) {
  const [selectedTab, setSelectedTab] = useState(undefined);

  useEffect(() => {
    let testTab = document.getElementById(`test-tab-${id}`);
    let multiTestTab = document.getElementById(`multitest-tab-${id}`);
    const navContainer = document.getElementById(`simulation-nav-${id}`);
    let newHeight = parentHeight - navContainer.offsetHeight - 20;
    if (newHeight < 0) newHeight = 100;

    if (testTab) testTab.style.maxHeight = `${newHeight}px`;
    if (multiTestTab) multiTestTab.style.maxHeight = `${newHeight}px`;
  }, [parentHeight]);

  return (
    <div
      className={cn(
        "flex min-h-full w-full flex-col items-center gap-2 rounded-t-md bg-main pt-2 transition-all duration-200",
      )}
    >
      <Navgation id={id} selectedTab={selectedTab} setSelectedTab={setSelectedTab} whichProvider={whichProvider} />

      <TestTab
        id={id}
        className={cn("overflow-y-auto transition-all duration-200", selectedTab === "test-tab" ? "block" : "hidden")}
      />
      <MultiTestTab
        id={id}
        className={cn(
          "overflow-y-auto transition-all duration-200",
          selectedTab === "multitest-tab" ? "block" : "hidden",
        )}
      />
    </div>
  );
}

export default BottomDrawer;
