import { moodToColor, trapeziumArea } from "./utils";

describe("utils", () => {
  test("moodToColor", () => {
    expect(moodToColor(0)).toMatchInlineSnapshot(`"hsl(0.75turn, 100%, 65%)"`);
    expect(moodToColor(0.5)).toMatchInlineSnapshot(
      `"hsl(0.55turn, 100%, 52.5%)"`
    );
    expect(moodToColor(1)).toMatchInlineSnapshot(`"hsl(0.35turn, 100%, 40%)"`);
  });

  test("trapeziumArea", () => {
    expect(trapeziumArea(1, 2, 3)).toBe(4.5);
    expect(trapeziumArea(2, 4, 5)).toBe(15);
    expect(trapeziumArea(3, 3, 3)).toBe(9);
  });
});
