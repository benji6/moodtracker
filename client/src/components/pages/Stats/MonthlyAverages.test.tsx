import { computeAverageByMonth } from "./MonthlyAverages";

describe("MonthlyAverages", () => {
  describe("computeAverageByMonth", () => {
    it("works with 1 mood", () => {
      expect(
        computeAverageByMonth({
          allIds: ["2020-07-28T00:00:00.000Z"],
          byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
        })
      ).toEqual([["July 2020", 5]]);
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
      ).toEqual([["July 2020", 6]]);
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
        ["July 2020", 5],
        ["June 2020", 5],
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
            "July 2020",
            6.547916666666667,
          ],
          Array [
            "June 2020",
            5.047916666666667,
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
        ["July 2020", 5],
        ["June 2020", 5],
        ["May 2020", 5],
        ["April 2020", 5],
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
            "July 2020",
            8.866758241758241,
          ],
          Array [
            "June 2020",
            7.7445054945054945,
          ],
          Array [
            "May 2020",
            5.7335164835164845,
          ],
          Array [
            "April 2020",
            3.8557692307692317,
          ],
        ]
      `);
    });
  });
});
