import { createContext, useContext, useEffect, useState } from "react";

const QuestionSimulatorContext = createContext(null);

const QuestionSimulatorProvider = ({ children }) => {
  const [questionSimulatorInfo, setQuestionSimulatorInfo] = useState([
    // Done (end)
    {
      id: "ae3pcyreYDxXPUBTmiZx",
      name: "Aceita 'a' seguido de zero ou mais 'b's (ab*)",
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
        name: "Aceita 'a' seguido de zero ou mais 'b's (ab*)",
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
        title: "Aceita 'a' seguido de zero ou mais 'b's (ab*)",
        description:
          "Neste problema você deve criar uma máquina de Turing que aceita palavras compostas por 'a' seguido de zero ou mais 'b's. Ex: a, ab, abb...",
        descriptionItems: [
          "A ordem deve ser ab* (onde * significa 0 ou mais ocorrências), ou seja, 'a' antes de todos os b's.",
          "Esta é uma máquina de Turing com fita infinita para os dois lados.",
          "Neste problema apenas é avaliado se a palavra é aceita ou não, o conteúdo da fita ao final não é avaliado.",
          "A palavra precisa conter pelo menos um 'a'.",
        ],
        testCases: [
          {
            input: "a",
            output: true,
          },
          {
            input: "ab",
            output: true,
          },
          {
            input: "abbb",
            output: true,
          },
          {
            input: "b",
            output: false,
          },
          {
            input: "aba",
            output: false,
          },
          {
            input: "baa",
            output: false,
          },
        ],
        hiddenTestCases: [
          {
            input: "abbbbbbbbbb",
            output: true,
          },
          {
            input: "abbbbbbbbbbbbbbbbbbb",
            output: true,
          },
          {
            input: "abb",
            output: true,
          },
          {
            input: "bb",
            output: false,
          },
          {
            input: "",
            output: false,
          },
          {
            input: "baaaaaaaaaaaaaaaaaaaa",
            output: false,
          },
          {
            input: "baaaaaaaaa",
            output: false,
          },
        ],
      },
    },
    // Done (end)
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
        title: "Número de a's é igual ao dobro do número de b's",
        description:
          "Neste problema você deve criar uma máquina de Turing que aceita palavras que possuem o número de a's igual ao dobro do número de b's. Ex: aab, aaaabb...",
        descriptionItems: [
          "A ordem deve ser a*b* (onde * significa 0 ou mais ocorrências), ou seja, todos os a's antes de todos os b's.",
          "Esta é uma máquina de Turing com fita infinita para os dois lados.",
          "Neste problema apenas é avaliado se a palavra é aceita ou não, o conteúdo da fita ao final não é avaliado.",
          "A palavra deve conter pelo menos 2 (dois) a's e pelo menos 1 (um) b.",
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
          {
            input: "aabb",
            output: false,
          },
          {
            input: "baa",
            output: false,
          },
          {
            input: "",
            output: false,
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
            input: "a",
            output: false,
          },
          {
            input: "b",
            output: false,
          },
          {
            input: "aa",
            output: false,
          },
          {
            input: "ab",
            output: false,
          },
          {
            input: "aaab",
            output: false,
          },
          {
            input: "aaabb",
            output: false,
          },
        ],
      },
    },
    // Done (end)
    {
      id: "P4vt2KLWxiXdhNp9UvWe",
      name: "Número de a's é par e o número de b's é ímpar",
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
        name: "Número de a's é par e o número de b's é ímpar",
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
        title: "Número de a's é par e o número de b's é ímpar",
        description:
          "Neste problema você deve criar uma máquina de Turing que aceita palavras que possuem o número de a's par (|a*| % 2 = 0) e o número de b's ímpar (|b*| % 2 = 1). Ex: aab, abaabab...",
        descriptionItems: [
          "Os símbolos podem estar em qualquer ordem na palavra.",
          "Esta é uma máquina de Turing com fita infinita para os dois lados.",
          "Neste problema apenas é avaliado se a palavra é aceita ou não, o conteúdo da fita ao final não é avaliado.",
          "A palavra vazia (ε) não é aceita.",
        ],
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
            input: "baaababababaabb",
            output: true,
          },
          {
            input: "abaaab",
            output: false,
          },
          {
            input: "bbaaa",
            output: false,
          },
        ],
        hiddenTestCases: [
          {
            input: "ababababb",
            output: true,
          },
          {
            input: "bbaaaabaa",
            output: true,
          },
          {
            input: "b",
            output: true,
          },
          {
            input: "bbbaaaabaa",
            output: false,
          },
          {
            input: "ba",
            output: false,
          },
          {
            input: "",
            output: false,
          },
        ],
      },
    },
    // Done (end)
    {
      id: "y7RvIp5P8eCsGvgXM6mj",
      name: "Duplicar uma palavra",
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
        name: "Duplicar uma palavra",
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
        title: "Duplicar uma palavra",
        description:
          "Neste problema você deve criar uma máquina de Turing capaz de duplicar qualquer palavra, cujo alfabeto de entrada é (a, b, c). Ex: acab se tornará acab#acab, cabcac se tornará cabcac#cabcac...",
        descriptionItems: [
          "Os símbolos podem estar em qualquer ordem na palavra.",
          "Esta é uma máquina de Turing com fita infinita para os dois lados.",
          "Neste problema é avaliado o conteúdo da fita para cada teste, desconsiderando os espaços em branco antes e depois da palavra.",
          "A palavra duplicada deve aparecer logo após um # que separa a palavra original da duplicada.",
          "A palavra deve ter tamanho maior do que 1.",
        ],
        testCases: [
          {
            input: "acab",
            output: "acab#acab",
          },
          {
            input: "cabcac",
            output: "cabcac#cabcac",
          },
          {
            input: "bacccababaa",
            output: "bacccababaa#bacccababaa",
          },
          {
            input: "aaa",
            output: "aaa#aaa",
          },
        ],
        hiddenTestCases: [
          {
            input: "cababaabc",
            output: "cababaabc#cababaabc",
          },
          {
            input: "c",
            output: "c#c",
          },
          {
            input: "bbcc",
            output: "bbcc#bbcc",
          },
        ],
      },
    },
    // Done (end)
    {
      id: "K7hzz66zXgWitSHmu9uu",
      name: "Número de a's é igual ou menor que o número de b's",
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
        name: "Número de a's é igual ou menor que o número de b's",
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
        title: "Número de a's é igual ou menor que o número de b's",
        description:
          "Neste problema você deve criar uma máquina de Turing que aceita palavras que possuem o número de a's igual ou menor que o número de b's (|a*| <= |b*|). Ex: baab, bbababb...",
        descriptionItems: [
          "Os símbolos podem estar em qualquer ordem na palavra.",
          "Esta é uma máquina de Turing com fita infinita para os dois lados.",
          "Neste problema apenas é avaliado se a palavra é aceita ou não, o conteúdo da fita ao final não é avaliado.",
          "A palavra vazia (ε) é aceita.",
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
            input: "baabbab",
            output: true,
          },
          {
            input: "bbaabab",
            output: true,
          },
          {
            input: "babbaaa",
            output: false,
          },
          {
            input: "baababaa",
            output: false,
          },
          {
            input: "bbaababaaaaa",
            output: false,
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
            output: true,
          },
          {
            input: "a",
            output: false,
          },
          {
            input: "aaaaaaa",
            output: false,
          },
        ],
      },
    },
    // Done (end)
    {
      id: "E0BndlSHCPRyzTqNZT5d",
      name: "Palíndromos compostos por 0 ou 1",
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
        name: "Palíndromos compostos por 0 ou 1",
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
        title: "Palíndromos compostos por 0 ou 1",
        description:
          'Neste problema você deve criar uma máquina de Turing que aceita palavras que são palíndromos compostos por 0 ou 1. Diz se que uma palavra é um palíndromo se permanecer igual quando lida de trás para frente (exemplo comum no português é "arara"). Exemplo: 010, 111, 0...',
        descriptionItems: [
          "Os símbolos podem estar em qualquer ordem na palavra.",
          "Esta é uma máquina de Turing com fita infinita para os dois lados.",
          "Neste problema apenas é avaliado se a palavra é aceita ou não, o conteúdo da fita ao final não é avaliado.",
          "A palavra vazia (ε) é aceita.",
        ],
        testCases: [
          {
            input: "010",
            output: true,
          },
          {
            input: "111",
            output: true,
          },
          {
            input: "0",
            output: true,
          },
          {
            input: "1",
            output: true,
          },
          {
            input: "10001010001",
            output: true,
          },
          {
            input: "01",
            output: false,
          },
          {
            input: "10",
            output: false,
          },
          {
            input: "001",
            output: false,
          },
        ],
        hiddenTestCases: [
          {
            input: "0010100",
            output: true,
          },
          {
            input: "0000",
            output: true,
          },
          {
            input: "",
            output: true,
          },
          {
            input: "00010",
            output: false,
          },
          {
            input: "110",
            output: false,
          },
        ],
      },
    },
    // Done (end)
    {
      id: "WvABF6EkLmOwKKUpfIWI",
      name: "Inverter palavras compostas por 0 ou 1",
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
        name: "Inverter palavras compostas por 0 ou 1",
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
        title: "Inverter palavras compostas por 0 ou 1",
        description:
          "Neste problema você deve criar uma máquina de Turing que recebe uma palavra composta por 0 ou 1 e inverte a ordem dos símbolos. Exemplo: 0100 se torna 0010, 0111 se torna 1110...",
        descriptionItems: [
          "Os símbolos podem estar em qualquer ordem na palavra.",
          "Esta é uma máquina de Turing com fita infinita para os dois lados.",
          "Neste problema é avaliado o conteúdo da fita para cada teste, desconsiderando os espaços em branco antes e depois da palavra.",
          "A palavra vazia (ε) é aceita.",
        ],
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
            input: "0010110",
            output: "0110100",
          },
        ],
        hiddenTestCases: [
          {
            input: "001010011",
            output: "110010100",
          },
          {
            input: "0",
            output: "0",
          },
          {
            input: "1",
            output: "1",
          },
          {
            input: "",
            output: "",
          },
        ],
      },
    },
    // Done (end)
    {
      id: "CSubqpBYLzrddsNHiGMx",
      name: "Palavras que possuem pelo menos uma substring (pedaço de palavra) de tamanho 3 que se repete em algum lugar da palavra",
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
        name: "Palavras que possuem pelo menos uma substring (pedaço de palavra) de tamanho 3 que se repete em algum lugar da palavra",
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
          "Palavras que possuem pelo menos uma substring (pedaço de palavra) de tamanho 3 que se repete em algum lugar da palavra",
        description:
          "Neste problema você deve criar uma máquina de Turing que aceita palavras compostas por apenas 0's e 1's e que possuam pelo menos uma substring de tamanho 3 que se repete, pelo menos uma vez, em algum lugar da palavra. Exemplo: 0110001000 (100 se repete), 101101 (101 se repete)...",
        descriptionItems: [
          "Os símbolos podem estar em qualquer ordem na palavra.",
          "Esta é uma máquina de Turing com fita infinita para os dois lados.",
          "Neste problema apenas é avaliado se a palavra é aceita ou não, o conteúdo da fita ao final não é avaliado.",
          "A palavra precisa conter pelo menos 6 (seis) símbolos.",
        ],
        testCases: [
          {
            input: "0110001000",
            output: true,
          },
          {
            input: "101101",
            output: true,
          },
          {
            input: "000000",
            output: true,
          },
          {
            input: "00000",
            output: false,
          },
          {
            input: "101110",
            output: false,
          },
          {
            input: "001100",
            output: false,
          },
        ],
        hiddenTestCases: [
          {
            input: "111111",
            output: true,
          },
          {
            input: "01010101010",
            output: true,
          },
          {
            input: "111010001000",
            output: true,
          },
          {
            input: "0",
            output: false,
          },
          {
            input: "100110",
            output: false,
          },
        ],
      },
    },
    // Done (end)
    {
      id: "PBzlf7AU3rZqAfyzUaKo",
      name: "Palavras que possuem uma substring seguida pelo seu inverso",
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
        name: "Palavras que possuem uma substring seguida pelo seu inverso",
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
        title: "Palavras que possuem uma substring seguida pelo seu inverso",
        description:
          "Neste problema você deve criar uma máquina de Turing que aceita palavras, cujo alfabeto de entrada é (0, 1), formadas por uma substring qualquer seguida por ela mesmo invertida. Seja x uma substring de w e y = inverso(x), w = xy. Exemplo: 001100 (001 é a substring e 100 é o inverso dela), 1001001001 (10010 é a substring e 01001 é o inverso dela)...",
        descriptionItems: [
          "Os símbolos podem estar em qualquer ordem na palavra.",
          "Esta é uma máquina de Turing com fita infinita para os dois lados.",
          "Neste problema apenas é avaliado se a palavra é aceita ou não, o conteúdo da fita ao final não é avaliado.",
          "A palavra vazia (ε) é aceita.",
        ],
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
          {
            input: "00110",
            output: false,
          },
          {
            input: "1001001",
            output: false,
          },
          {
            input: "1000",
            output: false,
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
          {
            input: "01010",
            output: false,
          },
          {
            input: "01",
            output: false,
          },
        ],
      },
    },
    // Done (end)
    {
      id: "2CCJIubpwoxiRdhXM5tR",
      name: "Palavras que possuem um número de a's seguido pelo mesmo número de b's seguido pelo mesmo número de c's",
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
        name: "Palavras que possuem um número de a's seguido pelo mesmo número de b's seguido pelo mesmo número de c's",
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
          "Palavras que possuem um número de a's seguido pelo mesmo número de b's seguido pelo mesmo número de c's",
        description:
          "Neste problema você deve criar uma máquina de Turing multifitas, utilizando 2 (duas) fitas, que aceita palavras compostas por apenas a's, b's e c's e que possuem um número de a's seguido pelo mesmo número de b's seguido pelo mesmo número de c's. Exemplo: abc, aabbcc, aaabbbccc...",
        descriptionItems: [
          "Os símbolos devem seguir a ordem exata de a's, b's e c's.",
          "Esta é uma máquina de Turing com fitas infinitas para os dois lados.",
          "Neste problema apenas é avaliado se a palavra é aceita ou não, o conteúdo da fita ao final não é avaliado.",
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
          {
            input: "abcc",
            output: false,
          },
          {
            input: "aabbbcc",
            output: false,
          },
          {
            input: "aaaaabbbccc",
            output: false,
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
          {
            input: "bca",
            output: false,
          },
          {
            input: "aaccbb",
            output: false,
          },
        ],
      },
    },
    // Done (end)
    {
      id: "o3fqhuX21Dff9JO1mNMo",
      name: "Palavras que possuem uma substring seguida por ela mesmo repetida",
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
        name: "Palavras que possuem uma substring seguida por ela mesmo repetida",
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
        title: "Palavras que possuem uma substring seguida por ela mesmo repetida",
        description:
          "Neste problema você deve criar uma máquina de Turing multifitas, utilizando 2 (duas) fitas, que aceita palavras que possuem apenas a's, b's e c's e que sejam compostas por uma substring qualquer seguida por ela mesmo repetida. Seja x uma substring de w, w = xx. Exemplo: abcabc, aabbccaabbcc, aaabbbcccaaabbbccc...",
        descriptionItems: [
          "Os símbolos podem estar em qualquer ordem na palavra.",
          "Esta é uma máquina de Turing com fitas infinitas para os dois lados.",
          "Neste problema apenas é avaliado se a palavra é aceita ou não, o conteúdo da fita ao final não é avaliado.",
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
          {
            input: "aab",
            output: false,
          },
          {
            input: "ab",
            output: false,
          },
          {
            input: "acccc",
            output: false,
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
            input: "b",
            output: false,
          },
          {
            input: "bc",
            output: false,
          },
          {
            input: "c",
            output: false,
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

  useEffect(() => {
    const data = localStorage.getItem("questionsInfo");
    if (data) {
      setQuestionSimulatorInfo(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("questionsInfo", JSON.stringify(questionSimulatorInfo));
  }, [questionSimulatorInfo]);

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
