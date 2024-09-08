import { drawArrow } from "../utils/drawArrow";
import { createHistory } from "../utils/history";
import { updateBoxPosition } from "../utils/updateTBoxPosition";
import TransitionBox from "./transitionBox";

export default class Link {
  constructor(p5, stateA, stateB, rules = [], parallelPart = 0.5, perpendicularPart = 0, lineAngleAdjust = 0) {
    this.p5 = p5; // Store the p5 instance
    this.stateA = stateA;
    this.stateB = stateB;
    this.previusScale = p5.canvasScale;
    this.snapToPadding = 6;
    this.hitTargetPadding = 6;

    // Status
    this.hovering = false;
    this.selected = false;
    this.dragging = false;

    // Make anchor point relative to the locations of stateA and stateB
    this.parallelPart = parallelPart;
    this.perpendicularPart = perpendicularPart;
    this.lineAngleAdjust = lineAngleAdjust;

    // Transition box
    this.transitionBox = new TransitionBox(p5, -1000, -1000, rules);
  }

  det(a, b, c, d, e, f, g, h, i) {
    return a * e * i + b * f * g + c * d * h - a * f * h - b * d * i - c * e * g;
  }

  circleFromThreePoints(x1, y1, x2, y2, x3, y3) {
    let a = this.det(x1, y1, 1, x2, y2, 1, x3, y3, 1);
    let bx = -this.det(x1 * x1 + y1 * y1, y1, 1, x2 * x2 + y2 * y2, y2, 1, x3 * x3 + y3 * y3, y3, 1);
    let by = this.det(x1 * x1 + y1 * y1, x1, 1, x2 * x2 + y2 * y2, x2, 1, x3 * x3 + y3 * y3, x3, 1);
    let c = -this.det(x1 * x1 + y1 * y1, x1, y1, x2 * x2 + y2 * y2, x2, y2, x3 * x3 + y3 * y3, x3, y3);

    return {
      x: -bx / (2 * a),
      y: -by / (2 * a),
      r: this.p5.sqrt(bx * bx + by * by - 4 * a * c) / (2 * this.p5.abs(a)),
    };
  }

  getAnchorPoint() {
    let dx = this.stateB.x - this.stateA.x;
    let dy = this.stateB.y - this.stateA.y;
    let scale = this.p5.sqrt(dx * dx + dy * dy);

    return {
      x: this.stateA.x + dx * this.parallelPart - (dy * this.perpendicularPart) / scale,
      y: this.stateA.y + dy * this.parallelPart + (dx * this.perpendicularPart) / scale,
    };
  }

  setAnchorPoint(x, y) {
    let dx = this.stateB.x - this.stateA.x;
    let dy = this.stateB.y - this.stateA.y;
    let scale = this.p5.sqrt(dx * dx + dy * dy);

    this.parallelPart = (dx * (x - this.stateA.x) + dy * (y - this.stateA.y)) / (scale * scale);
    this.perpendicularPart = (dx * (y - this.stateA.y) - dy * (x - this.stateA.x)) / scale;

    // Snap to a straight line
    if (
      this.parallelPart > 0 &&
      this.parallelPart < 1 &&
      this.p5.abs(this.perpendicularPart) < this.snapToPadding * this.previusScale
    ) {
      this.lineAngleAdjust = (this.perpendicularPart < 0) * this.p5.PI;
      this.perpendicularPart = 0;
    }
  }

  getEndPointsAndCircle() {
    if (this.perpendicularPart == 0) {
      let midX = (this.stateA.x + this.stateB.x) / 2;
      let midY = (this.stateA.y + this.stateB.y) / 2;
      let start = this.stateA.closestPointOnCircle(midX, midY);
      let end = this.stateB.closestPointOnCircle(midX, midY);

      return {
        hasCircle: false,
        startX: start.x,
        startY: start.y,
        endX: end.x,
        endY: end.y,
      };
    }

    let anchor = this.getAnchorPoint();
    let circle = this.circleFromThreePoints(
      this.stateA.x,
      this.stateA.y,
      this.stateB.x,
      this.stateB.y,
      anchor.x,
      anchor.y,
    );
    let isReversed = this.perpendicularPart > 0;
    let reverseScale = isReversed ? 1 : -1;
    let startAngle =
      this.p5.atan2(this.stateA.y - circle.y, this.stateA.x - circle.x) -
      (reverseScale * this.stateA.radius) / circle.r;
    let endAngle =
      this.p5.atan2(this.stateB.y - circle.y, this.stateB.x - circle.x) +
      (reverseScale * this.stateA.radius) / circle.r;

    let startX = circle.x + circle.r * this.p5.cos(startAngle);
    let startY = circle.y + circle.r * this.p5.sin(startAngle);
    let endX = circle.x + circle.r * this.p5.cos(endAngle);
    let endY = circle.y + circle.r * this.p5.sin(endAngle);

    return {
      hasCircle: true,
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
      startAngle: startAngle,
      endAngle: endAngle,
      circleX: circle.x,
      circleY: circle.y,
      circleR: circle.r,
      reverseScale: reverseScale,
      isReversed: isReversed,
    };
  }

  containsPoint(x, y) {
    let stuff = this.getEndPointsAndCircle();

    if (stuff.hasCircle) {
      let dx = x - stuff.circleX;
      let dy = y - stuff.circleY;
      let distance = this.p5.sqrt(dx * dx + dy * dy) - stuff.circleR;

      if (this.p5.abs(distance) < this.hitTargetPadding * this.previusScale) {
        let angle = this.p5.atan2(dy, dx);
        let startAngle = stuff.startAngle;
        let endAngle = stuff.endAngle;

        if (stuff.isReversed) {
          let temp = startAngle;
          startAngle = endAngle;
          endAngle = temp;
        }

        if (endAngle < startAngle) {
          endAngle += this.p5.PI * 2;
        }

        if (angle < startAngle) {
          angle += this.p5.PI * 2;
        } else if (angle > endAngle) {
          angle -= this.p5.PI * 2;
        }

        return angle > startAngle && angle < endAngle;
      }
    } else {
      let dx = stuff.endX - stuff.startX;
      let dy = stuff.endY - stuff.startY;
      let length = this.p5.sqrt(dx * dx + dy * dy);
      let percent = (dx * (x - stuff.startX) + dy * (y - stuff.startY)) / (length * length);
      let distance = (dx * (y - stuff.startY) - dy * (x - stuff.startX)) / length;

      return percent > 0 && percent < 1 && this.p5.abs(distance) < this.hitTargetPadding * this.previusScale;
    }

    return false;
  }

  mousePressed() {
    if (this.p5.selectedLeftToolbarButton === "addLink") return;

    if (!this.selected) return;

    this.dragging = this.p5.selectedLeftToolbarButton === "selectObject";
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
    if (this.previusScale !== this.p5.canvasScale) {
      this.parallelPart = (this.parallelPart / this.previusScale) * this.p5.canvasScale;
      this.perpendicularPart = (this.perpendicularPart / this.previusScale) * this.p5.canvasScale;
      this.lineAngleAdjust = (this.lineAngleAdjust / this.previusScale) * this.p5.canvasScale;
      this.previusScale = this.p5.canvasScale;
    }

    if (this.selected && this.dragging) this.setAnchorPoint(this.p5.mouseX, this.p5.mouseY);

    // update the box
    let stuff = this.getEndPointsAndCircle();
    if (stuff.hasCircle) {
      let startAngle = stuff.startAngle;
      let endAngle = stuff.endAngle;

      if (endAngle < startAngle) {
        endAngle += this.p5.PI * 2;
      }
      let boxAngle = (startAngle + endAngle) / 2 + stuff.isReversed * this.p5.PI;
      let boxX = stuff.circleX + stuff.circleR * this.p5.cos(boxAngle);
      let boxY = stuff.circleY + stuff.circleR * this.p5.sin(boxAngle);
      updateBoxPosition(this.p5, this.transitionBox, boxX, boxY, boxAngle);
    } else {
      let boxX = (stuff.startX + stuff.endX) / 2;
      let boxY = (stuff.startY + stuff.endY) / 2;
      let boxAngle = this.p5.atan2(stuff.endX - stuff.startX, stuff.startY - stuff.endY);
      updateBoxPosition(this.p5, this.transitionBox, boxX, boxY, boxAngle);
    }

    if (this.transitionBox.selected) {
      this.selected = false;
      this.p5.selectedObject = null;
    }
  }

  draw() {
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

    let stuff = this.getEndPointsAndCircle();

    if (stuff.hasCircle) {
      let circleW = this.p5.max(
        this.p5.dist(this.stateA.x, this.stateA.y, this.stateB.x, this.stateB.y),
        stuff.circleR * 2,
      );
      this.p5.push();
      this.p5.noFill();
      // Draw arc
      if (stuff.isReversed) {
        this.p5.arc(stuff.circleX, stuff.circleY, circleW, stuff.circleR * 2, stuff.endAngle, stuff.startAngle);
      } else {
        this.p5.arc(stuff.circleX, stuff.circleY, circleW, stuff.circleR * 2, stuff.startAngle, stuff.endAngle);
      }
      this.p5.pop();
    } else {
      // Draw line
      this.p5.line(stuff.startX, stuff.startY, stuff.endX, stuff.endY);
    }

    // Draw the head of the arrow
    if (stuff.hasCircle) {
      drawArrow(this.p5, stuff.endX, stuff.endY, stuff.endAngle - stuff.reverseScale * (this.p5.PI / 2));
    } else {
      drawArrow(this.p5, stuff.endX, stuff.endY, this.p5.atan2(stuff.endY - stuff.startY, stuff.endX - stuff.startX));
    }
    this.p5.pop();
  }
}
