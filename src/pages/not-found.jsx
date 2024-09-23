import NotFound404 from "/assets/not-found404.svg";

function NotFound() {
  return (
    <div className="flex min-h-full w-full flex-grow flex-col items-center justify-center gap-6">
      <p className="text-center text-lg font-semibold text-darkVariant sm:text-2xl">
        Oops, não conseguimos encontrar a página que você está procurando!
      </p>
      <img src={NotFound404} alt="Not Found" className="w-1/2 min-w-40 max-w-96" />
    </div>
  );
}

export default NotFound;
