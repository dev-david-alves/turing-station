import CustomInput from "./customInput";
import { drawText } from "../utils/calculateAndDrawText";
import { createHistory } from "../utils/history";

export default class State {
  constructor(p5, id, x, y, r) {
    this.p5 = p5;
    this.id = id;
    this.isStartState = false;
    this.isEndState = false;

    this.scaleFactor = p5.globalScaleFactor;

    // Dragging
    this.dragging = false;
    this.hovering = false;
    this.selected = false;
    this.simulating = false;

    // Position
    this.x = x * this.scaleFactor;
    this.y = y * this.scaleFactor;
    this.offsetX = 0;
    this.offsetY = 0;

    // Dimensions
    this.r = r * this.scaleFactor;

    // Text input
    this.input = new CustomInput(p5, -1000, -1000, null);
    this.input.input.value("Q_{" + id + "}");
    this.input.textInput("Q_{" + id + "}");
  }

  closestPointOnCircle(x, y) {
    let dx = x - this.x;
    let dy = y - this.y;
    let scale = this.p5.sqrt(dx * dx + dy * dy);

    return {
      x: this.x + (dx * this.r) / scale,
      y: this.y + (dy * this.r) / scale,
    };
  }

  containsPoint(x, y) {
    let distance = this.p5.dist(x, y, this.x, this.y);
    return distance < this.r;
  }

  mousePressed() {
    if (this.input.visible) {
      this.input.visible = false;
      createHistory(this.p5);
    }

    if (this.selected && this.p5.selectedLeftSidebarButton === "select") {
      this.dragging = true;
      this.offsetX = this.x - this.p5.mouseX;
      this.offsetY = this.y - this.p5.mouseY;
    }
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
    if (this.scaleFactor != this.p5.globalScaleFactor) {
      this.r = (this.r / this.scaleFactor) * this.p5.globalScaleFactor;
      this.x = (this.x / this.scaleFactor) * this.p5.globalScaleFactor;
      this.y = (this.y / this.scaleFactor) * this.p5.globalScaleFactor;
      this.scaleFactor = this.p5.globalScaleFactor;
    }

    this.x -= this.p5.movingCanvasOffset.x;
    this.y -= this.p5.movingCanvasOffset.y;

    if (this.dragging) {
      this.x = this.p5.mouseX + this.offsetX;
      this.y = this.p5.mouseY + this.offsetY;
    }

    this.input.x = this.x - this.input.width / 2;
    this.input.y = this.y - (this.r + this.input.height + 5 * this.scaleFactor);

    if (this.input.visible && document.activeElement !== this.input.input.elt) {
      this.input.input.elt.focus();
    }

    this.input.update(this.scaleFactor);
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
    this.p5.strokeWeight(2 * this.scaleFactor);
    this.p5.fill("#1762A3");
    this.p5.stroke("#ffffff");
    if (this.selected) this.p5.fill("#11528C");
    if (this.simulating) {
      this.p5.strokeWeight(4 * this.scaleFactor);
      this.p5.fill("purple");
    }

    this.p5.ellipseMode(this.p5.CENTER);
    this.p5.ellipse(this.x, this.y, this.r * 2, this.r * 2);
    if (this.isEndState) this.p5.ellipse(this.x, this.y, this.r * 1.6, this.r * 1.6);

    this.p5.pop();

    this.p5.push();
    // Different fill based on status
    this.p5.fill("#ffffff");

    drawText(
      this.p5,
      this.x - (this.input.textWidth / 2) * this.p5.globalScaleFactor,
      this.y,
      this.input.allSubstrings,
      this.input.fontSize * this.p5.globalScaleFactor,
    );
    this.p5.pop();
  }
}
