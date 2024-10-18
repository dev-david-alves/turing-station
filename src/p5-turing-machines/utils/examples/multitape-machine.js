export const multitapeExample01 = {
  name: "Número de a's é igual ao número de b's",
  canvasScale: 1,
  variant: "mttm",
  numTapes: 3,
  stayOption: true,
  states: [
    {
      id: 0,
      x: 150,
      y: 200,
      isStartState: true,
      isFinalState: false,
      label: "Q_{0}",
    },
    {
      id: 1,
      x: 350,
      y: 200,
      isStartState: false,
      isFinalState: false,
      label: "Q_{1}",
    },
    {
      id: 2,
      x: 550,
      y: 200,
      isStartState: false,
      isFinalState: true,
      label: "Q_{2}",
    },
  ],
  links: [
    {
      isSelfLink: true,
      state: 0,
      rules: [
        {
          label: ["a", "X", "D", "☐", "X", "D", "☐", "☐", "P"],
        },
        {
          label: ["b", "Y", "D", "☐", "☐", "P", "☐", "Y", "D"],
        },
      ],
      anchorAngle: -1.5707963267948966,
    },
    {
      isSelfLink: false,
      stateA: 0,
      stateB: 1,
      rules: [
        {
          label: ["☐", "☐", "P", "☐", "☐", "E", "☐", "☐", "E"],
        },
      ],
      parallelPart: 0,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: true,
      state: 1,
      rules: [
        {
          label: ["☐", "☐", "P", "X", "☐", "E", "Y", "☐", "E"],
        },
      ],
      anchorAngle: -1.5707963267948966,
    },
    {
      isSelfLink: false,
      stateA: 1,
      stateB: 2,
      rules: [
        {
          label: ["☐", "☐", "P", "☐", "☐", "P", "☐", "☐", "P"],
        },
      ],
      parallelPart: 0,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
  ],
  initialStateLink: {
    state: 0,
    deltaX: -100,
    deltaY: 0,
  },
};
