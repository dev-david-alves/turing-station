import { Outlet } from "react-router-dom";
import SideBar from "../components/navigation/SideBar";
import { useState } from "react";
import { cn } from "../utils/cn";
import { useSimulator } from "../providers/simulator";

function Layout() {
  const [sidebarisOpen, setSidebarIsOpen] = useState(true);
  const { simulatorInfo } = useSimulator();
  const isAnyFullScreen = simulatorInfo.some((item) => item.fullScreen);

  return (
    <div className="dark-mode-variables relative flex min-h-screen w-full bg-background">
      <div className={cn("full z-[25000]", isAnyFullScreen && "hidden")}>
        <SideBar isOpen={sidebarisOpen} setIsOpen={setSidebarIsOpen} />
        <div
          className={cn(
            "flex min-h-screen w-64 max-w-64 flex-col items-center justify-between bg-main py-8 shadow-xl transition-all duration-300",
            !sidebarisOpen && "w-16",
          )}
        ></div>
      </div>

      <main className="flex h-full min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-background px-[5px] py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
