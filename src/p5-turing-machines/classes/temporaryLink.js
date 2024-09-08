import { drawArrow } from "../utils/drawArrow";

export default class TemporaryLink {
  constructor(p5) {
    this.p5 = p5;
    this.from = null;
    this.to = null;
    this.previusScale = p5.canvasScale;
  }

  draw() {
    if (!this.from || !this.to) return;

    this.p5.push();
    this.p5.stroke("#ffffff");
    this.p5.fill("#ffffff");
    this.p5.strokeWeight(2 * this.previusScale);

    this.p5.circle(this.from.x, this.from.y, 5 * this.previusScale);
    this.p5.line(this.from.x, this.from.y, this.to.x, this.to.y);

    // Draw the head of the arrow
    let angle = this.p5.atan2(this.to.y - this.from.y, this.to.x - this.from.x);
    drawArrow(this.p5, this.to.x, this.to.y, angle);
    this.p5.pop();
  }
}
