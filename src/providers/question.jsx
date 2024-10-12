import { createContext, useContext, useEffect, useState } from "react";

const QuestionSimulatorContext = createContext(null);

const generateRandomId = () => Math.random().toString(36).substr(2, 9);

const QuestionSimulatorProvider = ({ children }) => {
  const [questionSimulatorInfo, setQuestionSimulatorInfo] = useState([
    {
      id: "gdfhdhadhfag",
      name: "Juuj",
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
        name: "a^nb^n",
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
            input: "k",
            output: true,
          },
          {
            input: "a",
            output: false,
          },
        ],
      },
    },
    {
      id: "6lkkjsgbgfl0i",
      name: "Juuj",
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
        name: "a^nb^n",
        canvasScale: 1,
        variant: "mttm",
        numTapes: 3,
        stayOption: true,
        states: [],
        links: [],
        initialStateLink: {
          state: 0,
          deltaX: -100,
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
            input: "k",
            output: true,
          },
          {
            input: "a",
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
      tm_variant: "mttm", // Three possible values: "tm", "ndtm", "mttm"
      tm_num_tapes: 3, // Only for "mttm" variant
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
          {
            input: "1000101",
            output: false,
          },
          {
            input: "001",
            output: true,
          },
          {
            input: "0000001",
            output: true,
          },
        ],
        hiddenTestCases: [
          {
            input: "k",
            output: true,
          },
          {
            input: "a",
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
  //   console.log(questionSimulatorInfo);
  //   localStorage.setItem("questionsInfo", JSON.stringify(questionSimulatorInfo));
  // }, [JSON.stringify(questionSimulatorInfo)]);

  // useEffect(() => {
  //   console.log(questionSimulatorInfo);
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
