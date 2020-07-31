import { computeAverageByMonth } from "./MonthlyAverages";

describe("MonthlyAverages", () => {
  describe("computeAverageByMonth", () => {
    it("works with 1 mood", () => {
      expect(
        computeAverageByMonth({
          allIds: ["2020-07-28T00:00:00.000Z"],
          byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
        })
      ).toEqual({ "July 2020": 5 });
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
      ).toEqual({ "July 2020": 6 });
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
      ).toEqual({
        "June 2020": 5,
        "July 2020": 5,
      });

      expect(
        computeAverageByMonth({
          allIds: ["2020-06-10T00:00:00.000Z", "2020-07-10T00:00:00.000Z"],
          byId: {
            "2020-06-10T00:00:00.000Z": { mood: 4 },
            "2020-07-10T00:00:00.000Z": { mood: 7 },
          },
        })
      ).toEqual({
        "June 2020": 5.04375,
        "July 2020": 6.54375,
      });
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
      ).toEqual({
        "April 2020": 5,
        "May 2020": 5,
        "June 2020": 5,
        "July 2020": 5,
      });

      expect(
        computeAverageByMonth({
          allIds: ["2020-04-05T00:00:00.000Z", "2020-07-05T00:00:00.000Z"],
          byId: {
            "2020-04-05T00:00:00.000Z": { mood: 3 },
            "2020-07-05T00:00:00.000Z": { mood: 9 },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "April 2020": 3.853021978021979,
          "July 2020": 8.864010989010989,
          "June 2020": 7.739010989010989,
          "May 2020": 5.728021978021979,
        }
      `);
    });
  });
});
