import { useEffect, useState } from "react";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../Select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Dialog";
import { useSearchParams } from "react-router-dom";

function DialogFilter() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [localFilterBy, setLocalFilterBy] = useState(searchParams.get("filterBy") || "all");
  const [localSortBy, setLocalSortBy] = useState(searchParams.get("sortBy") || "name");
  const [localDirection, setLocalDirection] = useState(searchParams.get("direction") === "asc");

  const handleApplyFilter = () => {
    searchParams.set("filterBy", localFilterBy);
    searchParams.set("sortBy", localSortBy);
    searchParams.set("direction", localDirection ? "asc" : "desc");
    setSearchParams(searchParams);
    setModalOpen(false);
  };

  useEffect(() => {
    setLocalFilterBy(searchParams.get("filterBy") || "all");
    setLocalSortBy(searchParams.get("sortBy") || "name");
    setLocalDirection(searchParams.get("direction") === "asc");
  }, [searchParams]);

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button className="flex h-fit w-fit items-center gap-2 bg-transparent px-0 py-2 text-white shadow-none">
          <Icon icon="octicon:filter-16" className="icon h-4 w-4" /> Filtros
        </Button>
      </DialogTrigger>
      <DialogContent className="dark-mode-variables w-[90%] bg-main sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-left text-white">Filtros</DialogTitle>
          <DialogDescription className="sr-only text-white">Selecione os filtros que deseja aplicar.</DialogDescription>
        </DialogHeader>

        <div className="flex w-full flex-col justify-center gap-2">
          <div className="flex w-full items-center gap-2">
            <label htmlFor="filter" className="text-nowrap text-sm text-white">
              Filtrar por:
            </label>
            <Select onValueChange={(value) => setLocalFilterBy(value)} defaultValue={localFilterBy}>
              <SelectTrigger className="ml-4 mr-7 h-8 w-full" id="filter">
                <SelectValue placeholder="Filtro" />
              </SelectTrigger>
              <SelectContent className="dark-mode-variables z-[50010]">
                <SelectGroup>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="tm">MT determinística</SelectItem>
                  <SelectItem value="ndtm">MT não determinística</SelectItem>
                  <SelectItem value="mttm">MT multifitas</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-full justify-center gap-2">
            <div className="flex w-full items-center gap-2">
              <label htmlFor="sort" className="text-nowrap text-sm text-white">
                Ordenar por:
              </label>
              <Select onValueChange={(value) => setLocalSortBy(value)} className="w-full" defaultValue={localSortBy}>
                <SelectTrigger className="h-8 w-full" id="sort">
                  <SelectValue placeholder="Ordem" />
                </SelectTrigger>
                <SelectContent className="dark-mode-variables z-[50010]">
                  <SelectGroup>
                    <SelectItem value="name">Nome</SelectItem>
                    <SelectItem value="createdAt">Data de criação</SelectItem>
                    <SelectItem value="lastModified">Última modificação</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="direction"
                className="hidden text-white"
                checked={localDirection}
                onClick={() => setLocalDirection(!localDirection)}
              />
              <label
                htmlFor="direction"
                className="flex cursor-pointer select-none items-center gap-2 text-gray-200 transition-colors hover:text-white"
              >
                {localDirection ? (
                  <Icon icon="octicon:sort-asc-16" className="icon h-5 w-5" />
                ) : (
                  <Icon icon="octicon:sort-desc-16" className="icon h-5 w-5" />
                )}
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button className="w-24 bg-darkGreen text-white" onClick={handleApplyFilter}>
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogFilter;
