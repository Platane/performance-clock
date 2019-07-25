/**
 * some parameters
 */
const N = 30;
const SIZE = 60;
const PI2 = Math.PI * 2;

const createSvgElement = elementName =>
  document.createElementNS("http://www.w3.org/2000/svg", elementName);

/**
 * prepare svg elements
 */
const clock = createSvgElement("svg");
clock.style = `position:fixed;top:50px;left:2px;width:${SIZE}px;height:${SIZE}px;z-index:99999999`;
clock.setAttribute("viewBox", "-1.1 -1.1 2.2 2.2");

document.body.appendChild(clock);

const circle = createSvgElement("circle");
circle.setAttribute("cx", 0);
circle.setAttribute("cy", 0);
circle.setAttribute("r", 1.05);
circle.style = "fill:#eee9;stroke:#999;stroke-width:0.1";
clock.appendChild(circle);

const sections = createSvgElement("g");
clock.appendChild(sections);

Array.from({ length: N }).forEach(() => {
  const section = createSvgElement("path");
  sections.appendChild(section);
});

/**
 * draw clock helper
 */
const buildSectionPath = (a, b) => {
  const delta = (b - a + PI2) % PI2;
  const large = delta > Math.PI;

  return [
    `M 0 0`,
    `L ${Math.cos(a)} ${Math.sin(a)}`,
    `A 1 1 0 ${+large} 1 ${Math.cos(b)} ${Math.sin(b)}`,
    "z"
  ].join(" ");
};

const drawClock = steps => {
  for (let i = 1; i < steps.length; i++) {
    const a = steps[i];
    const b = steps[i - 1];

    const delta = (b - a + PI2) % PI2;

    const hue = 100 - Math.min(delta * 100, 100);

    const section = sections.children[i - 1];
    section.setAttribute("d", buildSectionPath(a, b + 0.02));
    section.setAttribute("fill", `hsl(${hue},60%,60%)`);
  }
};

/**
 * loop every animation frame
 */
let lastDate = Date.now();
const loop = () => {
  const delta = Date.now() - lastDate;
  lastDate = Date.now();

  const k = delta / 600;

  steps.unshift((steps[0] + k) % PI2);
  steps.splice(N, 9999);

  drawClock(steps);

  requestAnimationFrame(loop);
};

const steps = [0];
loop();
