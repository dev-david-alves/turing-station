import { useEffect, useRef } from "react";
import TopBar from "./TopBar";
import LeftSideBar from "./LeftSideBar";
import { useSimulator } from "../../providers/simulator";
import { cn } from "../../utils/cn";
import BottomDrawer from "./BottomDrawer";
import { useState } from "react";
import StateModal from "./context-menu/StateModal";
import LinkModal from "./context-menu/LinkModal";
import CanvasModal from "./context-menu/CanvasModal";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../Resizable";
import { useQuestionSimulator } from "../../providers/question";

const Simulator = ({ id, children, whichProvider = "simulator" }) => {
  if (!id) throw new Error("Simulator component must have an id prop");

  const { getOne, handleFocus, setSimulatorInfo } =
    whichProvider === "simulator" ? useSimulator() : useQuestionSimulator();
  const [isEditPopoverOpen, setIsEditPopoverOpen] = useState(false);
  const [parentHeight, setParentHeight] = useState(0);

  const simulator = getOne(id);

  if (!simulator) return null;

  const isOpen = simulator.open;
  const isFullScreen = simulator.fullScreen;
  const isFocused = simulator.focused;
  const showLeftToolbar = simulator.showLeftToolbar;
  const bottomDrawerOpen = simulator.bottomDrawerOpen;

  const bottomDrawerRef = useRef(null);
  const MIN_BOTTOM_DRAWER_SIZE = 9;
  const MAX_BOTTOM_DRAWER_SIZE = 80;

  const toggleBottomDrawerIsOpen = (size) => {
    let divR = document.getElementById(`bottom-drawer-${id}`);
    if (divR) setParentHeight(divR.offsetHeight);

    if (size > MIN_BOTTOM_DRAWER_SIZE)
      setSimulatorInfo((prev) => prev.map((item) => (item.id === id ? { ...item, bottomDrawerOpen: true } : item)));
    else setSimulatorInfo((prev) => prev.map((item) => (item.id === id ? { ...item, bottomDrawerOpen: false } : item)));
  };

  useEffect(() => {
    const bottomPanel = bottomDrawerRef.current;
    if (bottomPanel) {
      if (bottomDrawerOpen) {
        if (bottomPanel.getSize() == 9) bottomPanel.resize(60);

        let divR = document.getElementById(`bottom-drawer-${id}`);
        if (divR) {
          setTimeout(() => {
            setParentHeight(divR.offsetHeight);
          }, 200);
        }
      } else {
        bottomPanel.resize(MIN_BOTTOM_DRAWER_SIZE);
        let divR = document.getElementById(`bottom-drawer-${id}`);
        if (divR) setParentHeight(divR.offsetHeight);
      }
    }
  }, [bottomDrawerOpen]);

  return (
    <div
      id={`simulator-${id}`}
      onClick={() => handleFocus(true, id)}
      className={cn(
        "z-10 flex h-[31.8rem] w-full flex-col items-center overflow-hidden rounded-lg bg-background shadow-default transition-all duration-500",
        !isOpen && "h-[3.5rem]",
        isFullScreen && "min-w-screen max-w-screen fixed left-0 top-0 z-[100] h-full min-h-full rounded-none",
        isFocused && whichProvider === "simulator" ? "shadow-high" : "shadow-question",
      )}
    >
      <TopBar
        id={id}
        isEditPopoverOpen={isEditPopoverOpen}
        setIsEditPopoverOpen={setIsEditPopoverOpen}
        whichProvider={whichProvider}
      />
      <div
        className={cn(
          "relative flex h-[28.5rem] max-h-[40rem] w-full items-center border-b-[5px] border-r-[5px] border-main transition-all duration-500",
          !isOpen && "max-h-0 overflow-hidden",
          isFullScreen && "h-full max-h-full",
          !showLeftToolbar && "border-l-[5px]",
        )}
      >
        <LeftSideBar id={id} whichProvider={whichProvider} />

        <ResizablePanelGroup direction="vertical">
          <ResizablePanel
            defaultSize={100 - MIN_BOTTOM_DRAWER_SIZE}
            minSize={100 - MAX_BOTTOM_DRAWER_SIZE}
            maxSize={100 - MIN_BOTTOM_DRAWER_SIZE}
          >
            <div id={`playground-${id}`} className="h-full w-full rounded-br-xl">
              {children}

              <StateModal id={id} className="hidden" />
              {/* <LinkModal id={id} className="hidden" /> */}
              {/* <CanvasModal id={id} className="hidden" />  */}
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            id={`bottom-drawer-${id}`}
            minSize={MIN_BOTTOM_DRAWER_SIZE}
            maxSize={MAX_BOTTOM_DRAWER_SIZE}
            className="z-[2010] mx-1 overflow-y-auto"
            ref={bottomDrawerRef}
            defaultSize={MIN_BOTTOM_DRAWER_SIZE}
            onResize={(size) => toggleBottomDrawerIsOpen(size)}
          >
            <div className="min-h-full overflow-hidden rounded-t-md bg-main">
              <BottomDrawer id={id} parentHeight={parentHeight} whichProvider={whichProvider} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Simulator;
