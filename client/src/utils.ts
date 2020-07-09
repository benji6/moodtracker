import { interpolatePlasma } from "d3-scale-chromatic";

let colorCache = new Map();

// n must be between 0 and 1 inclusive
export const moodToColor = (n: number): string => {
  const cachedColor = colorCache.get(n);
  if (cachedColor) return cachedColor;
  const color = interpolatePlasma(n * 0.75);
  colorCache.set(n, color);
  return color;
};
