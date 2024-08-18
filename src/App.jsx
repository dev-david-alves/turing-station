import { ReactP5Wrapper } from "@p5-wrapper/react";
import { sketch } from "./machine";

export default function App() {
  return (
    <main className="w-full h-screen flex items-center gap-10">
      <ReactP5Wrapper sketch={sketch} />;
      <ReactP5Wrapper sketch={sketch} />;
    </main>
  );
}
