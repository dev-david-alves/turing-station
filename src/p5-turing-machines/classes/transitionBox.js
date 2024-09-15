import { inputVariants } from "../../components/Input";
import { cn } from "../../utils/cn";
import { calculateTextWidth, drawText } from "../utils/calculateAndDrawText";
import { texMap } from "../utils/getTexMaps";
import { createHistory } from "../utils/history";
import { convertSubstringsToString, transformInputText } from "../utils/transformInputText";

export default class TransitionBox {
  constructor(p5, x, y, rules = []) {
    this.p5 = p5;
    this.previusScale = this.p5.canvasScale;

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
    this.options = null;

    this.createBox();
    if (this.leftButton && this.rightButton) this.switchButtons("left");

    if (this.readInput && this.writeInput) {
      this.readInput.input(() => {
        const { status, data } = this.getOptions(this.readInput);
        if (status) {
          this.customDataList(data, this.readInput, "left-0");
        }

        this.changeResultText();
      });

      this.readInput.elt.addEventListener("blur", () => this.options?.remove());

      this.writeInput.input(() => {
        const { status, data } = this.getOptions(this.writeInput);
        if (status) {
          this.customDataList(data, this.writeInput, "right-0");
        }

        this.changeResultText();
      });

      this.writeInput.elt.addEventListener("blur", () => this.options?.remove());
    }

    // Rules information
    this.siblingRules = [];
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

  getOptions(inputField) {
    if (!inputField) return;

    const texMapKeys = Object.entries(texMap).filter(([key, _]) =>
      key.toLowerCase().includes(inputField.value().toLowerCase()),
    );

    if (this.options) this.options.remove();

    if (inputField.value().length <= 1 || inputField.value() === "\\" || texMapKeys.length === 0)
      return { status: false, data: null };

    return { status: true, data: texMapKeys };
  }

  customDataList(dataFiltered, inputField, className) {
    if (!this.mainDiv || !inputField) return;

    this.options = this.p5.createDiv();
    this.options.parent(this.mainDiv);
    this.options.class(
      cn(
        "flex flex-col overflow-hidden rounded-md border-[1px] border-white bg-main text-white shadow-lg  absolute top-0 transform -translate-y-full mx-3 w-[calc(50%-1rem)]",
        className,
      ),
    );

    for (let i = 0; i < dataFiltered.length; i++) {
      let option = this.p5.createDiv();
      option.parent(this.options);
      option.class(
        cn(
          "flex items-center justify-between px-2 py-2 text-xs transition-colors duration-150 hover:bg-background",
          i > 0 && "border-t border-gray-700",
        ),
      );
      option.mousePressed(() => {
        inputField.value(dataFiltered[i][0]);
        this.changeResultText();
        this.options.remove();
      });

      let span1 = this.p5.createSpan(dataFiltered[i][0]);
      span1.parent(option);
      span1.class("font-semibold");

      let span2 = this.p5.createSpan(dataFiltered[i][1]);
      span2.parent(option);
      span2.class("text-gray-300");
    }
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
    this.mainDiv.position(this.x + this.p5.canvasOffset.x, this.y + this.p5.canvasOffset.y);
    this.mainDiv.class("relative z-[200]");
    this.auxDiv = this.p5.createDiv();
    this.auxDiv.parent(this.mainDiv);
    this.auxDiv.class("flex flex-col items-center justify-center gap-2");

    this.boxDiv = this.p5.createDiv();
    this.boxDiv.parent(this.auxDiv);
    this.boxDiv.class("flex w-[220px] max-w-[220px] flex-col gap-2 rounded-md bg-main p-3 shadow-lg");

    // Inputs
    this.inputDiv = this.p5.createDiv();
    this.inputDiv.parent(this.boxDiv);
    this.inputDiv.class("flex items-center justify-center gap-[.5rem]");

    this.readInput = this.p5.createInput();
    this.readInput.parent(this.inputDiv);
    this.readInput.class(cn(inputVariants({ variant: "default", size: "sm" }), "text-md py-1"));
    this.readInput.attribute("placeholder", "Lê");
    this.writeInput = this.p5.createInput();
    this.writeInput.parent(this.inputDiv);
    this.writeInput.class(cn(inputVariants({ variant: "default", size: "sm" }), "text-md py-1"));
    this.writeInput.attribute("placeholder", "Escreve");

    // Buttons
    this.buttonDiv = this.p5.createDiv();
    this.buttonDiv.parent(this.boxDiv);
    this.buttonDiv.class("flex items-center justify-between");
    this.directionButtonDiv = this.p5.createDiv();
    this.directionButtonDiv.parent(this.buttonDiv);
    this.directionButtonDiv.class("flex items-center gap-[.4rem]");

    const buttonClass =
      "flex h-9 w-9 items-center justify-center rounded-md border-2 border-primary bg-gray-800 font-semibold text-white";

    this.leftButton = this.p5.createButton("E");
    this.leftButton.parent(this.directionButtonDiv);
    this.leftButton.class(buttonClass);
    this.leftButton.id("leftButton");
    this.leftButton.mousePressed(() => this.switchButtons("left"));

    this.rightButton = this.p5.createButton("D");
    this.rightButton.parent(this.directionButtonDiv);
    this.rightButton.class(buttonClass);
    this.rightButton.id("rightButton");
    this.rightButton.mousePressed(() => this.switchButtons("right"));

    this.stayButton = this.p5.createButton("P");
    this.stayButton.parent(this.directionButtonDiv);
    this.stayButton.class(buttonClass);
    this.stayButton.id("stayButton");
    this.stayButton.mousePressed(() => this.switchButtons("stay"));

    this.confirmButton = this.p5.createButton(
      "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'><path fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='3.5' d='M20 7L10 17l-5-5'/></svg>",
    );
    this.confirmButton.parent(this.buttonDiv);
    this.confirmButton.class(cn(buttonClass, "bg-transparent border-none hover:text-darkGreen transition-colors"));
    this.confirmButton.mousePressed(() => this.confirmRule());

    // Label
    this.labelDiv = this.p5.createDiv();
    this.labelDiv.parent(this.auxDiv);
    this.labelDiv.class("flex w-fit items-center gap-2 rounded-md bg-main px-3 py-1 italic text-white shadow-lg");
    this.labelSpan = this.p5.createSpan("aasad -> b, D");
    this.labelSpan.parent(this.labelDiv);
    this.labelSpan.class("font-semibold text-white");
  }

  containsPoint(x = this.p5.mouseX, y = this.p5.mouseY) {
    const padding = 10 * this.p5.canvasScale;
    // For test, draw rules box
    // this.p5.push();
    // this.p5.noFill();
    // this.p5.stroke("#ffffff");
    // this.p5.rect(
    //   this.rulesX - this.rulesWidth / 2 - padding,
    //   this.rulesY + this.offsetBoxY / 4 - padding,
    //   this.rulesWidth + padding * 2,
    //   this.rulesHeight + padding * 2,
    // );
    // this.p5.pop();

    return (
      x > this.rulesX - this.rulesWidth / 2 - padding &&
      x < this.rulesX + this.rulesWidth / 2 + padding &&
      y > this.rulesY + this.offsetBoxY / 4 - padding &&
      y < this.rulesY + this.offsetBoxY / 4 + this.rulesHeight + padding
    );
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

  checkNonDeterministic(allReadSubstringsFromRule) {
    let fullReadSub = allReadSubstringsFromRule.join("");

    for (let i = 0; i < this.siblingRules.length; i++) {
      let allReadSubstrings = convertSubstringsToString(this.siblingRules[i].label).split("→")[0].trim();

      if (fullReadSub === allReadSubstrings) return true;
    }

    return false;
  }

  confirmRule() {
    // Get the result of the changeResultText function
    let { allReadSubstrings, allWriteSubstrings, direction } = this.changeResultText();
    // Concat all arrays
    let rule = allReadSubstrings.concat([" ", "→", " "], allWriteSubstrings, [", "], [direction]);

    if (this.p5.tm_variant !== "ndtm" && this.checkNonDeterministic(allReadSubstrings)) {
      alert("Essa variante não aceita regras não determinísticas!");
      return;
    }

    if (this.selectedRuleIndex !== -1) {
      if (!this.ruleAlreadyExists(rule)) {
        this.rules[this.selectedRuleIndex] = {
          label: rule,
          width: calculateTextWidth(this.p5, -1000, -1000, rule, this.ruleFontSize),
        };
      }
    } else {
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
      this.mainDiv.show();
      this.mainDiv.position(this.x + this.p5.canvasOffset.x, this.y + this.p5.canvasOffset.y);
    } else {
      this.mainDiv.hide();
      this.mainDiv.position(-1000, -1000);
      this.options?.remove();

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
