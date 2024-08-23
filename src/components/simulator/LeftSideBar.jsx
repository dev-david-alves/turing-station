import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { cn } from "../../utils/cn";

const topButtons = [
  {
    icon: "fa-solid:mouse-pointer",
    className: "h-4 w-4",
  },
  {
    icon: "mingcute:move-fill",
    className: "h-4 w-4",
  },
  {
    icon: "zondicons:add-solid",
    className: "h-4 w-4",
  },
  {
    icon: "bi:square-fill",
    className: "h-3 w-3",
  },
  {
    icon: "mingcute:arrow-right-fill",
    className: "h-5 w-5",
  },
  {
    icon: "ic:round-close",
    className: "h-5 w-5",
  },
  {
    icon: "material-symbols:remove-selection",
    className: "h-5 w-5",
  },
];

const bottomButtons = [
  {
    icon: "bxs:file-import",
    className: "h-5 w-5",
  },
  {
    icon: "material-symbols:download",
    className: "h-5 w-5",
  },
  {
    icon: "ic:round-zoom-in",
    className: "h-5 w-5",
  },
  {
    icon: "ic:round-zoom-out",
    className: "h-5 w-5",
  },
];

function LeftSideBar({ id }) {
  const [selectedButton, setSelectedButton] = useState(undefined);

  return (
    <div className="flex h-full max-h-full flex-col items-center justify-between bg-main shadow-default">
      <div className="flex h-fit flex-col items-center">
        {topButtons.map((button, index) => (
          <button
            key={index}
            id={`button-${id}`}
            className={cn(
              "flex h-10 w-14 items-center justify-center border-none bg-none text-white transition-colors duration-200 hover:bg-darkVariant hover:text-main",
              selectedButton === index && "selected bg-primary text-white hover:bg-primaryHover hover:text-white",
            )}
            onClick={() => {
              setSelectedButton(index);
            }}
          >
            <Icon icon={button.icon} className={`${button.className} icon`} />
          </button>
        ))}
      </div>
      <div className="flex h-fit flex-col items-center">
        {bottomButtons.map((button, index) => (
          <button
            key={index}
            id={`button-${id}`}
            className="flex h-10 w-14 items-center justify-center border-none bg-none text-white transition-colors duration-200 hover:bg-darkVariant hover:text-main"
          >
            <Icon icon={button.icon} className={`${button.className} icon`} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default LeftSideBar;
