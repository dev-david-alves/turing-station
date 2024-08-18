export const updateBoxPosition = (p5, tBox, x, y, angleOrNull, isSelfLink = false, parent = null) => {
  if (!tBox) return;

  let ruleX = x;
  let ruleY = y;

  // position the text intelligently if given an angle
  if (angleOrNull != null) {
    let cosCalc = p5.cos(angleOrNull);
    let sinCalc = p5.sin(angleOrNull);
    let cornerPointX = cosCalc > 0 ? 1 : -1;
    let cornerPointY = sinCalc > 0 ? 1 : -1;

    // Adjust x, y based on angle
    x += cornerPointX - sinCalc;
    y += cornerPointY + cosCalc;

    // Rules position based on cosine and sine calculations
    ruleX = x + (tBox.rulesWidth / 2 + 5 * tBox.scaleFactor) * cosCalc;

    if (p5.round(p5.abs(sinCalc)) == 0 && p5.round(p5.abs(cosCalc)) == 1) {
      ruleY = y - (tBox.rulesHeight / 2 + tBox.offsetBoxY / 2);
    } else if (sinCalc < 0) {
      ruleY = y + (tBox.rulesHeight + tBox.offsetBoxY / 2) * sinCalc;
    } else if (p5.round(p5.abs(sinCalc)) == 1 && p5.round(p5.abs(cosCalc)) == 1) {
      ruleX = x + (tBox.rulesWidth / 2 + tBox.offsetBoxY / 2) * cosCalc;
    }
  }

  // Update the box's position
  tBox.x = x - tBox.w / 2;
  tBox.y = y - tBox.h / 2;

  // Update rules position
  if (!isSelfLink) {
    tBox.rulesX = ruleX;
    tBox.rulesY = ruleY;
  } else {
    let angle = p5.atan2(y - parent.y, x - parent.x);
    tBox.rulesX = x + (tBox.rulesWidth / 2 + 5 * tBox.scaleFactor) * p5.cos(angle);

    if (angle < 0) {
      let sinn = p5.map(p5.sin(angle), 0, -1, -0.5, -1);
      tBox.rulesY = y + (tBox.rulesHeight + tBox.offsetBoxY / 2) * sinn;
    } else {
      let sinn = p5.map(p5.sin(angle), 0, 1, -0.5, 0);
      tBox.rulesY = y + (tBox.rulesHeight + tBox.offsetBoxY / 2) * sinn;
    }
  }
};
