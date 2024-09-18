import React, { useEffect, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSimulator } from "../../providers/simulator";
import { cn } from "../../utils/cn";
import EditSimulatorModal from "./EditSimulatorModal";
import { useClickOuside } from "../../hooks/useClickDetection";

function TopBar({ id, isEditPopoverOpen, setIsEditPopoverOpen }) {
  const { setSimulatorInfo, getOne } = useSimulator();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "F11") {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    // Handler to update full-screen state
    const handleFullScreenChange = () => {
      setSimulatorInfo((prev) =>
        prev.map((item) => (item.id === id ? { ...item, fullScreen: !!document.fullscreenElement } : item)),
      );
    };

    // Listen for full-screen change events
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = ({ fullScreen }) => {
    if (!document.fullscreenElement) {
      if (!fullScreen) return;
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // const handleOpen = () => {
  //   setSimulatorInfo((prev) =>
  //     prev.map((item) => (item.id === id ? { ...item, open: !item.open } : { ...item, open: false })),
  //   );
  // };

  const handleResize = () => {
    setSimulatorInfo((prev) => prev.map((item) => (item.id === id ? { ...item, fullScreen: !item.fullScreen } : item)));
  };

  const simulator = getOne(id);

  if (!simulator) return null;

  const isOpen = simulator.open;
  const isFullScreen = simulator.fullScreen;

  const modalRef = useRef(null);
  useClickOuside(modalRef, () => setIsEditPopoverOpen(false));

  // Toggle full screen when fullScreen state changes
  useEffect(() => {
    toggleFullScreen({ fullScreen: isFullScreen });
  }, [isFullScreen]);

  return (
    <div className={cn("flex w-full items-center justify-between bg-main px-3 pb-2 pt-3", !isOpen && "py-3")}>
      <div className="flex items-center gap-2">
        {/* {!isFullScreen && (
          <button className="rotate-0 border-none bg-none p-2 text-white" onClick={handleOpen}>
            <Icon
              icon="ep:arrow-down-bold"
              className={cn("icon h-4 w-4 transition-transform duration-300", !isOpen && "-rotate-90")}
            />
          </button>
        )} */}
        <button className="border-none bg-none text-sm font-semibold text-white">
          <p className="px-2 py-[.4rem] uppercase text-white">{simulator.name}</p>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={modalRef}>
          <button
            className="border-none bg-none p-2 text-white"
            onClick={() => setIsEditPopoverOpen(!isEditPopoverOpen)}
          >
            <Icon icon="ic:round-settings" className="icon h-4 w-4" />
          </button>

          <div className={cn("absolute -right-5 z-[2000] mt-1", !isEditPopoverOpen && "invisible absolute -z-50")}>
            <EditSimulatorModal id={id} />
          </div>
        </div>

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
