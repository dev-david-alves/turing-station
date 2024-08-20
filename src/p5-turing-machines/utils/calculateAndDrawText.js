export const calculateTextWidth = (p5, xx = -1000, yy = -1000, substring = [], fontSize = 12) => {
  p5.push();
  p5.textAlign(p5.LEFT, p5.CENTER);
  // p5.textStyle(p5.ITALIC);
  p5.textSize(fontSize);

  let startX = xx;

  p5.fill(255, 255, 255, 0);

  for (let i = 0; i < substring.length; i++) {
    let newString = substring[i];

    if (substring[i].startsWith("_{") && substring[i].endsWith("}")) {
      newString = substring[i].replace(/_{/g, "");
      newString = newString.replace(/}/g, "");
      p5.push();
      p5.textSize(fontSize * 0.73);
      p5.text(newString, xx, yy + 10 * p5.globalScaleFactor);
      xx += p5.textWidth(newString);
      p5.pop();
    } else if (substring[i].startsWith("^{") && substring[i].endsWith("}")) {
      newString = substring[i].replace(/\^{/g, "");
      newString = newString.replace(/}/g, "");
      p5.push();
      p5.textSize(fontSize * 0.73);
      p5.text(newString, xx, yy - 2 * p5.globalScaleFactor);
      xx += p5.textWidth(newString);
      p5.pop();
    } else if (substring[i].startsWith("_")) {
      newString = substring[i].replace(/_/g, "");
      p5.push();
      p5.textSize(fontSize * 0.73);
      p5.text(newString, xx, yy + 10 * p5.globalScaleFactor);
      xx += p5.textWidth(newString);
      p5.pop();
    } else if (substring[i].startsWith("^")) {
      newString = substring[i].replace(/\^/g, "");
      p5.push();
      p5.textSize(fontSize * 0.73);
      p5.text(newString, xx, yy - 2 * p5.globalScaleFactor);
      xx += p5.textWidth(newString);
      p5.pop();
    } else {
      p5.text(substring[i], xx, yy);
      xx += p5.textWidth(newString);
    }
  }

  p5.pop();
  return Math.abs(xx - startX);
};

export const drawText = (p5, xx = -1000, yy = -1000, substring = [], fontSize = 12) => {
  p5.push();
  p5.textAlign(p5.LEFT, p5.CENTER);
  // p5.textStyle(p5.ITALIC);
  p5.textSize(fontSize);

  for (let i = 0; i < substring.length; i++) {
    let newString = substring[i];

    if (substring[i].startsWith("_{") && substring[i].endsWith("}")) {
      newString = substring[i].replace(/_{/g, "");
      newString = newString.replace(/}/g, "");
      p5.push();
      p5.textSize(fontSize * 0.73);
      p5.text(newString, xx, yy + 6 * p5.globalScaleFactor);
      xx += p5.textWidth(newString);
      p5.pop();
    } else if (substring[i].startsWith("^{") && substring[i].endsWith("}")) {
      newString = substring[i].replace(/\^{/g, "");
      newString = newString.replace(/}/g, "");
      p5.push();
      p5.textSize(fontSize * 0.73);
      p5.text(newString, xx, yy - 6 * p5.globalScaleFactor);
      xx += p5.textWidth(newString);
      p5.pop();
    } else if (substring[i].startsWith("_")) {
      newString = substring[i].replace(/_/g, "");
      p5.push();
      p5.textSize(fontSize * 0.73);
      p5.text(newString, xx, yy + 6 * p5.globalScaleFactor);
      xx += p5.textWidth(newString);
      p5.pop();
    } else if (substring[i].startsWith("^")) {
      newString = substring[i].replace(/\^/g, "");
      p5.push();
      p5.textSize(fontSize * 0.73);
      p5.text(newString, xx, yy - 6 * p5.globalScaleFactor);
      xx += p5.textWidth(newString);
      p5.pop();
    } else {
      p5.text(substring[i], xx, yy);
      xx += p5.textWidth(newString);
    }
  }

  p5.pop();
};
