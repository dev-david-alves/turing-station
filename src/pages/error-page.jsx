import { Link } from "react-router-dom";
import Error from "/assets/error.svg";
import { Icon } from "@iconify/react/dist/iconify.js";

function ErrorPage() {
  return (
    <div className="dark-mode-variables flex min-h-screen w-full flex-grow flex-col items-center justify-center gap-6 bg-background">
      <p className="text-center text-lg font-semibold text-darkVariant sm:text-2xl">Oops, algo deu errado!</p>
      <img src={Error} alt="Something went wrong." className="w-1/2 min-w-40 max-w-96" />
      <Link
        to="/"
        className="group flex items-center justify-center gap-2 rounded-lg border-2 border-darkVariant px-4 py-2 text-center text-lg font-semibold text-darkVariant transition-colors hover:bg-darkVariant hover:text-background"
      >
        <Icon icon="icon-park-solid:back" className="h-4 w-4 text-darkVariant group-hover:text-background" />
        Atualizar e voltar para a página inicial
      </Link>
    </div>
  );
}

export default ErrorPage;
