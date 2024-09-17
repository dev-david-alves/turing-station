import State from "../classes/state";
import Link from "../classes/link";
import SelfLink from "../classes/selfLink";

export const compareJSONObjects = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const createJSONExportObj = (p5) => {
  let dmt = {
    name: p5.tm_name,
    canvasScale: p5.canvasScale,
    variant: p5.tm_variant,
    numTapes: p5.tm_num_tapes,
    states: [],
    links: [],
    initialStateLink: null,
  };

  p5.states.forEach((state) => {
    dmt.states.push({
      id: state.id,
      x: state.x / state.previusScale,
      y: state.y / state.previusScale,
      isStartState: state.isStartState,
      isFinalState: state.isFinalState,
      label: state.input.allSubstrings.join(""),
    });
  });

  p5.links.forEach((link) => {
    if (link instanceof Link) {
      dmt.links.push({
        isSelfLink: false,
        stateA: link.stateA.id,
        stateB: link.stateB.id,
        rules: link.transitionBox.getFormattedRules(),
        parallelPart: link.parallelPart / link.previusScale,
        perpendicularPart: link.perpendicularPart / link.previusScale,
        lineAngleAdjust: link.lineAngleAdjust / link.previusScale,
      });
    } else if (link instanceof SelfLink) {
      dmt.links.push({
        isSelfLink: true,
        state: link.state.id,
        rules: link.transitionBox.getFormattedRules(),
        anchorAngle: link.anchorAngle,
      });
    }
  });

  if (p5.startLink) {
    dmt.initialStateLink = {
      state: p5.startLink.state.id,
      deltaX: p5.startLink.deltaX / p5.startLink.previusScale,
      deltaY: p5.startLink.deltaY / p5.startLink.previusScale,
    };
  }

  return dmt;
};

export const createCanvasFromOBJ = (p5, obj) => {
  p5.tm_name = obj.name;
  p5.canvasScale = obj.canvasScale;
  p5.tm_variant = obj.variant;
  p5.tm_num_tapes = obj.numTapes;
  p5.states = [];
  p5.links = [];
  p5.startLink = null;

  obj.states.forEach((state) => {
    let newX = state.x * p5.canvasScale;
    let newY = state.y * p5.canvasScale;

    let newState = new State(p5, state.id, newX, newY);
    newState.isStartState = state.isStartState;
    newState.isFinalState = state.isFinalState;
    newState.input.input.value(state.label);
    newState.input.textInput(state.label);
    p5.states.push(newState);
  });

  obj.links.forEach((link) => {
    if (link.isSelfLink) {
      if (!link.hasOwnProperty("state")) return false;
      if (!Number.isInteger(link.state)) return false;

      let state = p5.states.find((state) => state.id === link.state);
      p5.links.push(new SelfLink(p5, state, true, link.rules, link.anchorAngle));
    } else {
      if (!link.hasOwnProperty("stateA") || !link.hasOwnProperty("stateB")) return false;
      if (!Number.isInteger(link.stateA) || !Number.isInteger(link.stateB)) return false;

      let stateA = p5.states.find((state) => state.id === link.stateA);
      let stateB = p5.states.find((state) => state.id === link.stateB);

      let newParallelPart = link.parallelPart * p5.canvasScale;
      let newPerpendicularPart = link.perpendicularPart * p5.canvasScale;
      let newLineAngleAdjust = link.lineAngleAdjust * p5.canvasScale;

      p5.links.push(
        new Link(p5, stateA, stateB, link.rules, newParallelPart, newPerpendicularPart, newLineAngleAdjust),
      );
    }
  });

  if (obj.initialStateLink) {
    p5.setInitialState(obj.initialStateLink.state, {
      deltaX: obj.initialStateLink.deltaX * p5.canvasScale,
      deltaY: obj.initialStateLink.deltaY * p5.canvasScale,
    });

    if (p5.startLink) p5.startLink.selected = false;
  }

  return true;
};
