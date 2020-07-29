export const mean = (xs: number[]): number =>
  xs.reduce((a, b) => a + b) / xs.length;

let colorCache = new Map();

// n must be between 0 and 1 inclusive
export const moodToColor = (n: number): string => {
  const cachedColor = colorCache.get(n);
  if (cachedColor) return cachedColor;
  const color = `hsl(${0.75 - n * 0.4}turn, 100%, ${65 - 25 * n}%)`;
  colorCache.set(n, color);
  return color;
};

export const trapeziumArea = (a: number, b: number, h: number): number =>
  ((a + b) / 2) * h;
