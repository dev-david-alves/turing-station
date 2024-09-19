import { createContext, useContext, useEffect, useState } from "react";

const SimulatorContext = createContext(null);

const generateRandomId = () => Math.random().toString(36).substr(2, 9);

const SimulatorProvider = ({ children }) => {
  const [simulatorInfo, setSimulatorInfo] = useState([
    {
      id: generateRandomId(),
      name: "Custom MT 01",
      open: true, // TM accordion open by default
      fullScreen: false,
      focused: true,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "mttm", // Three possible values: "tm", "ndtm", "mttm"
      tm_num_tapes: 3, // Only for "mttm" variant
      data: undefined, // Last tm saved on the simulator history (same data) used to restore the simulator
    },
    {
      id: generateRandomId(),
      name: "Custom MT 02",
      open: false, // TM accordion open by default
      fullScreen: false,
      focused: false,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "mttm", // Three possible values: "tm", "ndtm", "mttm"
      tm_num_tapes: 3, // Only for "mttm" variant
      data: undefined, // Last tm saved on the simulator history (same data) used to restore the simulator
    },
    {
      id: generateRandomId(),
      name: "Custom MT 03",
      open: false, // TM accordion open by default
      fullScreen: false,
      focused: false,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "mttm", // Three possible values: "tm", "ndtm", "mttm"
      tm_num_tapes: 3, // Only for "mttm" variant
      data: undefined, // Last tm saved on the simulator history (same data) used to restore the simulator
    },
    {
      id: generateRandomId(),
      name: "Custom MT 04",
      open: false, // TM accordion open by default
      fullScreen: false,
      focused: false,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "mttm", // Three possible values: "tm", "ndtm", "mttm"
      tm_num_tapes: 3, // Only for "mttm" variant
      data: undefined, // Last tm saved on the simulator history (same data) used to restore the simulator
    },
    {
      id: generateRandomId(),
      name: "Custom MT 05",
      open: false, // TM accordion open by default
      fullScreen: false,
      focused: false,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "mttm", // Three possible values: "tm", "ndtm", "mttm"
      tm_num_tapes: 3, // Only for "mttm" variant
      data: undefined, // Last tm saved on the simulator history (same data) used to restore the simulator
    },
    {
      id: generateRandomId(),
      name: "Custom MT 06",
      open: false, // TM accordion open by default
      fullScreen: false,
      focused: false,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "mttm", // Three possible values: "tm", "ndtm", "mttm"
      tm_num_tapes: 3, // Only for "mttm" variant
      data: undefined, // Last tm saved on the simulator history (same data) used to restore the simulator
    },
  ]);

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

  // useEffect(() => {
  //   console.log(simulatorInfo);
  // }, [simulatorInfo]);

  return (
    <SimulatorContext.Provider value={{ simulatorInfo, setSimulatorInfo, getOne, handleFocus }}>
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
