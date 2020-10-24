import { computeAverageByWeek } from "./WeeklyAverages";

describe("WeeklyAverages", () => {
  describe("computeAverageByWeek", () => {
    it("works with 1 mood", () => {
      expect(
        computeAverageByWeek({
          allIds: ["2020-07-28T00:00:00.000Z"],
          byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
        })
      ).toEqual([[new Date("2020-07-27"), 5]]);
    });

    it("gets date correct", () => {
      expect(
        computeAverageByWeek({
          allIds: ["2020-08-16T22:00:00.000Z"],
          byId: { "2020-08-16T22:00:00.000Z": { mood: 5 } },
        })
      ).toEqual([[new Date("2020-08-10"), 5]]);
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
      ).toEqual([[new Date("2020-07-27"), 6]]);
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
        [new Date("2020-07-20"), 5],
        [new Date("2020-07-27"), 5],
      ]);

      expect(
        computeAverageByWeek({
          allIds: ["2020-07-25T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
          byId: {
            "2020-07-25T00:00:00.000Z": { mood: 3 },
            "2020-07-28T00:00:00.000Z": { mood: 6 },
          },
        })
      ).toMatchInlineSnapshot(`
        Array [
          Array [
            2020-07-20T00:00:00.000Z,
            4,
          ],
          Array [
            2020-07-27T00:00:00.000Z,
            5.5,
          ],
        ]
      `);
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
        [new Date("2020-06-29"), 5],
        [new Date("2020-07-06"), 5],
        [new Date("2020-07-13"), 5],
        [new Date("2020-07-20"), 5],
        [new Date("2020-07-27"), 5],
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
            2020-06-29T00:00:00.000Z,
            4.050000000000001,
          ],
          Array [
            2020-07-06T00:00:00.000Z,
            4.449999999999999,
          ],
          Array [
            2020-07-13T00:00:00.000Z,
            5.15,
          ],
          Array [
            2020-07-20T00:00:00.000Z,
            5.75,
          ],
        ]
      `);
    });
  });
});
