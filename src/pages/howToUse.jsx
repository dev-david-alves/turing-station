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
    title: "Shortcut 01:",
    tip: "this is the shortcut 01",
  },
  {
    title: "Shortcut 02:",
    tip: "this is the shortcut 02",
  },
  {
    title: "Shortcut 03:",
    tip: "this is the shortcut 03",
  },
];

const especialSymbols = [
  {
    title: "Symbol 01:",
    tip: "this is the symbol 01",
  },
  {
    title: "Symbol 02:",
    tip: "this is the symbol 02",
  },
  {
    title: "Symbol 03:",
    tip: "this is the symbol 03",
  },
];

function howToUse() {
  return (
    <div className={cn("flex min-h-full w-full flex-grow flex-col gap-4 px-4 sm:px-8")}>
      <div className="flex w-full items-center justify-between px-4 sm:px-0">
        <h1 className="text-center text-3xl font-bold text-white">Instruções de uso</h1>
      </div>

      <div className="flex min-h-full w-full flex-grow flex-col items-center gap-6">
        <VideoCards title="Como usar o simulador" videoList={howToUseTheSimulator} />

        <VideoCards title="Outras áreas do Turing Station" videoList={otherVideos} />

        <TipCards title="Teclas de atalho para o simulador de MT" tipList={shortcuts} />

        <TipCards title="Símbolos especiais e atalhos de texto" tipList={especialSymbols} />
      </div>
    </div>
  );
}

export default howToUse;
