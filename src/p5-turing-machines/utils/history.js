import { createJSONExportObj, compareJSONObjects } from "./objectFunctions";

export const createHistory = (p5) => {
  let { isEqual, currentState } = compareStatesOfHistory(p5);

  if (!isEqual) {
    // Remove all p5.history after current index
    p5.history = p5.history.slice(0, p5.currentHistoryIndex + 1);

    // Check if p5.history is full
    if (p5.history.length >= p5.maxHistory) {
      p5.history.shift();
      p5.currentHistoryIndex--;
    }

    p5.history.push(currentState);
    p5.currentHistoryIndex++;
  }
};

export const compareStatesOfHistory = (p5, index = -1) => {
  let realIndex = index === -1 ? p5.currentHistoryIndex : index;
  let currentState = structuredClone(createJSONExportObj(p5));
  let stateOnIndex = structuredClone(p5.history[realIndex]);

  return {
    isEqual: compareJSONObjects(currentState, stateOnIndex),
    currentState: currentState,
  };
};
