import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";
// Deterministic grain generated locally: no texture downloads or asset loading race.
function grainTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#f1eee7";
  ctx.fillRect(0, 0, 256, 256);
  let seed = 17;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < 1300; i++) {
    const x = random() * 256,
      y = random() * 256;
    ctx.strokeStyle = `rgba(119,103,80,${random() * 0.1})`;
    ctx.lineWidth = random() * 0.8 + 0.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
      x + random() * 15,
      y + 20,
      x - random() * 15,
      y + 55,
      x + random() * 8,
      y + 100,
    );
    ctx.stroke();
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
export const woodGrain = grainTexture();

// Neutral woven fibers: tint is supplied by each material, rather than baked in.
function wovenTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#e5e0d3";
  ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 8)
    for (let x = 0; x < 256; x += 8) {
      const horizontal = (x / 8 + y / 8) % 2 === 0;
      ctx.fillStyle = horizontal ? "#f5f0e3" : "#c9c2b3";
      ctx.fillRect(x + 1, y + 1, horizontal ? 7 : 5, horizontal ? 5 : 7);
      ctx.fillStyle = "#fffbf1";
      ctx.fillRect(x + 1, y + 1, horizontal ? 7 : 1, horizontal ? 1 : 7);
    }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
export const wovenFiber = wovenTexture();
