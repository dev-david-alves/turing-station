export const nonDeterministicExample01 = {
  name: "Palavras formadas por um ou mais a's (a+)",
  canvasScale: 1.25,
  variant: "ndtm",
  numTapes: 1,
  stayOption: true,
  states: [
    {
      id: 1,
      x: 113.60405154167685,
      y: 179.25409944621822,
      isStartState: true,
      isFinalState: false,
      label: "Q_{1}",
    },
    {
      id: 2,
      x: 261.3373848750102,
      y: 177.38743277955152,
      isStartState: false,
      isFinalState: false,
      label: "Q_{2}",
    },
    {
      id: 3,
      x: 415.73738487501004,
      y: 180.58743277955153,
      isStartState: false,
      isFinalState: true,
      label: "Q_{3}",
    },
  ],
  links: [
    {
      isSelfLink: true,
      state: 1,
      rules: [
        {
          label: ["a", "x", "D"],
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
          label: ["a", "x", "D"],
        },
      ],
      parallelPart: 0.4,
      perpendicularPart: 0,
      lineAngleAdjust: 0,
    },
    {
      isSelfLink: false,
      stateA: 2,
      stateB: 3,
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
