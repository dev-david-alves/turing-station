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
import { ErrorToast, SuccessToast } from "../components/Toast";
import { texMap } from "../p5-turing-machines/utils/getTexMaps";

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

function TestCase({ testCase, answer, showTestIcons, tapeInTheEnd = [] }) {
  const [tapes, setTapes] = useState([]);

  useEffect(() => {
    let aux = "";
    tapeInTheEnd.forEach((tape) => {
      aux += tape === texMap["\\Blank"] ? "ε" : tape;
    });

    setTapes(aux);
  }, [tapeInTheEnd]);

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
      ) : null}

      <p
        className={cn(
          "h-10 w-full max-w-full truncate rounded-md bg-darkenBlue px-4 py-2 font-semibold text-white",
          typeof testCase.output !== "boolean" && "w-[calc(100%/3)]",
        )}
      >
        {testCase.input}
      </p>

      {typeof testCase.output !== "boolean" && (
        <>
          <p
            className={cn(
              "h-10 w-[calc(100%/3)] truncate rounded-md bg-darkenBlue px-4 py-2 font-semibold text-white",
              tapes === testCase.output && "text-lightGreen",
              tapes !== testCase.output && "text-lightDanger",
            )}
          >
            {tapes}
          </p>
          <p
            className={cn(
              "h-10 w-[calc(100%/3)] truncate rounded-md bg-darkenBlue px-4 py-2 font-semibold text-white",
              testCase.output && "text-lightGreen",
            )}
          >
            {testCase.output}
          </p>{" "}
        </>
      )}
    </li>
  );
}

function Question() {
  const [answers, setAnswers] = useState(null);

  const params = useParams();
  const questionId = params.id;

  const { simulatorInfo, getOne, setSimulatorInfo } = useQuestionSimulator();
  const data = getOne(questionId);

  if (!data) {
    return <NotFound />;
  }

  const question = data.question;

  const [showTests, setShowTests] = useState(false);
  const [showTestIcons, setShowTestIcons] = useState(false);
  const [showCasesMessage, setShowCasesMessage] = useState(false);
  const [tm, setTM] = useState(null);
  const [tapeInTheEnd, setTapeInTheEnd] = useState([]);

  const handleCheckAnswer = () => {
    setShowTestIcons(true);
    setShowCasesMessage(true);
    setShowTests(true);

    if (!tm) return;

    let testCases = question.testCases.map((testCase) => {
      tm.setComputedWord(testCase.input);
      let { accepted } = tm.fastForward();

      let aux = [];
      tm.branchs.forEach((branch) => {
        branch[1].forEach((tape) => {
          aux.push(tape.getTape().join(""));
        });
      });
      setTapeInTheEnd(aux);

      return accepted;
    });

    let hiddenTestCases = question.hiddenTestCases.map((testCase) => {
      tm.setComputedWord(testCase.input);
      let { accepted } = tm.fastForward();

      let aux = [];
      tm.branchs.forEach((branch) => {
        branch[1].forEach((tape) => {
          aux.push(tape.getTape().join(""));
        });
      });
      setTapeInTheEnd(aux);

      return accepted;
    });

    let testPassed = testCases.filter((answer, index) => answer === question.testCases[index].output);
    let hiddenTestPassed = hiddenTestCases.filter((answer, index) => answer === question.hiddenTestCases[index].output);

    const solved =
      testPassed.length + hiddenTestPassed.length === question.testCases.length + question.hiddenTestCases.length;

    if (solved) SuccessToast("Parabéns! Você resolveu esta questão!")();
    else ErrorToast("Ops! Parece que algo não está certo. Tente novamente!")();

    let backup = [...simulatorInfo];
    backup = backup.map((item) => {
      if (item.id === questionId) {
        let newItem = { ...item };
        newItem.question.solved = solved;

        return newItem;
      }

      return item;
    });

    setSimulatorInfo(backup);

    setAnswers({
      testCases,
      numTestCasesPassed: testPassed.length,
      hiddenTestCases,
      numHiddenTestCasesPassed: hiddenTestPassed.length,
    });
  };

  useEffect(() => {
    setTM(createTM({ data: data.data }));
  }, [data]);

  useEffect(() => {
    setShowTestIcons(false);
    setShowCasesMessage(false);
  }, [data.data]);

  return (
    <div className="flex w-full flex-col gap-4 rounded-md bg-main py-4 shadow-lg">
      <div className="flex w-full flex-col gap-2 rounded-md bg-main px-4 md:gap-4">
        <div className="flex w-full justify-between gap-6">
          <h2 className="text-xl font-bold text-white md:text-2xl">{question.title}</h2>
          <span
            className={cn(
              "text-md inline text-nowrap font-bold sm:text-lg",
              question.solved ? "text-lightGreen" : "text-lightDanger",
            )}
          >
            {question.solved ? "Resolvido" : "Não resolvido"}
          </span>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center gap-4">
            <p className="text-md font-semibold text-white">Descrição</p>
            <div
              className={cn(
                "truncate px-2 py-0.5 font-semibold",
                data.tm_variant === "tm" && "bg-secondaryBlue",
                data.tm_variant === "ndtm" && "bg-warning",
                data.tm_variant === "mttm" && "bg-purpleMedium text-white",
              )}
            >
              {data.tm_variant === "tm"
                ? "Determinística"
                : data.tm_variant === "ndtm"
                  ? "Não determinística"
                  : "Multifitas"}
            </div>
          </div>
          <p className="text-sm text-white">{question.description}</p>
          <ul className="w-full px-4 text-white">
            {question.descriptionItems.map((item, index) => (
              <li key={index} className="list-disc text-sm">
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
        <div className="flex w-full flex-col gap-2 px-4">
          <div className="flex w-full items-center justify-between gap-4">
            <p className="text-lg font-semibold text-white">Casos de teste</p>
            <p
              className={cn(
                "text-md font-semibold text-white",
                answers.numTestCasesPassed + answers.numHiddenTestCasesPassed ===
                  question.testCases.length + question.hiddenTestCases.length
                  ? "text-lightGreen"
                  : "text-lightDanger",

                !showCasesMessage && "hidden",
              )}
            >
              {answers &&
                `${answers.numTestCasesPassed + answers.numHiddenTestCasesPassed}/${question.testCases.length + question.hiddenTestCases.length} casos de teste`}
            </p>
          </div>
          <div className={cn("flex items-center justify-between gap-2", showTestIcons && "ml-10")}>
            <p
              className={cn(
                "text-left font-semibold text-darkVariant",
                question && question.testCases && typeof question.testCases[0].output !== "boolean"
                  ? "w-[calc(100%/3)]"
                  : "w-full",
              )}
            >
              Palavras
            </p>

            {question && question.testCases && typeof question.testCases[0].output !== "boolean" ? (
              <>
                <p className="w-[calc(100%/3)] text-left font-semibold text-darkVariant">Resultados</p>
                <p className="w-[calc(100%/3)] text-left font-semibold text-darkVariant">Resultados esperados</p>
              </>
            ) : null}
          </div>
          <ul className="flex w-full list-disc flex-col gap-2 text-white">
            {question.testCases.map((testCase, index) => (
              <TestCase
                key={index}
                testCase={testCase}
                answer={answers ? answers.testCases[index] : null}
                showTestIcons={showTestIcons}
                tapeInTheEnd={tapeInTheEnd}
              />
            ))}
          </ul>

          <div className="mt-2 flex w-full items-center justify-center gap-2 text-white">
            <Icon icon="material-symbols:lock-outline" className="icon h-5 w-5 text-white" />
            <p className="text-lg font-semibold">{question.hiddenTestCases.length} casos de teste ocultos</p>
          </div>
        </div>
      )}

      <div className="flex w-full items-center justify-center gap-2 px-4 sm:justify-end">
        <Button
          variant="default"
          className="bg-zinc-700 text-white"
          disabled={!showTests}
          onClick={() => setShowTests(false)}
        >
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
