import { computeAverageByWeek } from "./WeeklyAverages";

describe("WeeklyAverages", () => {
  describe("computeAverageByWeek", () => {
    it("works with 1 mood", () => {
      expect(
        computeAverageByWeek({
          allIds: ["2020-07-28T00:00:00.000Z"],
          byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
        })
      ).toEqual([["27 July – 2 August 2020", 5]]);
    });

    it("works with 2 moods in the same week", () => {
      expect(
        computeAverageByWeek({
          allIds: ["2020-07-28T00:00:00.000Z", "2020-07-29T00:00:00.000Z"],
          byId: {
            "2020-07-28T00:00:00.000Z": { mood: 5 },
            "2020-07-29T00:00:00.000Z": { mood: 7 },
          },
        })
      ).toEqual([["27 July – 2 August 2020", 6]]);
    });

    it("works with 2 moods in adjacent weeks", () => {
      expect(
        computeAverageByWeek({
          allIds: ["2020-07-25T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
          byId: {
            "2020-07-25T00:00:00.000Z": { mood: 5 },
            "2020-07-28T00:00:00.000Z": { mood: 5 },
          },
        })
      ).toEqual([
        ["27 July – 2 August 2020", 5],
        ["20–26 July 2020", 5],
      ]);

      expect(
        computeAverageByWeek({
          allIds: ["2020-07-25T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
          byId: {
            "2020-07-25T00:00:00.000Z": { mood: 3 },
            "2020-07-28T00:00:00.000Z": { mood: 6 },
          },
        })
      ).toEqual([
        ["27 July – 2 August 2020", 4.9375],
        ["20–26 July 2020", 3.4375],
      ]);
    });

    it("works with 2 moods in separate non-adjacent weeks", () => {
      expect(
        computeAverageByWeek({
          allIds: ["2020-07-05T00:00:00.000Z", "2020-07-31T00:00:00.000Z"],
          byId: {
            "2020-07-05T00:00:00.000Z": { mood: 5 },
            "2020-07-31T00:00:00.000Z": { mood: 5 },
          },
        })
      ).toEqual([
        ["27 July – 2 August 2020", 5],
        ["20–26 July 2020", 5],
        ["13–19 July 2020", 5],
        ["6–12 July 2020", 5],
      ]);

      expect(
        computeAverageByWeek({
          allIds: ["2020-07-05T00:00:00.000Z", "2020-07-25T00:00:00.000Z"],
          byId: {
            "2020-07-05T00:00:00.000Z": { mood: 4 },
            "2020-07-25T00:00:00.000Z": { mood: 6 },
          },
        })
      ).toMatchInlineSnapshot(`
        Array [
          Array [
            "20–26 July 2020",
            5.69375,
          ],
          Array [
            "13–19 July 2020",
            5.0375000000000005,
          ],
          Array [
            "6–12 July 2020",
            4.34375,
          ],
        ]
      `);
    });
  });
});
