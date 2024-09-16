import Link from "../classes/link";
import SelfLink from "../classes/selfLink";
import StartLink from "../classes/startLink";
import State from "../classes/state";
import TemporaryLink from "../classes/temporaryLink";
import { createHistory } from "./history";

const touchStartedInsideCanvas = (p5, event) => {
  p5.closeBottomDrawer(event);
  let canCall = !(p5.isMouseOutsideCanvas() || p5.touches.length > 1);
  if (!canCall) return true;

  if (p5.checkAndCloseAllStateInputVisible()) createHistory(p5);

  if (p5.selectedLeftToolbarButton === "move") return true;
  if (p5.links.some((link) => link.transitionBox.selected)) return true;

  p5.selectedObject = p5.getFirstSelectedObject();
  if (p5.selectedObject) p5.selectedObject.object.selected = true;

  // Add State on Click Canvas
  if (p5.selectedLeftToolbarButton === "addState" && !p5.selectedObject) {
    p5.unSelectAllObjects();
    p5.createState(p5.mouseX, p5.mouseY);

    return true;
  }

  // Delete Object on Click Canvas
  if (p5.selectedLeftToolbarButton === "deleteObject") {
    p5.deleteObject();

    p5.links.forEach((link) => {
      link.transitionBox.mousePressed();
    });
  }

  if (p5.selectedLeftToolbarButton === "selectObject" && p5.selectedObject) {
    p5.selectedObject.object.mousePressed();
  }

  return true;
};

const touchMovedInsideCanvas = (p5, event) => {
  let canCall = !(p5.isMouseOutsideCanvas() || p5.touches.length > 1);
  if (!canCall) return true;

  event.preventDefault();
  if (p5.stateContextMenu) p5.stateContextMenu.hide();
  if (p5.keyIsDown(p5.SHIFT) || p5.selectedLeftToolbarButton === "addLink") p5.createLink();
};

const touchEndedInsideCanvas = (p5) => {
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
            !p5.links.some((link) => link instanceof Link && link.stateA.id === from.id && link.stateB.id === to.id)
          ) {
            p5.links.push(new Link(p5, from, to));
            p5.links[p5.links.length - 1].transitionBox.siblingRules = p5.findAllLinkSiblingRules(from);
            p5.links[p5.links.length - 1].transitionBox.selected = true;

            // Extra: if already exists a link to -> from, turn links curved
            if (
              p5.links.some((link) => link instanceof Link && link.stateA.id === to.id && link.stateB.id === from.id)
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

  return true;
};

export { touchStartedInsideCanvas, touchMovedInsideCanvas, touchEndedInsideCanvas };
