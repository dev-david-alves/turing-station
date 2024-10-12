import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { TMSimulator } from "../p5-turing-machines/TMSimulator";
import NotFound from "./not-found";
import { useQuestionSimulator } from "../providers/question";
import Simulator from "../components/simulator/Simulator";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "../components/Button";
import { MTNDTM } from "../p5-turing-machines/classes/simulation/multitape-nondeterministic";
import { cn } from "../utils/cn";

const createTM = ({ data }) => {
  let q = new Set(data.states.map((state) => state.id));
  let sigma = new Set(); // I don't need this
  let gamma = new Set(); // I don't need this
  let startState = data.initialStateLink ? data.initialStateLink.state : null;
  let finalStates = new Set(data.states.filter((state) => state.isFinalState).map((state) => state.id));

  // Create the delta
  let delta = {};

  data.links.forEach((link) => {
    let from = null;
    let to = null;

    if (link.isSelfLink) {
      from = link.state;
      to = link.state;
    } else {
      from = link.stateA;
      to = link.stateB;
    }

    if (!delta[from]) delta[from] = {};

    let mappingMove = {
      E: -1,
      D: 1,
      P: 0,
    };

    link.rules.forEach((rule) => {
      let fullRule = [];
      rule.label.forEach((r) => {
        let ruleBreak = r.split("").filter((r) => r !== " " && r !== "→" && r !== ",");
        fullRule = fullRule.concat(ruleBreak);
      });

      let key = fullRule.map((r, i) => (i % 3 === 0 ? r : "")).join("");

      if (!delta[from][key]) delta[from][key] = [];

      let actions = [];
      for (let i = 0; i < fullRule.length; i += 3) {
        actions.push({ write: fullRule[i + 1], move: mappingMove[fullRule[i + 2]] });
      }

      delta[from][key].push({ to, actions });
    });
  });

  return new MTNDTM(q, sigma, gamma, delta, startState, finalStates, data.numTapes);
};

function TestCase({ testCase, answer, showTestIcons }) {
  return (
    <li className="flex w-full items-center justify-between gap-2">
      {showTestIcons ? (
        <>
          {answer === testCase.output ? (
            <Icon icon="solar:check-circle-outline" className="icon h-8 min-h-8 w-8 min-w-8 text-lightGreen" />
          ) : (
            <Icon icon="icon-park-outline:close-one" className="icon h-8 min-h-8 w-8 min-w-8 text-lightDanger" />
          )}
        </>
      ) : (
        <div className="min-w-8"></div>
      )}

      <p className="w-[calc(100%/3)] rounded-md bg-darkenBlue px-4 py-2 font-semibold text-white">{testCase.input}</p>
      <p
        className={cn(
          "w-[calc(100%/3)] rounded-md bg-darkenBlue px-4 py-2 font-semibold text-white",
          answer && "text-lightGreen",
          !answer && "text-lightDanger",
        )}
      >
        {answer ? "Aceita" : "Rejeita"}
      </p>
      <p
        className={cn(
          "w-[calc(100%/3)] rounded-md bg-darkenBlue px-4 py-2 font-semibold text-white",
          testCase.output && "text-lightGreen",
          !testCase.output && "text-lightDanger",
        )}
      >
        {testCase.output ? "Aceita" : "Rejeita"}
      </p>
    </li>
  );
}

function Question() {
  const [answers, setAnswers] = useState(null);

  const params = useParams();
  const questionId = params.id;

  const { getOne, setSimulatorInfo } = useQuestionSimulator();
  const data = getOne(questionId);

  if (!data) {
    return <NotFound />;
  }

  const question = data.question;

  const [showTests, setShowTests] = useState(false);
  const [showTestIcons, setShowTestIcons] = useState(false);
  const [tm, setTM] = useState(null);

  const handleCheckAnswer = () => {
    setShowTestIcons(true);
    setShowTests(true);

    if (!tm) return;

    let answersChecked = question.testCases.map((testCase) => {
      tm.setComputedWord(testCase.input);
      let { accepted } = tm.fastForward();
      return accepted;
    });

    const solved = answersChecked.every((answer) => answer);
    setSimulatorInfo((prev) => prev.map((item) => (item.id === questionId ? { ...item, solved: solved } : item)));

    setAnswers(answersChecked);
  };

  useEffect(() => {
    setTM(createTM({ data: data.data }));
  }, [data]);

  useEffect(() => {
    setShowTestIcons(false);
  }, [data.data]);

  return (
    <div className="flex w-full flex-col gap-4 rounded-md bg-main py-4 shadow-lg">
      <div className="flex w-full flex-col gap-4 rounded-md bg-main px-4">
        <h2 className="text-2xl font-bold text-white">{question.title}</h2>
        <div className="flex w-full flex-col gap-2">
          <p className="text-sm font-semibold text-white">Descrição</p>
          <p className="text-xs text-white">{question.description}</p>
          <ul className="w-full px-4 text-white">
            {question.descriptionItems.map((item, index) => (
              <li key={index} className="list-disc text-xs">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full border-y border-gray-700">
        <Simulator id={questionId} whichProvider="questions">
          <TMSimulator id={questionId} whichProvider="questions" />
        </Simulator>
      </div>

      {showTests && (
        <div className="flex flex-col gap-2 px-4">
          <p className="ml-10 text-lg font-semibold text-white">Casos de teste</p>
          <div className="ml-10 flex items-center justify-between gap-2">
            <p className="w-[calc(100%/3)] text-left font-semibold text-darkVariant">Palavras: </p>
            <p className="w-[calc(100%/3)] text-left font-semibold text-darkVariant">Resultados: </p>
            <p className="w-[calc(100%/3)] text-left font-semibold text-darkVariant">Resultados esperados: </p>
          </div>
          <ul className="flex w-full list-disc flex-col gap-2 text-white">
            {question.testCases.map((testCase, index) => (
              <TestCase
                key={index}
                testCase={testCase}
                answer={answers ? answers[index] : null}
                showTestIcons={showTestIcons}
              />
            ))}
          </ul>
        </div>
      )}

      <div className="flex w-full items-center justify-end gap-2 px-4">
        <Button variant="default" className="bg-zinc-700 text-white" onClick={() => setShowTests(false)}>
          Esconder testes
        </Button>
        <Button variant="default" className="text-white" onClick={handleCheckAnswer}>
          Testar solução
        </Button>
      </div>
    </div>
  );
}

export default Question;
