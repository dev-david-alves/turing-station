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

// Non Deterministic Multitape Turing Machine
export class MTNDTM {
  constructor(
    Q = new set(),
    sigma = new set(),
    gamma = new set(),
    delta = {},
    initialState = null,
    finalStates = new set(),
    numTapes = 1,
  ) {
    this.Q = Q; // Set of states
    this.sigma = sigma; // Input alphabet
    this.gamma = gamma; // Tape alphabet
    this.delta = delta; // Transition function
    this.initialState = initialState; // Initial state
    this.finalStates = finalStates; // Final states
    this.numTapes = numTapes; // Number of tapes

    // State, Tapes, isBranchRejected
    this.branchs = [this.createDefaultBranchs(this.initialState, [BLANK])]; // Queue that keep track of the branchs

    // Extras
    this.maxInterections = 1000;
    this.history = [];
  }

  // Just for testing
  printBranchs() {
    console.log("\n-------------------------------");
    this.branchs.forEach((branch) => {
      console.log(`State: ${JSON.stringify(branch[0])}`);
      branch[1].forEach((tape, index) => {
        console.log(`Tape ${index + 1}: ${tape.getTape()}, Head: ${tape.getHead()}`);
      });
    });
    console.log("-------------------------------");
  }

  createDefaultBranchs(state, firstTapeContent) {
    let tapes = [];
    tapes.push(new Tape([...firstTapeContent]));
    for (let i = 0; i < this.numTapes - 1; i++) {
      // tapes.push(new Tape([BLANK]));
      tapes.push(new Tape(Array.from({ length: firstTapeContent.length }, () => BLANK)));
    }

    return [state, tapes, false];
  }

  setComputedWord(word) {
    let tapeContent = word.length === 0 ? [BLANK] : [...word.split("")];
    this.branchs = [this.createDefaultBranchs(this.initialState, tapeContent)];
    this.history = [];
  }

  isSubset(subset, superset) {
    return [...subset].every((element) => superset.has(element));
  }

  checkAcceptance() {
    for (const branch of this.branchs) {
      const currentState = branch[0];
      if (this.finalStates.has(currentState)) return true;
    }

    return false;
  }

  checkRejection() {
    return this.branchs.every((branch) => branch[2]);
  }

  createHistory() {
    this.history.push([...this.branchs]);
  }

  stepBack() {
    if (this.history.length === 0) return false;

    this.branchs = this.history.pop();
    return true;
  }

  stepForward() {
    this.createHistory();

    let auxBranchs = [];
    while (this.branchs.length > 0) {
      const branch = this.branchs.shift();

      const currentState = branch[0];
      const tapesObj = branch[1];

      const currentSymbolsConfig = tapesObj.map((tape) => tape.getSymbol()).join("");

      if (branch[2]) continue;

      if (!this.delta.hasOwnProperty(currentState)) {
        const newBranch = [currentState, tapesObj, true];
        auxBranchs.push(newBranch);
        continue;
      }

      if (!this.delta[currentState].hasOwnProperty(currentSymbolsConfig)) {
        const newBranch = [currentState, tapesObj, true];
        auxBranchs.push(newBranch);
        continue;
      }

      const currentDelta = this.delta[currentState][currentSymbolsConfig];

      currentDelta.forEach((delta) => {
        const newTapes = [];

        delta.actions.forEach((tapeDelta, tapeIndex) => {
          let newTape = new Tape([...tapesObj[tapeIndex].getTape()]);
          newTape.setHead(tapesObj[tapeIndex].getHead());

          newTape.setSymbol(tapeDelta.write);
          newTape.move(tapeDelta.move);
          newTapes.push(newTape);
        });

        const newBranch = [delta.to, newTapes, false];
        auxBranchs.push(newBranch);
      });
    }

    this.branchs = auxBranchs;

    if (this.checkRejection()) {
      return { accepted: false, end: true };
    }
    if (this.checkAcceptance()) {
      return { accepted: true, end: true };
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

    return { accepted: false, end: true };
  }
}

// Example of how the delta function should look like for  Lmtnd = a's == b's
// let key1 = ["a", BLANK, BLANK].toString();
// let key2 = ["b", BLANK, BLANK].toString();
// let key3 = [BLANK, BLANK, BLANK].toString();
// let key4 = [BLANK, "X", "Y"].toString();
// let key5 = [BLANK, BLANK, BLANK].toString();
// const delta = {
//   0: {
//     [key1]: [
//       {
//         to: 0,
//         actions: [
//           { write: "X", move: RIGHT },
//           { write: "X", move: RIGHT },
//           { write: BLANK, move: STAY },
//         ],
//       },
//     ],
//     [key2]: [
//       {
//         to: 0,
//         actions: [
//           { write: "Y", move: RIGHT },
//           { write: BLANK, move: STAY },
//           { write: "Y", move: RIGHT },
//         ],
//       },
//     ],
//     [key3]: [
//       {
//         to: 1,
//         actions: [
//           { write: BLANK, move: STAY },
//           { write: BLANK, move: LEFT },
//           { write: BLANK, move: LEFT },
//         ],
//       },
//     ],
//   },
//   1: {
//     [key4]: [
//       {
//         to: 1,
//         actions: [
//           { write: BLANK, move: STAY },
//           { write: BLANK, move: LEFT },
//           { write: BLANK, move: LEFT },
//         ],
//       },
//     ],
//     [key5]: [
//       {
//         to: 2,
//         actions: [
//           { write: BLANK, move: STAY },
//           { write: BLANK, move: STAY },
//           { write: BLANK, move: STAY },
//         ],
//       },
//     ],
//   },
// };

// // aababb
// const mtndtm = new MTNDTM(
//   new Set([0, 1, 2]),
//   new Set(["a", "b"]),
//   new Set(["a", "b", "X", "Y", BLANK]),
//   delta,
//   0,
//   new Set([2]),
//   3,
// );

// mtndtm.setComputedWord("aababb");

// mtndtm.printBranchs();
// mtndtm.stepForward();
// mtndtm.stepForward();
// mtndtm.stepForward();
// mtndtm.stepForward();
// mtndtm.stepForward();

// mtndtm.stepForward();
// mtndtm.stepForward();
// mtndtm.stepForward();
// mtndtm.stepForward();

// mtndtm.stepForward();
// mtndtm.stepForward();
