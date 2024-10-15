import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const QuestionFilterContext = createContext(null);

const QuestionFilterProvider = ({ children }) => {
  const [filterBy, setFilterBy] = useState("all");

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const filter = searchParams.get("filter");

    if (filter) setFilterBy(filter);
  }, []);

  useEffect(() => {
    searchParams.set("filter", filterBy);

    setSearchParams(searchParams);
  }, [filterBy]);

  return <QuestionFilterContext.Provider value={{ filterBy, setFilterBy }}>{children}</QuestionFilterContext.Provider>;
};

const useQuestionFilters = () => {
  const context = useContext(QuestionFilterContext);

  if (!context) {
    throw new Error("useQuestionFilters must be used within a QuestionFilterProvider");
  }

  return context;
};

export { QuestionFilterProvider, useQuestionFilters };
