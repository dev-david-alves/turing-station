import { Outlet } from "react-router-dom";
import { useState } from "react";
import { cn } from "../utils/cn";
import { useSimulator } from "../providers/simulator";
import SideNavigation from "../components/navigation/SideNavigation";
import TabNavitaion from "../components/navigation/TabNavigation";

function Layout() {
  const [sidebarisOpen, setSidebarIsOpen] = useState(true);
  const { simulatorInfo } = useSimulator();
  const isAnyFullScreen = simulatorInfo.some((item) => item.fullScreen);

  return (
    <div className="dark-mode-variables relative flex min-h-screen w-full bg-background">
      <div className={cn("full relative z-[25000] hidden sm:block", isAnyFullScreen && "hidden sm:hidden")}>
        <SideNavigation isOpen={sidebarisOpen} setIsOpen={setSidebarIsOpen} />
        <div
          className={cn(
            "flex min-h-screen w-64 max-w-64 flex-col items-center justify-between bg-main py-8 shadow-xl transition-all duration-300",
            !sidebarisOpen && "w-16",
          )}
        ></div>
      </div>

      <div className={cn("full bottom-0 z-[25000] block bg-main sm:hidden", isAnyFullScreen && "hidden")}>
        <TabNavitaion />
      </div>

      <main className="flex h-full min-h-screen w-full flex-col items-center overflow-x-hidden bg-background pb-20 pt-10 sm:pb-10">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
