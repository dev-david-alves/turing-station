import TipCards from "../components/TipCards";
import VideoCards from "../components/VideoCards";
import { texMap } from "../p5-turing-machines/utils/getTexMaps";
import { cn } from "../utils/cn";

const howToUseTheSimulator = [
  {
    title: "Introdução ao Turing Station",
    iframeLink: "https://drive.google.com/file/d/1GuUCwb1GKEeJGdPJIRSVJd8EzdrmYqtA/preview",
  },
  {
    title: "Criando uma Máquina de Turing Determinística",
    iframeLink: "https://drive.google.com/file/d/1OoOglbQWHxxIbgtw4es-vtmr5mJkttNK/preview",
  },
  {
    title: "Criando uma Máquina de Turing Não Determinística",
    iframeLink: "https://drive.google.com/file/d/1lowJYqs8_WbSGPFIHEMTP9Qdtfx8_MH2/preview",
  },
  {
    title: "Criando uma Máquina de Turing Multifitas",
    iframeLink: "https://drive.google.com/file/d/1lNV_TGVLYT5-y49l4h_a7NmDp8ZXTEHd/preview",
  },
  {
    title: "(Em breve) Utilizando Turing Station pelo celular",
  },
  {
    title: "(Em breve) Resolvendo questões de Máquina de Turing",
  },
];

const shortcuts = {
  "Ctrl + botão esquerdo do mouse": "Mover canvas",
  "Dois cliques/toques em um estado": "Abrir menu de ações (Estado inicial, Final, Renomear, Deletar)",
  "Delete (Quando um elemento está selecionado)": "Deletar elemento",
  "Shift + botão esquerdo do mouse (Menu selectionar ativo)": "Criar transição/Estado inicial",
  "Roda do mouse (rodando)": "Aproximar/Afastar (Zoom)",
  "Roda do mouse (clicando)": "Mover canvas",
  "Ctrl + Z": "Desfazer",
  "Ctrl + Y": "Refazer",
};

function howToUse() {
  return (
    <div className={cn("flex min-h-full w-full flex-grow flex-col gap-4 px-4 sm:px-8")}>
      <div className="flex w-full items-center justify-between px-4 sm:px-0">
        <h1 className="text-left text-2xl font-bold text-white sm:text-3xl">
          Instruções de uso <span className="text-secondaryBlue opacity-85">(Beta)</span>
        </h1>
      </div>

      <div className="flex min-h-full w-full flex-grow flex-col items-center gap-6">
        <VideoCards title="Como usar o simulador" videoList={howToUseTheSimulator} />

        {/* <VideoCards title="Outras áreas do Turing Station" videoList={otherVideos} /> */}

        <TipCards title="Teclas de atalho para o simulador de MT" tipList={shortcuts} />

        <TipCards title="Símbolos especiais e atalhos de texto" tipList={texMap} />
      </div>
    </div>
  );
}

export default howToUse;
