import { createContext, useContext, useEffect, useState } from "react";

const QuestionSimulatorContext = createContext(null);

const generateRandomId = () => Math.random().toString(36).substr(2, 9);

const QuestionSimulatorProvider = ({ children }) => {
  const [questionSimulatorInfo, setQuestionSimulatorInfo] = useState([
    {
      id: "gdfhdhadhfag",
      name: "Número de 1s igual a 0s (Multifitas)",
      open: true, // TM accordion open by default
      fullScreen: false,
      focused: true,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "mttm", // Three possible values: "tm", "ndtm", "mttm"
      tm_num_tapes: 3, // Only for "mttm" variant
      bottomDrawerOpen: false,
      stayOption: false,
      data: {
        name: "Número de 1s igual a 0s (Multifitas)",
        canvasScale: 1,
        variant: "mttm",
        numTapes: 3,
        stayOption: true,
        states: [
          {
            id: 0,
            x: 150,
            y: 200,
            isStartState: true,
            isFinalState: false,
            label: "Q_{0}",
          },
          {
            id: 1,
            x: 350,
            y: 200,
            isStartState: false,
            isFinalState: false,
            label: "Q_{1}",
          },
          {
            id: 2,
            x: 550,
            y: 200,
            isStartState: false,
            isFinalState: true,
            label: "Q_{2}",
          },
        ],
        links: [
          {
            isSelfLink: true,
            state: 0,
            rules: [
              {
                label: ["a", "X", "D", "☐", "X", "D", "☐", "☐", "P"],
              },
              {
                label: ["b", "Y", "D", "☐", "☐", "P", "☐", "Y", "D"],
              },
            ],
            anchorAngle: -1.5707963267948966,
          },
          {
            isSelfLink: false,
            stateA: 0,
            stateB: 1,
            rules: [
              {
                label: ["☐", "☐", "P", "☐", "☐", "E", "☐", "☐", "E"],
              },
            ],
            parallelPart: 0,
            perpendicularPart: 0,
            lineAngleAdjust: 0,
          },
          {
            isSelfLink: true,
            state: 1,
            rules: [
              {
                label: ["☐", "☐", "P", "X", "☐", "E", "Y", "☐", "E"],
              },
            ],
            anchorAngle: -1.5707963267948966,
          },
          {
            isSelfLink: false,
            stateA: 1,
            stateB: 2,
            rules: [
              {
                label: ["☐", "☐", "P", "☐", "☐", "P", "☐", "☐", "P"],
              },
            ],
            parallelPart: 0,
            perpendicularPart: 0,
            lineAngleAdjust: 0,
          },
        ],
        initialStateLink: {
          state: 0,
          deltaX: -100,
          deltaY: 0,
        },
      }, // Last tm saved on the simulator history (same data) used to restore the simulator
      // Question part
      question: {
        solved: false,
        title: "Crie uma MT que testa palavras com o mesmo número de 1s e 0s utilizando três fitas.",
        description:
          "Neste problema, você deve criar uma máquina de Turing que aceita palavras que possuem o mesmo número de 1s e 0s. A máquina deve possuir três fitas, sendo que a primeira fita é a fita de entrada, a segunda fita é a fita de trabalho e a terceira fita é a fita de saída. A máquina deve aceitar a palavra se o número de 1s for igual ao número de 0s e rejeitar caso contrário.",
        descriptionItems: ["0s e 1s podem estar em qualquer ordem na palavra.", "A palavra vazia (ε) é aceita."],
        testCases: [
          {
            input: "ababb",
            output: false,
          },
          {
            input: "abbaab",
            output: true,
          },
          {
            input: "bbbaabaa",
            output: true,
          },
          {
            input: "babb",
            output: false,
          },
        ],
        hiddenTestCases: [
          {
            input: "abbabbaab",
            output: false,
          },
          {
            input: "a",
            output: false,
          },
          {
            input: "b",
            output: false,
          },
          {
            input: "",
            output: true,
          },
        ],
      },
    },
    {
      id: "6lkkjsgbgfl0i",
      name: "Número de 1s igual a 0s",
      open: true, // TM accordion open by default
      fullScreen: false,
      focused: true,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "tm", // Three possible values: "tm", "ndtm", "mttm"
      tm_num_tapes: 1, // Only for "mttm" variant
      bottomDrawerOpen: false,
      stayOption: false,
      data: {
        name: "Número de 1s igual a 0s",
        canvasScale: 1,
        variant: "tm",
        numTapes: 1,
        stayOption: true,
        states: [
          {
            id: 1,
            x: 223.08049726869248,
            y: 198.79295374283583,
            isStartState: true,
            isFinalState: false,
            label: "Q_{1}",
          },
          {
            id: 2,
            x: 407.0804972686924,
            y: 203.79295374283583,
            isStartState: false,
            isFinalState: false,
            label: "Q_{2}",
          },
          {
            id: 3,
            x: 653.0804972686923,
            y: 201.7929537428358,
            isStartState: false,
            isFinalState: false,
            label: "Q_{3}",
          },
          {
            id: 4,
            x: 262,
            y: 299.3999938964844,
            isStartState: false,
            isFinalState: false,
            label: "Q_{4}",
          },
          {
            id: 5,
            x: 428,
            y: 306.3999938964844,
            isStartState: false,
            isFinalState: true,
            label: "Q_{5}",
          },
        ],
        links: [
          {
            isSelfLink: false,
            stateA: 1,
            stateB: 2,
            rules: [
              {
                label: ["0", "x", "D"],
              },
            ],
            parallelPart: 0.5,
            perpendicularPart: 0,
            lineAngleAdjust: 0,
          },
          {
            isSelfLink: true,
            state: 2,
            rules: [
              {
                label: ["0", "0", "D"],
              },
              {
                label: ["y", "y", "D"],
              },
            ],
            anchorAngle: -1.5707963267948966,
          },
          {
            isSelfLink: false,
            stateA: 2,
            stateB: 3,
            rules: [
              {
                label: ["1", "y", "E"],
              },
            ],
            parallelPart: 0.5,
            perpendicularPart: 0,
            lineAngleAdjust: 0,
          },
          {
            isSelfLink: true,
            state: 3,
            rules: [
              {
                label: ["y", "y", "E"],
              },
              {
                label: ["0", "0", "E"],
              },
            ],
            anchorAngle: -1.4351639399472504,
          },
          {
            isSelfLink: false,
            stateA: 3,
            stateB: 1,
            rules: [
              {
                label: ["x", "x", "D"],
              },
            ],
            parallelPart: 0.34873258037779004,
            perpendicularPart: 125.34981269237727,
            lineAngleAdjust: 0,
          },
          {
            isSelfLink: false,
            stateA: 1,
            stateB: 4,
            rules: [
              {
                label: ["y", "y", "D"],
              },
              {
                label: ["☐", "☐", "D"],
              },
            ],
            parallelPart: 0.5,
            perpendicularPart: 0,
            lineAngleAdjust: 0,
          },
          {
            isSelfLink: true,
            state: 4,
            rules: [
              {
                label: ["y", "y", "D"],
              },
            ],
            anchorAngle: -1.4181469983996315,
          },
          {
            isSelfLink: false,
            stateA: 4,
            stateB: 5,
            rules: [
              {
                label: ["☐", "☐", "D"],
              },
            ],
            parallelPart: 0.5,
            perpendicularPart: 0,
            lineAngleAdjust: 0,
          },
        ],
        initialStateLink: {
          state: 1,
          deltaX: -80,
          deltaY: 0,
        },
      }, // Last tm saved on the simulator history (same data) used to restore the simulator
      // Question part
      question: {
        solved: false,
        title: "Crie uma MT que testa palavras com o mesmo número de 1s e 0s.",
        description:
          "Neste problema, você deve criar uma máquina de Turing que aceita palavras que possuem o mesmo número de 1s e 0s. A máquina deve aceitar a palavra se o número de 1s for igual ao número de 0s e rejeitar caso contrário.",
        descriptionItems: ["0s e 1s podem estar em qualquer ordem na palavra.", "A palavra vazia (ε) é aceita."],
        testCases: [
          {
            input: "1001",
            output: false,
          },
          {
            input: "00011",
            output: false,
          },
          {
            input: "000111",
            output: true,
          },
          {
            input: "00000001111111",
            output: true,
          },
        ],
        hiddenTestCases: [
          {
            input: "0011",
            output: true,
          },
          {
            input: "",
            output: true,
          },
          {
            input: "0010100",
            output: false,
          },
        ],
      },
    },
    {
      id: "llfarntrfdj",
      name: "Juuj",
      open: true, // TM accordion open by default
      fullScreen: false,
      focused: true,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "ndtm", // Three possible values: "tm", "ndtm", "mttm"
      tm_num_tapes: 1, // Only for "mttm" variant
      bottomDrawerOpen: false,
      stayOption: false,
      data: {
        name: "a|ac*|ab|adt|adtefy",
        canvasScale: 0.75,
        variant: "ndtm",
        numTapes: 1,
        stayOption: true,
        states: [
          {
            id: 1,
            x: 260.6666658294651,
            y: 281.59997558593597,
            isStartState: true,
            isFinalState: false,
            label: "Q_{1}",
          },
          {
            id: 2,
            x: 369.9999991627983,
            y: 197.59997558593594,
            isStartState: false,
            isFinalState: false,
            label: "Q_{2}",
          },
          {
            id: 3,
            x: 531.3333324961314,
            y: 198.93330891926928,
            isStartState: false,
            isFinalState: true,
            label: "Q_{3}",
          },
          {
            id: 4,
            x: 372.666665829465,
            y: 361.59997558593597,
            isStartState: false,
            isFinalState: false,
            label: "Q_{4}",
          },
          {
            id: 5,
            x: 531.3333324961314,
            y: 356.26664225260265,
            isStartState: false,
            isFinalState: false,
            label: "Q_{5}",
          },
        ],
        links: [
          {
            isSelfLink: false,
            stateA: 1,
            stateB: 2,
            rules: [
              {
                label: ["0", "0", "D"],
              },
            ],
            parallelPart: 0.6666666666666666,
            perpendicularPart: 0,
            lineAngleAdjust: 0,
          },
          {
            isSelfLink: false,
            stateA: 1,
            stateB: 4,
            rules: [
              {
                label: ["0", "0", "D"],
              },
            ],
            parallelPart: 0.6666666666666666,
            perpendicularPart: 0,
            lineAngleAdjust: 0,
          },
          {
            isSelfLink: true,
            state: 2,
            rules: [
              {
                label: ["0", "0", "D"],
              },
            ],
            anchorAngle: -1.5707963267948966,
          },
          {
            isSelfLink: false,
            stateA: 2,
            stateB: 3,
            rules: [
              {
                label: ["1", "1", "D"],
              },
            ],
            parallelPart: 0.6666666666666666,
            perpendicularPart: 0,
            lineAngleAdjust: 0,
          },
          {
            isSelfLink: false,
            stateA: 4,
            stateB: 5,
            rules: [
              {
                label: ["1", "1", "D"],
              },
            ],
            parallelPart: 0.6666666666666666,
            perpendicularPart: 0,
            lineAngleAdjust: 0,
          },
          {
            isSelfLink: false,
            stateA: 5,
            stateB: 3,
            rules: [
              {
                label: ["0", "0", "D"],
              },
            ],
            parallelPart: 0.6666666666666666,
            perpendicularPart: 0,
            lineAngleAdjust: 0,
          },
        ],
        initialStateLink: {
          state: 1,
          deltaX: -80,
          deltaY: 0,
        },
      }, // Last tm saved on the simulator history (same data) used to restore the simulator
      // Question part
      question: {
        solved: false,
        title: "Crie uma MT que testa se a palavra z pertence ao alfabeto k.",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora perferendis velit repudiandae molestiae! Praesentium sint ipsum tenetur error.",
        descriptionItems: [
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
          "Tempora perferendis velit repudiandae molestiae!",
          "Praesentium sint ipsum tenetur error.",
        ],
        testCases: [
          {
            input: "010",
            output: true,
          },
          {
            input: "101",
            output: false,
          },
          {
            input: "0201",
            output: false,
          },
          {
            input: "00001",
            output: true,
          },
        ],
        hiddenTestCases: [
          {
            input: "1000101",
            output: false,
          },
          {
            input: "001",
            output: true,
          },
          {
            input: "1000001",
            output: false,
          },
        ],
      },
    },
  ]);

  const getOne = (id) => questionSimulatorInfo.find((item) => item.id === id);

  const handleFocus = (focused, id) => {
    const simulator = getOne(id);

    if (!simulator) return;
    if (simulator.focused === focused) return;

    setQuestionSimulatorInfo((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, open: focused, focused: focused } : { ...item, open: false, focused: false },
      ),
    );
  };

  const setBottomDrawerOpen = (id, value) => {
    setQuestionSimulatorInfo((prev) =>
      prev.map((item) => (item.id === id ? { ...item, bottomDrawerOpen: value } : item)),
    );
  };

  // useEffect(() => {
  //   const data = localStorage.getItem("questionsInfo");
  //   if (data) {
  //     setQuestionSimulatorInfo(JSON.parse(data));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("questionsInfo", JSON.stringify(questionSimulatorInfo));
  // }, [questionSimulatorInfo]);

  return (
    <QuestionSimulatorContext.Provider
      value={{
        simulatorInfo: questionSimulatorInfo,
        setSimulatorInfo: setQuestionSimulatorInfo,
        getOne,
        handleFocus,
        generateRandomId,
        setBottomDrawerOpen,
      }}
    >
      {children}
    </QuestionSimulatorContext.Provider>
  );
};

const useQuestionSimulator = () => {
  const context = useContext(QuestionSimulatorContext);

  if (!context) {
    throw new Error("useQuestionSimulator must be used within a QuestionSimulatorProvider");
  }

  return context;
};

export { QuestionSimulatorProvider, useQuestionSimulator };
