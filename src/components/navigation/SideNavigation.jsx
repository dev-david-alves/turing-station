import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";

const links = [
  {
    name: "Simulador",
    to: "/",
    icon: "ph:graph-bold",
  },
  {
    name: "Instruções de uso",
    to: "/como-utilizar",
    icon: "carbon:machine-learning",
  },
  {
    name: "Aprenda sobre MTS",
    to: "/aprenda-sobre-mts",
    icon: "hugeicons:knowledge-01",
  },
  {
    name: "Teste de conhecimento",
    to: "/teste-de-conhecimento",
    icon: "iconoir:learning",
  },
];

function SideNavigation({ isOpen, setIsOpen }) {
  const location = useLocation();

  return (
    <div
      className={cn(
        "fixed flex min-h-screen w-64 max-w-64 flex-col items-center justify-between overflow-hidden bg-main py-8 shadow-xl transition-all duration-300",
        !isOpen && "w-16",
      )}
    >
      <div className="flex w-full flex-col items-center gap-8">
        {isOpen ? (
          <div className="flex w-full items-center justify-between px-4">
            <span className="text-2xl font-extrabold text-white">
              Turing<span className="text-secondaryBlue">Station</span>
            </span>
            <button
              className="flex h-8 w-8 items-end justify-center text-primary outline-none transition-colors hover:text-primaryHover"
              onClick={() => setIsOpen(false)}
            >
              <Icon icon="majesticons:close-line" className="text-2xl" />
            </button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between px-4">
            <span className="cursor-pointer text-2xl font-extrabold text-white" onClick={() => setIsOpen(true)}>
              T<span className="text-secondaryBlue">S</span>
            </span>
          </div>
        )}

        <ul className="w-full">
          {links.map((link) => (
            <li
              key={link.name}
              className={cn(
                "flex items-center gap-3.5 transition-all duration-300",
                location.pathname === link.to && "bg-background",
                location.pathname !== link.to && "hover:bg-darkenBlue",
              )}
            >
              {location.pathname === link.to && <div className="h-6 min-h-6 w-1.5 min-w-1.5 bg-secondaryBlue"></div>}
              <Link
                to={link.to}
                className={cn(
                  "text-md flex h-16 w-full items-center gap-2 text-nowrap pl-5 text-white",
                  location.pathname === link.to && "pl-0 text-secondaryBlue",
                )}
              >
                <Icon icon={link.icon} className="min-w-fit text-xl" />
                {isOpen && link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex w-full items-center justify-center">
        {isOpen ? (
          <a
            href="https://github.com/dev-david-alves"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-nowrap transition-all hover:brightness-125"
          >
            <span className="text-md font-light text-darkVariant">
              por <span className="font-extrabold text-secondaryBlue">David Alves</span>
            </span>
            <Icon icon="akar-icons:github-fill" className="text-secondaryBlue" />
          </a>
        ) : (
          <a
            href="https://github.com/dev-david-alves"
            target="_blank"
            rel="noreferrer"
            className={cn("flex items-center gap-2 transition-all hover:brightness-125", !isOpen && "flex-col")}
          >
            <span className="text-md font-extrabold text-secondaryBlue">D.A.</span>

            <Icon icon="akar-icons:github-fill" className="text-secondaryBlue" />
          </a>
        )}
      </div>
    </div>
  );
}

export default SideNavigation;
