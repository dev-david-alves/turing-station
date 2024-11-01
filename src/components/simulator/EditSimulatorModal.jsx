import { useEffect, useRef } from "react";
import { Input } from "../Input";
import { Button, buttonVariants } from "../Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox } from "../Checkbox";
import { useSimulator } from "../../providers/simulator";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { texMapMatch } from "../../p5-turing-machines/utils/transformInputText";
import { texMap } from "../../p5-turing-machines/utils/getTexMaps";
import { SuccessToast } from "../Toast";
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
import { useQuestionSimulator } from "../../providers/question";

function EditSimulatorModal({ id, whichProvider = "simulator" }) {
  const renameRef = useRef(null);
  const { simulatorInfo, getOne, setSimulatorInfo } =
    whichProvider === "simulator" ? useSimulator() : useQuestionSimulator();
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameErrors, setRenameErrors] = useState([]);

  const simulator = getOne(id);

  if (!simulator) return null;

  const { name, showLeftToolbar, showTooltips } = simulator;

  const handleChange = (e) => {
    setRenameErrors([]);
    let value = texMapMatch([e.target.value], texMap)[0];
    e.target.value = value;
  };

  const handleRename = (e) => {
    e.preventDefault();

    const newName = e.target.rename.value;

    if (!newName) {
      setRenameErrors(["O nome do simulador não pode ser vazio"]);
      return;
    }

    if (newName === name) return;

    if (newName.length < 3) {
      setRenameErrors(["Nome do simulador deve ter no mínimo 3 caracteres"]);
      return;
    }

    if (newName.length > 50) {
      setRenameErrors(["Nome do simulador deve ter no máximo 50 caracteres"]);
      return;
    }

    const hasSimulator = simulatorInfo.find((item) => item.name === newName);
    if (hasSimulator) {
      setRenameErrors(["Já existe um simulador com este nome"]);
      return;
    }

    setSimulatorInfo((prev) => prev.map((item) => (item.id === id ? { ...item, name: newName } : item)));
    setIsRenaming(false);
    SuccessToast("Simulador renomeado com sucesso!")();
  };

  const handleCancelRename = () => {
    renameRef.current.value = name;
    setIsRenaming(false);
  };

  useEffect(() => {
    renameRef.current.value = name;
  }, [name]);

  // const handleToggleLeftToolbar = () => {
  //   setSimulatorInfo((prev) =>
  //     prev.map((item) => (item.id === id ? { ...item, showLeftToolbar: !item.showLeftToolbar } : item)),
  //   );
  // };

  const handleToggleTooltips = () => {
    setSimulatorInfo((prev) =>
      prev.map((item) => (item.id === id ? { ...item, showTooltips: !item.showTooltips } : item)),
    );
  };

  const handleDeleteSimulator = () => {
    setSimulatorInfo((prev) => prev.filter((item) => item.id !== id));
    SuccessToast("Simulador deletado com sucesso!")();
  };

  const handleDuplicateSimulator = () => {
    // Create a new simulator with the same data, but with a new id and name and open: true
    const newSimulator = {
      ...simulator,
      id: Date.now(),
      name: `${name} ${Date.now()}`,
      createdAt: new Date(),
      lastModified: new Date(),
    };

    // Reset the simulator to open: false, focused: false, and fullScreen: false
    setSimulatorInfo((prev) => [
      ...prev.map((item) => (item.id === id ? { ...item, open: false, focused: false, fullScreen: false } : item)),
      newSimulator,
    ]);
    SuccessToast("Simulador duplicado com sucesso!")();
  };

  return (
    <div className="flex w-full max-w-80 flex-col justify-center gap-2 rounded-md bg-main p-4 px-0 text-white shadow-4xl">
      <p className="text-center">Informações do simulador</p>
      <div className={cn("flex w-full flex-col gap-2 px-4", whichProvider !== "simulator" && "hidden")}>
        <label htmlFor="rename" className="text-sm font-medium">
          Renomear simulador
        </label>
        <form onSubmit={handleRename} className="flex w-full items-center gap-1">
          <Input
            ref={renameRef}
            type="text"
            id="rename"
            placeholder="Digite para renomear o simulador..."
            maxLength="50"
            defaultValue={name}
            disabled={!isRenaming}
            onChange={handleChange}
          />

          <Button
            type="button"
            variant="popoverMenu"
            className={cn("flex max-w-10 items-center justify-center rounded-md p-0", isRenaming && "hidden")}
            onClick={() => setIsRenaming(true)}
          >
            <Icon icon="uil:pen" className="icon h-4 w-4 max-w-full" />
          </Button>

          <div className={cn("flex items-center gap-1", !isRenaming && "hidden")}>
            <Button
              variant="popoverMenu"
              className="flex w-10 items-center justify-center rounded-md p-0"
              onClick={handleCancelRename}
            >
              <Icon icon="uil:times" className="icon icon h-5 w-5 max-w-full" />
            </Button>

            <Button
              type="submit"
              variant="popoverMenu"
              className="flex w-10 items-center justify-center rounded-md p-0"
            >
              <Icon icon="uil:check" className="icon h-5 w-5 max-w-full" />
            </Button>
          </div>
        </form>

        {renameErrors.length > 0 && (
          <div className="flex flex-col gap-1 text-xs text-danger">
            {renameErrors.map((error, index) => (
              <span key={index}>{error}</span>
            ))}
          </div>
        )}
      </div>

      <hr className="border-darkenBlue border-opacity-10" />

      {/* <div className="mx-4 flex w-full items-center gap-2">
        <Checkbox id="hide-toolbar" checked={showLeftToolbar} onClick={handleToggleLeftToolbar} />
        <label htmlFor="hide-toolbar" className="cursor-pointer text-sm font-medium">
          Mostrar barra de ferramentas
        </label>
      </div> */}

      <div className="mx-4 flex w-full items-center gap-2">
        <Checkbox id="disable-tooltips" checked={showTooltips} onClick={handleToggleTooltips} />
        <label htmlFor="disable-tooltips" className="cursor-pointer text-sm font-medium">
          Mostrar dicas
        </label>
      </div>

      <hr className={cn("border-darkenBlue border-opacity-10", whichProvider !== "simulator" && "hidden")} />

      <label
        htmlFor={`import-mt-input-${id}`}
        className={cn(
          buttonVariants({ variant: "popoverMenu", size: "sm" }),
          "cursor-pointer justify-start",
          whichProvider !== "simulator" && "hidden",
        )}
      >
        <Icon icon="bxs:file-import" className="icon h-4 w-4" /> Importar MT
      </label>
      <input type="file" id={`import-mt-input-${id}`} className="hidden" />

      <hr className="border-darkenBlue border-opacity-10" />

      <div className="flex w-full flex-col gap-0">
        <Button variant="popoverMenu" size="sm" className="text-sm" id={`export-mt-png-${id}`}>
          <Icon icon="material-symbols-light:image" className="icon h-4 w-4" /> Exportar como imagem PNG
        </Button>
        <Button variant="popoverMenu" size="sm" className="text-sm" id={`export-mt-json-${id}`}>
          <Icon icon="carbon:machine-learning" className="icon h-4 w-4" /> Exportar arquivo Turing Station
        </Button>
      </div>

      <hr className={cn("border-darkenBlue border-opacity-10", whichProvider !== "simulator" && "hidden")} />

      <Button
        variant="popoverMenu"
        size="sm"
        className={cn("text-sm", whichProvider !== "simulator" && "hidden")}
        onClick={handleDuplicateSimulator}
      >
        <Icon icon="bx:duplicate" className="icon h-4 w-4" /> Duplicar simulador
      </Button>

      <hr className={cn("border-darkenBlue border-opacity-10", whichProvider !== "simulator" && "hidden")} />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="popoverMenu"
            size="sm"
            className={cn(
              "text-sm text-danger hover:bg-danger hover:text-white",
              whichProvider !== "simulator" && "hidden",
            )}
          >
            <Icon icon="mdi:trash" className="icon h-4 w-4" />
            Deletar simulador
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="dark-mode-variables text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Este simulador será deletado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-danger" onClick={handleDeleteSimulator}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default EditSimulatorModal;
