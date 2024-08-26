import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSimulator } from "../../providers/simulator";
import { cn } from "../../utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import EditSimulatorModal from "./EditSimulatorModal";

function TopBar({ id, isEditPopoverOpen, setIsEditPopoverOpen }) {
  const { setData, getOne } = useSimulator();

  const handleOpen = () => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, open: !item.open } : { ...item, open: false })));
  };

  const handleResize = () => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, fullScreen: !item.fullScreen } : item)));
  };

  const simulator = getOne(id);

  if (!simulator) return null;

  const isOpen = simulator.open;
  const isFullScreen = simulator.fullScreen;

  return (
    <div className={cn("flex w-full items-center justify-between bg-main px-3 pb-2 pt-3", !isOpen && "py-3")}>
      <div className="flex items-center gap-2">
        {!isFullScreen && (
          <button className="rotate-0 border-none bg-none p-2 text-white" onClick={handleOpen}>
            <Icon
              icon="ep:arrow-down-bold"
              className={cn("icon h-4 w-4 transition-transform duration-300", !isOpen && "-rotate-90")}
            />
          </button>
        )}
        <button className="border-none bg-none text-sm font-semibold text-white">
          <p className="px-2 py-[.4rem] uppercase text-white">{simulator.name}</p>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Popover open={isEditPopoverOpen} onOpenChange={setIsEditPopoverOpen}>
          <PopoverTrigger asChild>
            <button className="border-none bg-none p-2 text-white">
              <Icon icon="ic:round-settings" className="icon h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className={cn("dark-mode-variables z-[200] max-w-80 bg-main px-0 shadow-4xl", isFullScreen && "mr-5")}
          >
            <EditSimulatorModal id={id} />
          </PopoverContent>
        </Popover>

        <button className="border-none bg-none p-2 text-white" onClick={handleResize}>
          {isFullScreen ? (
            <Icon icon="mage:minimize" className="icon h-4 w-4" />
          ) : (
            <Icon icon="prime:expand" className="icon h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

export default TopBar;
