import { useEffect, useRef, useState } from "react";
import { useSimulator } from "../../providers/simulator";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, buttonVariants } from "../Button";
import { SuccessToast, ErrorToast } from "../Toast";
import { checkFileFormatArray } from "../../schemas/mtSchema";
import { Checkbox } from "../Checkbox";
import { cn } from "../../utils/cn";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../AlertDialog";

function MainMenu({ setIsMainMenuOpen }) {
  const { simulatorInfo, setSimulatorInfo, generateRandomId } = useSimulator();
  const [showTooltips, setShowTooltips] = useState(true);

  const importAllRef = useRef(null);

  const exportMultipleMTs = () => {
    let dmts = simulatorInfo.map((simulator) => simulator.data);

    // Use plain js to save the file
    let blob = new Blob([JSON.stringify(dmts)], { type: "application/json" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "multiple-turing-machines.json";
    a.click();
    URL.revokeObjectURL(url);

    SuccessToast("Arquivo das MTs salvo com sucesso!")();
    setIsMainMenuOpen(false);
  };

  const handleClickInputFile = () => {
    importAllRef.current.click();
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      ErrorToast("Erro: nenhum arquivo selecionado!")();
      return { success: false, message: "Erro: nenhum arquivo selecionado!" };
    }

    if (file.type !== "application/json") {
      ErrorToast("Erro: arquivo não é um JSON!")();
      return { success: false, message: "Erro: arquivo não é um JSON!" };
    }

    let reader = new FileReader();
    reader.onload = (event) => {
      let result = JSON.parse(event.target.result);

      result = result?.length > 0 ? result : [result];
      const parsed = checkFileFormatArray(result); // Use the schema to check the file format

      if (!parsed.success) {
        ErrorToast("Erro: arquivo não está no formato correto!")();
      } else {
        let auxData = [];
        result.forEach((data) => {
          auxData.push({
            id: generateRandomId(),
            createdAt: new Date(),
            lastModified: new Date(),
            name: data.name,
            open: false,
            fullScreen: false,
            focused: false,
            showLeftToolbar: true,
            showTooltips: true,
            tm_variant: data.variant,
            tm_num_tapes: data.variant !== "mttm" ? 1 : data.numTapes,
            stayOption: data.stayOption,
            data: data,
          });
        });

        setSimulatorInfo(auxData);
        SuccessToast("Importação realizada com sucesso!")();
        setIsMainMenuOpen(false);
      }
    };

    reader.readAsText(file);
  };

  const handleDeleteAllSimulators = () => {
    setSimulatorInfo([]);
    SuccessToast("Todos os simuladores deletados com sucesso!")();
    setIsMainMenuOpen(false);
  };

  const handleToggleTooltips = () => {
    setSimulatorInfo((prev) => prev.map((item) => ({ ...item, showTooltips: !item.showTooltips })));
  };

  useEffect(() => {
    setShowTooltips(simulatorInfo[0]?.showTooltips);
  }, [simulatorInfo]);

  return (
    <div className="dark-mode-variables flex w-full max-w-80 flex-col justify-center gap-2 rounded-md bg-main p-4 px-0 text-white shadow-4xl">
      <p className="text-center">Menu de ações</p>

      <hr className="border-darkenBlue border-opacity-10" />

      <div className="mx-4 flex w-full items-center gap-2">
        <Checkbox id="disable-all-tooltips" checked={showTooltips} onClick={handleToggleTooltips} />
        <label htmlFor="disable-all-tooltips" className="cursor-pointer text-sm font-medium">
          Mostrar dicas
        </label>
      </div>

      <hr className="border-darkenBlue border-opacity-10" />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="popoverMenu"
            size="sm"
            className={cn(buttonVariants({ variant: "popoverMenu", size: "sm" }), "cursor-pointer justify-start")}
          >
            <Icon icon="bxs:file-import" className="icon h-4 w-4" />
            Importar múltiplas MTs (JSON)
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="dark-mode-variables text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao importar múltiplas MTs, todos os simuladores atuais serão substituídos. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-danger" onClick={handleClickInputFile}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <input ref={importAllRef} type="file" id="import-all" className="hidden" onChange={handleImportFile} />

      <hr className="border-darkenBlue border-opacity-10" />

      <Button variant="popoverMenu" size="sm" className="text-sm" onClick={exportMultipleMTs}>
        <Icon icon="carbon:machine-learning" className="icon h-4 w-4" /> Exportar múltiplas MTs (JSON)
      </Button>

      <hr className="border-darkenBlue border-opacity-10" />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="popoverMenu" size="sm" className="text-sm text-danger hover:bg-danger hover:text-white">
            <Icon icon="mdi:trash" className="icon h-4 w-4" />
            Deletar todos os simuladores
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="dark-mode-variables text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os simuladores serão deletados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-danger" onClick={handleDeleteAllSimulators}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default MainMenu;
