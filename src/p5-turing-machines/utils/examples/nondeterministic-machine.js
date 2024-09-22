export const nonDeterministicExample01 = {
  name: "a|ac*|ab|adt|adtefy",
  canvasScale: 0.75,
  variant: "ndtm",
  numTapes: 1,
  stayOption: true,
  states: [
    {
      id: 1,
      x: 200,
      y: 200,
      isStartState: true,
      isFinalState: false,
      label: "Q_{1}",
    },
    {
      id: 2,
      x: 400,
      y: 200,
      isStartState: false,
      isFinalState: false,
      label: "Q_{2}",
    },
    {
      id: 3,
      x: 600,
      y: 200,
      isStartState: false,
      isFinalState: true,
      label: "Q_{3}",
    },
    {
      id: 4,
      x: 335.1999969482422,
      y: 309.8000030517578,
      isStartState: false,
      isFinalState: false,
      label: "Q_{4}",
    },
    {
      id: 5,
      x: 370,
      y: 497.6000061035156,
      isStartState: false,
      isFinalState: false,
      label: "Q_{5}",
    },
    {
      id: 6,
      x: 416,
      y: 415.6000061035156,
      isStartState: false,
      isFinalState: false,
      label: "Q_{6}",
    },
    {
      id: 7,
      x: 492,
      y: 331.6000061035156,
      isStartState: false,
      isFinalState: false,
      label: "Q_{7}",
    },
    {
      id: 8,
      x: 550,
      y: 481.6000061035156,
      isStartState: false,
      isFinalState: false,
      label: "Q_{8}",
    },
    {
      id: 9,
      x: 662,
      y: 314.2666727701823,
      isStartState: false,
      isFinalState: false,
      label: "Q_{9}",
    },
  ],
  links: [
    {
      isSelfLink: false,
      stateA: 1,
      stateB: 2,
      rules: [
        {
          label: ["a", "b", "D"],
        },
      ],
      parallelPart: 0.125,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: false,
      stateA: 2,
      stateB: 3,
      rules: [
        {
          label: ["b", "c", "D"],
        },
        {
          label: ["☐", "☐", "D"],
        },
      ],
      parallelPart: 0.125,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: true,
      state: 2,
      rules: [
        {
          label: ["c", "d", "D"],
        },
      ],
      anchorAngle: -1.5707963267948966,
    },
    {
      isSelfLink: false,
      stateA: 1,
      stateB: 4,
      rules: [
        {
          label: ["a", "☐", "D"],
        },
      ],
      parallelPart: 0.125,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: false,
      stateA: 4,
      stateB: 3,
      rules: [
        {
          label: ["t", "τ", "D"],
        },
      ],
      parallelPart: 0.125,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: false,
      stateA: 4,
      stateB: 6,
      rules: [
        {
          label: ["d", "☐", "D"],
        },
      ],
      parallelPart: 0.3333333333333333,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: false,
      stateA: 4,
      stateB: 5,
      rules: [
        {
          label: ["d", "a", "D"],
        },
      ],
      parallelPart: 0.3333333333333333,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: false,
      stateA: 4,
      stateB: 7,
      rules: [
        {
          label: ["d", "☐", "D"],
        },
      ],
      parallelPart: 0.3333333333333333,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: false,
      stateA: 6,
      stateB: 8,
      rules: [
        {
          label: ["e", "☐", "D"],
        },
      ],
      parallelPart: 0.3333333333333333,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: false,
      stateA: 7,
      stateB: 3,
      rules: [
        {
          label: ["t", "☐", "E"],
        },
      ],
      parallelPart: 0.3333333333333333,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: false,
      stateA: 8,
      stateB: 9,
      rules: [
        {
          label: ["f", "☐", "D"],
        },
      ],
      parallelPart: 0.3333333333333333,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: false,
      stateA: 9,
      stateB: 3,
      rules: [
        {
          label: ["t", "☐", "E"],
        },
      ],
      parallelPart: 0.3333333333333333,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: false,
      stateA: 5,
      stateB: 3,
      rules: [
        {
          label: ["y", "☐", "D"],
        },
      ],
      parallelPart: 0.3795037776884917,
      perpendicularPart: 98.83529668865616,
      lineAngleAdjust: 0,
    },
  ],
  initialStateLink: {
    state: 1,
    deltaX: -100,
    deltaY: 0,
  },
};
