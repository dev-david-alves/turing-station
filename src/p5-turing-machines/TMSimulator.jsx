import State from "./classes/state";
import TemporaryLink from "./classes/temporaryLink";
import StartLink from "./classes/startLink";
import SelfLink from "./classes/selfLink";
import Link from "./classes/link";
import { createHistory } from "./utils/history";

import { ReactP5Wrapper } from "@p5-wrapper/react";
import { useMemo } from "react";
import { useSimulator } from "../providers/simulator";
import { createCanvasFromOBJ, createJSONExportObj } from "./utils/objectFunctions";
import { exportAsJSON, exportAsPNG, importJSONFile } from "./utils/importAndExport";
import {
  simulationReset,
  simulationStepBack,
  simulationStepForward,
  simulationFastResult,
  createMT,
  updateTape,
  updateUIWhenSimulating,
} from "./classes/simulation/run";

import test_mt from "../../test-mts/turing-machine - nd 2.json";
import { texMap } from "./utils/getTexMaps";

import { touchStartedInsideCanvas, touchMovedInsideCanvas, touchEndedInsideCanvas } from "./utils/touchInteractions";
import { SuccessToast } from "../components/Toast";
import { useQuestionSimulator } from "../providers/question";

export const TMSimulator = ({ id, whichProvider = "simulator" }) => {
  const { getOne, setSimulatorInfo } = whichProvider === "simulator" ? useSimulator() : useQuestionSimulator();
  const { name, tm_variant, tm_num_tapes, stayOption, data } = getOne(id);

  const setImportedInfo = ({ newName, newVariant, newNumTapes }) => {
    setSimulatorInfo((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, name: newName, tm_variant: newVariant, tm_num_tapes: newNumTapes } : item,
      ),
    );

    SuccessToast("Importação realizada com sucesso!")();
  };

  const sketch = useMemo(
    () => (p5) => {
      // General global properties
      p5.canvasID = id;
      p5.isFocused = false;
      p5.canvasOffset = { x: 0, y: 0 };
      p5.moveCanvasVelocity = 3;
      p5.canvasScale = 1.0;
      p5.mtCreated = null;
      p5.selectedLeftToolbarButton = null;
      p5.selectedBottomTab = undefined;
      p5.testTabClasslist = false;
      p5.multiTestTabClasslist = false;
      p5.tm_variant = tm_variant;
      p5.tm_num_tapes = tm_num_tapes;
      p5.tm_name = name;
      p5.stayOption = stayOption;
      p5.multitestNumTests = -1;
      p5.setDataFunction = setSimulatorInfo;
      p5.prevDeviceOrientation = p5.deviceOrientation;

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

      // Context Menus
      p5.stateContextMenu = null;

      // Other functions
      p5.reCalculateCanvasSize = () => {
        const playground = p5.select(`#playground-${id}`);
        if (!playground) return;
        p5.resizeCanvas(playground.width, playground.height);
        p5.rotateScreen();
      };

      p5.getNewStateId = () => {
        let maxId = -1;
        for (let i = 0; i < p5.states.length; i++) if (p5.states[i].id > maxId) maxId = p5.states[i].id;

        return maxId + 1;
      };

      p5.setLeftToolbarButton = (buttonId) => {
        if (p5.selectedLeftToolbarButton === buttonId.split("-")[1]) return;

        p5.selectedLeftToolbarButton = buttonId.split("-")[1];

        const getAllButtons = p5.selectAll(`.toolbar-action-buttons-${id}`);
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
          createHistory(p5);
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

      p5.abstractCreateMT = () => {
        const { success, mt } = createMT(p5);
        if (success) {
          p5.mtCreated = mt;
          let input = p5.select(`#simulation-input-${id}`).value();
          p5.mtCreated.setComputedWord(input);
          updateTape(p5);
          updateUIWhenSimulating(p5, false, false, true);
        }
      };

      p5.closeBottomDrawer = (event) => {
        let bottomDrawer = p5.select(`#bottom-drawer-${id}`);
        if (!bottomDrawer.elt.contains(event.target)) {
          setSimulatorInfo((prev) =>
            prev.map((item) => (item.id === id ? { ...item, bottomDrawerOpen: false } : item)),
          );
        }
      };

      p5.closeLabTab = () => {
        p5.selectedBottomTab = undefined;

        updateUIWhenSimulating(p5, false, false, false);

        p5.states.forEach((state) => {
          state.simulating = false;
          state.input.visible = false;
        });
      };

      p5.openLabTab = () => {
        p5.unSelectAllObjects();
        p5.selectedBottomTab = "test-tab";

        p5.abstractCreateMT();

        p5.states.forEach((state) => (state.input.visible = false));

        p5.currentLink = null;
        p5.lastSelectedState = null;
        p5.selectedObject = null;
        p5.setLeftToolbarButton(`menu-selectObject-${id}`);
      };

      p5.showErrors = () => {
        let simulationBottomButtons = p5.selectAll(`.simulation-bottom-buttons-${id}`);
        let input = p5.select(`#simulation-input-${id}`);
        if (!p5.startLink) {
          p5.select(`#erros-container-${id}`).show();
          p5.select(`#tape-container-${id}`).hide();
          simulationBottomButtons.forEach((button) => button.attribute("disabled", "true"));
          input.attribute("disabled", "true");
          return;
        }

        input.removeAttribute("disabled");
        p5.select(`#erros-container-${id}`).hide();
      };

      p5.toggleTestTab = () => {
        let newTestTabClasslist = Array.from(p5.select(`#simulation-nav-test-tab-${id}`).elt.classList);
        if (newTestTabClasslist.toString() !== p5.testTabClasslist.toString()) {
          p5.testTabClasslist = newTestTabClasslist;
          if (newTestTabClasslist.includes("selected-bottom-tab-button")) {
            p5.openLabTab();
          } else {
            p5.closeLabTab();
          }
        }
      };

      p5.toggleMultiTestTab = () => {
        let newMultiTestTabClasslist = Array.from(p5.select(`#simulation-nav-multitest-tab-${id}`).elt.classList);
        if (newMultiTestTabClasslist.toString() !== p5.multiTestTabClasslist.toString()) {
          p5.multiTestTabClasslist = newMultiTestTabClasslist;
          p5.cleanAllMultiTestInputs();
          if (newMultiTestTabClasslist.includes("selected-bottom-tab-button")) {
            p5.selectedBottomTab = "multitest-tab";
            p5.abstractCreateMT();
            p5.states.forEach((state) => {
              state.input.visible = false;
              state.simulating = false;
            });
            p5.links.forEach((link) => (link.transitionBox.selected = false));
          } else {
            p5.selectedBottomTab = undefined;
          }
        }
      };

      p5.cleanAllMultiTestInputs = () => {
        p5.selectAll(`.multitest-input-${id}`).forEach((input) => {
          input.removeClass("border-lightDanger");
          input.removeClass("border-lightGreen");

          let inputRandomId = input.attribute("data-randomid");
          let acceptedIcon = p5.select(`#accepted-testIcon-${inputRandomId}-${id}`);
          let rejectedIcon = p5.select(`#rejected-testIcon-${inputRandomId}-${id}`);

          if (acceptedIcon) acceptedIcon.hide();
          if (rejectedIcon) rejectedIcon.hide();
        });
      };

      p5.runMultiTest = () => {
        if (!p5.mtCreated) return;
        const allTestInputs = p5.selectAll(`.multitest-input-${id}`);

        allTestInputs.forEach((input) => {
          let value = input.value();
          if (value === "" || value.length === 0) value = texMap["\\Blank"];

          p5.mtCreated.setComputedWord(input.value());

          const { accepted } = p5.mtCreated.fastForward();

          input.removeClass("border-lightDanger");
          input.removeClass("border-lightGreen");
          let inputRandomId = input.attribute("data-randomid");
          let acceptedIcon = p5.select(`#accepted-testIcon-${inputRandomId}-${id}`);
          let rejectedIcon = p5.select(`#rejected-testIcon-${inputRandomId}-${id}`);

          if (accepted) {
            input.addClass("border-lightGreen");
            acceptedIcon.show();
            rejectedIcon.hide();
          } else {
            input.addClass("border-lightDanger");
            acceptedIcon.hide();
            rejectedIcon.show();
          }
        });
      };

      // Set multitest input events
      p5.setMultiTestInputEvents = () => {
        p5.selectAll(`.multitest-input-${id}`).forEach((input) => {
          input.input(() => p5.cleanAllMultiTestInputs());

          // Get the data-randomid attribute
          let dataRandomId = input.attribute("data-randomid");
          let deleteButton = p5.select(`#delete-multitest-input-${dataRandomId}-${id}`);

          // Toggling the delete button
          input.elt.addEventListener("focus", () => {
            deleteButton.removeClass("hidden");
            deleteButton.addClass("flex");
          });

          // Add a blur event listener
          input.elt.addEventListener("blur", () => {
            // After a delay, hide the delete button
            setTimeout(() => {
              deleteButton.removeClass("flex");
              deleteButton.addClass("hidden");
            }, 300);
          });
        });
      };

      p5.rotateScreen = () => {
        p5.prevDeviceOrientation =
          p5.windowWidth > p5.windowHeight && (p5.windowWidth < 500 || p5.windowHeight < 500)
            ? "landscape"
            : "portrait";

        let leftToolbar = p5.select(`#left-toolbar-${id}`);
        if (!leftToolbar) return;

        if (p5.prevDeviceOrientation === "landscape") {
          leftToolbar.removeClass("items-center");
          leftToolbar.removeClass("flex-col");
        } else {
          leftToolbar.addClass("items-center");
          leftToolbar.addClass("flex-col");
        }
      };

      // Main functions
      p5.setup = () => {
        // Create canvas
        const playground = p5.select(`#playground-${id}`);
        p5.cnv = p5.createCanvas(playground.width, playground.height);
        p5.cnv.id(`canvas-${id}`);
        p5.rotateScreen();
        p5.cnv.mousePressed(() => p5.mousePressedInsideCanvas());
        p5.cnv.mouseReleased(() => p5.mouseReleasedInsideCanvas());
        p5.cnv.mouseMoved(() => p5.mouseDraggedInsideCanvas()); // Used because there is no mouseDragged event for cnv
        p5.cnv.doubleClicked(() => p5.doubleClickedInsideCanvas());
        p5.cnv.mouseWheel((event) => p5.mouseWheelInsideCanvas(event));
        p5.cnv.touchStarted((event) => {
          if (p5.isFocused) touchStartedInsideCanvas(p5, event);
        });
        p5.cnv.touchMoved((event) => {
          if (p5.isFocused) touchMovedInsideCanvas(p5, event);
        });
        window.addEventListener("contextmenu", (e) => e.preventDefault());

        // Just for testing
        // createCanvasFromOBJ(p5, test_mt);
        // End of testing

        // Set leftToolbar buttons mousePressed
        const getAllButtons = p5.selectAll(`.toolbar-action-buttons-${id}`);
        getAllButtons.forEach((button) => {
          button.mousePressed(() => p5.setLeftToolbarButton(button.elt.id));
        });

        p5.setLeftToolbarButton(`menu-selectObject-${id}`);

        // Set functions to menu buttons
        p5.select(`#menu-cleanCanvas-${id}`).mousePressed(() => p5.cleanCanvas());
        p5.select(`#menu-undo-${id}`).mousePressed(() => undo());
        p5.select(`#menu-redo-${id}`).mousePressed(() => redo());
        p5.select(`#menu-zoomIn-${id}`).mousePressed(() => p5.setZoom(0.25));
        p5.select(`#menu-zoomOut-${id}`).mousePressed(() => p5.setZoom(-0.25));

        // Set import and export buttons
        p5.select(`#import-mt-input-${id}`).changed(() =>
          importJSONFile(p5, p5.select(`#import-mt-input-${id}`).elt.files[0], setImportedInfo),
        );
        p5.select(`#export-mt-png-${id}`).mousePressed(() => exportAsPNG(p5));
        p5.select(`#export-mt-json-${id}`).mousePressed(() => exportAsJSON(p5));

        // Set context menu buttons
        p5.stateContextMenu = p5.select(`#state-contextMenu-${id}`);
        p5.select(`#toggle-initial-state-${id}`).mousePressed(() => p5.setInitialState());
        p5.select(`#toggle-final-state-${id}`).mousePressed(() => p5.setFinalState());
        p5.select(`#rename-state-${id}`).mousePressed(() => p5.renameState());
        p5.select(`#delete-state-${id}`).mousePressed(() => p5.deleteObject());

        // Set simulation input and buttons
        p5.select(`#simulation-input-${id}`).input(() => p5.abstractCreateMT());
        p5.select(`#simulation-fast-reset-${id}`).mousePressed(() => simulationReset(p5));
        p5.select(`#simulation-step-back-${id}`).mousePressed(() => simulationStepBack(p5));
        p5.select(`#simulation-step-forward-${id}`).mousePressed(() => simulationStepForward(p5));
        p5.select(`#simulation-fast-simulation-${id}`).mousePressed(() => simulationFastResult(p5));
        p5.select(`#erros-container-${id}`).show();

        if (data) createCanvasFromOBJ(p5, data);

        // First save on history
        p5.history.push(createJSONExportObj(p5));

        p5.abstractCreateMT();
        p5.states.forEach((state) => (state.simulating = false));

        // Get the tab
        p5.testTabClasslist = Array.from(p5.select(`#simulation-nav-test-tab-${id}`).elt.classList);
        p5.multiTestTabClasslist = Array.from(p5.select(`#simulation-nav-multitest-tab-${id}`).elt.classList);
        p5.select(`#run-multitest-${id}`).mousePressed(() => p5.runMultiTest());

        p5.setMultiTestInputEvents();
        p5.multitestNumTests = p5.selectAll(`.multitest-input-${id}`).length;

        // Initializate the ruleSibling for each link
        p5.links.forEach((link) => {
          if (link instanceof Link) {
            link.transitionBox.siblingRules = p5.findAllLinkSiblingRules(link.stateA);
          } else {
            link.transitionBox.siblingRules = p5.findAllLinkSiblingRules(link.state);
          }
        });
      };

      p5.draw = () => {
        let editModal = p5.select(`#edit-simulator-modal-${id}`);

        if (editModal && editModal.hasClass("editPopoverOpen")) {
          p5.states.forEach((state) => (state.input.visible = false));
          p5.links.forEach((link) => (link.transitionBox.selected = false));
        }

        // Updating the tm_name by doom because I can't access the update "name"
        p5.tm_name = p5.select(`#simulator-name-${id}`).elt.innerText;

        let simulatorDiv = p5.select(`#simulator-${id}`);
        p5.isFocused = simulatorDiv.hasClass("shadow-high") || simulatorDiv.hasClass("shadow-question");

        if (!p5.isFocused) return;

        p5.showErrors();
        p5.toggleTestTab();
        p5.toggleMultiTestTab();

        if (p5.selectAll(`.multitest-input-${id}`).length !== p5.multitestNumTests) {
          p5.multitestNumTests = p5.selectAll(`.multitest-input-${id}`).length;
          p5.setMultiTestInputEvents();
          p5.cleanAllMultiTestInputs();
        }

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

        // Do not allow to create a link from a final state
        if (p5.lastSelectedState && p5.lastSelectedState.isFinalState) p5.currentLink = null;

        // Draw the current link
        if (p5.currentLink) p5.currentLink.draw();

        // To prevent states from overlapping
        p5.stateRepulse();

        // Change cursor
        if (
          (p5.startLink && p5.startLink.hovering) ||
          p5.states.some((state) => state.hovering) ||
          p5.links.some((link) => link.hovering) ||
          p5.links.some((link) => link.transitionBox.ruleContainsPoint(p5.mouseX, p5.mouseY) != -1)
        )
          p5.cursor("pointer");
        else p5.cursor("default");
      };

      p5.findAllLinkSiblingRules = (originState) => {
        let rules = [];
        if (!originState) return rules;

        p5.links.forEach((link) => {
          if (link instanceof Link) {
            if (link.stateA.id === originState.id) {
              link.transitionBox.rules.forEach((rule) => {
                rules.push(rule);
              });
            }
          } else {
            if (link.state.id === originState.id) {
              link.transitionBox.rules.forEach((rule) => {
                rules.push(rule);
              });
            }
          }
        });

        return rules;
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

      p5.setInitialState = (stateID = null, props = null) => {
        let linkSize = 80 * p5.canvasScale;

        if (stateID === null) {
          if (!p5.selectedObject) return;
          if (!(p5.selectedObject.object instanceof State)) return;

          const selectedState = p5.selectedObject.object;
          let start = {
            x: selectedState.x - linkSize,
            y: selectedState.y,
          };
          p5.startLink = new StartLink(p5, selectedState, start);
          p5.startLink.selected = true;

          // Unset the start state for all states
          p5.states.forEach((state) => {
            state.isStartState = false;
            state.selected = false;
          });

          // Set the selected state as the start state
          selectedState.isStartState = true;
          createHistory(p5);
        } else {
          const state = p5.states.find((state) => state.id === stateID);
          if (state) {
            let start = { x: state.x - linkSize, y: state.y };

            // Modify the starting position if props are provided
            if (props) {
              start = {
                x: state.x + props.deltaX,
                y: state.y + props.deltaY,
              };
            }

            // Create a new StartLink for the specified state
            p5.startLink = new StartLink(p5, state, start);
            p5.startLink.selected = true;

            // Unset the start state for all states
            p5.states.forEach((state) => {
              state.isStartState = false;
              state.selected = false;
            });

            // Set the specified state as the start state
            state.isStartState = true;
            createHistory(p5);
          }
        }

        // Hide the context menu
        if (p5.stateContextMenu) p5.stateContextMenu.hide();
      };

      p5.setFinalState = () => {
        if (!p5.selectedObject) return;
        if (!(p5.selectedObject.object instanceof State)) return;

        const selectedState = p5.selectedObject.object;
        selectedState.isFinalState = !selectedState.isFinalState;

        createHistory(p5);

        // Hide the context menu
        if (p5.stateContextMenu) p5.stateContextMenu.hide();
      };

      p5.renameState = () => {
        if (!p5.selectedObject) return;
        if (!(p5.selectedObject.object instanceof State)) return;

        const selectedState = p5.selectedObject.object;
        selectedState.input.visible = true;
        p5.stateContextMenu.hide();
      };

      p5.deleteObject = () => {
        if (!p5.selectedObject) return false;

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
        createHistory(p5);
        if (p5.stateContextMenu) p5.stateContextMenu.hide();
      };

      p5.createState = (x = p5.mouseX, y = p5.mouseX) => {
        // Check if mouse is over a link transition box
        if (p5.links.some((link) => link.transitionBox.containsPoint(x, y))) return;
        if (p5.links.some((link) => link.transitionBox.ruleContainsPoint(x, y) != -1)) return;

        // Create new state
        let stateID = p5.getNewStateId();
        p5.states.push(new State(p5, stateID, x, y));
        p5.states[p5.states.length - 1].selected = true;
        p5.selectedObject = {
          object: p5.states[p5.states.length - 1],
          index: p5.states.length - 1,
        };

        createHistory(p5);
      };

      p5.stateRepulse = () => {
        if (p5.states.length < 2) return;

        // For states to repulse each other
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

      p5.checkAndCloseAllStateInputVisible = () => {
        const stateInputVisible = p5.states.some((state) => state.input.visible);
        if (stateInputVisible) {
          p5.states.forEach((state) => (state.input.visible = false));
          return true;
        }

        return false;
      };

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
                  p5.links[p5.links.length - 1].transitionBox.siblingRules = p5.findAllLinkSiblingRules(from);
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
                    link.transitionBox.siblingRules = p5.findAllLinkSiblingRules(from);
                    link.transitionBox.selected = true;
                  }
                }
              } else {
                p5.startLink = new StartLink(p5, hoveredObject.object, p5.currentLink.from);
                p5.startLink.selected = true;

                for (let i = 0; i < p5.states.length; i++) p5.states[i].isStartState = false;
                hoveredObject.object.isStartState = true;

                createHistory(p5);
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
            p5.links[p5.links.length - 1].transitionBox.siblingRules = p5.findAllLinkSiblingRules(p5.currentLink.state);
            p5.links[p5.links.length - 1].transitionBox.selected = true;
          } else {
            let link = p5.links.find((link) => link instanceof SelfLink && link.state.id === p5.lastSelectedState.id);
            if (link) {
              link.transitionBox.siblingRules = p5.findAllLinkSiblingRules(p5.lastSelectedState);
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

      p5.openStateContextMenu = () => {
        if (p5.selectedObject && p5.selectedObject.object instanceof State) {
          if (!p5.stateContextMenu) return false;
          const selectedState = p5.selectedObject.object;

          // Get height of the context menu
          p5.stateContextMenu.position(p5.canvasOffset.x + selectedState.x, p5.canvasOffset.y + selectedState.y);

          if (selectedState.isFinalState) {
            p5.select("#toggle-final-state-" + id).html("Definir como não final");
          } else {
            p5.select("#toggle-final-state-" + id).html("Definir como final");
          }

          p5.stateContextMenu.show();
        }
      };

      p5.mousePressedInsideCanvas = () => {
        if (!p5.isFocused) return false;
        if (p5.stateContextMenu) p5.stateContextMenu.hide();
        if (p5.checkAndCloseAllStateInputVisible()) createHistory(p5);

        if (
          p5.mouseButton === p5.CENTER ||
          p5.keyIsDown(p5.SHIFT) ||
          p5.keyIsDown(p5.CONTROL) ||
          p5.selectedLeftToolbarButton === "move"
        )
          return false;

        p5.selectedObject = p5.getFirstSelectedObject();
        if (p5.selectedObject) p5.selectedObject.object.selected = true;

        if (p5.mouseButton === p5.LEFT) {
          // Add State on Click Canvas
          if (p5.selectedLeftToolbarButton === "addState" && !p5.selectedObject) {
            p5.unSelectAllObjects();
            p5.createState(p5.mouseX, p5.mouseY);

            return false;
          }

          // Delete Object on Click Canvas
          if (p5.selectedLeftToolbarButton === "deleteObject") {
            p5.deleteObject();

            p5.links.forEach((link) => {
              link.transitionBox.deleteRule();
            });
          }

          p5.links.forEach((link) => {
            link.transitionBox.mousePressed();
          });

          if (p5.selectedLeftToolbarButton === "selectObject" && p5.selectedObject) {
            p5.selectedObject.object.mousePressed();
          }
        } else if (p5.mouseButton === p5.RIGHT) {
          p5.openStateContextMenu();
        }

        return false;
      };

      p5.isMouseOutsideCanvas = () => {
        return p5.mouseX < 0 || p5.mouseY < 0 || p5.mouseX > p5.width || p5.mouseY > p5.height;
      };

      // MousePressed
      p5.mousePressed = (event) => {
        p5.closeBottomDrawer(event);
      };

      // MouseDragged
      p5.mouseDraggedInsideCanvas = () => {
        if (!p5.mouseIsPressed || p5.mouseButton !== p5.LEFT) return false;

        if (p5.keyIsDown(p5.SHIFT) || p5.selectedLeftToolbarButton === "addLink") p5.createLink();

        return false;
      };

      // MouseReleased and TouchEnded
      p5.mouseReleased = () => {
        p5.canvasOffset.x = 0;
        p5.canvasOffset.y = 0;

        if (p5.startLink) p5.startLink.mouseReleased();

        p5.states.forEach((state) => {
          state.mouseReleased();
        });

        p5.links.forEach((link) => {
          link.mouseReleased();
        });

        if (!p5.isFocused) return true;
        // Outside canvas
        if (p5.isMouseOutsideCanvas()) {
          p5.currentLink = null;
          return true;
        }
      };

      p5.touchEnded = () => {
        p5.canvasOffset.x = 0;
        p5.canvasOffset.y = 0;

        if (p5.startLink) p5.startLink.mouseReleased();

        p5.states.forEach((state) => {
          state.mouseReleased();
        });

        p5.links.forEach((link) => {
          link.mouseReleased();
        });

        if (!p5.isFocused) return true;
        // Outside canvas
        if (p5.isMouseOutsideCanvas()) {
          p5.currentLink = null;
          return true;
        }

        touchEndedInsideCanvas(p5);
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

        if (p5.selectedLeftToolbarButton === "selectObject" && hoveredObject) {
          if (hoveredObject.object instanceof State) {
            p5.openStateContextMenu();
          }
        }

        return false;
      };

      p5.mouseWheelInsideCanvas = (event) => {
        if (event.deltaY > 0) p5.setZoom(-0.25);
        else if (event.deltaY < 0) p5.setZoom(0.25);
      };

      const undo = () => {
        let newIndex = p5.max(p5.currentHistoryIndex - 1, 0);

        if (newIndex !== p5.currentHistoryIndex) {
          p5.currentHistoryIndex = newIndex;
          createCanvasFromOBJ(p5, p5.history[newIndex]);
          p5.setDataFunction((prev) =>
            prev.map((item) => (item.id === p5.canvasID ? { ...item, data: p5.history[newIndex] } : item)),
          );
        }
      };

      const redo = () => {
        let newIndex = p5.min(p5.currentHistoryIndex + 1, p5.history.length - 1);

        if (newIndex !== p5.currentHistoryIndex) {
          p5.currentHistoryIndex = newIndex;
          createCanvasFromOBJ(p5, p5.history[newIndex]);
          p5.setDataFunction((prev) =>
            prev.map((item) => (item.id === p5.canvasID ? { ...item, data: p5.history[newIndex] } : item)),
          );
        }
      };

      // Keyboard functions
      p5.keyPressed = () => {
        if (!p5.isFocused) return true;

        if (p5.keyCode === p5.DELETE) p5.deleteObject();

        p5.states.forEach((state) => {
          state.keyPressed();
        });

        p5.links.forEach((link) => {
          link.transitionBox.keyPressed();
        });

        // Check ctrl + z
        if (p5.keyIsDown(p5.CONTROL) && (p5.key === "z" || p5.key === "Z")) undo();

        // Check ctrl + y
        if (p5.keyIsDown(p5.CONTROL) && (p5.key === "y" || p5.key === "Y")) redo();
      };

      p5.keyReleased = () => {
        if (!p5.isFocused) return true;

        if (p5.keyCode === p5.SHIFT && p5.selectedLeftToolbarButton !== "addLink") {
          p5.currentLink = null;
        } else if (p5.keyCode === p5.CONTROL) {
          p5.canvasOffset.x = 0;
          p5.canvasOffset.y = 0;
        }
      };
    },
    [id],
  );

  return <ReactP5Wrapper sketch={sketch} />;
};
