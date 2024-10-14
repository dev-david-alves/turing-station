import TipCards from "../components/TipCards";
import VideoCards from "../components/VideoCards";
import { cn } from "../utils/cn";

const howToUseTheSimulator = [
  {
    title: "Video 1",
  },
  {
    title: "Video 2",
  },
  {
    title: "Video 3",
  },
  {
    title: "Video 4",
  },
  {
    title: "Video 5",
  },
  {
    title: "Video 6",
  },
];

const otherVideos = [
  {
    title: "Video 1",
  },
  {
    title: "Video 2",
  },
  {
    title: "Video 3",
  },
];

const shortcuts = [
  {
    title: "Article 01:",
    tip: "this is the article 01",
  },
  {
    title: "Article 02:",
    tip: "this is the article 02",
  },
  {
    title: "Article 03:",
    tip: "this is the article 03",
  },
];

function LearnAboutTM() {
  return (
    <div className={cn("flex min-h-full w-full flex-grow flex-col gap-4 px-4 sm:px-8")}>
      <div className="flex w-full items-center justify-between px-4 sm:px-0">
        <h1 className="text-left text-2xl font-bold text-white sm:text-3xl">Aprenda sobre Máquinas de Turing</h1>
      </div>

      <div className="flex min-h-full w-full flex-grow flex-col items-center gap-6">
        <VideoCards title="Máquinas de Turing" videoList={howToUseTheSimulator} />

        <VideoCards title="Variantes de Máquinas de Turing" videoList={otherVideos} />

        <VideoCards title="Resolução de questões" videoList={otherVideos} />

        <TipCards title="Artigos relacionados" tipList={shortcuts} />
      </div>
    </div>
  );
}

export default LearnAboutTM;
