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

  return true;
};

const touchMovedInsideCanvas = (p5, event) => {
  let canCall = !(p5.isMouseOutsideCanvas() || p5.touches.length > 1);
  if (!canCall) return true;
  event.preventDefault();

  if (!p5.selectedObject) {
    p5.selectedObject = p5.getFirstSelectedObject();
    if (p5.selectedObject) p5.selectedObject.object.selected = true;
  }

  p5.states.forEach((state) => {
    if (state.selected) state.mousePressed();
  });

  p5.links.forEach((link) => {
    if (link.selected) link.mousePressed();
  });

  if (p5.startLink) {
    if (p5.startLink.selected) p5.startLink.mousePressed();
  }

  if (p5.stateContextMenu) p5.stateContextMenu.hide();
  if (p5.selectedLeftToolbarButton === "addLink") p5.createLink();
};

const touchEndedInsideCanvas = (p5) => {
  p5.mouseReleasedInsideCanvas();
};

export { touchStartedInsideCanvas, touchMovedInsideCanvas, touchEndedInsideCanvas };
