import State from "./classes/state";
import TemporaryLink from "./classes/temporaryLink";
import StartLink from "./classes/startLink";
import SelfLink from "./classes/selfLink";
import Link from "./classes/link";
import { createHistory } from "./utils/history";

import { ReactP5Wrapper } from "@p5-wrapper/react";
import { useMemo } from "react";
import { useSimulator } from "../providers/simulator";

export const TMSimulator = ({ id }) => {
  const { getOne } = useSimulator();
  const { fullScreen, focused, showLeftToolbar } = getOne(id);

  const sketch = useMemo(
    () => (p5) => {
      // General global properties
      p5.canvasID = id;
      p5.canvasOffset = { x: 0, y: 0 };
      p5.moveCanvasVelocity = 3;
      p5.canvasScale = 1.0;
      p5.mtCreated = null;
      p5.selectedLeftToolbarButton = null;

      // History
      p5.history = [];
      p5.maxHistory = 10; // Up to 10 saves
      p5.currentHistoryIndex = 0; // Current index of history

      // States
      p5.states = [];
      p5.lastSelectedState = null;
      p5.selectedObject = null;

      // Links
      p5.currentLink = null;
      p5.startLink = null;
      p5.links = [];

      // JSON functions
      // p5.compareJSONObjects = (obj1, obj2) => {
      //   if (obj1.canvasScale !== obj2.canvasScale) return false;
      //   if (obj1.states.length !== obj2.states.length || obj1.links.length !== obj2.links.length) return false;

      //   for (let i = 0; i < obj1.states.length; i++) {
      //     if (
      //       obj1.states[i].id !== obj2.states[i].id ||
      //       obj1.states[i].x !== obj2.states[i].x ||
      //       obj1.states[i].y !== obj2.states[i].y ||
      //       obj1.states[i].isStartState !== obj2.states[i].isStartState ||
      //       obj1.states[i].isEndState !== obj2.states[i].isEndState ||
      //       obj1.states[i].isRejectState !== obj2.states[i].isRejectState ||
      //       obj1.states[i].label !== obj2.states[i].label
      //     )
      //       return false;
      //   }

      //   for (let i = 0; i < obj1.links.length; i++) {
      //     if (obj1.links[i].isSelfLink !== obj2.links[i].isSelfLink) return false;

      //     if (!obj1.links[i].isSelfLink) {
      //       if (obj1.links[i].rules.length !== obj2.links[i].rules.length) return false;

      //       let comparedRules = obj1.links[i].rules.every(
      //         (rule, index) => JSON.stringify(rule.label) === JSON.stringify(obj2.links[i].rules[index].label),
      //       );

      //       if (
      //         obj1.links[i].stateA !== obj2.links[i].stateA ||
      //         obj1.links[i].stateB !== obj2.links[i].stateB ||
      //         !comparedRules
      //       )
      //         return false;

      //       if (obj1.links[i].hasCircle !== obj2.links[i].hasCircle) return false;

      //       if (obj1.links[i].hasCircle) {
      //         if (
      //           obj1.links[i].startX !== obj2.links[i].startX ||
      //           obj1.links[i].startY !== obj2.links[i].startY ||
      //           obj1.links[i].endX !== obj2.links[i].endX ||
      //           obj1.links[i].endY !== obj2.links[i].endY ||
      //           obj1.links[i].circleX !== obj2.links[i].circleX ||
      //           obj1.links[i].circleY !== obj2.links[i].circleY ||
      //           obj1.links[i].circleR !== obj2.links[i].circleR ||
      //           obj1.links[i].startAngle !== obj2.links[i].startAngle ||
      //           obj1.links[i].endAngle !== obj2.links[i].endAngle
      //         )
      //           return false;
      //       } else {
      //         if (
      //           obj1.links[i].startX !== obj2.links[i].startX ||
      //           obj1.links[i].startY !== obj2.links[i].startY ||
      //           obj1.links[i].endX !== obj2.links[i].endX ||
      //           obj1.links[i].endY !== obj2.links[i].endY
      //         )
      //           return false;
      //       }
      //     } else {
      //       if (obj1.links[i].rules.length !== obj2.links[i].rules.length) return false;

      //       let comparedRules = obj1.links[i].rules.every(
      //         (rule, index) => JSON.stringify(rule.label) === JSON.stringify(obj2.links[i].rules[index].label),
      //       );

      //       if (
      //         obj1.links[i].state !== obj2.links[i].state ||
      //         !comparedRules ||
      //         obj1.links[i].anchorAngle !== obj2.links[i].anchorAngle
      //       )
      //         return false;
      //     }
      //   }

      //   if ((obj1.initialStateLink && !obj2.initialStateLink) || (!obj1.initialStateLink && obj2.initialStateLink))
      //     return false;

      //   if (obj1.initialStateLink) {
      //     if (
      //       obj1.initialStateLink.state !== obj2.initialStateLink.state ||
      //       obj1.initialStateLink.deltaX !== obj2.initialStateLink.deltaX ||
      //       obj1.initialStateLink.deltaY !== obj2.initialStateLink.deltaY
      //     )
      //       return false;
      //   }

      //   return true;
      // };

      // p5.createJSONExportObj = () => {
      //   let dmt = {
      //     canvasScale: p5.canvasScale,
      //     states: [],
      //     links: [],
      //     initialStateLink: null,
      //   };

      //   for (let i = 0; i < p5.states.length; i++) {
      //     dmt.states.push({
      //       id: p5.states[i].id,
      //       x: p5.states[i].x / p5.canvasScale,
      //       y: p5.states[i].y / p5.canvasScale,
      //       isStartState: p5.states[i].isStartState,
      //       isEndState: p5.states[i].isEndState,
      //       isRejectState: p5.states[i].isRejectState,
      //       label: p5.states[i].input.input.value(),
      //     });
      //   }

      //   for (let i = 0; i < p5.links.length; i++) {
      //     if (p5.links[i] instanceof Link) {
      //       let stuff = p5.links[i].getEndPointsAndCircle();

      //       dmt.links.push({
      //         isSelfLink: false,
      //         stateA: p5.links[i].stateA.id,
      //         stateB: p5.links[i].stateB.id,
      //         rules: p5.links[i].transitionBox.rules,
      //         parallelPart: p5.links[i].parallelPart,
      //         perpendicularPart: p5.links[i].perpendicularPart,
      //         lineAngleAdjust: p5.links[i].lineAngleAdjust,
      //         hasCircle: stuff.hasCircle,
      //         startX: stuff.startX / p5.canvasScale,
      //         startY: stuff.startY / p5.canvasScale,
      //         endX: stuff.endX / p5.canvasScale,
      //         endY: stuff.endY / p5.canvasScale,
      //         circleX: stuff.circleX / p5.canvasScale,
      //         circleY: stuff.circleY / p5.canvasScale,
      //         circleR: stuff.circleR / p5.canvasScale,
      //         startAngle: stuff.startAngle,
      //         endAngle: stuff.endAngle,
      //       });
      //     } else if (p5.links[i] instanceof SelfLink) {
      //       dmt.links.push({
      //         isSelfLink: true,
      //         state: p5.links[i].state.id,
      //         rules: p5.links[i].transitionBox.rules,
      //         anchorAngle: p5.links[i].anchorAngle,
      //       });
      //     }
      //   }

      //   if (p5.startLink) {
      //     dmt.initialStateLink = {
      //       state: p5.startLink.state.id,
      //       deltaX: p5.startLink.deltaX,
      //       deltaY: p5.startLink.deltaY,
      //     };
      //   }

      //   return dmt;
      // };

      // // Import file
      // p5.inputFile = null;

      // p5.createCanvasStatesFromOBJ = (obj) => {
      //   p5.canvasScale = obj.canvasScale;
      //   if (scalingCanvasSlider) scalingCanvasSlider.value(p5.canvasScale);

      //   p5.states = [];
      //   p5.links = [];
      //   p5.startLink = null;

      //   for (let i = 0; i < obj.states.length; i++) {
      //     let state = obj.states[i];
      //     p5.states.push(new State(p5, state.id, state.x, state.y));
      //     p5.states[p5.states.length - 1].isStartState = state.isStartState;
      //     p5.states[p5.states.length - 1].isEndState = state.isEndState;
      //     p5.states[p5.states.length - 1].isRejectState = state.isRejectState;
      //     p5.states[p5.states.length - 1].input.input.value(state.label);
      //     p5.states[p5.states.length - 1].input.textInput(state.label);
      //   }

      //   for (let i = 0; i < obj.links.length; i++) {
      //     let link = obj.links[i];
      //     if (Number.isInteger(link.stateA) && Number.isInteger(link.stateB)) {
      //       let stateA = p5.states.find((state) => state.id === link.stateA);
      //       let stateB = p5.states.find((state) => state.id === link.stateB);
      //       p5.links.push(
      //         new Link(p5, stateA, stateB, link.rules, link.parallelPart, link.perpendicularPart, link.lineAngleAdjust),
      //       );
      //     } else if (Number.isInteger(link.state)) {
      //       let state = p5.states.find((state) => state.id === link.state);
      //       p5.links.push(new SelfLink(p5, state, true, link.rules, link.anchorAngle));
      //     }
      //   }

      //   if (obj.initialStateLink) {
      //     p5.setInitialState(obj.initialStateLink.state, {
      //       deltaX: obj.initialStateLink.deltaX,
      //       deltaY: obj.initialStateLink.deltaY,
      //     });
      //     p5.startLink.selected = false;
      //   }

      //   return true;
      // };

      // p5.handleInputFile = (file) => {
      //   if (file.type === "application" && file.subtype === "json") {
      //     let reader = new FileReader();
      //     reader.onload = (event) => {
      //       let result = JSON.parse(event.target.result);

      //       if (createCanvasStatesFromOBJ(result)) {
      //         createHistory(p5, setSketchs);
      //       }
      //     };
      //     reader.readAsText(file.file);
      //   }

      //   p5.inputFile.value("");
      // };

      // Other functions
      p5.reCalculateCanvasSize = () => {
        const playground = p5.select(`#playground-${id}`);
        if (!playground) return;
        p5.resizeCanvas(playground.width, playground.height);
      };

      p5.getNewStateId = () => {
        let maxId = 0;
        for (let i = 0; i < p5.states.length; i++) if (p5.states[i].id > maxId) maxId = p5.states[i].id;

        return maxId + 1;
      };

      p5.setLeftToolbarButton = (buttonId) => {
        if (p5.selectedLeftToolbarButton === buttonId.split("-")[1]) return;

        p5.selectedLeftToolbarButton = buttonId.split("-")[1];

        console.log(p5.selectedLeftToolbarButton);

        const getAllButtons = p5.selectAll(".toolbar-action-buttons");
        getAllButtons.forEach((button) => {
          if (button.elt.id === buttonId) button.addClass("selected-button");
          else button.removeClass("selected-button");
        });
      };

      p5.cleanCanvas = () => {
        if (confirm("Você tem certeza que deseja limpar o canvas?")) {
          p5.states = [];
          p5.links = [];
          p5.startLink = null;
          p5.currentLink = null;
          p5.lastSelectedState = null;
          p5.selectedObject = null;
          p5.mtCreated = null;
          // createHistory();
        }
      };

      p5.setZoom = (scale) => {
        if (p5.canvasScale + scale < 0.5) {
          p5.canvasScale = 0.5;
        } else if (p5.canvasScale + scale > 2.0) {
          p5.canvasScale = 2.0;
        } else {
          p5.canvasScale = p5.canvasScale + scale;
        }
      };

      // Main functions
      p5.setup = () => {
        // Create canvas
        const playground = p5.select(`#playground-${id}`);
        p5.cnv = p5.createCanvas(playground.width, playground.height);
        p5.cnv.mousePressed(() => p5.mousePressedInsideCanvas());
        p5.cnv.mouseReleased(() => p5.mouseReleasedInsideCanvas());
        p5.cnv.mouseMoved(() => p5.mouseDraggedInsideCanvas()); // Used because there is no mouseDragged event for cnv
        p5.cnv.doubleClicked(() => p5.doubleClickedInsideCanvas());
        p5.cnv.mouseWheel((event) => p5.mouseWheelInsideCanvas(event));

        // Just for testing
        p5.states.push(new State(p5, p5.getNewStateId(), 150, 200));
        p5.states.push(new State(p5, p5.getNewStateId(), 450, 200));
        p5.links.push(
          new Link(p5, p5.states[0], p5.states[1], [
            {
              label: ["☐", " ", "→", " ", "☐", ", ", "E"],
              width: 54.01171875,
            },
            {
              label: ["☐", " ", "→", " ", "☐", ", ", "D"],
              width: 54.01171875,
            },
          ]),
        );

        // Set leftToolbar buttons mousePressed
        const getAllButtons = p5.selectAll(".toolbar-action-buttons");
        getAllButtons.forEach((button) => {
          button.mousePressed(() => p5.setLeftToolbarButton(button.elt.id));
        });

        // Set functions to buttons there cannot be selected
        p5.select(`#menu-cleanCanvas-${id}`).mousePressed(() => p5.cleanCanvas());
        p5.select(`#menu-undo-${id}`).mousePressed(() => console.log("undo"));
        p5.select(`#menu-redo-${id}`).mousePressed(() => console.log("redo"));
        p5.select(`#menu-zoomIn-${id}`).mousePressed(() => p5.setZoom(0.25));
        p5.select(`#menu-zoomOut-${id}`).mousePressed(() => p5.setZoom(-0.25));

        // First save on history
        // p5.history.push(p5.createJSONExportObj());
      };

      p5.draw = () => {
        // Set properties
        p5.reCalculateCanvasSize();
        p5.background("#181a1e");

        // Move canvas
        if (
          p5.mouseIsPressed &&
          ((p5.keyIsDown(p5.CONTROL) && p5.mouseButton === p5.LEFT) ||
            p5.mouseButton === p5.CENTER ||
            p5.selectedLeftToolbarButton === "moveCanvas")
        ) {
          p5.moveCanvas();
        }

        // Remove links that have no rules
        for (let i = 0; i < p5.links.length; i++) {
          if (!p5.links[i].transitionBox.selected && p5.links[i].transitionBox.rules.length === 0) {
            p5.links[i].transitionBox.remove();
            p5.links.splice(i, 1);
            i--;
          }
        }

        // Set objects hovering
        p5.unHoverAllObjects();
        let hoveredObject = p5.getFirstSelectedObject(p5.mouseX, p5.mouseY, false);
        if (hoveredObject) hoveredObject.object.hovering = hoveredObject.object.containsPoint(p5.mouseX, p5.mouseY);

        // Draw objects in order to create "layers"
        for (let i = 0; i < p5.links.length; i++) {
          p5.links[i].update();
          p5.links[i].draw();
          p5.links[i].transitionBox.update();
          p5.links[i].transitionBox.draw();
        }

        if (p5.startLink) {
          p5.startLink.update();
          p5.startLink.draw();
        }

        for (let i = 0; i < p5.states.length; i++) {
          p5.states[i].update();
          p5.states[i].draw();
        }

        if (p5.currentLink) p5.currentLink.draw();

        // To prevent states from overlapping
        p5.stateRepulse();
      };

      p5.createLink = () => {
        if (
          (p5.selectedLeftToolbarButton !== "selectObject" && p5.selectedLeftToolbarButton !== "addLink") ||
          p5.links.some((link) => link.transitionBox.selected)
        )
          return;

        let hoveredObject = p5.getFirstSelectedObject(p5.mouseX, p5.mouseY, false);

        if ((hoveredObject && hoveredObject.object instanceof State) || !hoveredObject) {
          if (
            hoveredObject &&
            !(p5.currentLink instanceof TemporaryLink && p5.lastSelectedState !== p5.states[hoveredObject.index])
          ) {
            p5.currentLink = new SelfLink(p5, p5.states[hoveredObject.index]);
            p5.lastSelectedState = p5.states[hoveredObject.index];
          } else {
            if (p5.lastSelectedState) {
              if (p5.currentLink instanceof SelfLink && !p5.currentLink.from) {
                p5.currentLink = new TemporaryLink(p5);
                p5.currentLink.from = p5.lastSelectedState.closestPointOnCircle(p5.mouseX, p5.mouseY);
              }
            } else {
              if (!p5.currentLink || !p5.currentLink.from) {
                p5.currentLink = new TemporaryLink(p5);
                p5.currentLink.from = { x: p5.mouseX, y: p5.mouseY };
              }
            }
          }
        } else {
          if (p5.currentLink instanceof SelfLink) {
            p5.currentLink = new TemporaryLink(p5);
            p5.currentLink.from = p5.lastSelectedState.closestPointOnCircle(p5.mouseX, p5.mouseY);
          }
        }

        if (p5.currentLink instanceof TemporaryLink) {
          p5.currentLink.to = { x: p5.mouseX, y: p5.mouseY };

          if (
            hoveredObject &&
            hoveredObject.object instanceof State &&
            p5.lastSelectedState &&
            p5.states[hoveredObject.index].id !== p5.lastSelectedState.id
          ) {
            p5.currentLink.to = p5.states[hoveredObject.index].closestPointOnCircle(
              p5.lastSelectedState.x,
              p5.lastSelectedState.y,
            );
          } else if (p5.lastSelectedState) {
            p5.currentLink.from = p5.lastSelectedState.closestPointOnCircle(p5.mouseX, p5.mouseY);
          } else if (hoveredObject && hoveredObject.object instanceof State && !p5.lastSelectedState) {
            p5.currentLink.to = p5.states[hoveredObject.index].closestPointOnCircle(
              p5.currentLink.from.x,
              p5.currentLink.from.y,
            );
          }
        }
      };

      // p5.setInitialState = (index = null, props = null) => {
      //   let linkSize = 80 * p5.canvasScale;

      //   if (index === null) {
      //     if (p5.selectedObject && p5.selectedObject.object instanceof State) {
      //       let start = {
      //         x: p5.selectedObject.object.x - linkSize,
      //         y: p5.selectedObject.object.y,
      //       };
      //       p5.startLink = new StartLink(p5, p5.selectedObject.object, start);
      //       p5.startLink.selected = true;

      //       // Unset the start state for all states
      //       for (let i = 0; i < p5.states.length; i++) {
      //         p5.selectedObject.object.isStartState = false;
      //       }

      //       // Set the selected state as the start state
      //       p5.selectedObject.object.isStartState = true;
      //       p5.cnvIsFocused = "export-menu";
      //     }
      //   } else {
      //     let start = { x: p5.states[index].x - linkSize, y: p5.states[index].y };

      //     // Modify the starting position if props are provided
      //     if (props) {
      //       start = {
      //         x: p5.states[index].x + props.deltaX,
      //         y: p5.states[index].y + props.deltaY,
      //       };
      //     }

      //     // Create a new StartLink for the specified state
      //     p5.startLink = new StartLink(p5, p5.states[index], start);
      //     p5.startLink.selected = true;

      //     // Unset the start state for all states
      //     for (let i = 0; i < p5.states.length; i++) {
      //       p5.states[i].isStartState = false;
      //     }

      //     // Set the specified state as the start state
      //     p5.states[index].isStartState = true;
      //   }

      //   // Hide the context menu
      //   p5.contextMenu.hide();
      // };

      p5.deleteObject = () => {
        if (p5.selectedObject) {
          if (p5.selectedObject.object instanceof State) {
            // Remove State
            for (let i = 0; i < p5.links.length; i++) {
              if (p5.links[i] instanceof Link) {
                if (
                  p5.links[i].stateA.id === p5.selectedObject.object.id ||
                  p5.links[i].stateB.id === p5.selectedObject.object.id
                ) {
                  p5.links[i].transitionBox.remove();
                  p5.links.splice(i, 1);
                  i--;
                }
              } else {
                if (p5.links[i].state.id === p5.selectedObject.object.id) {
                  p5.links[i].transitionBox.remove();
                  p5.links.splice(i, 1);
                  i--;
                }
              }
            }

            if (p5.startLink && p5.startLink.state.id === p5.selectedObject.object.id) p5.startLink = null;

            p5.selectedObject.object.remove();
            p5.states.splice(p5.selectedObject.index, 1);
          } else if (p5.selectedObject.object instanceof Link || p5.selectedObject.object instanceof SelfLink) {
            // Remove Link
            p5.selectedObject.object.transitionBox.remove();
            p5.links.splice(p5.selectedObject.index, 1);
          } else if (p5.selectedObject.object instanceof StartLink) {
            // Remove StartLink
            p5.startLink = null;
          }

          p5.selectedObject = null;
          // createHistory(p5, setSketchs);
        }
      };

      p5.stateRepulse = () => {
        if (p5.states.length < 2) return;

        const repulseRatio = 2.2;
        const repulseFactor = repulseRatio * p5.states[0].radius;

        for (let i = 0; i < p5.states.length; i++) {
          for (let j = 0; j < p5.states.length - 1; j++) {
            if (i == j) continue;
            let distance = p5.dist(p5.states[i].x, p5.states[i].y, p5.states[j].x, p5.states[j].y);
            if (distance < repulseFactor) {
              let angle = p5.atan2(p5.states[j].y - p5.states[i].y, p5.states[j].x - p5.states[i].x);
              let pushX = p5.cos(angle) * 5;
              let pushY = p5.sin(angle) * 5;
              p5.states[i].x -= pushX;
              p5.states[i].y -= pushY;
              p5.states[j].x += pushX;
              p5.states[j].y += pushY;
            }
          }
        }
      };

      // function checkAnyStateInputVisible() {
      //   return p5.states.some((state) => state.input.visible);
      // }

      p5.unHoverAllObjects = () => {
        p5.states.forEach((state) => (state.hovering = false));
        p5.links.forEach((link) => {
          link.hovering = false;
          link.transitionBox.hovering = false;
        });
        if (p5.startLink) p5.startLink.hovering = false;
      };

      p5.unSelectAllObjects = () => {
        p5.states.forEach((state) => (state.selected = false));
        p5.links.forEach((link) => {
          link.selected = false;
          link.transitionBox.selected = false;
        });
        if (p5.startLink) p5.startLink.selected = false;
      };

      p5.getFirstSelectedObject = (x = p5.mouseX, y = p5.mouseY, uncheckObjects = true) => {
        if (uncheckObjects) p5.unSelectAllObjects();

        for (let i = p5.states.length - 1; i >= 0; i--) {
          if (p5.states[i].containsPoint(x, y)) return { object: p5.states[i], index: i };
        }

        if (p5.startLink && p5.startLink.containsPoint(x, y)) return { object: p5.startLink, index: -1 };

        for (let i = p5.links.length - 1; i >= 0; i--) {
          if (p5.links[i].containsPoint(x, y)) return { object: p5.links[i], index: i };
        }

        return null;
      };

      p5.moveCanvas = (x = p5.mouseX, y = p5.mouseY) => {
        p5.canvasOffset.x = (p5.canvasOffset.x - (x - p5.pmouseX)) / p5.moveCanvasVelocity;
        p5.canvasOffset.y = (p5.canvasOffset.y - (y - p5.pmouseY)) / p5.moveCanvasVelocity;
      };

      p5.mouseReleasedInsideCanvas = () => {
        p5.canvasOffset.x = 0;
        p5.canvasOffset.y = 0;

        if (p5.currentLink instanceof TemporaryLink) {
          if (p5.currentLink.from && p5.currentLink.to) {
            let hoveredObject = p5.getFirstSelectedObject();

            if (hoveredObject && hoveredObject.object instanceof State) {
              // Check if the link is coming from another state
              if (p5.lastSelectedState && p5.lastSelectedState instanceof State) {
                let from = p5.lastSelectedState;
                let to = hoveredObject.object.id !== p5.lastSelectedState.id ? hoveredObject.object : null;

                if (
                  from &&
                  to &&
                  !p5.links.some(
                    (link) => link instanceof Link && link.stateA.id === from.id && link.stateB.id === to.id,
                  )
                ) {
                  p5.links.push(new Link(p5, from, to));
                  p5.links[p5.links.length - 1].transitionBox.selected = true;

                  // Extra: if already exists a link to -> from, turn links curved
                  if (
                    p5.links.some(
                      (link) => link instanceof Link && link.stateA.id === to.id && link.stateB.id === from.id,
                    )
                  ) {
                    let link = p5.links.find(
                      (link) => link instanceof Link && link.stateA.id === to.id && link.stateB.id === from.id,
                    );
                    if (link) {
                      if (link.perpendicularPart === 0) {
                        link.perpendicularPart = 10;
                        p5.links[p5.links.length - 1].perpendicularPart = 10;
                      }
                    }
                  }
                } else {
                  let link = p5.links.find(
                    (link) => link instanceof Link && link.stateA.id === from.id && link.stateB.id === to.id,
                  );
                  if (link) {
                    link.transitionBox.selected = true;
                    console.log("Link already exists");
                  }
                }
              } else {
                p5.startLink = new StartLink(p5, hoveredObject.object, p5.currentLink.from);
                p5.startLink.selected = true;

                for (let i = 0; i < p5.states.length; i++) p5.states[i].isStartState = false;
                hoveredObject.object.isStartState = true;

                // createHistory(p5, setSketchs);
              }
            } else {
              hoveredObject = null;
              p5.selectedObject = null;
              p5.lastSelectedState = null;
              p5.currentLink = null;
            }
          }
        } else if (p5.currentLink instanceof SelfLink) {
          p5.unSelectAllObjects();

          // Check if already exists a link to itself
          if (!p5.links.some((link) => link instanceof SelfLink && link.state.id === p5.lastSelectedState.id)) {
            p5.links.push(new SelfLink(p5, p5.currentLink.state, true));
            p5.links[p5.links.length - 1].transitionBox.selected = true;
          } else {
            let link = p5.links.find((link) => link instanceof SelfLink && link.state.id === p5.lastSelectedState.id);
            if (link) {
              console.log("SelfLink already exists");
              link.transitionBox.selected = true;
            }
          }
        }

        p5.currentLink = null;
        p5.lastSelectedState = null;

        if (p5.startLink) p5.startLink.mouseReleased();

        p5.links.forEach((link) => {
          link.mouseReleased();
        });

        p5.states.forEach((state) => {
          state.mouseReleased();
        });

        return false;
      };

      p5.mouseDraggedInsideCanvas = () => {
        if (!p5.mouseIsPressed || p5.mouseButton !== p5.LEFT) return false;

        if (p5.keyIsDown(p5.SHIFT) || p5.selectedLeftToolbarButton === "addLink") p5.createLink();

        return false;
      };

      p5.mousePressedInsideCanvas = () => {
        if (!focused) return false;

        if (
          p5.mouseButton === p5.CENTER ||
          p5.keyIsDown(p5.SHIFT) ||
          p5.keyIsDown(p5.CONTROL) ||
          p5.selectedLeftToolbarButton === "move"
        )
          return;

        p5.selectedObject = p5.getFirstSelectedObject();
        if (p5.selectedObject) p5.selectedObject.object.selected = true;

        if (p5.mouseButton === p5.LEFT) {
          // Add State on Click Canvas
          if (p5.selectedLeftToolbarButton === "addState" && !p5.selectedObject) {
            p5.unSelectAllObjects();

            // Check if mouse is over a link transition box
            if (p5.links.some((link) => link.transitionBox.containsPoint(p5.mouseX, p5.mouseY))) return;

            // Create new state
            let stateID = p5.getNewStateId();
            p5.states.push(new State(p5, stateID, p5.mouseX, p5.mouseY));
            p5.states[p5.states.length - 1].selected = true;
            p5.selectedObject = {
              object: p5.states[p5.states.length - 1],
              index: p5.states.length - 1,
            };

            // createHistory(p5, setSketchs);
            return false;
          }

          // Delete Object on Click Canvas
          if (p5.selectedLeftToolbarButton === "deleteObject") {
            // if (checkAnyStateInputVisible()) createHistory(p5, setSketchs);

            p5.deleteObject();

            p5.links.forEach((link) => {
              link.transitionBox.mousePressed();
            });
          }

          if (p5.selectedLeftToolbarButton === "selectObject" && p5.selectedObject) {
            p5.selectedObject.object.mousePressed();
          }
        }

        //   } else if (p5.mouseButton === p5.RIGHT) {
        //     if (p5.selectedObject && p5.selectedObject.object instanceof State) {
        //       p5.contextMenu.position(
        //         p5.globalWindowOffset.x + p5.selectedObject.object.x,
        //         p5.globalWindowOffset.y + p5.selectedObject.object.y,
        //       );

        //       if (p5.selectedObject.object.isEndState) {
        //         p5.select("#set-final-state-" + sketchIndex).html("Definir como Não Final");
        //       } else {
        //         p5.select("#set-final-state-" + sketchIndex).html("Definir como Final");
        //       }

        //       p5.contextMenu.show();
        //     }
        //   }

        //   return false;
        // }
      };

      p5.mouseReleased = () => {
        p5.canvasOffset.x = 0;
        p5.canvasOffset.y = 0;

        if (!focused) return false;

        p5.states.forEach((state) => {
          state.mouseReleased();
        });

        p5.links.forEach((link) => {
          link.mouseReleased();
        });
      };

      p5.doubleClickedInsideCanvas = () => {
        let hoveredObject = p5.getFirstSelectedObject(p5.mouseX, p5.mouseY, false);

        p5.links.forEach((link) => {
          link.transitionBox.doubleClick();
          link.doubleClick();
        });

        if (
          p5.links.some((link) => link.transitionBox.containsPoint(p5.mouseX, p5.mouseY) && link.transitionBox.selected)
        )
          return;

        if (p5.selectedLeftToolbarButton === "selectObject") {
          if (!hoveredObject) {
            console.log("Double clicked on empty space");
            let stateID = p5.getNewStateId();
            p5.states.push(new State(p5, stateID, p5.mouseX / p5.canvasScale, p5.mouseY / p5.canvasScale));
            p5.states[p5.states.length - 1].selected = true;
            p5.selectedObject = {
              object: p5.states[p5.states.length - 1],
              index: p5.states.length - 1,
            };

            // createHistory(p5, setSketchs);
          }

          // else {
          //   if (hoveredObject.object instanceof State) {
          //     console.log("Double clicked on state");
          //     p5.contextMenu.position(
          //       p5.globalWindowOffset.x + hoveredObject.object.x,
          //       p5.globalWindowOffset.y + hoveredObject.object.y,
          //     );

          //     if (hoveredObject.object.isEndState) {
          //       p5.select("#set-final-state-" + sketchIndex).html("Definir como Não Final");
          //     } else {
          //       p5.select("#set-final-state-" + sketchIndex).html("Definir como Final");
          //     }

          //     p5.contextMenu.show();
          //   }
          // }
        }

        return false;
      };

      p5.mouseWheelInsideCanvas = (event) => {
        if (event.deltaY > 0) p5.setZoom(-0.25);
        else if (event.deltaY < 0) p5.setZoom(0.25);
      };

      // // Keyboard functions
      // p5.keyPressed = () => {
      //   // if (p5.cnvIsFocused === "outside") return false;

      //   if (
      //     (p5.keyCode === 49 || p5.keyCode === 50 || p5.keyCode === 51 || p5.keyCode === 52 || p5.keyCode === 53) &&
      //     !p5.keyIsDown(p5.SHIFT) &&
      //     !p5.states.some((state) => state.input.visible) &&
      //     !p5.links.some((link) => link.transitionBox.selected) &&
      //     !p5.select("#lab-test-" + sketchIndex).hasClass("active")
      //   ) {
      //     let index = p5.keyCode - 49;
      //     let buttons = ["select", "move", "addState", "addLink", "delete"];
      //     p5.setSelectedMenuButton(buttons[index]);
      //     // return false;
      //   }

      //   if (p5.keyCode === p5.DELETE) p5.deleteObject();

      //   p5.states.forEach((state) => {
      //     state.keyPressed();
      //   });

      //   p5.links.forEach((link) => {
      //     link.transitionBox.keyPressed();
      //   });

      //   // Check ctrl + z
      //   if (p5.keyIsDown(p5.CONTROL) && (p5.key === "z" || p5.key === "Z")) {
      //     let newIndex = p5.max(p5.currentHistoryIndex - 1, 0);

      //     if (newIndex !== p5.currentHistoryIndex) {
      //       p5.currentHistoryIndex = newIndex;
      //       createCanvasStatesFromOBJ(p5.history[p5.currentHistoryIndex]);
      //     }
      //   }

      //   // Check ctrl + y
      //   if (p5.keyIsDown(p5.CONTROL) && (p5.key === "y" || p5.key === "Y")) {
      //     let newIndex = p5.min(p5.currentHistoryIndex + 1, p5.history.length - 1);

      //     if (newIndex !== p5.currentHistoryIndex) {
      //       p5.currentHistoryIndex = newIndex;
      //       createCanvasStatesFromOBJ(p5.history[p5.currentHistoryIndex]);
      //     }
      //   }

      //   // return false;
      // };

      p5.keyReleased = () => {
        if (!focused) return false;

        if (p5.keyCode === p5.SHIFT && p5.selectedLeftToolbarButton !== "addLink") {
          p5.currentLink = null;
        } else if (p5.keyCode === p5.CONTROL) {
          p5.canvasOffset.x = 0;
          p5.canvasOffset.y = 0;
        }

        return false;
      };
    },
    [id, focused],
  );

  return <ReactP5Wrapper sketch={sketch} />;
};
