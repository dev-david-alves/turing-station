import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import SideNavigation from "../components/navigation/SideNavigation";
import TabNavitaion from "../components/navigation/TabNavigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
  const [sidebarisOpen, setSidebarIsOpen] = useState(true);
  const [isAnyFullScreen, setIsAnyFullScreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      // Check if any element is currently in fullscreen
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      ) {
        setIsAnyFullScreen(true);
      } else {
        setIsAnyFullScreen(false);
      }
    };

    // Add event listeners for fullscreen changes
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  return (
    <>
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

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default Layout;
