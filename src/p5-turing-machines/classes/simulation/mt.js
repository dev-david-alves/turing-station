// Deterministic Turing Machine
export class MT {
  constructor(
    Q = new set(),
    sigma = new set(),
    gamma = new set(),
    delta = {},
    initialState = 0,
    endStates = new set(),
  ) {
    this.Q = Q;
    this.sigma = sigma;
    this.gamma = gamma;
    this.delta = delta;
    this.initialState = initialState;
    this.endStates = endStates;
    this.tape = [];
    this.head = 0;

    this.L = -1; // Left
    this.R = 1; // Right
    this.S = 0; // Stay

    // Extra
    this.history = [];
    this.maxInterectedIndex = 0;
    this.currentState = this.initialState;
    this.blankSymbol = "☐";
    this.simulatedWord = "";
  }

  isSubset(setA, setB) {
    for (let element of setA) {
      if (!setB.has(element)) return false;
    }

    return true;
  }

  checkValidMTFormat() {
    // Sigma must not contain blank symbol
    if (this.sigma.has(this.blankSymbol)) return false;
    // Gamma must contain blank symbol
    if (!this.gamma.has(this.blankSymbol)) return false;
    // Sigma must be a subset of Gamma
    if (!this.isSubset(this.sigma, this.gamma)) return false;
    // Q must contain initial state
    if (!this.Q.has(this.initialState)) return false;
    // End states must be a subset of Q
    if (!this.isSubset(this.endStates, this.Q)) return false;

    // Check if all transitions are valid
    for (const state in this.delta) {
      if (!this.Q.has(parseInt(state))) return false;

      for (const symbol in this.delta[state]) {
        if (!this.gamma.has(symbol)) return false;

        const transition = this.delta[state][symbol];
        if (!transition) return false;

        if (!this.gamma.has(transition.write)) return false;
        if (transition.move !== this.L && transition.move !== this.R && transition.move !== this.S) return false;
        if (!this.Q.has(transition.nextState)) return false;
      }
    }

    return true;
  }

  checkAcceptance() {
    if (this.endStates.has(this.currentState)) {
      if (this.maxInterectedIndex >= this.simulatedWord.length) return { accepted: true, end: true };
      else return { accepted: false, end: true };
    }

    return { accepted: false, end: false };
  }

  createHistory() {
    this.history.push({
      tape: [...this.tape],
      tapeHead: this.head,
      currentState: this.currentState,
      maxInterectedIndex: this.maxInterectedIndex,
    });
  }

  fastSimulationReset() {
    this.head = 0;
    this.tape = [];
    this.maxInterectedIndex = 0;
    this.history = [];
  }

  backwardSimulation() {
    let last = this.history.pop();
    this.tape = last.tape;
    this.head = last.tapeHead;
    this.currentState = last.currentState;
    this.maxInterectedIndex = last.maxInterectedIndex;
  }

  forwardSimulation() {
    if (!this.checkValidMTFormat()) {
      alert("Invalid Turing Machine format\n\n");
      return { accepted: false, end: true };
    }

    if (this.tape.length === 0) this.tape = [this.blankSymbol];

    let result = this.checkAcceptance();
    if (result.end) return result;

    const currentSymbol = this.tape[this.head];
    const transition = this.delta[this.currentState][currentSymbol];

    if (!transition) return { accepted: false, end: true };

    this.createHistory();

    this.tape[this.head] = transition.write;
    this.head += transition.move;
    this.currentState = transition.nextState;

    if (this.head < 0) {
      this.head = 0;
      this.tape.unshift(this.blankSymbol);
    } else if (this.head >= this.tape.length) {
      this.tape.push(this.blankSymbol);
    }

    this.maxInterectedIndex = Math.max(this.maxInterectedIndex, this.head);

    return this.checkAcceptance();
  }

  fastSimulation(word = "", maxIteractions = 100) {
    if (!this.checkValidMTFormat()) {
      alert("Invalid Turing Machine format\n\n");
      return false;
    }

    this.simulatedWord = word;
    this.maxInterectedIndex = 0; // To check if all the word was interected at least once
    this.tape = this.simulatedWord.split("");
    if (this.tape.length === 0) this.tape = [this.blankSymbol];

    this.currentState = this.initialState;
    this.head = 0;

    do {
      let result = this.forwardSimulation();
      if (result.end) return result;

      maxIteractions--;
      if (maxIteractions <= 0) {
        alert("Max iterations reached\n\n");
        return { accepted: false, end: true };
      }
    } while (true);
  }
}
