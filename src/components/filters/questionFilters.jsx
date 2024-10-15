import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../Select";
import { useSearchParams } from "react-router-dom";

function Filters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (value) => {
    searchParams.set("filterBy", value);
    setSearchParams(searchParams);
  };

  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <label htmlFor="filter" className="text-nowrap text-sm text-white">
        Filtrar por:
      </label>
      <Select
        onValueChange={handleFilterChange}
        value={searchParams.get("filterBy")}
        defaultValue={searchParams ? searchParams.get("filterBy") : "all"}
      >
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
