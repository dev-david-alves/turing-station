export const deterministicExample01 = {
  name: "Número de 0's é igual ao número de 1's",
  canvasScale: 1.25,
  variant: "tm",
  numTapes: 1,
  stayOption: true,
  states: [
    {
      id: 1,
      x: 110.08049727450248,
      y: 158.0531344072383,
      isStartState: true,
      isFinalState: false,
      label: "Q_{1}",
    },
    {
      id: 2,
      x: 261.0804972745028,
      y: 159.0531344072383,
      isStartState: false,
      isFinalState: false,
      label: "Q_{2}",
    },
    {
      id: 3,
      x: 413.0804972745012,
      y: 161.05313440723825,
      isStartState: false,
      isFinalState: false,
      label: "Q_{3}",
    },
    {
      id: 4,
      x: 193.00000000581005,
      y: 270.6601745608869,
      isStartState: false,
      isFinalState: false,
      label: "Q_{4}",
    },
    {
      id: 5,
      x: 333.0000000058104,
      y: 273.6601745608869,
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
      parallelPart: 0.4,
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
      parallelPart: 0.4,
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
      parallelPart: 0.2645239020967051,
      perpendicularPart: 89.52518390740295,
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
      parallelPart: 0.4,
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
      parallelPart: 0.4,
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
