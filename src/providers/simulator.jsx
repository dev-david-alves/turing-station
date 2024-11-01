import { createContext, useContext, useEffect, useState } from "react";

const SimulatorContext = createContext(null);

const generateRandomId = () => Math.random().toString(36).substr(2, 9);

const SimulatorProvider = ({ children }) => {
  const [simulatorInfo, setSimulatorInfo] = useState([]);

  const getOne = (id) => simulatorInfo.find((item) => item.id === id);

  const handleFocus = (focused, id) => {
    const simulator = getOne(id);

    if (!simulator) return;
    if (simulator.focused === focused) return;

    setSimulatorInfo((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, open: focused, focused: focused } : { ...item, open: false, focused: false },
      ),
    );
  };

  const setBottomDrawerOpen = (id, value) => {
    setSimulatorInfo((prev) => prev.map((item) => (item.id === id ? { ...item, bottomDrawerOpen: value } : item)));
  };

  useEffect(() => {
    const data = localStorage.getItem("simulatorInfo");
    if (data) {
      setSimulatorInfo(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("simulatorInfo", JSON.stringify(simulatorInfo));
  }, [simulatorInfo]);

  return (
    <SimulatorContext.Provider
      value={{ simulatorInfo, setSimulatorInfo, getOne, handleFocus, generateRandomId, setBottomDrawerOpen }}
    >
      {children}
    </SimulatorContext.Provider>
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
