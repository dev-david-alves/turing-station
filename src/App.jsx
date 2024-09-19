import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";

import Home from "./pages/home";
import HowToUse from "./pages/howToUse";
import Layout from "./pages/layout";
import NotFound from "./pages/not-found";
import ErrorPage from "./pages/error-page";
import { SimulatorProvider } from "./providers/simulator";

// Define routes using createBrowserRouter
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <SimulatorProvider>
          <Layout />
        </SimulatorProvider>
      ),
      errorElement: <ErrorPage />, // Use an error boundary for the layout
      children: [
        { index: true, element: <Home /> },
        { path: "/how-to-use", element: <HowToUse /> },
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
