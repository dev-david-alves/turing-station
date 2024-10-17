import { createContext, useContext, useEffect, useState } from "react";

const QuestionSimulatorContext = createContext(null);

const QuestionSimulatorProvider = ({ children }) => {
  const [questionSimulatorInfo, setQuestionSimulatorInfo] = useState([
    {
      id: "fe3pcXreYDzXPUBtmiZx",
      name: "Número de a's é igual ao dobro do número de b's",
      open: true,
      fullScreen: false,
      focused: true,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "tm",
      tm_num_tapes: 1,
      bottomDrawerOpen: false,
      stayOption: true,
      data: {
        name: "Número de a's é igual ao dobro do número de b's",
        canvasScale: 1,
        variant: "tm",
        numTapes: 1,
        stayOption: true,
        states: [],
        links: [],
        initialStateLink: null,
      },
      question: {
        solved: false,
        title: "Número de a's é igual ao dobro do número de b's.",
        description:
          "Neste problema você deve criar uma máquina de Turing que aceita palavras que possuem o número de a's igual ao dobro do número de b's. Ex: aab, aaaabb...",
        descriptionItems: [
          "A ordem deve ser a*b* (onde * significa 0 ou mais ocorrências), ou seja, todos os a's depois todos os b's.",
          "Neste problema apenas é avaliado se a palavra é aceita ou não.",
          "A palavra vazia (ε) é aceita.",
        ],
        testCases: [
          {
            input: "aab",
            output: true,
          },
          {
            input: "aaaabb",
            output: true,
          },
          {
            input: "aaaaaaaabbbb",
            output: true,
          },
        ],
        hiddenTestCases: [
          {
            input: "aaaaaabbb",
            output: true,
          },
          {
            input: "aaaaaaaaaabbbbb",
            output: true,
          },
          {
            input: "",
            output: true,
          },
        ],
      },
    },
    {
      id: "P4vt2KLWxiXdhNp9UvWe",
      name: "Número de a's é par e o número de b's é ímpar.",
      open: true,
      fullScreen: false,
      focused: true,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "tm",
      tm_num_tapes: 1,
      bottomDrawerOpen: false,
      stayOption: true,
      data: {
        name: "Número de a's é par e o número de b's é ímpar.",
        canvasScale: 1,
        variant: "tm",
        numTapes: 1,
        stayOption: true,
        states: [],
        links: [],
        initialStateLink: null,
      },
      question: {
        solved: false,
        title: "Número de a's é par e o número de b's é ímpar.",
        description:
          "Neste problema você deve criar uma máquina de Turing que aceita palavras que possuem o número de a's par e o número de b's ímpar. Ex: aab, abaabab...",
        descriptionItems: ["Os símbolos podem estar em qualquer ordem na palavra.", "A palavra vazia (ε) é aceita."],
        testCases: [
          {
            input: "aab",
            output: true,
          },
          {
            input: "abaabab",
            output: true,
          },
          {
            input: "baaababababaa",
            output: true,
          },
        ],
        hiddenTestCases: [
          {
            input: "ababaab",
            output: true,
          },
          {
            input: "bbaaaabaa",
            output: true,
          },
          {
            input: "",
            output: true,
          },
        ],
      },
    },
    {
      id: "y7RvIp5P8eCsGvgXM6mj",
      name: "Duplicar uma palavra.",
      open: true,
      fullScreen: false,
      focused: true,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "tm",
      tm_num_tapes: 1,
      bottomDrawerOpen: false,
      stayOption: true,
      data: {
        name: "Duplicar uma palavra.",
        canvasScale: 1,
        variant: "tm",
        numTapes: 1,
        stayOption: true,
        states: [],
        links: [],
        initialStateLink: null,
      },
      question: {
        solved: false,
        title: "Duplicar uma palavra.",
        description:
          "Neste problema você deve criar uma máquina de Turing capaz de duplicar qualquer palavra, cujo alfabeto é [a, b, c]. Ex: acab se tornará acabacab, cabcac se tornará cabcaccabcac...",
        descriptionItems: [
          "Os símbolos podem estar em qualquer ordem na palavra.",
          "A palavra deve ter tamanho maior do que 1.",
        ],
        testCases: [
          {
            input: "aab",
            output: "aabaab",
          },
          {
            input: "abcaabcab",
            output: "abcaabcababcaabcab",
          },
          {
            input: "bacccababaa",
            output: "bacccababaabacccababaa",
          },
        ],
        hiddenTestCases: [
          {
            input: "cababaabc",
            output: "cababaabccababaabc",
          },
          {
            input: "c",
            output: "cc",
          },
          {
            input: "",
            output: false,
          },
        ],
      },
    },
    {
      id: "K7hzz66zXgWitSHmu9uu",
      name: "Número de a's é igual ou menor que o número de b's.",
      open: true,
      fullScreen: false,
      focused: true,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "tm",
      tm_num_tapes: 1,
      bottomDrawerOpen: false,
      stayOption: true,
      data: {
        name: "Número de a's é igual ou menor que o número de b's.",
        canvasScale: 1,
        variant: "tm",
        numTapes: 1,
        stayOption: true,
        states: [],
        links: [],
        initialStateLink: null,
      },
      question: {
        solved: false,
        title: "Número de a's é igual ou menor que o número de b's.",
        description:
          "Neste problema você deve criar uma máquina de Turing que aceita palavras que possuem o número de a's igual ou menor que o número de b's. Ex: baab, bbababb...",
        descriptionItems: [
          "Os símbolos podem estar em qualquer ordem na palavra.",
          "A palavra deve ter tamanho maior do que 1.",
        ],
        testCases: [
          {
            input: "aabbb",
            output: true,
          },
          {
            input: "babbaa",
            output: true,
          },
          {
            input: "baabab",
            output: true,
          },
        ],
        hiddenTestCases: [
          {
            input: "ababaabb",
            output: true,
          },
          {
            input: "b",
            output: true,
          },
          {
            input: "",
            output: false,
          },
        ],
      },
    },
    {
      id: "E0BndlSHCPRyzTqNZT5d",
      name: "Palíndromos compostos por 0 ou 1.",
      open: true,
      fullScreen: false,
      focused: true,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "tm",
      tm_num_tapes: 1,
      bottomDrawerOpen: false,
      stayOption: true,
      data: {
        name: "Palíndromos compostos por 0 ou 1.",
        canvasScale: 1,
        variant: "tm",
        numTapes: 1,
        stayOption: true,
        states: [],
        links: [],
        initialStateLink: null,
      },
      question: {
        solved: false,
        title: "Palíndromos compostos por 0 ou 1.",
        description:
          'Neste problema você deve criar uma máquina de Turing que aceita palavras que são palíndromos compostos por 0 ou 1. Diz se que uma palavra é uma palíndromo se permanecer igual quando lida de trás para diante (exemplo comum no português é "arara"). Exemplo: 010, 111, 0...',
        descriptionItems: ["Os símbolos podem estar em qualquer ordem na palavra.", "A palavra vazia (ε) é aceita."],
        testCases: [
          {
            input: "010",
            output: true,
          },
          {
            input: "10001010001",
            output: true,
          },
          {
            input: "1",
            output: true,
          },
        ],
        hiddenTestCases: [
          {
            input: "0010100",
            output: true,
          },
          {
            input: "0",
            output: true,
          },
          {
            input: "",
            output: true,
          },
        ],
      },
    },
    {
      id: "WvABF6EkLmOwKKUpfIWI",
      name: "Inverter palavras compostas por 0 ou 1.",
      open: true,
      fullScreen: false,
      focused: true,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "tm",
      tm_num_tapes: 1,
      bottomDrawerOpen: false,
      stayOption: true,
      data: {
        name: "Inverter palavras compostas por 0 ou 1.",
        canvasScale: 1,
        variant: "tm",
        numTapes: 1,
        stayOption: true,
        states: [],
        links: [],
        initialStateLink: null,
      },
      question: {
        solved: false,
        title: "Inverter palavras compostas por 0 ou 1.",
        description:
          "Neste problema você deve criar uma máquina de Turing que recebe uma palavra composta por 0 ou 1 e inverte a ordem dos símbolos. Exemplo: 0100 se torna 0010, 0111 se torna 1110...",
        descriptionItems: ["Os símbolos podem estar em qualquer ordem na palavra.", "A palavra vazia (ε) é aceita."],
        testCases: [
          {
            input: "0100",
            output: "0010",
          },
          {
            input: "0111",
            output: "1110",
          },
          {
            input: "010110",
            output: "011010",
          },
        ],
        hiddenTestCases: [
          {
            input: "001010011",
            output: "110010100",
          },
          {
            input: "0",
            output: true,
          },
          {
            input: "",
            output: true,
          },
        ],
      },
    },
    {
      id: "CSubqpBYLzrddsNHiGMx",
      name: "Palavras que possuem uma substring (pedaço de palavra) de tamanho 3 que se repete em algum lugar da palavra.",
      open: true,
      fullScreen: false,
      focused: true,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "ndtm",
      tm_num_tapes: 1,
      bottomDrawerOpen: false,
      stayOption: true,
      data: {
        name: "Palavras que possuem uma substring (pedaço de palavra) de tamanho 3 que se repete em algum lugar da palavra.",
        canvasScale: 1,
        variant: "ndtm",
        numTapes: 1,
        stayOption: true,
        states: [],
        links: [],
        initialStateLink: null,
      },
      question: {
        solved: false,
        title:
          "Palavras que possuem uma substring (pedaço de palavra) de tamanho 3 que se repete em algum lugar da palavra.",
        description:
          "Neste problema você deve criar uma máquina de Turing que aceita palavras compostas por apenas 0's e 1's e que possuam uma substring de tamanho 3 que se repete em algum lugar da palavra. Exemplo: 010001000 (000 se repete), 101010 (101 se repete)...",
        descriptionItems: ["Os símbolos podem estar em qualquer ordem na palavra."],
        testCases: [
          {
            input: "010001000",
            output: true,
          },
          {
            input: "101010",
            output: true,
          },
          {
            input: "000000",
            output: true,
          },
        ],
        hiddenTestCases: [
          {
            input: "111111",
            output: true,
          },
          {
            input: "010101010",
            output: true,
          },
          {
            input: "111010001000",
            output: true,
          },
        ],
      },
    },
    {
      id: "PBzlf7AU3rZqAfyzUaKo",
      name: "Palavras que possuem uma substring seguida pelo o inverso dela.",
      open: true,
      fullScreen: false,
      focused: true,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "ndtm",
      tm_num_tapes: 1,
      bottomDrawerOpen: false,
      stayOption: true,
      data: {
        name: "Palavras que possuem uma substring seguida pelo o inverso dela.",
        canvasScale: 1,
        variant: "ndtm",
        numTapes: 1,
        stayOption: true,
        states: [],
        links: [],
        initialStateLink: null,
      },
      question: {
        solved: false,
        title: "Palavras que possuem uma substring seguida pelo o inverso dela.",
        description:
          "Neste problema você deve criar uma máquina de Turing que aceita palavras compostas por apenas 0's e 1's e que sejam compostas por apenas uma substring qualquer seguida por ela mesmo invertida, ou seja, seja x uma substring de w e y = inverso(x), w = xy. Exemplo: 001100 (001 é a substring e 100 é o inverso dela), 1001001001 (10010 é a substring e 01001 é o inverso dela)...",
        descriptionItems: ["Os símbolos podem estar em qualquer ordem na palavra.", "A palavra vazia (ε) é aceita."],
        testCases: [
          {
            input: "001100",
            output: true,
          },
          {
            input: "1001001001",
            output: true,
          },
          {
            input: "000000",
            output: true,
          },
        ],
        hiddenTestCases: [
          {
            input: "111111",
            output: true,
          },
          {
            input: "01011010",
            output: true,
          },
          {
            input: "",
            output: true,
          },
        ],
      },
    },
    {
      id: "2CCJIubpwoxiRdhXM5tR",
      name: "Palavras que possuem um número de a's seguido pelo mesmo número de b's seguido pelo mesmo número de c's.",
      open: true,
      fullScreen: false,
      focused: true,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "mttm",
      tm_num_tapes: 2,
      bottomDrawerOpen: false,
      stayOption: true,
      data: {
        name: "Palavras que possuem um número de a's seguido pelo mesmo número de b's seguido pelo mesmo número de c's.",
        canvasScale: 1,
        variant: "mttm",
        numTapes: 2,
        stayOption: true,
        states: [],
        links: [],
        initialStateLink: null,
      },
      question: {
        solved: false,
        title:
          "Palavras que possuem um número de a's seguido pelo mesmo número de b's seguido pelo mesmo número de c's.",
        description:
          "Neste problema você deve criar uma máquina de Turing utilizando 2 (duas) fitas que aceita palavras compostas por apenas a's, b's e c's e que possuem um número de a's seguido pelo mesmo número de b's seguido pelo mesmo número de c's.. Exemplo: abc, aabbcc, aaabbbccc...",
        descriptionItems: [
          "Os símbolos devem seguir a ordem exata de a's, b's e c's.",
          "A palavra vazia (ε) é aceita.",
        ],
        testCases: [
          {
            input: "abc",
            output: true,
          },
          {
            input: "aabbcc",
            output: true,
          },
          {
            input: "aaabbbccc",
            output: true,
          },
        ],
        hiddenTestCases: [
          {
            input: "aaaaaaaaaaaaaaabbbbbbbbbbbbbbbccccccccccccccc",
            output: true,
          },
          {
            input: "aaaabbbbcccc",
            output: true,
          },
          {
            input: "",
            output: true,
          },
        ],
      },
    },
    {
      id: "o3fqhuX21Dff9JO1mNMo",
      name: "Palavras que possuem uma substring seguida por ela mesmo.",
      open: true,
      fullScreen: false,
      focused: true,
      showLeftToolbar: true,
      showTooltips: false,
      tm_variant: "mttm",
      tm_num_tapes: 2,
      bottomDrawerOpen: false,
      stayOption: true,
      data: {
        name: "Palavras que possuem uma substring seguida por ela mesmo.",
        canvasScale: 1,
        variant: "mttm",
        numTapes: 2,
        stayOption: true,
        states: [],
        links: [],
        initialStateLink: null,
      },
      question: {
        solved: false,
        title: "Palavras que possuem uma substring seguida por ela mesmo.",
        description:
          "Neste problema você deve criar uma máquina de Turing utilizando 2 (duas) fitas que aceita palavras compostas por apenas a's, b's e c's e que sejam compostas por apenas uma substring qualquer seguida por ela mesmo repetida, ou seja, seja x uma substring de w, w = xx. Exemplo: abcabc, aabbccaabbcc, aaabbbcccaaabbbccc...",
        descriptionItems: [
          "Os símbolos devem seguir a ordem exata de a's, b's e c's.",
          "A palavra deve conter pelo menos 1 (um) a, 1 (um) b e 1 (um) c.",
        ],
        testCases: [
          {
            input: "abcabc",
            output: true,
          },
          {
            input: "aabbccaabbcc",
            output: true,
          },
          {
            input: "aaabbbcccaaabbbccc",
            output: true,
          },
        ],
        hiddenTestCases: [
          {
            input: "abbbbbccccccccccccccabbbbbcccccccccccccc",
            output: true,
          },
          {
            input: "aaaabbbbcaaaabbbbc",
            output: true,
          },
          {
            input: "",
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
