import State from "../classes/state";
import Link from "../classes/link";
import SelfLink from "../classes/selfLink";

export const compareJSONObjects = (obj1, obj2) => {
  if (obj1.canvasScale !== obj2.canvasScale) return false;
  if (obj1.states.length !== obj2.states.length || obj1.links.length !== obj2.links.length) return false;

  for (let i = 0; i < obj1.states.length; i++) {
    if (
      obj1.states[i].id !== obj2.states[i].id ||
      obj1.states[i].x !== obj2.states[i].x ||
      obj1.states[i].y !== obj2.states[i].y ||
      obj1.states[i].isStartState !== obj2.states[i].isStartState ||
      obj1.states[i].isEndState !== obj2.states[i].isEndState ||
      obj1.states[i].label !== obj2.states[i].label
    )
      return false;
  }

  for (let i = 0; i < obj1.links.length; i++) {
    if (obj1.links[i].isSelfLink !== obj2.links[i].isSelfLink) return false;

    if (!obj1.links[i].isSelfLink) {
      if (obj1.links[i].rules.length !== obj2.links[i].rules.length) return false;

      let comparedRules = obj1.links[i].rules.every(
        (rule, index) => JSON.stringify(rule.label) === JSON.stringify(obj2.links[i].rules[index].label),
      );

      if (
        obj1.links[i].stateA !== obj2.links[i].stateA ||
        obj1.links[i].stateB !== obj2.links[i].stateB ||
        !comparedRules
      )
        return false;

      if (obj1.links[i].hasCircle !== obj2.links[i].hasCircle) return false;

      if (obj1.links[i].hasCircle) {
        if (
          obj1.links[i].startX !== obj2.links[i].startX ||
          obj1.links[i].startY !== obj2.links[i].startY ||
          obj1.links[i].endX !== obj2.links[i].endX ||
          obj1.links[i].endY !== obj2.links[i].endY ||
          obj1.links[i].circleX !== obj2.links[i].circleX ||
          obj1.links[i].circleY !== obj2.links[i].circleY ||
          obj1.links[i].circleR !== obj2.links[i].circleR ||
          obj1.links[i].startAngle !== obj2.links[i].startAngle ||
          obj1.links[i].endAngle !== obj2.links[i].endAngle
        )
          return false;
      } else {
        if (
          obj1.links[i].startX !== obj2.links[i].startX ||
          obj1.links[i].startY !== obj2.links[i].startY ||
          obj1.links[i].endX !== obj2.links[i].endX ||
          obj1.links[i].endY !== obj2.links[i].endY
        )
          return false;
      }
    } else {
      if (obj1.links[i].rules.length !== obj2.links[i].rules.length) return false;

      let comparedRules = obj1.links[i].rules.every(
        (rule, index) => JSON.stringify(rule.label) === JSON.stringify(obj2.links[i].rules[index].label),
      );

      if (
        obj1.links[i].state !== obj2.links[i].state ||
        !comparedRules ||
        obj1.links[i].anchorAngle !== obj2.links[i].anchorAngle
      )
        return false;
    }
  }

  if ((obj1.initialStateLink && !obj2.initialStateLink) || (!obj1.initialStateLink && obj2.initialStateLink))
    return false;

  if (obj1.initialStateLink) {
    if (
      obj1.initialStateLink.state !== obj2.initialStateLink.state ||
      obj1.initialStateLink.deltaX !== obj2.initialStateLink.deltaX ||
      obj1.initialStateLink.deltaY !== obj2.initialStateLink.deltaY
    )
      return false;
  }

  return true;
};

export const createJSONExportObj = (p5) => {
  let dmt = {
    canvasScale: p5.canvasScale,
    states: [],
    links: [],
    initialStateLink: null,
  };

  for (let i = 0; i < p5.states.length; i++) {
    dmt.states.push({
      id: p5.states[i].id,
      x: p5.states[i].x / p5.canvasScale,
      y: p5.states[i].y / p5.canvasScale,
      isStartState: p5.states[i].isStartState,
      isEndState: p5.states[i].isEndState,
      // label: p5.states[i].input.input.value(),
    });
  }

  for (let i = 0; i < p5.links.length; i++) {
    if (p5.links[i] instanceof Link) {
      dmt.links.push({
        isSelfLink: false,
        stateA: p5.links[i].stateA.id,
        stateB: p5.links[i].stateB.id,
        rules: p5.links[i].transitionBox.rules,
        parallelPart: p5.links[i].parallelPart,
        perpendicularPart: p5.links[i].perpendicularPart,
        lineAngleAdjust: p5.links[i].lineAngleAdjust,
      });
    } else if (p5.links[i] instanceof SelfLink) {
      dmt.links.push({
        isSelfLink: true,
        state: p5.links[i].state.id,
        rules: p5.links[i].transitionBox.rules,
        anchorAngle: p5.links[i].anchorAngle,
      });
    }
  }

  if (p5.startLink) {
    dmt.initialStateLink = {
      state: p5.startLink.state.id,
      deltaX: p5.startLink.deltaX,
      deltaY: p5.startLink.deltaY,
    };
  }

  return dmt;
};

export const createCanvasFromOBJ = (p5, obj) => {
  p5.canvasScale = obj.canvasScale;
  p5.states = [];
  p5.links = [];
  p5.startLink = null;

  obj.states.forEach((state) => {
    let newState = new State(p5, state.id, state.x, state.y);
    newState.isStartState = state.isStartState;
    newState.isEndState = state.isEndState;
    // state.input.input.value(state.label);
    // state.input.textInput(state.label);
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
      p5.links.push(
        new Link(p5, stateA, stateB, link.rules, link.parallelPart, link.perpendicularPart, link.lineAngleAdjust),
      );
    }
  });

  if (obj.initialStateLink) {
    p5.setInitialState(obj.initialStateLink.state, {
      deltaX: obj.initialStateLink.deltaX,
      deltaY: obj.initialStateLink.deltaY,
    });
    p5.startLink.selected = false;
  }

  return true;
};
