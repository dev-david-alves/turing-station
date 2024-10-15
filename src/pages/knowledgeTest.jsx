import { cn } from "../utils/cn";
import { Outlet, useNavigate, useParams } from "react-router";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "../components/Button";
import { QuestionSimulatorProvider } from "../providers/question";
import Filters from "../components/filters/questionFilters";

function KnowledgeTest() {
  // If page is different from index, you can use useParams to get the id
  const { id: questionId } = useParams();
  const navigate = useNavigate();

  return (
    <div className={cn("flex min-h-full w-full flex-grow flex-col gap-4 px-4 sm:px-8")}>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-left text-2xl font-bold text-white sm:text-3xl">Teste de conhecimento</h1>
          {questionId && (
            <Button
              className="items-center gap-1 bg-zinc-700 text-sm text-white"
              onClick={() => navigate(`/teste-de-conhecimento/?filterBy=all`)}
            >
              <Icon icon="humbleicons:arrow-go-back" className="icon h-5 w-5 text-white" /> Voltar
            </Button>
          )}
        </div>
        {!questionId && <Filters />}
      </div>

      <QuestionSimulatorProvider>
        <Outlet />
      </QuestionSimulatorProvider>
    </div>
  );
}

export default KnowledgeTest;
