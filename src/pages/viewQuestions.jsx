import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { useQuestionSimulator } from "../providers/question";
import { useSearchParams } from "react-router-dom";
import NoData from "/assets/no-data.svg";

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

  const [searchParams] = useSearchParams();
  const [finalData, setFinalData] = useState([]);

  useEffect(() => {
    const filterBy = searchParams.get("filterBy") || "all";

    let data = [...simulatorInfo];
    if (simulatorInfo.length > 0) {
      if (filterBy !== "all") {
        if (filterBy === "tm" || filterBy === "ndtm" || filterBy === "mttm") {
          data = data.filter((item) => item.tm_variant === filterBy);
        } else if (filterBy === "solved") {
          data = data.filter((item) => item.question.solved);
        } else if (filterBy === "unsolved") {
          data = data.filter((item) => !item.question.solved);
        }
      }
    }

    setFinalData(data);
  }, [searchParams, simulatorInfo]);

  return (
    <>
      {finalData.length > 0 ? (
        <>
          {finalData.map((item, index) => (
            <QuestionSection key={index} currentQuestion={index + 1} question={item.question} questionId={item.id} />
          ))}
        </>
      ) : (
        <div className="flex min-h-full w-full flex-grow flex-col items-center justify-center gap-6">
          <p className="text-center text-lg font-semibold text-darkVariant sm:text-2xl">
            Oops, não conseguimos encontrar questões com os filtros aplicados!
          </p>
          <img src={NoData} alt="No Data" className="w-1/2 min-w-40 max-w-96" />
        </div>
      )}
    </>
  );
}

export default ViewQuestion;
