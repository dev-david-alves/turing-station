import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";

const links = [
  {
    name: "Simulador",
    to: "/?filterBy=all&sortBy=name&direction=asc",
    icon: "ph:graph-bold",
  },
  {
    name: "Instruções de uso",
    to: "/como-utilizar",
    icon: "carbon:machine-learning",
  },
  // {
  //   name: "Aprenda sobre MTS",
  //   to: "/aprenda-sobre-mts",
  //   icon: "hugeicons:knowledge-01",
  // },
  {
    name: "Teste de conhecimento",
    to: "/teste-de-conhecimento/?filterBy=all",
    icon: "iconoir:learning",
  },
];

function TabNavigation() {
  const location = useLocation();

  // shadow poiting-up
  return (
    <div className="fixed bottom-0 flex h-16 w-full items-center justify-between overflow-hidden bg-main shadow-[0px_-5px_10px_#181a1e] transition-all duration-300">
      <div className="flex w-full flex-col items-center gap-8">
        <ul className="flex w-full items-center">
          {links.map((link) => {
            let locQuestionMark = link.to.indexOf("?");
            let sub = link.to.substring(0, locQuestionMark === -1 ? link.to.length : locQuestionMark);
            let areEqual = location.pathname === sub;

            return (
              <li
                key={link.name}
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-3.5 transition-all duration-300",
                  areEqual && "bg-background",
                  !areEqual && "hover:bg-darkenBlue",
                )}
              >
                <Link
                  to={link.to}
                  className={cn(
                    "text-md relative flex h-16 min-h-16 w-full flex-col items-center justify-center gap-2 text-nowrap text-white",
                    areEqual && "text-secondaryBlue",
                  )}
                >
                  {areEqual && (
                    <div className="absolute top-0 h-1.5 min-h-1.5 w-6 min-w-6 bg-secondaryBlue min-[370px]:w-12 min-[370px]:max-w-12"></div>
                  )}
                  <div className="flex items-center justify-center gap-2">
                    <Icon icon={link.icon} className="min-w-fit text-xl" />
                    {/* <span className="max-[370px]:hidden">{link.name}</span> */}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default TabNavigation;
