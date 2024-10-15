import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SimulatorFilterContext = createContext(null);

const SimulatorFilterProvider = ({ children }) => {
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [direction, setDirection] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const filter = searchParams.get("filter");
    const sort = searchParams.get("sort");
    const direction = searchParams.get("direction");

    if (filter) setFilterBy(filter);
    if (sort) setSortBy(sort);
    if (direction) setDirection(direction === "asc");
  }, []);

  useEffect(() => {
    searchParams.set("filter", filterBy);
    searchParams.set("sort", sortBy);
    searchParams.set("direction", direction ? "asc" : "desc");

    setSearchParams(searchParams);
  }, [filterBy, sortBy, direction]);

  return (
    <SimulatorFilterContext.Provider value={{ filterBy, setFilterBy, sortBy, setSortBy, direction, setDirection }}>
      {children}
    </SimulatorFilterContext.Provider>
  );
};

const useSimulatorFilters = () => {
  const context = useContext(SimulatorFilterContext);

  if (!context) {
    throw new Error("useSimulatorFilters must be used within a SimulatorFilterProvider");
  }

  return context;
};

export { SimulatorFilterProvider, useSimulatorFilters };
