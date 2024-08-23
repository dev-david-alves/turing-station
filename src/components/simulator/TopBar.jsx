import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSimulator } from "../../providers/simulator";
import { cn } from "../../utils/cn";

function TopBar({ id }) {
  const { data, setData } = useSimulator();

  const handleOpen = () => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, open: !item.open } : { ...item, open: false })));
  };

  const handleResize = () => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, fullScreen: !item.fullScreen } : item)));
  };

  const handleDeleteSimulator = () => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const isOpen = data.find((item) => item.id === id).open;
  const isFullScreen = data.find((item) => item.id === id).fullScreen;

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
          <p className="px-2 py-[.4rem] uppercase text-white">Custom MT 01</p>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="border-none bg-none p-2 text-white" onClick={handleResize}>
          {isFullScreen ? (
            <Icon icon="mage:minimize" className="icon h-4 w-4" />
          ) : (
            <Icon icon="prime:expand" className="icon h-4 w-4" />
          )}
        </button>
        <button className="border-none bg-none p-2 text-white" onClick={() => handleDeleteSimulator()}>
          <Icon icon="mdi:trash" className="icon h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default TopBar;
