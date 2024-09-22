export const deterministicExample01 = {
  name: "Test",
  canvasScale: 1,
  variant: "tm",
  numTapes: 1,
  stayOption: true,
  states: [
    {
      id: 0,
      x: 150,
      y: 200,
      isStartState: false,
      isFinalState: false,
      isRejectState: false,
      label: "Q_{0}",
    },
    {
      id: 1,
      x: 450,
      y: 200,
      isStartState: true,
      isFinalState: false,
      isRejectState: false,
      label: "Q_{1}",
    },
    {
      id: 2,
      x: 284.8000030517578,
      y: 316.1999969482422,
      isStartState: false,
      isFinalState: false,
      isRejectState: false,
      label: "Q_{2}",
    },
  ],
  links: [
    {
      isSelfLink: false,
      stateA: 0,
      stateB: 1,
      rules: [
        {
          label: ["☐", "☐", "E"],
        },
        {
          label: ["β", "☐", "E"],
        },
      ],
      parallelPart: 0.5260000101725261,
      perpendicularPart: -116.80000305175781,
      lineAngleAdjust: 3.141592653589793,
    },
    {
      isSelfLink: false,
      stateA: 0,
      stateB: 2,
      rules: [
        {
          label: ["☐", "☐", "E"],
        },
      ],
      parallelPart: 0.5,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: false,
      stateA: 2,
      stateB: 1,
      rules: [
        {
          label: ["α", "τ", "D"],
        },
      ],
      parallelPart: 0.5,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: true,
      state: 1,
      rules: [
        {
          label: ["☐", "☐", "E"],
        },
      ],
      anchorAngle: -0.358770800910852,
    },
    {
      isSelfLink: true,
      state: 0,
      rules: [
        {
          label: ["Γ", "δ", "D"],
        },
      ],
      anchorAngle: -2.3209146580151057,
    },
  ],
  initialStateLink: {
    state: 0,
    deltaX: -100,
    deltaY: 0,
  },
};
