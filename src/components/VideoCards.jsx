import React from "react";

const Card = ({ title }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-[160px] w-[240px] rounded-md bg-background"></div>
      <span className="text-md font-semibold text-white">{title}</span>
    </div>
  );
};

function VideoCards({ title, videoList }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 rounded-md bg-main px-4 pb-3 pt-2">
      <h2 className="text-xl font-bold text-primary sm:text-2xl">{title}</h2>
      <div className="flex w-full items-center gap-2 overflow-x-auto pb-2">
        {videoList.map((item) => (
          <Card key={item.title} title={item.title} />
        ))}
      </div>
    </div>
  );
}

export default VideoCards;
