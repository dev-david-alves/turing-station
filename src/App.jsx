import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";

import Layout from "./pages/layout";
import Home from "./pages/home";
import HowToUse from "./pages/howToUse";
import LearnAboutTM from "./pages/learnAboutTM";
import KnowledgeTest from "./pages/KnowledgeTest";
import NotFound from "./pages/not-found";
import ErrorPage from "./pages/error-page";
import Question from "./pages/question";
import ViewQuestions from "./pages/viewQuestions";

// Define routes using createBrowserRouter
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />, // Use an error boundary for the layout
      children: [
        { index: true, element: <Home /> },
        { path: "/como-utilizar", element: <HowToUse /> },
        // { path: "/aprenda-sobre-mts", element: <LearnAboutTM /> },
        {
          path: "/teste-de-conhecimento",
          element: <KnowledgeTest />,
          children: [
            {
              index: true,
              element: <ViewQuestions />,
            },
            {
              path: ":id",
              element: <Question />,
            },
          ],
        },
        { path: "*", element: <NotFound /> }, // Catch-all route
      ],
    },
  ],
  {
    basename: "/turing-station",
  },
);

export default function App() {
  return <RouterProvider router={router} />;
}
