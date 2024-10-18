export const deterministicExample01 = {
  name: "Número de 0's é igual ao número de 1's",
  canvasScale: 1,
  variant: "tm",
  numTapes: 1,
  stayOption: true,
  states: [
    {
      id: 1,
      x: 223.08049726869248,
      y: 198.79295374283583,
      isStartState: true,
      isFinalState: false,
      label: "Q_{1}",
    },
    {
      id: 2,
      x: 407.0804972686924,
      y: 203.79295374283583,
      isStartState: false,
      isFinalState: false,
      label: "Q_{2}",
    },
    {
      id: 3,
      x: 653.0804972686923,
      y: 201.7929537428358,
      isStartState: false,
      isFinalState: false,
      label: "Q_{3}",
    },
    {
      id: 4,
      x: 262,
      y: 299.3999938964844,
      isStartState: false,
      isFinalState: false,
      label: "Q_{4}",
    },
    {
      id: 5,
      x: 428,
      y: 306.3999938964844,
      isStartState: false,
      isFinalState: true,
      label: "Q_{5}",
    },
  ],
  links: [
    {
      isSelfLink: false,
      stateA: 1,
      stateB: 2,
      rules: [
        {
          label: ["0", "x", "D"],
        },
      ],
      parallelPart: 0.5,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: true,
      state: 2,
      rules: [
        {
          label: ["0", "0", "D"],
        },
        {
          label: ["y", "y", "D"],
        },
      ],
      anchorAngle: -1.5707963267948966,
    },
    {
      isSelfLink: false,
      stateA: 2,
      stateB: 3,
      rules: [
        {
          label: ["1", "y", "E"],
        },
      ],
      parallelPart: 0.5,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: true,
      state: 3,
      rules: [
        {
          label: ["y", "y", "E"],
        },
        {
          label: ["0", "0", "E"],
        },
      ],
      anchorAngle: -1.4351639399472504,
    },
    {
      isSelfLink: false,
      stateA: 3,
      stateB: 1,
      rules: [
        {
          label: ["x", "x", "D"],
        },
      ],
      parallelPart: 0.34873258037779004,
      perpendicularPart: 125.34981269237727,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: false,
      stateA: 1,
      stateB: 4,
      rules: [
        {
          label: ["y", "y", "D"],
        },
      ],
      parallelPart: 0.5,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: true,
      state: 4,
      rules: [
        {
          label: ["y", "y", "D"],
        },
      ],
      anchorAngle: -1.4181469983996315,
    },
    {
      isSelfLink: false,
      stateA: 4,
      stateB: 5,
      rules: [
        {
          label: ["☐", "☐", "D"],
        },
      ],
      parallelPart: 0.5,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
  ],
  initialStateLink: {
    state: 1,
    deltaX: -80,
    deltaY: 0,
  },
};
