import UnderConstruction from "/assets/under-construction.svg";

function howToUse() {
  return (
    <div className="flex min-h-full w-full flex-grow flex-col items-center justify-center gap-6">
      <p className="text-center text-lg font-semibold text-darkVariant sm:text-2xl">
        Página em construção, volte mais tarde!
      </p>
      <img src={UnderConstruction} alt="Under Construction" className="w-1/2 min-w-40 max-w-96" />
    </div>
  );
}

export default howToUse;
