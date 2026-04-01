/**
 * Rasterize images/logo.svg → images/logo-email.png for HTML email (Gmail-safe).
 */
const fs = require("fs");
const path = require("path");
const { Resvg } = require("@resvg/resvg-js");

const root = path.join(__dirname, "..");
const svgPath = path.join(root, "images", "logo.svg");
const outPath = path.join(root, "images", "logo-email.png");

const svg = fs.readFileSync(svgPath, "utf8");
// 72px tall (129×72 file); email-signature-gmail.html uses width="64" height="36" for layout (Gmail ignores most CSS on images).
const resvg = new Resvg(svg, { fitTo: { mode: "height", value: 72 } });
fs.writeFileSync(outPath, resvg.render().asPng());
console.log("Wrote", outPath);
