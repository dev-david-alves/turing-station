import { calculateTextWidth, drawText } from "../utils/calculateAndDrawText";
import { texMap } from "../utils/getTexMaps";
import { createHistory } from "../utils/history";
import { convertSubstringsToString, transformInputText } from "../utils/transformInputText";

export default class TransitionBox {
  constructor(p5, x, y, parent = null, rules = []) {
    this.p5 = p5;
    this.parent = parent;
    this.scaleFactor = p5.globalScaleFactor;

    // Position
    this.x = x * this.scaleFactor;
    this.y = y * this.scaleFactor;

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
    this.offsetBoxY = this.offsetBoxYConstant * this.scaleFactor;
    this.ruleFontSizeConstant = 12;
    this.ruleFontSize = this.ruleFontSizeConstant * this.scaleFactor;

    // Transition box elements
    this.directionButtonPressed = "left";

    this.mainDiv = null;
    this.boxDiv = null;
    this.inputDiv = null;
    this.buttonDiv = null;
    this.directionButtonDiv = null;
    this.leftButton = null;
    this.rightButton = null;
    this.confirmButton = null;
    this.labelDiv = null;
    this.labelSpan = null;

    this.createBox();
    if (this.leftButton && this.rightButton) this.switchButtons("left");

    if (this.readInput && this.writeInput) {
      this.readInput.input(() => this.changeResultText());
      this.writeInput.input(() => this.changeResultText());
    }

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
      this.leftButton.style("background-color", "#1762a3");
      this.rightButton.style("background-color", "transparent");
      this.stayButton.style("background-color", "transparent");
    } else if (direction === "right") {
      this.directionButtonPressed = "right";
      this.rightButton.style("background-color", "#1762a3");
      this.leftButton.style("background-color", "transparent");
      this.stayButton.style("background-color", "transparent");
    } else {
      this.directionButtonPressed = "stay";
      this.stayButton.style("background-color", "#1762a3");
      this.leftButton.style("background-color", "transparent");
      this.rightButton.style("background-color", "transparent");
    }

    this.changeResultText();
  }

  createBox() {
    this.mainDiv = this.p5.createDiv();
    this.mainDiv.parent(this.parent);
    this.mainDiv.position(this.x + this.p5.globalWindowOffset.x, this.y + this.p5.globalWindowOffset.y);
    this.mainDiv.class("flex flex-col gap-[.2rem] items-center justify-center absolute z-[100]");
    this.boxDiv = this.p5.createDiv();
    this.boxDiv.parent(this.mainDiv);
    this.boxDiv.class("bg-[#222831] p-[1rem] rounded-[.5rem] flex flex-col gap-[.5rem] drop-shadow-md");

    // Inputs
    this.inputDiv = this.p5.createDiv();
    this.inputDiv.parent(this.boxDiv);
    this.inputDiv.class("flex items-center justify-center gap-[.5rem]");
    this.readInput = this.p5.createInput();
    this.readInput.parent(this.inputDiv);
    this.readInput.class(
      "px-[1rem] py-1 rounded-[.4rem] focus:outline-none w-[8rem] bg-transparent border-2 border-[--color-primary] text-white",
    );
    this.readInput.attribute("placeholder", "Lê");
    this.writeInput = this.p5.createInput();
    this.writeInput.parent(this.inputDiv);
    this.writeInput.class(
      "px-[1rem] py-1 rounded-[.4rem] focus:outline-none w-[8rem] bg-transparent border-2 border-[--color-primary] text-white",
    );
    this.writeInput.attribute("placeholder", "Escreve");

    // Buttons
    this.buttonDiv = this.p5.createDiv();
    this.buttonDiv.parent(this.boxDiv);
    this.buttonDiv.class("flex items-center justify-between");
    this.directionButtonDiv = this.p5.createDiv();
    this.directionButtonDiv.parent(this.buttonDiv);
    this.directionButtonDiv.class("flex items-center gap-[.4rem]");

    this.leftButton = this.p5.createButton("E");
    this.leftButton.parent(this.directionButtonDiv);
    this.leftButton.class(
      "w-[3rem] h-[3rem] text-[1.2rem] text-white font-semibold border-[.1rem] border-[--color-primary] rounded-[.4rem] bg-transparent transition-colors",
    );
    this.leftButton.id("leftButton");
    this.leftButton.mousePressed(() => this.switchButtons("left"));

    this.rightButton = this.p5.createButton("D");
    this.rightButton.parent(this.directionButtonDiv);
    this.rightButton.class(
      "w-[3rem] h-[3rem] text-[1.2rem] text-white font-semibold border-[.1rem] border-[--color-primary] rounded-[5px] bg-transparent transition-colors",
    );
    this.rightButton.id("rightButton");
    this.rightButton.mousePressed(() => this.switchButtons("right"));

    this.stayButton = this.p5.createButton("P");
    this.stayButton.parent(this.directionButtonDiv);
    this.stayButton.class(
      "w-[3rem] h-[3rem] text-[1.2rem] text-white font-semibold border-[.1rem] border-[--color-primary] rounded-[5px] bg-transparent transition-colors",
    );
    this.stayButton.id("stayButton");
    this.stayButton.mousePressed(() => this.switchButtons("stay"));

    this.confirmButton = this.p5.createButton("<span class='material-symbols-outlined'>check</span>");
    this.confirmButton.parent(this.buttonDiv);
    this.confirmButton.class("text-center w-[40px] h-[40px] outline-none text-white");
    this.confirmButton.mousePressed(() => this.confirmRule());

    // Label
    this.labelDiv = this.p5.createDiv();
    this.labelDiv.parent(this.mainDiv);
    this.labelDiv.class("bg-[#222831] px-[1rem] py-[.2rem] rounded-[5px] flex flex-col gap-1 drop-shadow-md");
    this.labelSpan = this.p5.createSpan("aasad -> b, D");
    this.labelSpan.parent(this.labelDiv);
    this.labelSpan.class("font-semibold text-white");
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

    createHistory(this.p5);
  }

  // Remove all elements
  remove() {
    this.mainDiv.remove();
  }

  removeRule() {
    if (this.selectedRuleIndex !== -1) {
      this.rules.splice(this.selectedRuleIndex, 1);
      this.selectedRuleIndex = -1;

      createHistory(this.p5);
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

    if (this.selectedRuleIndex !== -1 && this.p5.selectedLeftSidebarButton === "delete") {
      this.removeRule();
    }
  }

  doubleClick() {
    if (this.p5.selectedLeftSidebarButton !== "select" && this.p5.selectedLeftSidebarButton !== "addLink") return;
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

    if (this.scaleFactor != this.p5.globalScaleFactor) {
      this.x = (this.x / this.scaleFactor) * this.p5.globalScaleFactor;
      this.y = (this.y / this.scaleFactor) * this.p5.globalScaleFactor;
      this.offsetBoxY = this.offsetBoxYConstant * this.p5.globalScaleFactor;
      this.ruleFontSize = this.ruleFontSizeConstant * this.p5.globalScaleFactor;
      this.scaleFactor = this.p5.globalScaleFactor;
    }

    for (let i = 0; i < this.rules.length; i++) {
      this.rules[i].width = calculateTextWidth(this.p5, -1000, -1000, this.rules[i].label, this.ruleFontSize);
    }

    this.rulesHeight = this.rules.length * this.offsetBoxY;
    this.rulesWidth = this.getTheLargestWidth();

    this.hovering = this.containsPoint(this.p5.mouseX, this.p5.mouseY);

    if (this.selected) this.mainDiv.elt.style.visibility = "visible";
    else this.mainDiv.elt.style.visibility = "hidden";

    if (!this.selected) {
      this.readInput.value("");
      this.writeInput.value("");
      this.switchButtons("left");
    }

    this.mainDiv.position(this.x + this.p5.globalWindowOffset.x, this.y + this.p5.globalWindowOffset.y);
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
