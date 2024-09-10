import { texMap } from "../../utils/getTexMaps";
import SelfLink from "../selfLink";
import { MT } from "./mt";

export const createMT = (p5) => {
  p5.mtCreated = null;

  let q = new Set(p5.states.map((state) => state.id));
  let sigma = new Set(); // I don't need this
  let gamma = new Set();
  let startState = p5.startLink ? p5.startLink.state.id : null;
  let finalStates = new Set(p5.states.filter((state) => state.isFinalState).map((state) => state.id));

  if (startState === null) return { success: false, message: "Defina um estado inicial!", mt: null };

  // Break the rules into read, write, direction
  p5.links.forEach((link) => {
    link.transitionBox.rules.forEach((rule) => {
      let ruleBreak = rule.label.filter((r) => r !== " " && r !== "→" && r !== ", ");
      gamma.add(ruleBreak[0]);
      gamma.add(ruleBreak[1]);
    });
  });

  // Create the delta
  let delta = {};

  p5.links.forEach((link) => {
    let stateA = null;
    let stateB = null;

    if (link instanceof SelfLink) {
      stateA = link.state.id;
      stateB = link.state.id;
    } else {
      stateA = link.stateA.id;
      stateB = link.stateB.id;
    }

    if (!delta[stateA]) delta[stateA] = {};

    link.transitionBox.rules.forEach((rule) => {
      let ruleBreak = rule.label.filter((r) => r !== " " && r !== "→" && r !== ", ");

      if (!delta[stateA][ruleBreak[0]]) delta[stateA][ruleBreak[0]] = {};

      let mappingMove = {
        E: -1,
        D: 1,
        P: 0,
      };
      delta[stateA][ruleBreak[0]] = {
        write: ruleBreak[1],
        move: mappingMove[ruleBreak[2]],
        nextState: stateB,
      };
    });
  });

  // console.log("Q: ", q);
  // console.log("Gamma: ", gamma);
  // console.log("Delta: ", delta);
  // console.log("Start State: ", startState);
  // console.log("Final States: ", finalStates);

  const mt = new MT(q, sigma, gamma, delta, startState, finalStates);
  if (!mt.checkValidMTFormat()) return { success: false, message: "Máquina de Turing inválida!", mt: null };

  let inputValue = p5.select(`#simulation-input-${p5.canvasID}`).value();
  mt.simulatedWord = inputValue;
  mt.tape = inputValue.length > 0 ? inputValue.split("") : [texMap["\\blank"]];

  return {
    success: true,
    message: "Máquina de Turing criada com sucesso!",
    mt: mt,
  };
};

export const simulationReset = (p5) => {
  if (!p5.mtCreated) return;
  p5.mtCreated = null;
  updateTape(p5);
  updateUIWhenSimulating(p5, false, false, true);
};

export const simulationStepBack = (p5) => {
  if (!p5.mtCreated) return;
  p5.mtCreated.stepBack();

  updateTape(p5);
  updateUIWhenSimulating(p5, false, false, true);
};

export const simulationStepForward = (p5) => {
  if (!p5.mtCreated) {
    const { success, mt } = createMT(p5);

    if (!success) return;

    p5.mtCreated = mt;

    let inputValue = p5.select(`#simulation-input-${p5.canvasID}`).value();
    p5.mtCreated.simulatedWord = inputValue;
    p5.mtCreated.tape = inputValue.length > 0 ? inputValue.split("") : [texMap["\\blank"]];
  }

  const { accepted, end } = p5.mtCreated.stepForward();

  updateTape(p5);
  updateUIWhenSimulating(p5, accepted, end, true);
};

export const simulationFastResult = (p5) => {
  const { success, mt } = createMT(p5);

  if (!success) return;
  p5.mtCreated = mt;

  let inputWord = p5.select(`#simulation-input-${p5.canvasID}`).value();

  const { accepted, end } = p5.mtCreated.fastResult(inputWord, 1000);

  updateTape(p5);
  updateUIWhenSimulating(p5, accepted, end, true);
};

// UI Update

export const updateTape = (p5) => {
  let tapeDiv = p5.select(`#tape-container-${p5.canvasID}`);
  if (!tapeDiv) return;

  tapeDiv.html("");
  tapeDiv.hide();

  if (!p5.mtCreated) {
    const { success, mt } = createMT(p5);
    if (!success) return;

    p5.mtCreated = mt;
    let inputValue = p5.select(`#simulation-input-${p5.canvasID}`).value();
    p5.mtCreated.simulatedWord = inputValue;
    p5.mtCreated.tape = inputValue.length > 0 ? inputValue.split("") : [texMap["\\blank"]];
  }

  if (p5.mtCreated.tape.length === 0) return;

  // Draw the tape
  tapeDiv.show();
  let tapeWrapper = p5.createDiv("");
  tapeWrapper.class("flex items-center justify-center px-2 py-1");
  tapeWrapper.parent(tapeDiv);

  let tapeBoundsImage = p5.createImg("./assets/tape-bounds.svg", "tape-bounds-image");
  tapeBoundsImage.class("h-7");
  tapeBoundsImage.parent(tapeWrapper);

  for (let i = 0; i < p5.mtCreated.tape.length; i++) {
    let tapeCell = p5.createDiv("");
    tapeCell.class(
      "relative w-7 h-7 bg-white border-x-[.05rem] border-[--color-white] text-[1.4rem] font-semibold text-[dark-white] flex items-center justify-center",
    );
    tapeCell.parent(tapeWrapper);
    let span = p5.createElement("span", p5.mtCreated.tape[i]);
    span.parent(tapeCell);
    span.class("text-sm font-semibold text-[dark-white]");

    // Tape head
    if (i === p5.mtCreated.head) {
      let tapeHead = p5.createDiv("<img src='./assets/tape-head.svg' class='w-[2rem] h-[2rem]'>");
      tapeHead.class("absolute -bottom-[1.2rem]");
      tapeHead.parent(tapeCell);
    }
  }

  let tapeBoundsImage2 = p5.createImg("./assets/tape-bounds.svg", "tape-bounds-image");
  tapeBoundsImage2.class("h-7 rotate-180 mt-[.01rem]");
  tapeBoundsImage2.parent(tapeWrapper);
};

export const updateUIWhenSimulating = (p5, accepted, end, labOpened = false) => {
  if (!p5.mtCreated) return;

  p5.states.forEach((state) => {
    state.simulating = false;
    if (state.id === p5.mtCreated.currentState && labOpened) state.simulating = true;
  });

  // Enable/Disable simulation buttons
  let fastReset = p5.select(`#simulation-fast-reset-${p5.canvasID}`);
  let stepBack = p5.select(`#simulation-step-back-${p5.canvasID}`);
  let stepForward = p5.select(`#simulation-step-forward-${p5.canvasID}`);
  let fastSimulation = p5.select(`#simulation-fast-simulation-${p5.canvasID}`);

  if (!fastReset || !stepBack || !stepForward || !fastSimulation) return;

  fastReset.removeAttribute("disabled");
  stepBack.removeAttribute("disabled");
  stepForward.removeAttribute("disabled");
  fastSimulation.removeAttribute("disabled");

  if (!p5.mtCreated) {
    fastReset.attribute("disabled", true);
    stepBack.attribute("disabled", true);
    stepForward.attribute("disabled", true);
    fastSimulation.attribute("disabled", true);

    return;
  }

  if (accepted && end) {
    let tapeDiv = p5.select(`#tape-container-${p5.canvasID}`);
    tapeDiv.show();
    tapeDiv.removeClass("bg-[#ff0000]");
    tapeDiv.addClass("bg-[#6cfe6c]");
    tapeDiv.addClass("filter-[blur(1rem)]");

    stepBack.removeAttribute("disabled");
    fastReset.removeAttribute("disabled");
    stepForward.attribute("disabled", true);
    fastSimulation.attribute("disabled", true);
  } else if (!accepted && end) {
    let tapeDiv = p5.select(`#tape-container-${p5.canvasID}`);
    tapeDiv.show();
    tapeDiv.removeClass("bg-[#6cfe6c]");
    tapeDiv.addClass("bg-[#ff0000]");

    stepBack.removeAttribute("disabled");
    fastReset.removeAttribute("disabled");
    stepForward.attribute("disabled", true);
    fastSimulation.attribute("disabled", true);
  } else {
    let tapeDiv = p5.select(`#tape-container-${p5.canvasID}`);
    tapeDiv.show();
    tapeDiv.removeClass("bg-[#ff0000]");
    tapeDiv.removeClass("bg-[#6cfe6c]");

    if (p5.mtCreated.history.length === 0) {
      fastReset.attribute("disabled", true);
      stepBack.attribute("disabled", true);
    } else {
      fastReset.removeAttribute("disabled");
      stepBack.removeAttribute("disabled");
    }
  }
};
