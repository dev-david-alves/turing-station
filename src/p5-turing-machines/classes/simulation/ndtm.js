import { texMap } from "../../utils/getTexMaps.js";

export const BLANK = texMap["\\Blank"];
export const LEFT = -1;
export const RIGHT = 1;
export const STAY = 0;

class Tape {
  constructor(tape) {
    this.content = tape;
    this.head = 0;
  }

  setHead(index) {
    this.head = index;
  }

  getHead() {
    return this.head;
  }

  setTape(content) {
    this.content = content;
  }

  getTape() {
    return this.content;
  }

  setSymbol(symbol) {
    this.content[this.head] = symbol;
  }

  getSymbol() {
    return this.content[this.head];
  }

  move(direction) {
    this.head += direction;
    if (this.head < 0) {
      this.content.unshift(BLANK);
      this.head = 0;
    } else if (this.head >= this.content.length) {
      this.content.push(BLANK);
    }
  }
}

// Non Deterministic Turing Machine
export class NDTM {
  constructor(
    Q = new set(),
    sigma = new set(),
    gamma = new set(),
    delta = {},
    initialState = null,
    finalStates = new set(),
  ) {
    this.Q = Q; // Set of states
    this.sigma = sigma; // Input alphabet
    this.gamma = gamma; // Tape alphabet
    this.delta = delta; // Transition function
    this.initialState = initialState; // Initial state
    this.finalStates = finalStates; // Final states

    this.branchs = [[this.initialState, new Tape([BLANK], false)]]; // Queue the keep track of the branchs

    // Extras
    this.maxInterections = 1000;
    this.history = [];
  }

  printBranchs() {
    this.branchs.forEach((branch) => {
      console.log(`State: ${branch[0]} - Tape: ${branch[1].getTape()}, Head: ${branch[1].getHead()}`);
    });
    console.log("-------------------------------");
  }

  setComputedWord(word) {
    let tapeContent = word.length === 0 ? [BLANK] : [...word.split("")];
    this.branchs = [[this.initialState, new Tape(tapeContent), false]];
    this.history = [];
    // this.createHistory();
  }

  isSubset(subset, superset) {
    return [...subset].every((element) => superset.has(element));
  }

  checkValidMTFormat() {
    // Sigma must not contain blank symbol
    if (this.sigma.has(BLANK)) return false;
    // Gamma must contain blank symbol
    if (!this.gamma.has(BLANK)) return false;
    // Sigma must be a subset of Gamma
    if (!this.isSubset(this.sigma, this.gamma)) return false;
    // Q must contain initial state
    if (!this.Q.has(this.initialState)) return false;
    // Final states must be a subset of Q
    if (!this.isSubset(this.finalStates, this.Q)) return false;

    return true;
  }

  checkAcceptance() {
    for (const branch of this.branchs) {
      const currentState = branch[0];
      if (this.finalStates.has(currentState)) return true;
    }

    return false;
  }

  checkRejection() {
    let rejected = this.branchs.every((branch) => {
      const currentState = branch[0];
      if (this.finalStates.has(currentState)) return false;
      if (!this.delta.hasOwnProperty(currentState)) return true;
      if (!this.delta[currentState].hasOwnProperty(branch[1].getSymbol())) return true;
    });

    return rejected;
  }

  createHistory() {
    this.history.push([...this.branchs]);
  }

  fastReset() {
    this.branchs = [[this.initialState, new Tape([BLANK])]];
    this.history = [];
  }

  stepBack() {
    if (this.history.length === 0) return false;

    this.branchs = this.history.pop();
    this.printBranchs();
    return true;
  }

  stepForward() {
    this.createHistory();

    let auxBranchs = [];
    while (this.branchs.length > 0) {
      const branch = this.branchs.shift();

      const currentState = branch[0];

      const tapeObj = branch[1];

      if (tapeObj.getTape().length === 0) tape.setTape([BLANK]);

      const currentSymbol = tapeObj.getSymbol();

      if (!this.delta.hasOwnProperty(currentState)) {
        const newBranch = [currentState, tapeObj, true];
        auxBranchs.push(newBranch);
        continue;
      }
      if (!this.delta[currentState].hasOwnProperty(currentSymbol)) {
        const newBranch = [currentState, tapeObj, true];
        auxBranchs.push(newBranch);
        continue;
      }

      const currentDelta = this.delta[currentState][currentSymbol];
      const head = tapeObj.getHead();

      for (const { write, move, to } of currentDelta) {
        let newTape = new Tape([...tapeObj.getTape()]);
        newTape.setHead(head);
        newTape.setSymbol(write);
        newTape.move(move);
        const newBranch = [to, newTape, false];
        auxBranchs.push(newBranch);
      }
    }

    this.branchs = auxBranchs;

    this.printBranchs();

    if (this.checkAcceptance()) {
      console.log("Accepted");
      return { accepted: true, end: true };
    }
    if (this.checkRejection()) {
      console.log("Rejected");
      return { accepted: false, end: true };
    }

    return { accepted: false, end: false };
  }

  fastForward() {
    let itr = 0;

    while (itr < this.maxInterections) {
      const { accepted, end } = this.stepForward();
      if (end) return { accepted, end };

      itr++;
    }
  }
}

// Example of how the delta function should look like for  Lnd = {010} {00∗1}
const delta = {
  0: {
    0: [
      { write: "0", move: RIGHT, to: 1 },
      { write: "0", move: RIGHT, to: 2 },
    ],
  },
  1: {
    1: [{ write: "1", move: RIGHT, to: 3 }],
  },
  2: {
    0: [{ write: "0", move: RIGHT, to: 2 }],
    1: [{ write: "1", move: RIGHT, to: 4 }],
  },
  3: {
    0: [{ write: "0", move: RIGHT, to: 4 }],
  },
};

const nDTM = new NDTM(new Set([0, 1, 2, 3, 4]), new Set([0, 1]), new Set([0, 1, BLANK]), delta, 0, new Set([4]));

nDTM.setComputedWord("0001");
