import React from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { useQuestionSimulator } from "../providers/question";

const QuestionSection = ({ currentQuestion, question, questionId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full flex-col gap-2 rounded-md bg-main p-4 shadow-lg md:gap-4">
      <h2 className="text-xl font-bold text-white md:text-2xl">
        {currentQuestion}. {question.title}
      </h2>
      <div className="flex w-full flex-col gap-2">
        <p className="text-md font-semibold text-white">Descrição</p>
        <p className="text-sm text-white">{question.description}</p>
        <ul className="w-full px-4 text-white">
          {question.descriptionItems.map((item, index) => (
            <li key={index} className="list-disc text-sm">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex w-full items-center justify-end gap-2">
        <div className="flex w-full items-center justify-end">
          <Button
            variant={!question.solved ? "darkGreen" : "default"}
            className="min-w-28 text-white"
            onClick={() => navigate(`/teste-de-conhecimento/${questionId}`)}
          >
            {question.solved ? "Resolver novamente" : "Resolver"}
          </Button>
        </div>
      </div>
    </div>
  );
};

function ViewQuestion() {
  const { simulatorInfo } = useQuestionSimulator();

  return (
    <>
      {simulatorInfo.map((item, index) => (
        <QuestionSection key={index} currentQuestion={index + 1} question={item.question} questionId={item.id} />
      ))}
    </>
  );
}

export default ViewQuestion;
