import CustomInput from "./customInput";
import { drawText } from "../utils/calculateAndDrawText";
import { createHistory } from "../utils/history";

export default class State {
  constructor(p5, id, x, y) {
    this.p5 = p5;
    this.id = id;
    this.isStartState = false;
    this.isFinalState = false;
    this.previusScale = this.p5.canvasScale;

    // Dragging
    this.dragging = false;
    this.hovering = false;
    this.selected = false;
    this.simulating = false;

    // Position
    this.x = x;
    this.y = y;
    this.offsetX = 0;
    this.offsetY = 0;

    // Dimensions
    this.radius = 25 * this.p5.canvasScale;

    // Text input
    this.input = new CustomInput(p5, -1000, -1000);
    this.input.input.value("Q_{" + id + "}");
    this.input.textInput("Q_{" + id + "}");
  }

  closestPointOnCircle(x, y) {
    let dx = x - this.x;
    let dy = y - this.y;
    let scale = this.p5.sqrt(dx * dx + dy * dy);

    return {
      x: this.x + (dx * this.radius) / scale,
      y: this.y + (dy * this.radius) / scale,
    };
  }

  containsPoint(x, y) {
    let distance = this.p5.dist(x, y, this.x, this.y);
    return distance < this.radius;
  }

  mousePressed() {
    if (this.input.visible) {
      this.input.visible = false;
      createHistory(this.p5);
    }

    if (!this.selected) return;
    if (this.p5.selectedLeftToolbarButton !== "selectObject") return;
    if (!this.containsPoint(this.p5.mouseX, this.p5.mouseY)) return;

    this.dragging = true;
    this.offsetX = this.x - this.p5.mouseX;
    this.offsetY = this.y - this.p5.mouseY;
  }

  mouseReleased() {
    if (this.dragging) {
      this.dragging = false;
      createHistory(this.p5);
    }
  }

  remove() {
    this.input.input.remove();
  }

  update() {
    if (this.previusScale != this.p5.canvasScale) {
      this.radius = (this.radius / this.previusScale) * this.p5.canvasScale;
      this.x = (this.x / this.previusScale) * this.p5.canvasScale;
      this.y = (this.y / this.previusScale) * this.p5.canvasScale;
      this.previusScale = this.p5.canvasScale;
    }

    this.x -= this.p5.canvasOffset.x;
    this.y -= this.p5.canvasOffset.y;

    if (this.dragging) {
      this.x = this.p5.mouseX + this.offsetX;
      this.y = this.p5.mouseY + this.offsetY;
    }

    this.input.x = this.x;
    this.input.y = this.y - (this.radius + this.input.height + 5 * this.p5.canvasScale);

    if (this.input.visible && document.activeElement !== this.input.input.elt) {
      this.input.input.elt.focus();
    }

    this.input.update(this.p5.canvasScale);
  }

  keyPressed() {
    if (this.p5.keyCode === this.p5.ENTER && this.input.visible) {
      this.input.visible = false;
      createHistory(this.p5);
    }
  }

  draw() {
    this.p5.push();
    // Different fill based on status
    this.p5.strokeWeight(2 * this.p5.canvasScale);
    this.p5.fill("#1762A3");
    this.p5.stroke("#ffffff");

    if (this.hovering) this.p5.fill("#156cb9");
    if (this.selected) this.p5.fill("#11528C");

    if (this.simulating !== "none") {
      this.p5.strokeWeight(4 * this.p5.canvasScale);
      if (this.simulating === "accepted") this.p5.fill("#6cfe6c");
      if (this.simulating === "rejected") this.p5.fill("#ff0000");
      if (this.simulating === "simulating") this.p5.fill("#8B008B");
    }

    this.p5.ellipseMode(this.p5.CENTER);
    this.p5.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    if (this.isFinalState) this.p5.ellipse(this.x, this.y, this.radius * 1.6, this.radius * 1.6);

    this.p5.pop();

    this.p5.push();
    // Different fill based on status
    this.p5.fill("#ffffff");

    drawText(
      this.p5,
      this.x - (this.input.textWidth / 2) * this.p5.canvasScale,
      this.y,
      this.input.allSubstrings,
      this.input.fontSize * this.p5.canvasScale,
    );
    this.p5.pop();
  }
}
