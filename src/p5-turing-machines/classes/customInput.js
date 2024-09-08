import { calculateTextWidth } from "../utils/calculateAndDrawText";
import { transformInputText } from "../utils/transformInputText";
import { texMap } from "../utils/getTexMaps";

export default class CustomInput {
  constructor(p5, x, y, parent = null) {
    // Start values
    this.p5 = p5;
    this.x = x;
    this.y = y;

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
      `absolute px-2 py-1 rounded-[.4rem] focus:outline-none w-[8rem] bg-background border-2 border-[--color-primary] text-white`,
    );
    this.input.position(this.x, this.y);

    this.input.input(() => this.textInput(this.input.value()));

    // Break string for better drawing suberscripts and superscripts
    this.allSubstrings = [];
  }

  textInput(value) {
    this.allSubstrings = transformInputText(value, texMap);
  }

  update() {
    this.textWidth = calculateTextWidth(this.p5, this.x, this.y, this.allSubstrings, this.fontSize);
    this.input.position(this.x, this.y);

    if (!this.visible) {
      this.input.elt.setSelectionRange(this.input.elt.selectionStart, this.input.elt.selectionStart);
      this.input.elt.blur();
      this.input.hide();
    } else this.input.show();
  }
}
