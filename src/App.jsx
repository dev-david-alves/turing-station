import { ReactP5Wrapper } from "@p5-wrapper/react";
import { sketch } from "./p5-turing-machines";

export default function App() {
  return (
    <main className="dark-mode-variables flex flex-col items-center justify-center bg-[var(--color-background)] px-[5px]">
      <h1 id="title" className="font-black] mb-[1rem] text-[4rem] text-[--color-primary]">
        Turing Station
      </h1>
      <ReactP5Wrapper sketch={sketch} />
    </main>
  );
}
