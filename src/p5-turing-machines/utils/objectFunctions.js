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
      obj1.states[i].isFinalState !== obj2.states[i].isFinalState ||
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

  p5.states.forEach((state) => {
    dmt.states.push({
      id: state.id,
      x: state.x / p5.canvasScale,
      y: state.y / p5.canvasScale,
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
        rules: link.transitionBox.rules,
        parallelPart: link.parallelPart,
        perpendicularPart: link.perpendicularPart,
        lineAngleAdjust: link.lineAngleAdjust,
      });
    } else if (link instanceof SelfLink) {
      dmt.links.push({
        isSelfLink: true,
        state: link.state.id,
        rules: link.transitionBox.rules,
        anchorAngle: link.anchorAngle,
      });
    }
  });

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
