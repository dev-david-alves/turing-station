import { drawArrow } from "../utils/drawArrow";
import { createHistory } from "../utils/history";

export default class StartLink {
  constructor(p5, state, start) {
    this.p5 = p5;
    this.state = state;
    this.previusScale = p5.canvasScale;
    this.deltaX = 0;
    this.deltaY = 0;
    this.snapToPadding = 6;
    this.hitTargetPadding = 6;

    // Status variables
    this.dragging = false;
    this.hovering = false;
    this.selected = false;

    if (start) this.setAnchorPoint(start.x, start.y);
  }

  containsPoint(x, y) {
    let stuff = this.getEndPoints();
    let dx = stuff.endX - stuff.startX;
    let dy = stuff.endY - stuff.startY;
    let length = this.p5.sqrt(dx * dx + dy * dy);
    let percent = (dx * (x - stuff.startX) + dy * (y - stuff.startY)) / (length * length);
    let distance = (dx * (y - stuff.startY) - dy * (x - stuff.startX)) / length;

    return percent > 0 && percent < 1 && this.p5.abs(distance) < this.hitTargetPadding * this.previusScale;
  }

  setAnchorPoint(x, y) {
    this.deltaX = x - this.state.x;
    this.deltaY = y - this.state.y;

    if (this.p5.abs(this.deltaX) < this.snapToPadding * this.previusScale) this.deltaX = 0;
    if (this.p5.abs(this.deltaY) < this.snapToPadding * this.previusScale) this.deltaY = 0;
  }

  getEndPoints() {
    let startX = this.state.x + this.deltaX;
    let startY = this.state.y + this.deltaY;
    let end = this.state.closestPointOnCircle(startX, startY);

    return {
      startX: startX,
      startY: startY,
      endX: end.x,
      endY: end.y,
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

  update() {
    if (this.previusScale !== this.p5.canvasScale) {
      this.deltaX = (this.deltaX / this.previusScale) * this.p5.canvasScale;
      this.deltaY = (this.deltaY / this.previusScale) * this.p5.canvasScale;
      this.previusScale = this.p5.canvasScale;
    }

    if (this.selected && this.dragging) {
      this.setAnchorPoint(this.p5.mouseX, this.p5.mouseY);
    }
  }

  draw() {
    let stuff = this.getEndPoints();

    this.p5.push();
    this.p5.stroke("#ffffff");
    this.p5.fill("#ffffff");
    this.p5.strokeWeight(2 * this.previusScale);

    // draw the line
    if (this.hovering) {
      this.p5.stroke("#6c9bcf");
      this.p5.fill("#6c9bcf");
    }

    if (this.selected) {
      this.p5.stroke("#11528C");
      this.p5.fill("#11528C");
    }

    this.p5.circle(stuff.startX, stuff.startY, 5 * this.previusScale);
    this.p5.line(stuff.startX, stuff.startY, stuff.endX, stuff.endY);

    // draw the head of the arrow
    drawArrow(this.p5, stuff.endX, stuff.endY, this.p5.atan2(-this.deltaY, -this.deltaX));
    this.p5.pop();
  }
}
