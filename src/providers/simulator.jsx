import { createContext, useContext, useEffect, useState } from "react";

const SimulatorContext = createContext(null);

const generateRandomId = () => Math.random().toString(36).substr(2, 9);

const SimulatorProvider = ({ children }) => {
  const [data, setData] = useState([
    {
      id: generateRandomId(),
      name: "Custom MT 01",
      open: true,
      fullScreen: false,
      focused: true,
      showLeftToolbar: true,
      showTooltips: true,
      data: undefined,
    },
    {
      id: generateRandomId(),
      name: "Custom MT 02",
      open: false,
      fullScreen: false,
      focused: false,
      showLeftToolbar: true,
      showTooltips: true,
      data: undefined,
    },

    {
      id: generateRandomId(),
      name: "Custom MT 03",
      open: false,
      fullScreen: false,
      focused: false,
      showLeftToolbar: true,
      showTooltips: true,
      data: undefined,
    },
  ]);

  const getOne = (id) => data.find((item) => item.id === id);

  const handleFocus = (focused, id) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, focused: focused } : { ...item, focused: false })),
    );
  };

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  return (
    <SimulatorContext.Provider value={{ data, setData, getOne, handleFocus }}>{children}</SimulatorContext.Provider>
  );
};

const useSimulator = () => {
  const context = useContext(SimulatorContext);

  if (!context) {
    throw new Error("useSimulator must be used within a SimulatorProvider");
  }

  return context;
};

export { SimulatorProvider, useSimulator };
