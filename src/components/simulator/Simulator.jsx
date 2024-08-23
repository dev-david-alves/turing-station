import { useRef } from "react";
import TopBar from "./TopBar";
import LeftSideBar from "./LeftSideBar";
import { useSimulator } from "../../providers/simulator";
import { cn } from "../../utils/cn";
import useClickDetection from "../../hooks/useClickOutside";

const Simulator = ({ id, children }) => {
  if (!id) throw new Error("Simulator component must have an id prop");

  const { data, handleFocus } = useSimulator();

  const isOpen = data.find((item) => item.id === id).open;
  const isFullScreen = data.find((item) => item.id === id).fullScreen;
  const isFocused = data.find((item) => item.id === id).focused;

  const simulatorRef = useRef(null);
  useClickDetection(simulatorRef, () => handleFocus(false, id));

  return (
    <div
      ref={simulatorRef}
      id={`simulator-${id}`}
      onClick={() => handleFocus(true, id)}
      className={cn(
        "z-10 flex h-[31.8rem] w-full max-w-[45rem] flex-col items-center overflow-hidden rounded-lg bg-main shadow-default transition-all duration-75",
        !isOpen && "h-[3.5rem]",
        isFullScreen && "min-w-screen max-w-screen fixed left-0 top-0 z-[100] min-h-screen rounded-none",
        isFocused && "shadow-high",
      )}
    >
      <TopBar id={id} />
      <div
        className={cn(
          "flex h-[28.5rem] max-h-[40rem] w-full items-center transition-all duration-300",
          !isOpen && "max-h-0 overflow-hidden",
          isFullScreen && "h-full max-h-full",
        )}
      >
        <LeftSideBar id={id} />
        <div
          id={`playground-${id}`}
          className="h-full w-full rounded-br-xl border-b-[.4rem] border-r-[.4rem] border-main bg-danger"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Simulator;
