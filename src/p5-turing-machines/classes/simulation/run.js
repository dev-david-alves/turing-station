import SelfLink from "../selfLink";
import { MTNDTM } from "./multitape-nondeterministic";
import tapeHead from "/assets/tape-head.svg";
import tapeBound from "/assets/tape-bound.svg";
import { cn } from "../../../utils/cn";

export const createMT = (p5) => {
  p5.mtCreated = null;

  let q = new Set(p5.states.map((state) => state.id));
  let sigma = new Set(); // I don't need this
  let gamma = new Set(); // I don't need this
  let startState = p5.startLink ? p5.startLink.state.id : null;
  let finalStates = new Set(p5.states.filter((state) => state.isFinalState).map((state) => state.id));

  if (startState === null) return { success: false, message: "Defina um estado inicial!", mt: null };

  // Create the delta
  let delta = {};

  p5.links.forEach((link) => {
    let from = null;
    let to = null;

    if (link instanceof SelfLink) {
      from = link.state.id;
      to = link.state.id;
    } else {
      from = link.stateA.id;
      to = link.stateB.id;
    }

    if (!delta[from]) delta[from] = {};

    let mappingMove = {
      E: -1,
      D: 1,
      P: 0,
    };

    link.transitionBox.rules.forEach((rule) => {
      let fullRule = [];
      rule.forEach((r) => {
        let ruleBreak = r.label.split("").filter((r) => r !== " " && r !== "→" && r !== ",");
        fullRule = fullRule.concat(ruleBreak);
      });

      let key = fullRule.map((r, i) => (i % 3 === 0 ? r : "")).join("");

      if (!delta[from][key]) delta[from][key] = [];

      let actions = [];
      for (let i = 0; i < fullRule.length; i += 3) {
        actions.push({ write: fullRule[i + 1], move: mappingMove[fullRule[i + 2]] });
      }

      delta[from][key].push({ to, actions });
    });
  });

  const mt = new MTNDTM(q, sigma, gamma, delta, startState, finalStates, p5.tm_num_tapes);

  let inputValue = p5.select(`#simulation-input-${p5.canvasID}`).value();
  mt.setComputedWord(inputValue);

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
    p5.mtCreated.setComputedWord(inputValue);
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
  p5.mtCreated.setComputedWord(inputWord);

  const { accepted, end } = p5.mtCreated.fastForward();

  updateTape(p5);
  updateUIWhenSimulating(p5, accepted, end, true);
};

const convertStateLabelToHtml = (allSubstrings) => {
  let html = "";

  allSubstrings.forEach((substring) => {
    if (substring.startsWith("_{") && substring.endsWith("}")) {
      html += "<sub>";
      html += substring.slice(2, substring.length - 1);
      html += "</sub>";
    } else if (substring.startsWith("^{") && substring.endsWith("}")) {
      html += "<sup>";
      html += substring.slice(2, substring.length - 1);
      html += "</sup>";
    } else if (substring.startsWith("_") && substring.length === 2) {
      html += "<sub>";
      html += substring[1];
      html += "</sub>";
    } else if (substring.startsWith("^") && substring.length === 2) {
      html += "<sup>";
      html += substring[1];
      html += "</sup>";
    } else {
      html += substring;
    }
  });

  return html;
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
    p5.mtCreated.setComputedWord(inputValue);
  }

  // Draw the tape
  tapeDiv.show();

  for (const branch of p5.mtCreated.branchs) {
    const branchRejection = branch[2];
    let tapeContainer = p5.createDiv("");
    let conditionToBorder = p5.mtCreated.branchs.length > 1 && p5.tm_variant === "mttm";
    tapeContainer.class(
      cn(
        "tape-container-class flex items-center justify-center w-full gap-1 rounded-md mb-2",
        conditionToBorder && "border border-white",
      ),
    );
    tapeContainer.parent(tapeDiv);

    const realState = p5.states.find((state) => state.id === branch[0]);
    let stateDiv = p5.createDiv(convertStateLabelToHtml(realState.input.allSubstrings));
    stateDiv.class(`tape-state tape-state-${p5.canvasID}`);
    stateDiv.parent(tapeContainer);

    let multitapeWrapper = p5.createDiv("");
    multitapeWrapper.parent(tapeContainer);
    multitapeWrapper.class(
      `w-full flex flex-col px-2 pt-2 gap-1 rounded-md tape-wrapper-${p5.canvasID} branchRejection-${branchRejection}`,
    );

    let allTapes = branch[1];

    allTapes.forEach((tape, index) => {
      let tapeWrapper = p5.createDiv("");
      tapeWrapper.class(`flex w-full overflow-x-auto h-12`);
      tapeWrapper.parent(multitapeWrapper);

      let tapeBoundsImage = p5.createImg(tapeBound, "tape-bound-image");
      tapeBoundsImage.class("h-7");
      tapeBoundsImage.parent(tapeWrapper);

      const oneTape = tape.getTape();
      for (let i = 0; i < oneTape.length; i++) {
        let cell = oneTape[i];
        let tapeCell = p5.createDiv("");
        tapeCell.class(
          "relative min-w-7 min-h-7 w-7 h-7 bg-white border-x-[.05rem] border-[--color-white] text-[1.4rem] font-semibold text-[dark-white] flex items-center justify-center",
        );
        tapeCell.parent(tapeWrapper);
        let span = p5.createElement("span", cell);
        span.parent(tapeCell);
        span.class("text-sm font-semibold text-[dark-white]");

        // Tape head
        if (i === tape.head) {
          let headContainer = p5.createDiv();
          let headImage = p5.createImg(tapeHead, "tape-head-image");
          headImage.parent(headContainer);
          headContainer.class("absolute -bottom-[.8rem]");
          headContainer.parent(tapeCell);
        }
      }

      let tapeBoundsImage2 = p5.createImg(tapeBound, "tape-bound-image");
      tapeBoundsImage2.class("h-7 rotate-180 mt-[.01rem]");
      tapeBoundsImage2.parent(tapeWrapper);
    });
  }
};

export const updateUIWhenSimulating = (p5, accepted, end, labOpened = false) => {
  if (!p5.mtCreated) return;
  if (!labOpened) return;

  p5.states.forEach((state) => {
    state.simulating = "none";
    p5.mtCreated.branchs.forEach((branch) => {
      if (branch[0] === state.id) {
        if (branch[2] || (!accepted && end)) {
          state.simulating = "rejected";
        } else if (p5.mtCreated.finalStates.has(state.id)) {
          state.simulating = "accepted";
        } else {
          state.simulating = "simulating";
        }
      }
    });
  });

  // Enable/Disable simulation buttons
  let fastReset = p5.select(`#simulation-fast-reset-${p5.canvasID}`);
  let stepBack = p5.select(`#simulation-step-back-${p5.canvasID}`);
  let stepForward = p5.select(`#simulation-step-forward-${p5.canvasID}`);
  let fastSimulation = p5.select(`#simulation-fast-simulation-${p5.canvasID}`);

  if (!fastReset || !stepBack || !stepForward || !fastSimulation) return;

  fastReset.attribute("disabled", true);
  stepBack.attribute("disabled", true);
  stepForward.attribute("disabled", true);
  fastSimulation.attribute("disabled", true);
  if (!p5.mtCreated) return;

  if (p5.mtCreated.history.length > 0) {
    fastReset.removeAttribute("disabled");
    stepBack.removeAttribute("disabled");
  }

  let tapeWrappers = p5.selectAll(`.tape-wrapper-${p5.canvasID}`);
  let tapeStates = p5.selectAll(`.tape-state-${p5.canvasID}`);

  if (!tapeWrappers) return;

  tapeWrappers.forEach((tapeWrapper, index) => {
    tapeStates[index].removeClass("bg-purpleMedium");
    tapeStates[index].removeClass("bg-danger");
    tapeStates[index].removeClass("bg-lightGreen");
    tapeWrapper.removeClass("bg-lightGreen");
    tapeWrapper.removeClass("bg-danger");

    if (tapeWrapper.hasClass(`branchRejection-true`)) {
      tapeWrapper.addClass("bg-danger");
      tapeStates[index].addClass("bg-danger");

      let isAllRejected = tapeWrappers.every((tw) => tw.hasClass("branchRejection-true"));
      if (!isAllRejected) {
        let parent = tapeWrapper.parent();
        parent.classList.add("hide");
        setTimeout(() => {
          parent.remove();
        }, 1300);
      }
    } else if (end) {
      if (accepted) {
        tapeWrapper.addClass("bg-lightGreen");
        tapeStates[index].addClass("bg-lightGreen");
      } else {
        tapeWrapper.addClass("bg-danger");
        tapeStates[index].addClass("bg-danger");
      }
    } else {
      tapeStates[index].addClass("bg-purpleMedium");
      stepForward.removeAttribute("disabled");
      fastSimulation.removeAttribute("disabled");
    }
  });
};
