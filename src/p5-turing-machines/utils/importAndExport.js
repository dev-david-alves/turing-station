import { checkFileFormat } from "../../schemas/mtSchema";
import { createHistory } from "./history";
import { createCanvasFromOBJ, createJSONExportObj } from "./objectFunctions";

export const handleInputFile = (p5, file) => {
  if (!file) {
    alert("Erro: nenhum arquivo selecionado!");
    return;
  }

  if (file.type !== "application/json") {
    alert("Erro: arquivo não é um JSON!");
    return;
  }

  let reader = new FileReader();
  reader.onload = (event) => {
    let result = JSON.parse(event.target.result);
    const parsed = checkFileFormat(result); // Use the schema to check the file format

    if (!parsed.success) {
      // If the file format is incorrect, show an error message
      alert("Erro: arquivo não está no formato correto!");
      return;
    }

    if (createCanvasFromOBJ(p5, parsed.data)) {
      // If the file format is correct, create the canvas
      console.log("Importação concluída com sucesso!");
      createHistory(p5);
    }
  };

  reader.readAsText(file);

  p5.select(`#import-mt-input-${p5.canvasId}`);
};

export const exportAsPNG = (p5) => {
  let img = p5.get();
  img.save("turing-machine.png");
};

export const exportAsJSON = (p5) => {
  let dmt = createJSONExportObj(p5);
  p5.saveJSON(dmt, "turing-machine.json");
};
