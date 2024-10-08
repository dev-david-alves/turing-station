import React from "react";
import { cn } from "../utils/cn";

const Card = ({ title, tip, className }) => {
  return (
    <li className={cn("flex items-center px-4 py-1.5", className)}>
      <span className="text-md font-semibold text-darkVariant">
        {title} <span className="font-normal text-white">{tip}</span>
      </span>
    </li>
  );
};

function TipCards({ title, tipList }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 rounded-md bg-main pb-3 pt-2">
      <h2 className="px-4 text-xl font-bold text-primary sm:text-2xl">{title}</h2>
      <ul className="max-h-40 w-full items-center overflow-y-auto pb-3">
        {tipList.map((item, index) => (
          <Card
            key={item.title}
            title={item.title}
            tip={item.tip}
            className={index % 2 === 0 ? "bg-background" : "bg-main"}
          />
        ))}
      </ul>
    </div>
  );
}

export default TipCards;
