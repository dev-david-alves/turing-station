import { useEffect, useRef } from "react";
import { Input } from "./Input";
import { Button, buttonVariants } from "./Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox } from "./Checkbox";
import { useSimulator } from "../providers/simulator";
import { useState } from "react";

function EditSimulatorModal({ id }) {
  const renameRef = useRef(null);
  const { getOne, setData } = useSimulator();
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

    setData((prev) => prev.map((item) => (item.id === id ? { ...item, name: newName } : item)));
    setIsRenaming(false);
  };

  const handleCancelRename = () => {
    renameRef.current.value = name;
    setIsRenaming(false);
  };

  const handleToggleLeftToolbar = () => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, showLeftToolbar: !item.showLeftToolbar } : item)),
    );
  };

  const handleToggleTooltips = () => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, showTooltips: !item.showTooltips } : item)));
  };

  const handleDeleteSimulator = () => {
    let confirmDelete = window.confirm("Tem certeza que deseja deletar este simulador?");

    if (!confirmDelete) return;
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex w-full flex-col justify-center gap-2 text-white">
      <p className="text-center">Informações do simulador</p>
      <div className="flex w-full flex-col gap-2 px-4">
        <label htmlFor="hide-toolbar" className="text-sm font-medium">
          Renomear simulador
        </label>
        <form onSubmit={handleRename} className="flex w-full items-center gap-2">
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

      <hr className="border-background border-opacity-5" />

      <div className="mx-4 flex w-full items-center gap-2">
        <Checkbox id="hide-toolbar" checked={showLeftToolbar} onClick={handleToggleLeftToolbar} />
        <label htmlFor="hide-toolbar" className="text-sm font-medium">
          Esconder barra de ferramentas
        </label>
      </div>

      <div className="mx-4 flex w-full items-center gap-2">
        <Checkbox id="disable-tooltips" checked={showTooltips} onClick={handleToggleTooltips} />
        <label htmlFor="disable-tooltips" className="text-sm font-medium">
          Desabilitar dicas
        </label>
      </div>

      <hr className="border-background border-opacity-5" />

      <Button variant="popoverMenu" size="sm" className="text-sm">
        <Icon icon="bxs:file-import" className="icon h-4 w-4" /> Importar MT
      </Button>

      <hr className="border-background border-opacity-5" />

      <div className="flex w-full flex-col gap-0">
        <Button variant="popoverMenu" size="sm" className="text-sm">
          <Icon icon="material-symbols-light:image" className="icon h-4 w-4" /> Exportar como imagem PNG
        </Button>
        <Button variant="popoverMenu" size="sm" className="text-sm">
          <Icon icon="carbon:machine-learning" className="icon h-4 w-4" /> Exportar arquivo Turing Station
        </Button>
      </div>

      <hr className="border-background border-opacity-5" />

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
