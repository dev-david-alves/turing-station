import { useRef } from "react";
import TopBar from "./TopBar";
import LeftSideBar from "./LeftSideBar";
import { useSimulator } from "../../providers/simulator";
import { cn } from "../../utils/cn";
import BottomDrawer from "./BottomDrawer";
import { useState } from "react";
import CreateTransition from "./context-menu/CreateTransition";
import StateModal from "./context-menu/StateModal";
import LinkModal from "./context-menu/LinkModal";
import CanvasModal from "./context-menu/CanvasModal";

const Simulator = ({ id, children }) => {
  if (!id) throw new Error("Simulator component must have an id prop");

  const { getOne, handleFocus } = useSimulator();
  const [isEditPopoverOpen, setIsEditPopoverOpen] = useState(false);

  const simulator = getOne(id);

  if (!simulator) return null;

  const isOpen = simulator.open;
  const isFullScreen = simulator.fullScreen;
  const isFocused = simulator.focused;
  const showLeftToolbar = simulator.showLeftToolbar;

  return (
    <div
      id={`simulator-${id}`}
      onClick={() => handleFocus(true, id)}
      className={cn(
        "z-10 flex h-[31.8rem] w-full max-w-[45rem] flex-col items-center overflow-hidden rounded-lg bg-main shadow-default transition-all duration-75",
        !isOpen && "h-[3.5rem]",
        isFullScreen && "min-w-screen max-w-screen fixed left-0 top-0 z-[100] min-h-screen rounded-none",
        isFocused && "shadow-high",
      )}
    >
      <TopBar id={id} isEditPopoverOpen={isEditPopoverOpen} setIsEditPopoverOpen={setIsEditPopoverOpen} />
      <div
        className={cn(
          "flex h-[28.5rem] max-h-[40rem] w-full items-center border-b-[5px] border-r-[5px] border-main transition-all duration-300",
          !isOpen && "max-h-0 overflow-hidden",
          isFullScreen && "h-full max-h-full",
          !showLeftToolbar && "border-l-[5px]",
        )}
      >
        <LeftSideBar id={id} />
        <div id={`playground-${id}`} className="relative h-full w-full rounded-br-xl bg-danger">
          {children}

          <CreateTransition id={id} className="invisible left-1/2 top-1/2" />
          <StateModal id={id} className="left-1/2 top-1/2 hidden" />
          <LinkModal id={id} className="left-1/2 top-1/2 hidden" />
          <CanvasModal id={id} className="left-1/2 top-1/2 hidden" />

          <div className="absolute bottom-0 z-[2000] w-full px-1">
            <BottomDrawer id={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
