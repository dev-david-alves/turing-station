import { calculateTextWidth } from "../utils/calculateAndDrawText";
import { transformInputText } from "../utils/transformInputText";
import { texMap } from "../utils/getTexMaps";

export default class CustomInput {
  constructor(p5, x, y, parent = null) {
    // Start values
    this.p5 = p5; // Store the p5 instance
    this.scaleFactor = p5.globalScaleFactor;
    this.x = x * this.scaleFactor;
    this.y = y * this.scaleFactor;

    // Dimensions
    this.fontSize = 15;
    this.width = 120;
    this.height = 30;
    this.textWidth = 0;

    // Status
    this.visible = false;

    // Input information
    this.input = this.p5.createInput("");
    this.input.elt.maxLength = 20; // Max length of input

    if (parent) this.input.parent(parent);
    this.input.size(this.width, this.height);
    this.input.class(
      `absolute px-[5px] outline-none border-solid border-[1px] border-black rounded-1 rounded text-center`,
    );
    this.input.position(this.x + this.p5.globalWindowOffset.x, this.y + this.p5.globalWindowOffset.y);

    this.input.input(() => this.textInput(this.input.value()));

    // Break string for better drawing suberscripts and superscripts
    this.allSubstrings = [];
  }

  textInput(value) {
    this.allSubstrings = transformInputText(value, texMap);
  }

  update() {
    if (this.scaleFactor !== this.globalScaleFactor) {
      this.x = (this.x / this.scaleFactor) * this.globalScaleFactor;
      this.y = (this.y / this.scaleFactor) * this.globalScaleFactor;
      this.scaleFactor = this.globalScaleFactor;
    }

    this.textWidth = calculateTextWidth(this.p5, this.x, this.y, this.allSubstrings, this.fontSize);
    this.input.class(
      `absolute px-[1rem] py-1 rounded-[.4rem] focus:outline-none w-[8rem] bg-transparent border-2 border-[--color-primary] text-white`,
    );
    this.input.position(this.x + this.p5.globalWindowOffset.x, this.y + this.p5.globalWindowOffset.y);

    if (!this.visible) {
      this.input.elt.setSelectionRange(this.input.elt.selectionStart, this.input.elt.selectionStart);
      this.input.elt.blur();
      this.input.hide();
    } else this.input.show();
  }
}
