import { ColorMaterial } from "@vertexvis/viewer";

export const SelectColor = {
  ...ColorMaterial.create(255, 255, 0),
  glossiness: 4,
  specular: { r: 255, g: 255, b: 255, a: 0 },
};

export function calcRedToGreenGradient(
  percent: number,
  invert = false
): string {
  const p = Math.max(invert ? 100 - percent : percent, 0);
  const color = {
    r: p < 50 ? 255 : Math.round(256 - (p - 50) * 5.12),
    g: p > 50 ? 255 : Math.round(p * 5.12),
    b: 0,
  };
  return rgbToHex(color);
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  return (
    "#" +
    [r, g, b]
      .map((c) => {
        const hex = Math.min(255, c).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}
