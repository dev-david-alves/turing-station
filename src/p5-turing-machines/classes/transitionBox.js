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
    this.randomID = Math.floor(Math.random() * 9999999);

    // Constants
    this.offsetBoxYConstant = 18;
    this.offsetBoxY = this.offsetBoxYConstant * this.previusScale;
    this.ruleFontSizeConstant = 10;
    this.ruleFontSize = this.ruleFontSizeConstant * this.previusScale;

    // Transition box elements
    this.directionButtonPressed = "left";

    this.mainDiv = null;
    this.boxDiv = null;
    this.inputDiv = null;
    this.buttonDiv = null;
    this.directionButtonDiv = null;
    this.confirmButton = null;
    this.labelDiv = null;
    this.labelSpan = null;
    this.options = null;

    this.createBox();

    this.allReadInputs = document.querySelectorAll(`.input-${this.p5.canvasID}-${this.randomID}[data-input="read"]`);
    this.allWriteInputs = document.querySelectorAll(`.input-${this.p5.canvasID}-${this.randomID}[data-input="write"]`);

    this.allLeftButtons = document.querySelectorAll(
      `.direction-button-${this.p5.canvasID}-${this.randomID}[data-direction="left"]`,
    );
    this.allRightButtons = document.querySelectorAll(
      `.direction-button-${this.p5.canvasID}-${this.randomID}[data-direction="right"]`,
    );
    this.allStayButtons = document.querySelectorAll(
      `.direction-button-${this.p5.canvasID}-${this.randomID}[data-direction="stay"]`,
    );

    this.resetAllInputsAndButtons();

    this.allReadInputs.forEach((input) => {
      input.addEventListener("input", () => {
        const { status, data } = this.getOptions(input);
        if (status) {
          this.customDataList(data, input, "left-0");
        }
        this.changeResultText();
      });

      input.addEventListener("blur", () => this.options?.remove());
    });

    this.allWriteInputs.forEach((input) => {
      input.addEventListener("input", () => {
        const { status, data } = this.getOptions(input);
        if (status) {
          let positionX = p5.tm_num_tapes === 1 ? "right-0" : "right-16";
          this.customDataList(data, input, positionX);
        }
        this.changeResultText();
      });

      input.addEventListener("blur", () => this.options?.remove());
    });

    // Rules information
    this.siblingRules = [];
    this.rules = [];
    this.rulesX = this.x;
    this.rulesY = this.y;
    this.rulesWidth = 0;
    this.rulesHeight = 0;

    // Convert the rules to the correct format
    rules.forEach((rule) => {
      let aux = [];
      let label = rule.label;
      // [read, write, direction, read, write, direction, ...]
      for (let i = 0; i < p5.tm_num_tapes; i++) {
        let read = label[i * 3];
        let write = label[i * 3 + 1];
        let direction = label[i * 3 + 2];

        let fullString = `${read} → ${write}, ${direction}`;
        let fullWidth = calculateTextWidth(this.p5, -1000, -1000, fullString, this.ruleFontSize);

        aux.push({
          label: fullString,
          width: fullWidth,
        });
      }

      this.rules.push(aux);
    });

    this.changeResultText();
  }

  getOptions(inputField) {
    if (!inputField) return;

    const texMapKeys = Object.entries(texMap).filter(([key, _]) =>
      key.toLowerCase().includes(inputField.value.toLowerCase()),
    );

    if (this.options) this.options.remove();

    if (inputField.value.length <= 1 || inputField.value === "\\" || texMapKeys.length === 0)
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
        inputField.value = dataFiltered[i][0];
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
    this.boxDiv.class("flex w-fit flex-col items-center gap-2 rounded-md bg-main p-3 shadow-lg");

    const inputClass = `text-md py-1 min-w-[60px] max-w-[80px] input-${this.p5.canvasID}-${this.randomID}`;
    const buttonClass = `flex min-h-9 min-w-9 h-9 w-9 items-center justify-center rounded-md border-2 border-primary bg-gray-800 font-semibold text-white direction-button-${this.p5.canvasID}-${this.randomID}`;

    Array.from({ length: this.p5.tm_num_tapes }).forEach((_, i) => {
      this.auxInputButtonDiv = this.p5.createDiv();
      this.auxInputButtonDiv.parent(this.boxDiv);
      this.auxInputButtonDiv.class(cn("flex items-center gap-2", this.p5.tm_num_tapes === 1 ? "flex-col" : "flex-row"));
      // Inputs
      let inputDiv = this.p5.createDiv();
      inputDiv.parent(this.auxInputButtonDiv);
      inputDiv.class("flex items-center justify-center gap-[.5rem]");

      let readInput = this.p5.createInput();
      readInput.parent(inputDiv);
      readInput.class(cn(inputVariants({ variant: "default", size: "sm" }), inputClass));
      readInput.attribute("placeholder", "Lê");
      readInput.attribute("data-tape", i);
      readInput.attribute("data-input", "read");

      let writeInput = this.p5.createInput();
      writeInput.parent(inputDiv);
      writeInput.class(cn(inputVariants({ variant: "default", size: "sm" }), inputClass));
      writeInput.attribute("placeholder", "Escreve");
      writeInput.attribute("data-tape", i);
      writeInput.attribute("data-input", "write");

      // Buttons
      let buttonDiv = this.p5.createDiv();
      buttonDiv.parent(this.auxInputButtonDiv);
      buttonDiv.class("flex items-center justify-between");
      this.directionButtonDiv = this.p5.createDiv();
      this.directionButtonDiv.parent(buttonDiv);
      this.directionButtonDiv.class("flex items-center gap-[.4rem]");

      let leftButton = this.p5.createButton("E");
      leftButton.parent(this.directionButtonDiv);
      leftButton.class(buttonClass);
      leftButton.attribute("data-tape", i);
      leftButton.attribute("data-direction", "left");
      leftButton.attribute("data-selected", "false");
      leftButton.mousePressed(() => this.switchButtons(i, "left"));

      let rightButton = this.p5.createButton("D");
      rightButton.parent(this.directionButtonDiv);
      rightButton.class(buttonClass);
      rightButton.attribute("data-tape", i);
      rightButton.attribute("data-direction", "right");
      rightButton.attribute("data-selected", "false");
      rightButton.mousePressed(() => this.switchButtons(i, "right"));

      let stayButton = this.p5.createButton("P");
      stayButton.parent(this.directionButtonDiv);
      stayButton.class(buttonClass);
      stayButton.attribute("data-tape", i);
      stayButton.attribute("data-direction", "stay");
      leftButton.attribute("data-selected", "false");
      stayButton.mousePressed(() => this.switchButtons(i, "stay"));
    });

    this.confirmButtonDiv = this.p5.createDiv();
    if (this.p5.tm_num_tapes == 1) {
      this.confirmButtonDiv.parent(this.directionButtonDiv);
    } else {
      this.confirmButtonDiv.parent(this.boxDiv);
    }

    this.confirmButtonDiv.class("w-full flex items-center justify-end gap-2");

    this.confirmButton = this.p5.createButton(
      "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'><path fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='3.5' d='M20 7L10 17l-5-5'/></svg>",
    );
    this.confirmButton.parent(this.confirmButtonDiv);
    this.confirmButton.class(cn(buttonClass, "bg-transparent border-none hover:text-darkGreen transition-colors"));
    this.confirmButton.mousePressed(() => this.confirmRules());

    // Label
    this.labelDiv = this.p5.createDiv();
    this.labelDiv.parent(this.auxDiv);
    this.labelDiv.class("flex w-fit items-center gap-2 rounded-md bg-main px-3 py-1 italic text-white shadow-lg");
    this.labelSpan = this.p5.createSpan("aasad -> b, D");
    this.labelSpan.parent(this.labelDiv);
    this.labelSpan.class("font-semibold text-white");
  }

  switchButtons(index, direction) {
    // Set data-selected to false for all buttons
    this.allLeftButtons[index].dataset.selected = "false";
    this.allRightButtons[index].dataset.selected = "false";
    this.allStayButtons[index].dataset.selected = "false";

    if (direction === "left") {
      this.allLeftButtons[index].dataset.selected = "true";
    } else if (direction === "right") {
      this.allRightButtons[index].dataset.selected = "true";
    } else {
      this.allStayButtons[index].dataset.selected = "true";
    }

    this.changeResultText();
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
      let xx = this.rulesX;
      let yy = this.rulesY + i * this.offsetBoxY + this.offsetBoxY * 0.8;

      let fullLabel = "";
      for (let j = 0; j < this.rules[i].length; j++) {
        let separator = j < this.rules[i].length - 1 ? " | " : "";
        fullLabel += this.rules[i][j].label + separator;
      }

      let fullLabelWidth = calculateTextWidth(this.p5, -1000, -1000, fullLabel, this.ruleFontSize);

      for (let j = 0; j < this.rules[i].length; j++) {
        if (
          x > xx - fullLabelWidth / 2 &&
          x < xx + fullLabelWidth / 2 &&
          y > yy - this.offsetBoxY / 2 &&
          y < yy + this.offsetBoxY / 2
        )
          return i;
      }
    }

    return -1;
  }

  ruleAlreadyExists(labelA) {
    for (let i = 0; i < this.rules.length; i++) {
      let allEquals = this.rules[i].every((rule, index) => {
        // console.log(rule.label, labelA[index]);
        return JSON.stringify(rule.label) === JSON.stringify(labelA[index]);
      });

      if (allEquals) return true;
    }

    return false;
  }

  checkNonDeterministic(fullReadSub) {
    for (let i = 0; i < this.siblingRules.length; i++) {
      let allReadSubstrings = [];
      for (let j = 0; j < this.siblingRules[i].length; j++) {
        allReadSubstrings.push(this.siblingRules[i][j].label.split("→")[0].trim());
      }

      if (JSON.stringify(fullReadSub) === JSON.stringify(allReadSubstrings)) return true;
    }

    return false;
  }

  resetAllInputsAndButtons() {
    this.allReadInputs.forEach((input) => (input.value = ""));
    this.allWriteInputs.forEach((input) => (input.value = ""));
    for (let i = 0; i < this.allLeftButtons.length; i++) {
      this.allLeftButtons[i].dataset.selected = "true";
      this.allRightButtons[i].dataset.selected = "false";
      this.allStayButtons[i].dataset.selected = "false";
    }
  }

  confirmRules() {
    // Get the result of the changeResultText function
    let fullInfo = this.changeResultText();
    let fullRules = [];

    // let fullReadSubstrings = fullInfo.map((info) => info.allReadSubstrings.join(""));
    // if (this.p5.tm_variant !== "ndtm" && this.checkNonDeterministic(fullReadSubstrings)) {
    //   alert("Essa variante não aceita regras não determinísticas!");
    //   return;
    // }

    fullInfo.forEach((info) => {
      let allReadSubstrings = info.allReadSubstrings;
      let allWriteSubstrings = info.allWriteSubstrings;
      let direction = info.direction;

      // Concat all arrays
      fullRules.push(allReadSubstrings.concat([" ", "→", " "], allWriteSubstrings, [", "], [direction]).join(""));
    });

    if (!this.ruleAlreadyExists(fullRules) && this.selectedRuleIndex === -1) {
      console.log("Adding new rule");
      this.rules.push([]);
      fullRules.forEach((rule) => {
        let lastIndex = this.rules.length - 1;
        this.rules[lastIndex].push({
          label: rule,
          width: calculateTextWidth(this.p5, -1000, -1000, rule, this.ruleFontSize),
        });
      });
    } else {
      if (this.selectedRuleIndex !== -1) {
        console.log("Updating rule");
        fullRules.forEach((rule, index) => {
          this.rules[this.selectedRuleIndex][index].label = rule;
          this.rules[this.selectedRuleIndex][index].width = calculateTextWidth(
            this.p5,
            -1000,
            -1000,
            rule,
            this.ruleFontSize,
          );
        });
      }
    }

    this.resetAllInputsAndButtons();
    this.selectedRuleIndex = -1;
    this.selected = false;

    createHistory(this.p5);
  }

  getFormattedRules() {
    let formattedRules = [];
    for (let i = 0; i < this.rules.length; i++) {
      let aux = [];
      for (let j = 0; j < this.rules[i].length; j++) {
        let rule = this.rules[i][j].label;
        let allSubstrings = convertSubstringsToString(rule).split("");
        aux.push(allSubstrings[0], allSubstrings[4], allSubstrings[7]);
      }
      formattedRules.push({ label: aux });
    }

    return formattedRules;
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

  getRule() {
    if (this.selectedRuleIndex !== -1) {
      let rules = this.rules[this.selectedRuleIndex];

      for (let i = 0; i < rules.length; i++) {
        let rule = rules[i].label;
        let allSubstrings = convertSubstringsToString(rule);

        let read = allSubstrings.split("→")[0].trim();
        let write = allSubstrings.split("→")[1].trim();
        // Remove the last character (direction)
        write = write.substring(0, write.length - 3);

        this.allReadInputs[i].value = read;
        this.allWriteInputs[i].value = write;

        if (allSubstrings.includes(", E")) {
          this.switchButtons(i, "left");
        } else if (allSubstrings.includes(", D")) {
          this.switchButtons(i, "right");
        } else {
          this.switchButtons(i, "stay");
        }
      }
    }
  }

  checkReadAndWriteInput(index) {
    // Regex that tests if the text has only one character (any character)
    let regex = /^.$/;
    // Check if match one of the texMap keys
    let readValue = this.allReadInputs[index].value.trim();
    let writeValue = this.allWriteInputs[index].value.trim();

    this.allReadInputs[index].classList.remove("border-primary");
    this.allReadInputs[index].classList.add("border-red-500");

    this.allWriteInputs[index].classList.remove("border-primary");
    this.allWriteInputs[index].classList.add("border-red-500");

    let readIsValid = readValue.length === 0 || readValue.match(regex) || texMap[readValue];
    let writeIsValid = writeValue.length === 0 || writeValue.match(regex) || texMap[writeValue];

    if (readIsValid) {
      this.allReadInputs[index].classList.add("border-primary");
      this.allReadInputs[index].classList.remove("border-red-500");
      if (texMap[readValue]) this.allReadInputs[index].value = texMap[readValue];
    }

    if (writeIsValid) {
      this.allWriteInputs[index].classList.add("border-primary");
      this.allWriteInputs[index].classList.remove("border-red-500");
      if (texMap[writeValue]) this.allWriteInputs[index].value = texMap[writeValue];
    }

    return { readIsValid, writeIsValid };
  }

  changeResultText() {
    let fullLabel = "";
    let fullInfo = [];
    for (let index = 0; index < this.p5.tm_num_tapes; index++) {
      let { readIsValid, writeIsValid } = this.checkReadAndWriteInput(index);

      let allReadSubstrings = [];
      if (readIsValid && this.allReadInputs[index].value.trim().length > 0) {
        allReadSubstrings = transformInputText(this.allReadInputs[index].value, texMap);
      } else {
        allReadSubstrings = [texMap["\\blank"]];
      }

      let allWriteSubstrings = [];
      if (writeIsValid && this.allWriteInputs[index].value.trim().length > 0) {
        allWriteSubstrings = transformInputText(this.allWriteInputs[index].value, texMap);
      } else {
        allWriteSubstrings = [texMap["\\blank"]];
      }

      let direction =
        this.allLeftButtons[index].dataset.selected === "true"
          ? "E"
          : this.allRightButtons[index].dataset.selected === "true"
            ? "D"
            : "P";

      let separator = index < this.p5.tm_num_tapes - 1 ? " | " : "";
      fullLabel += allReadSubstrings[0] + " → " + allWriteSubstrings[0] + ", " + direction + separator;
      fullInfo.push({ allReadSubstrings, allWriteSubstrings, direction });
    }

    this.labelSpan.html(fullLabel);

    return fullInfo;
  }

  // Mouse events
  mousePressed() {
    this.selectedRuleIndex = this.ruleContainsPoint();
    console.log(this.selectedRuleIndex);
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

  // Keyboard events
  keyPressed() {
    if (this.p5.keyCode === this.p5.ENTER) {
      if (!this.selected) return;
      this.confirmRules();
    } else if (this.p5.keyCode === this.p5.DELETE) {
      if (this.selected) return;
      this.removeRule();
    }
  }

  // Update and draw
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
      for (let j = 0; j < this.rules[i].length; j++) {
        this.rules[i][j].width = calculateTextWidth(this.p5, -1000, -1000, this.rules[i][j].label, this.ruleFontSize);
      }
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

      this.resetAllInputsAndButtons();
    }

    this.w = this.mainDiv.elt.offsetWidth;
    this.h = this.mainDiv.elt.offsetHeight;

    // Color the selected buttons
    for (let i = 0; i < this.allLeftButtons.length; i++) {
      let dataSelectedLeft = this.allLeftButtons[i].dataset.selected;
      let dataSelectedRight = this.allRightButtons[i].dataset.selected;
      let dataSelectedStay = this.allStayButtons[i].dataset.selected;

      if (dataSelectedLeft === "true") {
        this.allLeftButtons[i].classList.add("button-active");
      } else {
        this.allLeftButtons[i].classList.remove("button-active");
      }

      if (dataSelectedRight === "true") {
        this.allRightButtons[i].classList.add("button-active");
      } else {
        this.allRightButtons[i].classList.remove("button-active");
      }

      if (dataSelectedStay === "true") {
        this.allStayButtons[i].classList.add("button-active");
      } else {
        this.allStayButtons[i].classList.remove("button-active");
      }
    }
  }

  draw() {
    // Draw the rules
    for (let i = 0; i < this.rules.length; i++) {
      let fullLabel = "";
      for (let j = 0; j < this.rules[i].length; j++) {
        let separator = j < this.rules[i].length - 1 ? " | " : "";
        fullLabel += this.rules[i][j].label + separator;
      }

      let fullLabelWidth = calculateTextWidth(this.p5, -1000, -1000, fullLabel, this.ruleFontSize);

      let yy = this.rulesY + i * this.offsetBoxY + this.offsetBoxY * 0.8;
      let xx = this.rulesX - fullLabelWidth / 2;

      this.p5.push();
      this.p5.fill("#ffffff");
      if (this.ruleContainsPoint(this.p5.mouseX, this.p5.mouseY) === i) this.p5.fill("red");
      if (this.selectedRuleIndex === i) this.p5.fill("#E4E4E4");

      drawText(this.p5, xx, yy, fullLabel, this.ruleFontSize);
      this.p5.pop();
    }
  }

  getTheLargestWidth() {
    let largestWidth = 0;

    for (let i = 0; i < this.rules.length; i++) {
      for (let j = 0; j < this.rules[i].length; j++) {
        if (this.rules[i][j].width > largestWidth) {
          largestWidth = this.rules[i][j].width;
        }
      }
    }

    return largestWidth;
  }
}
