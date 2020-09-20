import { computeAverageByMonth } from "./MonthlyAverages";

describe("MonthlyAverages", () => {
  describe("computeAverageByMonth", () => {
    it("works with 1 mood", () => {
      expect(
        computeAverageByMonth({
          allIds: ["2020-07-28T00:00:00.000Z"],
          byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
        })
      ).toEqual([[new Date("2020-07-01"), 5]]);
    });

    it("works with 2 moods in the same month", () => {
      expect(
        computeAverageByMonth({
          allIds: ["2020-07-28T00:00:00.000Z", "2020-07-29T00:00:00.000Z"],
          byId: {
            "2020-07-28T00:00:00.000Z": { mood: 5 },
            "2020-07-29T00:00:00.000Z": { mood: 7 },
          },
        })
      ).toEqual([[new Date("2020-07-01"), 6]]);
    });

    it("works with 2 moods in adjacent months", () => {
      expect(
        computeAverageByMonth({
          allIds: ["2020-06-25T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
          byId: {
            "2020-06-25T00:00:00.000Z": { mood: 5 },
            "2020-07-28T00:00:00.000Z": { mood: 5 },
          },
        })
      ).toEqual([
        [new Date("2020-06-01"), 5],
        [new Date("2020-07-01"), 5],
      ]);

      expect(
        computeAverageByMonth({
          allIds: ["2020-06-10T00:00:00.000Z", "2020-07-10T00:00:00.000Z"],
          byId: {
            "2020-06-10T00:00:00.000Z": { mood: 4 },
            "2020-07-10T00:00:00.000Z": { mood: 7 },
          },
        })
      ).toMatchInlineSnapshot(`
        Array [
          Array [
            2020-06-01T00:00:00.000Z,
            5.05,
          ],
          Array [
            2020-07-01T00:00:00.000Z,
            6.550000000000001,
          ],
        ]
      `);
    });

    it("works with 2 moods in separate non-adjacent months", () => {
      expect(
        computeAverageByMonth({
          allIds: ["2020-04-05T00:00:00.000Z", "2020-07-31T00:00:00.000Z"],
          byId: {
            "2020-04-05T00:00:00.000Z": { mood: 5 },
            "2020-07-31T00:00:00.000Z": { mood: 5 },
          },
        })
      ).toEqual([
        [new Date("2020-04-01"), 5],
        [new Date("2020-05-01"), 5],
        [new Date("2020-06-01"), 5],
        [new Date("2020-07-01"), 5],
      ]);

      expect(
        computeAverageByMonth({
          allIds: ["2020-04-05T00:00:00.000Z", "2020-07-05T00:00:00.000Z"],
          byId: {
            "2020-04-05T00:00:00.000Z": { mood: 3 },
            "2020-07-05T00:00:00.000Z": { mood: 9 },
          },
        })
      ).toMatchInlineSnapshot(`
        Array [
          Array [
            2020-04-01T00:00:00.000Z,
            3.857142857142857,
          ],
          Array [
            2020-05-01T00:00:00.000Z,
            5.736263736263737,
          ],
          Array [
            2020-06-01T00:00:00.000Z,
            7.747252747252748,
          ],
          Array [
            2020-07-01T00:00:00.000Z,
            8.868131868131869,
          ],
        ]
      `);
    });
  });
});
