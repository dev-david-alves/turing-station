import { cn } from "../utils/cn";
import { Outlet } from "react-router";
import { QuestionSimulatorProvider } from "../providers/question";

function KnowledgeTest() {
  return (
    <div className={cn("flex min-h-full w-full flex-grow flex-col gap-4 px-4 sm:px-8")}>
      <div className="flex w-full items-center px-4 sm:px-0">
        <h1 className="text-center text-3xl font-bold text-white">Teste de conhecimento</h1>
      </div>
      <QuestionSimulatorProvider>
        <Outlet />
      </QuestionSimulatorProvider>
    </div>
  );
}

export default KnowledgeTest;
