import { useRouteError } from "react-router-dom";

function NotFound() {
  return (
    <div id="not-found-page">
      <h1>Oops!</h1>
      <p>Não conseguimos encontrar a página que você está procurando.</p>
    </div>
  );
}

export default NotFound;
