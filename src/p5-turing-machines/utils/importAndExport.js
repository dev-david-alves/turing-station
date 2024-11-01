import { ErrorToast, SuccessToast } from "../../components/Toast";
import { checkFileFormat } from "../../schemas/mtSchema";
import { createHistory } from "./history";
import { createCanvasFromOBJ, createJSONExportObj } from "./objectFunctions";

export const importJSONFile = (p5, file, callBack) => {
  if (!file) {
    ErrorToast("Erro: nenhum arquivo selecionado!")();
    return;
  }

  if (file.type !== "application/json") {
    ErrorToast("Erro: arquivo não é um JSON!")();
    return;
  }

  let reader = new FileReader();
  reader.onload = (event) => {
    let result = JSON.parse(event.target.result);
    const parsed = checkFileFormat(result); // Use the schema to check the file format

    if (!parsed.success) {
      // If the file format is incorrect, show an error message
      ErrorToast("Erro: arquivo não está no formato correto!")();
      return;
    }

    // If the file format is correct, create the canvas
    if (createCanvasFromOBJ(p5, parsed.data)) {
      createHistory(p5);
      const { name, variant, numTapes } = parsed.data;
      callBack({ newName: name, newVariant: variant, newNumTapes: numTapes });
    }
  };

  reader.readAsText(file);

  p5.select(`#import-mt-input-${p5.canvasId}`);
};

const generateFileName = (p5, extension) => {
  const name =
    p5.tm_variant === "tm"
      ? "turing-machine"
      : p5.tm_variant === "ndtm"
        ? "nondeterministic-turing-machine"
        : "multitape-turing-machine";

  return `${name}.${extension}`;
};

export const exportAsPNG = (p5) => {
  let img = p5.get();
  img.save(generateFileName(p5, "png"));
  SuccessToast("Imagem da MT salva com sucesso!")();
};

export const exportAsJSON = (p5) => {
  let dmt = createJSONExportObj(p5);
  p5.saveJSON(dmt, generateFileName(p5, "json"));
  SuccessToast("Arquivo da MT salvo com sucesso!")();
};
