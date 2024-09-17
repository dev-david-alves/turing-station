import { drawArrow } from "../utils/drawArrow";
import { createHistory } from "../utils/history";
import { updateBoxPosition } from "../utils/updateTBoxPosition";
import TransitionBox from "./transitionBox";

export default class SelfLink {
  constructor(p5, state, createTransitionBox = false, rules = [], anchorAngle = 0) {
    this.p5 = p5;
    this.state = state;
    this.previusScale = p5.canvasScale;
    this.anchorAngle = anchorAngle;
    this.mouseOffsetAngle = 0;
    this.hitTargetPadding = 6;

    // Status
    this.hovering = false;
    this.selected = false;

    if (anchorAngle === 0) this.setAnchorPoint(p5.mouseX, p5.mouseY);

    // Transition box
    this.transitionBox = null;
    if (createTransitionBox) this.transitionBox = new TransitionBox(p5, -1000, -1000, rules);
  }

  containsPoint(x, y) {
    let stuff = this.getEndPointsAndCircle();
    let dx = x - stuff.circleX;
    let dy = y - stuff.circleY;
    let distance = this.p5.sqrt(dx * dx + dy * dy) - stuff.circleR;

    return this.p5.abs(distance) < this.hitTargetPadding * this.previusScale;
  }

  setAnchorPoint(x, y) {
    this.anchorAngle = this.p5.atan2(y - this.state.y, x - this.state.x) + this.mouseOffsetAngle;
    // snap to 90 degrees
    let snap = this.p5.round(this.anchorAngle / (this.p5.PI / 2)) * (this.p5.PI / 2);
    if (this.p5.abs(this.anchorAngle - snap) < 0.1) this.anchorAngle = snap;

    // keep in the range -pi to pi so our containsPoint() function always works
    if (this.anchorAngle < -this.p5.PI) this.anchorAngle += 2 * this.p5.PI;
    if (this.anchorAngle > this.p5.PI) this.anchorAngle -= 2 * this.p5.PI;
  }

  getEndPointsAndCircle() {
    let circleX = this.state.x + 1.5 * this.state.radius * this.p5.cos(this.anchorAngle);
    let circleY = this.state.y + 1.5 * this.state.radius * this.p5.sin(this.anchorAngle);
    let circleR = 0.75 * this.state.radius;
    let startAngle = this.anchorAngle - this.p5.PI * 0.8;
    let endAngle = this.anchorAngle + this.p5.PI * 0.8;
    let startX = circleX + circleR * this.p5.cos(startAngle);
    let startY = circleY + circleR * this.p5.sin(startAngle);
    let endX = circleX + circleR * this.p5.cos(endAngle);
    let endY = circleY + circleR * this.p5.sin(endAngle);

    return {
      hasCircle: true,
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
      startAngle: startAngle,
      endAngle: endAngle,
      circleX: circleX,
      circleY: circleY,
      circleR: circleR,
    };
  }

  mousePressed() {
    if (this.p5.selectedLeftToolbarButton === "addLink") return;

    if (!this.selected) return;
    if (this.p5.selectedLeftToolbarButton !== "selectObject") return;
    if (!this.containsPoint(this.p5.mouseX, this.p5.mouseY)) return;

    this.dragging = true;
  }

  mouseReleased() {
    if (this.dragging) {
      this.dragging = false;
      createHistory(this.p5);
    }
  }

  doubleClick() {
    if (this.hovering) this.transitionBox.selected = true;
  }

  update() {
    this.previusScale = this.p5.canvasScale;

    if (this.selected && this.dragging) this.setAnchorPoint(this.p5.mouseX, this.p5.mouseY);

    // update the box
    let stuff = this.getEndPointsAndCircle();
    if (stuff.hasCircle) {
      let startAngle = stuff.startAngle;
      let endAngle = stuff.endAngle;

      if (endAngle < startAngle) {
        endAngle += this.p5.PI * 2;
      }
      let boxX = stuff.circleX + stuff.circleR * this.p5.cos(this.anchorAngle);
      let boxY = stuff.circleY + stuff.circleR * this.p5.sin(this.anchorAngle);

      updateBoxPosition(this.p5, this.transitionBox, boxX, boxY, this.anchorAngle, true, this.state);
    }

    if (this.transitionBox.selected) {
      this.selected = false;
      this.p5.selectedObject = null;
    }
  }

  draw() {
    let stuff = this.getEndPointsAndCircle();
    this.p5.push();
    this.p5.stroke("#ffffff");
    this.p5.fill("#ffffff");
    this.p5.strokeWeight(2 * this.previusScale);

    if (this.hovering) {
      this.p5.stroke("#E4E4E4");
      this.p5.fill("#E4E4E4");
    }

    if (this.selected) {
      this.p5.stroke("#11528C");
      this.p5.fill("#11528C");
    }

    // draw arc
    this.p5.push();
    this.p5.noFill();
    this.p5.arc(stuff.circleX, stuff.circleY, stuff.circleR * 2, stuff.circleR * 2, stuff.startAngle, stuff.endAngle);
    this.p5.pop();

    // draw the head of the arrow
    drawArrow(this.p5, stuff.endX, stuff.endY, stuff.endAngle + this.p5.PI * 0.4);
    this.p5.pop();
  }
}
