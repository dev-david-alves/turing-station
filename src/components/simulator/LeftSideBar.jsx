import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../Tooltip";
import { useSimulator } from "../../providers/simulator";

const topButtons = [
  {
    id: "menu-selectObject",
    icon: "fa-solid:mouse-pointer",
    className: "h-4 w-4",
    tip: "Selecione ou mova um elemento do canvas ao clicar sobre ele",
  },
  {
    id: "menu-moveCanvas",
    icon: "mingcute:move-fill",
    className: "h-4 w-4",
    tip: "Pressione e arraste dentro do canvas para mover a visualização",
  },
  {
    id: "menu-addState",
    icon: "zondicons:add-solid",
    className: "h-4 w-4",
    tip: "Adiciona um novo estado de MT ao canvas no local clicado",
  },
  {
    id: "menu-addBuildingBlock",
    icon: "bi:square-fill",
    className: "h-3 w-3",
    tip: "Adiciona uma sub-rotina ao canvas no local clicado",
  },
  {
    id: "menu-addLink",
    icon: "mingcute:arrow-right-fill",
    className: "h-5 w-5",
    tip: "Adiciona uma transição entre estados da MT no canvas, também pode ser utilizado para definir estado inicial",
  },
  {
    id: "menu-deleteObject",
    icon: "ic:round-close",
    className: "h-5 w-5",
    tip: "Deleta um elemento do canvas ao clicar sobre ele",
  },
];

const bottomButtons = [
  {
    id: "menu-cleanCanvas",
    icon: "material-symbols:remove-selection",
    className: "h-5 w-5",
    tip: "Limpa todo o canvas",
  },
  {
    id: "menu-undo",
    icon: "ic:round-undo",
    className: "h-5 w-5",
    tip: "Desfaz a última ação realizada no canvas",
  },
  {
    id: "menu-redo",
    icon: "ic:round-redo",
    className: "h-5 w-5",
    tip: "Refaz a última ação desfeita no canvas",
  },
  {
    id: "menu-zoomIn",
    icon: "ic:round-zoom-in",
    className: "h-5 w-5",
    tip: "Aumentar zoom do canvas",
  },
  {
    id: "menu-zoomOut",
    icon: "ic:round-zoom-out",
    className: "h-5 w-5",
    tip: "Diminuir zoom do canvas",
  },
];

function LeftSideBar({ id }) {
  const { getOne } = useSimulator();

  const simulator = getOne(id);

  if (!simulator) return null;

  const { showLeftToolbar, showTooltips } = simulator;

  if (!showLeftToolbar) return null;

  return (
    <div className="flex h-full max-h-full flex-col items-center justify-between bg-main shadow-default">
      {topButtons.map((button, index) => (
        <div className="flex h-fit flex-col items-center" key={index}>
          {showTooltips ? (
            <TooltipProvider>
              <Tooltip delayDuration={200} sideOffset={5}>
                <TooltipTrigger asChild>
                  <Button id={`${button.id}-${id}`} variant="simulatorMenu" className="toolbar-action-buttons">
                    <Icon icon={button.icon} className={`${button.className} icon`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-56 rounded-md bg-main text-white shadow-4xl">
                  <div className="w-full px-4 py-2">
                    <p className="text-xs font-bold text-darkGreen">Dica!</p>
                    <hr className="my-1 border-infoDark opacity-20" />
                    <p>{button.tip}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button id={`${button.id}-${id}`} variant="simulatorMenu" className="toolbar-action-buttons">
              <Icon icon={button.icon} className={`${button.className} icon`} />
            </Button>
          )}
        </div>
      ))}

      {bottomButtons.map((button, index) => (
        <div className="flex h-fit flex-col items-center" key={index}>
          {showTooltips ? (
            <TooltipProvider>
              <Tooltip delayDuration={200} sideOffset={5}>
                <TooltipTrigger asChild>
                  <Button
                    id={`${button.id}-${id}`}
                    variant="simulatorMenu"
                    className="flex h-10 w-14 items-center justify-center border-none bg-none text-white transition-colors duration-200"
                  >
                    <Icon icon={button.icon} className={`${button.className} icon`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-56 rounded-md bg-main text-white shadow-4xl">
                  <div className="w-full px-4 py-2">
                    <p className="text-xs font-bold text-darkGreen">Dica!</p>
                    <hr className="my-1 border-infoDark opacity-20" />
                    <p>{button.tip}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              id={`${button.id}-${id}`}
              variant="simulatorMenu"
              className="flex h-10 w-14 items-center justify-center border-none bg-none text-white transition-colors duration-200"
            >
              <Icon icon={button.icon} className={`${button.className} icon`} />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

export default LeftSideBar;
