import {
  getEnvelopingMoodIds,
  moodToColor,
  trapeziumArea,
  mapRight,
  computeAverageMoodInInterval,
  roundDateDown,
  roundDateUp,
  formatIsoMonthInLocalTimezone,
  getMoodIdsInInterval,
  computeTrendlinePoints,
} from "./utils";
import { MOOD_RANGE } from "./constants";

describe("utils", () => {
  describe("computeAverageMoodInInterval", () => {
    describe("when the fromDate is after the toDate", () => {
      it("throws an error", () => {
        expect(() =>
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
            },
            new Date("2020-07-31T00:00:00.000Z"),
            new Date("2020-07-30T00:00:00.000Z")
          )
        ).toThrow(Error("fromDate must be equal to or before toDate"));
      });
    });

    describe("when there are 0 moods", () => {
      it("throws an error", () => {
        expect(() =>
          computeAverageMoodInInterval(
            {
              allIds: [],
              byId: {},
            },
            new Date("2020-07-30T00:00:00.000Z"),
            new Date("2020-07-31T00:00:00.000Z")
          )
        ).toThrow(Error("No moods"));
      });
    });

    describe("when there is 1 mood", () => {
      it("returns an average mood when the mood intersects with the interval", () => {
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
            },
            new Date("2020-07-28T00:00:00.000Z"),
            new Date("2020-07-28T00:00:00.000Z")
          )
        ).toEqual(5);
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
            },
            new Date("2020-07-27T00:00:00.000Z"),
            new Date("2020-07-28T00:00:00.000Z")
          )
        ).toEqual(5);
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
            },
            new Date("2020-07-28T00:00:00.000Z"),
            new Date("2020-07-29T00:00:00.000Z")
          )
        ).toEqual(5);
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
            },
            new Date("2020-07-27T00:00:00.000Z"),
            new Date("2020-07-29T00:00:00.000Z")
          )
        ).toEqual(5);
      });

      it("throws an error when the mood does not intersect with the interval", () => {
        expect(() =>
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
            },
            new Date("2020-07-25T00:00:00.000Z"),
            new Date("2020-07-25T00:00:00.000Z")
          )
        ).toThrow(Error("No moods intersect with provided interval"));
        expect(() =>
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
            },
            new Date("2020-07-24T00:00:00.000Z"),
            new Date("2020-07-25T00:00:00.000Z")
          )
        ).toThrow(Error("No moods intersect with provided interval"));
        expect(() =>
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
            },
            new Date("2020-07-30T00:00:00.000Z"),
            new Date("2020-07-30T00:00:00.000Z")
          )
        ).toThrow(Error("No moods intersect with provided interval"));
        expect(() =>
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
            },
            new Date("2020-07-30T00:00:00.000Z"),
            new Date("2020-07-31T00:00:00.000Z")
          )
        ).toThrow(Error("No moods intersect with provided interval"));
      });
    });

    describe("when there are multiple moods", () => {
      it("works with 2 moods in the interval", () => {
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z", "2020-07-29T00:00:00.000Z"],
              byId: {
                "2020-07-28T00:00:00.000Z": { mood: 5 },
                "2020-07-29T00:00:00.000Z": { mood: 7 },
              },
            },
            new Date("2020-07-28T00:00:00.000Z"),
            new Date("2020-07-29T00:00:00.000Z")
          )
        ).toEqual(6);
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z", "2020-07-29T00:00:00.000Z"],
              byId: {
                "2020-07-28T00:00:00.000Z": { mood: 5 },
                "2020-07-29T00:00:00.000Z": { mood: 7 },
              },
            },
            new Date("2020-07-27T00:00:00.000Z"),
            new Date("2020-07-29T00:00:00.000Z")
          )
        ).toEqual(6);
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z", "2020-07-29T00:00:00.000Z"],
              byId: {
                "2020-07-28T00:00:00.000Z": { mood: 5 },
                "2020-07-29T00:00:00.000Z": { mood: 7 },
              },
            },
            new Date("2020-07-28T00:00:00.000Z"),
            new Date("2020-07-30T00:00:00.000Z")
          )
        ).toEqual(6);
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z", "2020-07-29T00:00:00.000Z"],
              byId: {
                "2020-07-28T00:00:00.000Z": { mood: 5 },
                "2020-07-29T00:00:00.000Z": { mood: 7 },
              },
            },
            new Date("2020-07-27T00:00:00.000Z"),
            new Date("2020-08-02T00:00:00.000Z")
          )
        ).toEqual(6);
      });

      it("works with 2 moods and only one in the interval", () => {
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-24T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
              byId: {
                "2020-07-24T00:00:00.000Z": { mood: 4 },
                "2020-07-28T00:00:00.000Z": { mood: 5 },
              },
            },
            new Date("2020-07-26T00:00:00.000Z"),
            new Date("2020-08-02T00:00:00.000Z")
          )
        ).toEqual(4.75);
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-24T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
              byId: {
                "2020-07-24T00:00:00.000Z": { mood: 4 },
                "2020-07-28T00:00:00.000Z": { mood: 5 },
              },
            },
            new Date("2020-07-23T00:00:00.000Z"),
            new Date("2020-07-24T00:00:00.000Z")
          )
        ).toEqual(4);
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-24T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
              byId: {
                "2020-07-24T00:00:00.000Z": { mood: 4 },
                "2020-07-28T00:00:00.000Z": { mood: 5 },
              },
            },
            new Date("2020-07-28T00:00:00.000Z"),
            new Date("2020-08-02T00:00:00.000Z")
          )
        ).toEqual(5);
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-24T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
              byId: {
                "2020-07-24T00:00:00.000Z": { mood: 4 },
                "2020-07-28T00:00:00.000Z": { mood: 5 },
              },
            },
            new Date("2020-07-20T00:00:00.000Z"),
            new Date("2020-07-25T00:00:00.000Z")
          )
        ).toEqual(4.125);
      });

      it("works with 2 moods and both outside the interval", () => {
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-24T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
              byId: {
                "2020-07-24T00:00:00.000Z": { mood: 4 },
                "2020-07-28T00:00:00.000Z": { mood: 5 },
              },
            },
            new Date("2020-07-25T00:00:00.000Z"),
            new Date("2020-07-27T00:00:00.000Z")
          )
        ).toEqual(4.5);
      });
    });
  });

  describe("computeTrendlinePoints", () => {
    it("works", () => {
      expect(
        computeTrendlinePoints(
          {
            allIds: ["2020-07-24T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
            byId: {
              "2020-07-24T00:00:00.000Z": { mood: 4 },
              "2020-07-28T00:00:00.000Z": { mood: 5 },
            },
          },
          [
            new Date("2020-07-25T00:00:00.000Z").getTime(),
            new Date("2020-07-27T00:00:00.000Z").getTime(),
          ]
        )
      ).toMatchInlineSnapshot(`
        Array [
          Array [
            1595635200000,
            4.25,
          ],
          Array [
            1595640600000,
            4.265625,
          ],
          Array [
            1595646000000,
            4.28125,
          ],
          Array [
            1595651400000,
            4.296875,
          ],
          Array [
            1595656800000,
            4.3125,
          ],
          Array [
            1595662200000,
            4.328125,
          ],
          Array [
            1595667600000,
            4.34375,
          ],
          Array [
            1595673000000,
            4.359375,
          ],
          Array [
            1595678400000,
            4.375,
          ],
          Array [
            1595683800000,
            4.390625,
          ],
          Array [
            1595689200000,
            4.40625,
          ],
          Array [
            1595694600000,
            4.421875,
          ],
          Array [
            1595700000000,
            4.4375,
          ],
          Array [
            1595705400000,
            4.453125,
          ],
          Array [
            1595710800000,
            4.46875,
          ],
          Array [
            1595716200000,
            4.484375,
          ],
          Array [
            1595721600000,
            4.5,
          ],
          Array [
            1595727000000,
            4.515625,
          ],
          Array [
            1595732400000,
            4.53125,
          ],
          Array [
            1595737800000,
            4.546875,
          ],
          Array [
            1595743200000,
            4.5625,
          ],
          Array [
            1595748600000,
            4.578125,
          ],
          Array [
            1595754000000,
            4.59375,
          ],
          Array [
            1595759400000,
            4.609375,
          ],
          Array [
            1595764800000,
            4.625,
          ],
          Array [
            1595770200000,
            4.640625,
          ],
          Array [
            1595775600000,
            4.65625,
          ],
          Array [
            1595781000000,
            4.671875,
          ],
          Array [
            1595786400000,
            4.6875,
          ],
          Array [
            1595791800000,
            4.703125,
          ],
          Array [
            1595797200000,
            4.71875,
          ],
          Array [
            1595802600000,
            4.734375,
          ],
          Array [
            1595808000000,
            4.75,
          ],
        ]
      `);
    });
  });

  describe("getEnvelopingMoodIds", () => {
    it("throws an error when the fromDate is after the toDate", () => {
      expect(() =>
        getEnvelopingMoodIds(
          [],
          new Date("2020-09-01T00:00:00"),
          new Date("2020-09-01T00:00:00")
        )
      ).not.toThrow();
      expect(() =>
        getEnvelopingMoodIds(
          [],
          new Date("2020-09-01T00:00:01"),
          new Date("2020-09-01T00:00:00")
        )
      ).toThrow(Error("`fromDate` should not be after `toDate`"));
    });

    it("returns the first ID when the range is before the mood ID range", () => {
      const allIds = [
        "2020-10-04T00:00:00",
        "2020-10-05T00:00:00",
        "2020-10-06T00:00:00",
      ];
      expect(
        getEnvelopingMoodIds(
          allIds,
          new Date("2020-09-01T00:00:00"),
          new Date("2020-09-02T00:00:00")
        )
      ).toEqual(["2020-10-04T00:00:00"]);
    });

    it("returns the last ID when the range is after the mood ID range", () => {
      const allIds = [
        "2020-10-04T00:00:00",
        "2020-10-05T00:00:00",
        "2020-10-06T00:00:00",
      ];
      expect(
        getEnvelopingMoodIds(
          allIds,
          new Date("2020-11-01T00:00:00"),
          new Date("2020-11-02T00:00:00")
        )
      ).toEqual(["2020-10-06T00:00:00"]);
    });

    it("returns all IDs when the date range encompasses all IDs", () => {
      const allIds = [
        "2020-10-04T00:00:00",
        "2020-10-05T00:00:00",
        "2020-10-06T00:00:00",
      ];
      expect(
        getEnvelopingMoodIds(
          allIds,
          new Date("2020-10-01T00:00:00"),
          new Date("2020-10-31T00:00:00")
        )
      ).toEqual(allIds);
    });

    it("returns all IDs when the date range is equal to the mood IDs range", () => {
      const allIds = [
        "2020-10-04T00:00:00",
        "2020-10-05T00:00:00",
        "2020-10-06T00:00:00",
      ];
      expect(
        getEnvelopingMoodIds(
          allIds,
          new Date("2020-10-04T00:00:00"),
          new Date("2020-10-06T00:00:00")
        )
      ).toEqual(allIds);
    });

    it("returns first ID before range", () => {
      const allIds = [
        "2020-10-04T00:00:00",
        "2020-10-04T00:00:01",
        "2020-10-04T00:00:02",
        "2020-10-05T00:00:00",
      ];
      expect(
        getEnvelopingMoodIds(
          allIds,
          new Date("2020-10-04T00:00:02"),
          new Date("2020-10-06T00:00:00")
        )
      ).toEqual([
        "2020-10-04T00:00:01",
        "2020-10-04T00:00:02",
        "2020-10-05T00:00:00",
      ]);
    });

    it("returns first ID after range", () => {
      const allIds = [
        "2020-10-04T00:00:00",
        "2020-10-05T00:00:00",
        "2020-10-06T00:00:00",
        "2020-10-06T00:00:01",
        "2020-10-06T00:00:02",
      ];
      expect(
        getEnvelopingMoodIds(
          allIds,
          new Date("2020-10-04T00:00:00"),
          new Date("2020-10-06T00:00:00")
        )
      ).toEqual([
        "2020-10-04T00:00:00",
        "2020-10-05T00:00:00",
        "2020-10-06T00:00:00",
        "2020-10-06T00:00:01",
      ]);
    });

    it("returns first ID before range and first ID after range", () => {
      const allIds = [
        "2020-10-04T00:00:00",
        "2020-10-04T00:00:01",
        "2020-10-04T00:00:02",
        "2020-10-05T00:00:00",
        "2020-10-06T00:00:00",
        "2020-10-06T00:00:01",
        "2020-10-06T00:00:02",
      ];
      expect(
        getEnvelopingMoodIds(
          allIds,
          new Date("2020-10-04T00:00:02"),
          new Date("2020-10-06T00:00:00")
        )
      ).toEqual([
        "2020-10-04T00:00:01",
        "2020-10-04T00:00:02",
        "2020-10-05T00:00:00",
        "2020-10-06T00:00:00",
        "2020-10-06T00:00:01",
      ]);
    });
  });

  describe("getMoodIdsInInterval", () => {
    it("throws an error when the fromDate is after the toDate", () => {
      expect(() =>
        getMoodIdsInInterval(
          [],
          new Date("2020-09-01T00:00:00"),
          new Date("2020-09-01T00:00:00")
        )
      ).not.toThrow();
      expect(() =>
        getMoodIdsInInterval(
          [],
          new Date("2020-09-01T00:00:01"),
          new Date("2020-09-01T00:00:00")
        )
      ).toThrow(Error("`fromDate` should not be after `toDate`"));
    });

    it("returns an empty array when there are no mood IDs provided", () => {
      expect(
        getMoodIdsInInterval(
          [],
          new Date("2020-09-02T00:00:00"),
          new Date("2020-09-03T00:00:00")
        )
      ).toEqual([]);
    });

    it("returns an empty array when there are no moods within the interval", () => {
      expect(
        getMoodIdsInInterval(
          ["2020-09-01T23:59:59", "2020-09-03T00:00:01"],
          new Date("2020-09-02T00:00:00"),
          new Date("2020-09-03T00:00:00")
        )
      ).toEqual([]);
    });

    it("returns all moods when all moods are within the interval", () => {
      expect(
        getMoodIdsInInterval(
          ["2020-09-02T00:00:00", "2020-09-03T00:00:00"],
          new Date("2020-09-02T00:00:00"),
          new Date("2020-09-03T00:00:00")
        )
      ).toEqual(["2020-09-02T00:00:00", "2020-09-03T00:00:00"]);
    });

    it("only returns moods that are within the interval", () => {
      expect(
        getMoodIdsInInterval(
          [
            "2020-09-01T23:59:59",
            "2020-09-02T00:00:00",
            "2020-09-03T00:00:00",
            "2020-09-03T00:00:01",
          ],
          new Date("2020-09-02T00:00:00"),
          new Date("2020-09-03T00:00:00")
        )
      ).toEqual(["2020-09-02T00:00:00", "2020-09-03T00:00:00"]);
    });
  });

  test("formatIsoMonthInLocalTimezone", () => {
    expect(formatIsoMonthInLocalTimezone(new Date("2020-09-01T00:00:00"))).toBe(
      "2020-09"
    );
    expect(formatIsoMonthInLocalTimezone(new Date("2020-09-30T23:59:59"))).toBe(
      "2020-09"
    );
    expect(formatIsoMonthInLocalTimezone(new Date("2020-10-01T00:00:00"))).toBe(
      "2020-10"
    );
  });

  test("mapRight", () => {
    expect(mapRight([], (x) => x + 1)).toEqual([]);
    expect(mapRight([1], (x) => x + 1)).toEqual([2]);
    expect(mapRight([1, 2, 3], (x) => x + 1)).toEqual([4, 3, 2]);
  });

  test("moodToColor", () => {
    expect(moodToColor(MOOD_RANGE[0])).toMatchInlineSnapshot(`"#1747f0"`);
    expect(
      moodToColor(MOOD_RANGE[0] + (MOOD_RANGE[1] + MOOD_RANGE[0]) / 2)
    ).toMatchInlineSnapshot(`"#00e0e0"`);
    expect(moodToColor(MOOD_RANGE[1])).toMatchInlineSnapshot(`"#30ff20"`);
    expect(
      moodToColor(MOOD_RANGE[0] + (MOOD_RANGE[1] - MOOD_RANGE[0]) / Math.PI)
    ).toMatchInlineSnapshot(`"#00b8fe"`);
  });

  test("roundDateDown", () => {
    expect(roundDateDown(new Date("2020-09-09T00:00:00.000"))).toEqual(
      new Date("2020-09-09T00:00:00.000")
    );
    expect(roundDateDown(new Date("2020-09-09T00:00:00.001"))).toEqual(
      new Date("2020-09-09T00:00:00.000")
    );
    expect(roundDateDown(new Date("2020-09-09T23:59:59.999"))).toEqual(
      new Date("2020-09-09T00:00:00.000")
    );
  });

  test("roundDateUp", () => {
    expect(roundDateUp(new Date("2020-09-08T00:00:00.000"))).toEqual(
      new Date("2020-09-08T00:00:00.000")
    );
    expect(roundDateUp(new Date("2020-09-08T00:00:00.001"))).toEqual(
      new Date("2020-09-09T00:00:00.000")
    );
    expect(roundDateUp(new Date("2020-09-07T23:59:59.999"))).toEqual(
      new Date("2020-09-08T00:00:00.000")
    );
  });

  test("trapeziumArea", () => {
    expect(trapeziumArea(1, 2, 3)).toBe(4.5);
    expect(trapeziumArea(2, 4, 5)).toBe(15);
    expect(trapeziumArea(3, 3, 3)).toBe(9);
  });
});
