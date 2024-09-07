import { calculateTextWidth, drawText } from "../utils/calculateAndDrawText";
import { texMap } from "../utils/getTexMaps";
import { createHistory } from "../utils/history";
import { convertSubstringsToString, transformInputText } from "../utils/transformInputText";

export default class TransitionBox {
  constructor(p5, x, y, rules = []) {
    this.p5 = p5;
    this.previusScale = p5.canvasScale;

    // Position
    this.x = x * this.previusScale;
    this.y = y * this.previusScale;

    // Dimensions
    this.w = 0;
    this.h = 0;

    // Status variables
    this.hovering = false;
    this.selected = false;
    this.hoveredRuleIndex = -1;
    this.selectedRuleIndex = -1;

    // Constants
    this.offsetBoxYConstant = 18;
    this.offsetBoxY = this.offsetBoxYConstant * this.previusScale;
    this.ruleFontSizeConstant = 12;
    this.ruleFontSize = this.ruleFontSizeConstant * this.previusScale;

    // Transition box elements
    this.directionButtonPressed = "left";

    this.mainDiv = p5.select(`#transition-box-${p5.canvasID}`);
    this.readInput = p5.select(`#transition-read-${p5.canvasID}`);
    this.writeInput = p5.select(`#transition-write-${p5.canvasID}`);
    this.leftButton = p5.select(`#transition-direction-left-${p5.canvasID}`);
    this.rightButton = p5.select(`#transition-direction-right-${p5.canvasID}`);
    this.stayButton = p5.select(`#transition-direction-stay-${p5.canvasID}`);
    this.confirmButton = p5.select(`#transition-create-${p5.canvasID}`);
    this.labelSpan = p5.select(`#transition-result-${p5.canvasID}`);

    if (this.readInput && this.writeInput) {
      this.readInput.input(() => this.changeResultText());
      this.writeInput.input(() => this.changeResultText());
    }

    if (this.leftButton && this.rightButton && this.stayButton) {
      this.leftButton.mousePressed(() => this.switchButtons("left"));
      this.rightButton.mousePressed(() => this.switchButtons("right"));
      this.stayButton.mousePressed(() => this.switchButtons("stay"));
    }

    if (this.confirmButton) this.confirmButton.mousePressed(() => this.confirmRule());

    // Rules information
    this.rules = rules;
    this.rulesX = this.x;
    this.rulesY = this.y;
    this.rulesWidth = 0;
    this.rulesHeight = 0;

    for (let i = 0; i < this.rules.length; i++) {
      this.rules[i].width = calculateTextWidth(this.p5, -1000, -1000, this.rules[i].label, this.ruleFontSize);
    }

    this.changeResultText();
  }

  switchButtons(direction) {
    if (direction === "left") {
      this.directionButtonPressed = "left";
      this.leftButton.style("background-color", "var(--primary)");
      this.rightButton.style("background-color", "transparent");
      this.stayButton.style("background-color", "transparent");
    } else if (direction === "right") {
      this.directionButtonPressed = "right";
      this.rightButton.style("background-color", "var(--primary)");
      this.leftButton.style("background-color", "transparent");
      this.stayButton.style("background-color", "transparent");
    } else {
      this.directionButtonPressed = "stay";
      this.stayButton.style("background-color", "var(--primary)");
      this.leftButton.style("background-color", "transparent");
      this.rightButton.style("background-color", "transparent");
    }

    this.changeResultText();
  }

  containsPoint(x = this.p5.mouseX, y = this.p5.mouseY) {
    if (!this.mainDiv) return false;

    return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
  }

  ruleContainsPoint(x = this.p5.mouseX, y = this.p5.mouseY) {
    for (let i = 0; i < this.rules.length; i++) {
      let yy = this.rulesY + i * this.offsetBoxY + this.offsetBoxY * 0.8;
      let xx = this.rulesX;

      if (
        x > xx - this.rules[i].width / 2 &&
        x < xx + this.rules[i].width / 2 &&
        y > yy - this.offsetBoxY / 2 &&
        y < yy + this.offsetBoxY / 2
      )
        return i;
    }

    return -1;
  }

  ruleAlreadyExists(labelA) {
    for (let i = 0; i < this.rules.length; i++) {
      let labelB = this.rules[i].label;

      if (JSON.stringify(labelA) === JSON.stringify(labelB)) return true;
    }

    return false;
  }

  confirmRule() {
    if (this.selectedRuleIndex !== -1) {
      let { allReadSubstrings, allWriteSubstrings, direction } = this.changeResultText();

      // Concat all arrays
      let rule = allReadSubstrings.concat([" ", "→", " "], allWriteSubstrings, [", "], [direction]);

      if (!this.ruleAlreadyExists(rule)) {
        this.rules[this.selectedRuleIndex] = {
          label: rule,
          width: calculateTextWidth(this.p5, -1000, -1000, rule, this.ruleFontSize),
        };
      }
    } else {
      let { allReadSubstrings, allWriteSubstrings, direction } = this.changeResultText();

      // Concat all arrays
      let rule = allReadSubstrings.concat([" ", "→", " "], allWriteSubstrings, [", "], [direction]);

      if (!this.ruleAlreadyExists(rule)) {
        this.rules.push({
          label: rule,
          width: calculateTextWidth(this.p5, -1000, -1000, rule, this.ruleFontSize),
        });
      }
    }

    this.readInput.value("");
    this.writeInput.value("");
    this.switchButtons("left");
    this.selectedRuleIndex = -1;
    this.selected = false;

    // createHistory(this.p5);
  }

  // Remove all elements
  remove() {
    this.mainDiv.remove();
  }

  removeRule() {
    if (this.selectedRuleIndex !== -1) {
      this.rules.splice(this.selectedRuleIndex, 1);
      this.selectedRuleIndex = -1;

      // createHistory(this.p5);
    }
  }

  keyPressed() {
    if (this.p5.keyCode === this.p5.ENTER) {
      if (!this.selected) return;
      this.confirmRule();
    } else if (this.p5.keyCode === this.p5.BACKSPACE) {
      this.checkReadAndWriteInput();
    } else if (this.p5.keyCode === this.p5.DELETE) {
      if (this.selected) return;
      this.removeRule();
    }
  }

  getRule() {
    if (this.selectedRuleIndex !== -1) {
      let allSubstrings = convertSubstringsToString(this.rules[this.selectedRuleIndex].label);
      let read = allSubstrings.split("→")[0].trim();
      let write = allSubstrings.split("→")[1].trim();
      // Remove the last character (direction)
      write = write.substring(0, write.length - 3);

      this.readInput.value(read);
      this.writeInput.value(write);

      if (allSubstrings.includes(", E")) {
        this.switchButtons("left");
      } else if (allSubstrings.includes(", D")) {
        this.switchButtons("right");
      } else {
        this.switchButtons("stay");
      }
    }
  }

  mousePressed() {
    this.selectedRuleIndex = this.ruleContainsPoint();

    if (this.selectedRuleIndex !== -1 && this.p5.selectedLeftToolbarButton === "deleteObject") {
      this.removeRule();
    }
  }

  doubleClick() {
    if (this.p5.selectedLeftToolbarButton !== "selectObject" && this.p5.selectedLeftToolbarButton !== "addLink") return;
    this.selectedRuleIndex = this.ruleContainsPoint();
    this.selected = this.selectedRuleIndex !== -1;
    this.getRule();
  }

  checkReadAndWriteInput() {
    // Regex that tests if the text has only one character (any character)
    let regex = /^.$/;

    // Check if match one of the texMap keys
    let readValue = this.readInput.value().trim();
    let writeValue = this.writeInput.value().trim();

    this.readInput.style("border-color", "red");
    this.writeInput.style("border-color", "red");

    let readIsValid = this.readInput.value().length === 0 || this.readInput.value().match(regex) || texMap[readValue];
    let writeIsValid =
      this.writeInput.value().length === 0 || this.writeInput.value().match(regex) || texMap[writeValue];

    if (readIsValid) {
      this.readInput.style("border-color", "#1762a3");
      if (texMap[readValue]) this.readInput.value(texMap[readValue]);
    }

    if (writeIsValid) {
      this.writeInput.style("border-color", "#1762a3");
      if (texMap[writeValue]) this.writeInput.value(texMap[writeValue]);
    }

    return { readIsValid, writeIsValid };
  }

  changeResultText() {
    let { readIsValid, writeIsValid } = this.checkReadAndWriteInput();

    let allReadSubstrings = [];
    if (readIsValid && this.readInput.value().trim().length > 0) {
      allReadSubstrings = transformInputText(this.readInput.value(), texMap);
    } else {
      allReadSubstrings = [texMap["\\blank"]];
    }

    let allWriteSubstrings = [];
    if (writeIsValid && this.writeInput.value().trim().length > 0) {
      allWriteSubstrings = transformInputText(this.writeInput.value(), texMap);
    } else {
      allWriteSubstrings = [texMap["\\blank"]];
    }

    let direction = this.directionButtonPressed === "left" ? "E" : this.directionButtonPressed === "right" ? "D" : "P";
    this.labelSpan.html(allReadSubstrings[0] + " → " + allWriteSubstrings[0] + ", " + direction);

    return { allReadSubstrings, allWriteSubstrings, direction };
  }

  update() {
    if (!this.mainDiv) return;

    if (this.previusScale != this.p5.canvasScale) {
      this.x = (this.x / this.previusScale) * this.p5.canvasScale;
      this.y = (this.y / this.previusScale) * this.p5.canvasScale;
      this.offsetBoxY = this.offsetBoxYConstant * this.p5.canvasScale;
      this.ruleFontSize = this.ruleFontSizeConstant * this.p5.canvasScale;
      this.previusScale = this.p5.canvasScale;
    }

    for (let i = 0; i < this.rules.length; i++) {
      this.rules[i].width = calculateTextWidth(this.p5, -1000, -1000, this.rules[i].label, this.ruleFontSize);
    }

    this.rulesHeight = this.rules.length * this.offsetBoxY;
    this.rulesWidth = this.getTheLargestWidth();

    this.hovering = this.containsPoint(this.p5.mouseX, this.p5.mouseY);

    if (this.selected) {
      this.mainDiv.position(this.x + this.w / 2 + this.p5.canvasOffset.x, this.y + this.h / 2 + this.p5.canvasOffset.y);
      this.mainDiv.elt.style.visibility = "visible";
    } else {
      this.mainDiv.position(-10000, -10000);
      this.mainDiv.elt.style.visibility = "hidden";

      this.readInput.value("");
      this.writeInput.value("");
      this.switchButtons("left");
    }

    this.w = this.mainDiv.elt.offsetWidth;
    this.h = this.mainDiv.elt.offsetHeight;
  }

  draw() {
    // Draw the rules
    for (let i = 0; i < this.rules.length; i++) {
      let yy = this.rulesY + i * this.offsetBoxY + this.offsetBoxY * 0.8;
      let xx = this.rulesX - this.rules[i].width / 2;

      this.p5.push();
      this.p5.fill("#ffffff");
      if (this.ruleContainsPoint(this.p5.mouseX, this.p5.mouseY) === i) this.p5.fill("#E4E4E4");
      if (this.selectedRuleIndex === i) this.p5.fill("#E4E4E4");

      drawText(this.p5, xx, yy, this.rules[i].label, this.ruleFontSize);
      this.p5.pop();
    }
  }

  getTheLargestWidth() {
    let largestWidth = 0;

    for (let i = 0; i < this.rules.length; i++) {
      if (this.rules[i].width > largestWidth) {
        largestWidth = this.rules[i].width;
      }
    }

    return largestWidth;
  }
}
