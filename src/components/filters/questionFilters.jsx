import React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../Select";
import { useQuestionFilters } from "../../providers/questionFilters";

function Filters() {
  const { setFilterBy } = useQuestionFilters();

  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <label htmlFor="filter" className="text-nowrap text-sm text-white">
        Filtrar por:
      </label>
      <Select onValueChange={(value) => setFilterBy(value)} defaultValue="all">
        <SelectTrigger className="h-8 w-56 min-w-56 max-w-56" id="filter">
          <SelectValue placeholder="Filtro" />
        </SelectTrigger>
        <SelectContent className="dark-mode-variables z-[50010]">
          <SelectGroup>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="tm">MT determinística</SelectItem>
            <SelectItem value="ndtm">MT não determinística</SelectItem>
            <SelectItem value="mttm">MT multifitas</SelectItem>
            <SelectItem value="solved">Resolvidas</SelectItem>
            <SelectItem value="unsolved">Não resolvidas</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default Filters;
