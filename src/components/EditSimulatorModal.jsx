import React from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox } from "./Checkbox";

function EditModal() {
  return (
    <div className="flex w-full flex-col justify-center gap-2 text-white">
      <p className="text-center">Informações do simulador</p>
      <div className="flex w-full flex-col gap-2 px-4">
        <label htmlFor="hide-toolbar" className="text-sm font-medium">
          Renomear simulador
        </label>
        <Input type="text" id="rename" placeholder="Digite para renomear o simulador..." maxLength="50" />
      </div>

      <hr className="border-background border-opacity-5" />

      <div className="mx-4 flex w-full items-center gap-2">
        <Checkbox id="hide-toolbar" />
        <label htmlFor="hide-toolbar" className="text-sm font-medium">
          Esconder barra de ferramentas
        </label>
      </div>

      <div className="mx-4 flex w-full items-center gap-2">
        <Checkbox id="disable-tooltips" />
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

      <Button variant="popoverMenu" size="sm" className="text-sm text-danger hover:bg-danger hover:text-white">
        <Icon icon="mdi:trash" className="icon h-4 w-4" />
        Deletar Simulador
      </Button>
    </div>
  );
}

export default EditModal;
