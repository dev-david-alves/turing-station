export const drawArrow = (p5, x, y, angle) => {
  let dx = Math.cos(angle);
  let dy = Math.sin(angle);

  p5.push();
  p5.strokeWeight(p5.canvasScale);

  p5.beginShape();
  p5.vertex(x, y);
  p5.vertex(
    x - 8 * p5.canvasScale * dx + 5 * p5.canvasScale * dy,
    y - 8 * p5.canvasScale * dy - 5 * p5.canvasScale * dx,
  );
  p5.vertex(
    x - 8 * p5.canvasScale * dx - 5 * p5.canvasScale * dy,
    y - 8 * p5.canvasScale * dy + 5 * p5.canvasScale * dx,
  );
  p5.endShape(p5.CLOSE);
  p5.pop();
};
