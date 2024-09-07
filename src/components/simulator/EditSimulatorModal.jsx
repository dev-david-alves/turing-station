import { useRef } from "react";
import { Input } from "../Input";
import { Button, buttonVariants } from "../Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox } from "../Checkbox";
import { useSimulator } from "../../providers/simulator";
import { useState } from "react";
import { cn } from "../../utils/cn";

function EditSimulatorModal({ id }) {
  const renameRef = useRef(null);
  const { getOne, setSimulatorInfo } = useSimulator();
  const [isRenaming, setIsRenaming] = useState(false);

  const simulator = getOne(id);

  if (!simulator) return null;

  const { name, showLeftToolbar, showTooltips } = simulator;

  const handleRename = (e) => {
    e.preventDefault();

    const newName = e.target.rename.value;
    if (!newName || newName === name) {
      setIsRenaming(false);
      return;
    }

    setSimulatorInfo((prev) => prev.map((item) => (item.id === id ? { ...item, name: newName } : item)));
    setIsRenaming(false);
  };

  const handleCancelRename = () => {
    renameRef.current.value = name;
    setIsRenaming(false);
  };

  const handleToggleLeftToolbar = () => {
    setSimulatorInfo((prev) =>
      prev.map((item) => (item.id === id ? { ...item, showLeftToolbar: !item.showLeftToolbar } : item)),
    );
  };

  const handleToggleTooltips = () => {
    setSimulatorInfo((prev) =>
      prev.map((item) => (item.id === id ? { ...item, showTooltips: !item.showTooltips } : item)),
    );
  };

  const handleDeleteSimulator = () => {
    let confirmDelete = window.confirm("Tem certeza que deseja deletar este simulador?");

    if (!confirmDelete) return;
    setSimulatorInfo((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex w-full max-w-80 flex-col justify-center gap-2 rounded-md bg-main p-4 px-0 text-white shadow-4xl">
      <p className="text-center">Informações do simulador</p>
      <div className="flex w-full flex-col gap-2 px-4">
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
          />

          {!isRenaming ? (
            <Button
              variant="popoverMenu"
              className="flex max-w-10 items-center justify-center rounded-md p-0"
              onClick={() => setIsRenaming(true)}
            >
              <Icon icon="uil:pen" className="icon h-4 w-4 max-w-full" />
            </Button>
          ) : (
            <div className="flex items-center gap-1">
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
          )}
        </form>
      </div>

      <hr className="border-darkenBlue border-opacity-10" />

      <div className="mx-4 flex w-full items-center gap-2">
        <Checkbox id="hide-toolbar" checked={showLeftToolbar} onClick={handleToggleLeftToolbar} />
        <label htmlFor="hide-toolbar" className="cursor-pointer text-sm font-medium">
          Mostrar barra de ferramentas
        </label>
      </div>

      <div className="mx-4 flex w-full items-center gap-2">
        <Checkbox id="disable-tooltips" checked={showTooltips} onClick={handleToggleTooltips} />
        <label htmlFor="disable-tooltips" className="cursor-pointer text-sm font-medium">
          Mostrar dicas
        </label>
      </div>

      <hr className="border-darkenBlue border-opacity-10" />

      <label
        htmlFor={`import-mt-input-${id}`}
        className={cn(buttonVariants({ variant: "popoverMenu", size: "sm" }), "cursor-pointer justify-start")}
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

      <hr className="border-darkenBlue border-opacity-10" />

      <Button
        variant="popoverMenu"
        size="sm"
        className="text-sm text-danger hover:bg-danger hover:text-white"
        onClick={handleDeleteSimulator}
      >
        <Icon icon="mdi:trash" className="icon h-4 w-4" />
        Deletar Simulador
      </Button>
    </div>
  );
}

export default EditSimulatorModal;
