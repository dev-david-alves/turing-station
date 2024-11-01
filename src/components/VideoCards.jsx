import React from "react";

const Card = ({ title, iframeLink }) => {
  return (
    <div className="flex flex-col gap-2">
      {iframeLink ? (
        <div className="overflow-hidden rounded-md border-2 border-gray-500">
          <iframe src={iframeLink} width="240" height="160" allow="autoplay; fullscreen" />
        </div>
      ) : (
        <div className="h-[160px] w-[240px] rounded-md border-2 border-gray-500 bg-background"></div>
      )}
      <span className="text-md font-semibold text-white">{title}</span>
    </div>
  );
};

function VideoCards({ title, videoList }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 rounded-md bg-main px-4 pb-3 pt-2">
      <h2 className="text-xl font-bold text-primary sm:text-2xl">{title}</h2>
      <div className="flex w-full gap-2 overflow-x-auto pb-2">
        {videoList.map((item) => (
          <Card key={item.title} title={item.title} iframeLink={item.iframeLink} />
        ))}
      </div>
    </div>
  );
}

export default VideoCards;
