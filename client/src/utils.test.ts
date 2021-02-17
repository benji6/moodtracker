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
  formatIsoDateInLocalTimezone,
  computeStandardDeviation,
  computeMean,
  isoDateFromIsoDateAndTime,
  getWeekdayIndex,
  formatIsoYearInLocalTimezone,
  createDateFromLocalDateString,
  getNormalizedDescriptionWordsFromMood,
} from "./utils";
import { MOOD_RANGE } from "./constants";

describe("utils", () => {
  describe("computeAverageMoodInInterval", () => {
    describe("when the fromDate is after the toDate", () => {
      it("returns undefined", () => {
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
            },
            new Date("2020-07-31T00:00:00.000Z"),
            new Date("2020-07-30T00:00:00.000Z")
          )
        ).toBeUndefined();
      });
    });

    describe("when there are 0 moods", () => {
      it("returns undefined", () => {
        expect(
          computeAverageMoodInInterval(
            {
              allIds: [],
              byId: {},
            },
            new Date("2020-07-30T00:00:00.000Z"),
            new Date("2020-07-31T00:00:00.000Z")
          )
        ).toBeUndefined();
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

      it("returns undefined when the mood does not intersect with the interval", () => {
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
            },
            new Date("2020-07-25T00:00:00.000Z"),
            new Date("2020-07-25T00:00:00.000Z")
          )
        ).toBeUndefined();
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
            },
            new Date("2020-07-24T00:00:00.000Z"),
            new Date("2020-07-25T00:00:00.000Z")
          )
        ).toBeUndefined();
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
            },
            new Date("2020-07-30T00:00:00.000Z"),
            new Date("2020-07-30T00:00:00.000Z")
          )
        ).toBeUndefined();
        expect(
          computeAverageMoodInInterval(
            {
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: { "2020-07-28T00:00:00.000Z": { mood: 5 } },
            },
            new Date("2020-07-30T00:00:00.000Z"),
            new Date("2020-07-31T00:00:00.000Z")
          )
        ).toBeUndefined();
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

  test("computeMean", () => {
    expect(computeMean([])).toBeUndefined();
    expect(computeMean([5])).toBe(5);
    expect(computeMean([1, 5])).toBe(3);
    expect(computeMean([1, 2, 3, 4, 5, 6, 7])).toBe(4);
  });

  test("createDateFromLocalDateString", () => {
    expect(createDateFromLocalDateString("2021-01-01")).toEqual(
      new Date("2021-01-01T00:00:00")
    );
  });

  describe("computeStandardDeviation", () => {
    it("returns 0 when the array is empty", () => {
      expect(computeStandardDeviation([])).toBe(0);
    });

    it("returns 0 when the array contains a single item", () => {
      expect(computeStandardDeviation([5])).toBe(0);
    });

    it("returns 0 when all items in the array are the same", () => {
      expect(computeStandardDeviation([5, 5, 5, 5, 5])).toBe(0);
    });

    it("returns the correct standard deviation", () => {
      expect(
        computeStandardDeviation([727.7, 1086.5, 1091, 1361.3, 1490.5, 1956.1])
      ).toBeCloseTo(420.96);
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
        "2020-10-04T00:00:00.000Z",
        "2020-10-04T00:00:01.000Z",
        "2020-10-04T00:00:02.000Z",
        "2020-10-05T00:00:00.000Z",
      ];
      expect(
        getEnvelopingMoodIds(
          allIds,
          new Date("2020-10-04T00:00:02.000Z"),
          new Date("2020-10-06T00:00:00.000Z")
        )
      ).toEqual([
        "2020-10-04T00:00:01.000Z",
        "2020-10-04T00:00:02.000Z",
        "2020-10-05T00:00:00.000Z",
      ]);
    });

    it("returns first ID after range", () => {
      const allIds = [
        "2020-10-04T00:00:00.000Z",
        "2020-10-05T00:00:00.000Z",
        "2020-10-06T00:00:00.000Z",
        "2020-10-06T00:00:01.000Z",
        "2020-10-06T00:00:02.000Z",
      ];
      expect(
        getEnvelopingMoodIds(
          allIds,
          new Date("2020-10-04T00:00:00.000Z"),
          new Date("2020-10-06T00:00:00.000Z")
        )
      ).toEqual([
        "2020-10-04T00:00:00.000Z",
        "2020-10-05T00:00:00.000Z",
        "2020-10-06T00:00:00.000Z",
        "2020-10-06T00:00:01.000Z",
      ]);
    });

    it("returns first ID before range and first ID after range", () => {
      const allIds = [
        "2020-10-04T00:00:00.000Z",
        "2020-10-04T00:00:01.000Z",
        "2020-10-04T00:00:02.000Z",
        "2020-10-05T00:00:00.000Z",
        "2020-10-06T00:00:00.000Z",
        "2020-10-06T00:00:01.000Z",
        "2020-10-06T00:00:02.000Z",
      ];
      expect(
        getEnvelopingMoodIds(
          allIds,
          new Date("2020-10-04T00:00:02.000Z"),
          new Date("2020-10-06T00:00:00.000Z")
        )
      ).toEqual([
        "2020-10-04T00:00:01.000Z",
        "2020-10-04T00:00:02.000Z",
        "2020-10-05T00:00:00.000Z",
        "2020-10-06T00:00:00.000Z",
        "2020-10-06T00:00:01.000Z",
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

  test("getNormalizedDescriptionWordsFromMood", () => {
    expect(getNormalizedDescriptionWordsFromMood({ mood: 5 })).toEqual([]);
    expect(
      getNormalizedDescriptionWordsFromMood({ description: "", mood: 5 })
    ).toEqual([]);
    expect(
      getNormalizedDescriptionWordsFromMood({ description: "   ", mood: 5 })
    ).toEqual([]);
    expect(
      getNormalizedDescriptionWordsFromMood({ description: "pikachu", mood: 5 })
    ).toEqual(["Pikachu"]);
    expect(
      getNormalizedDescriptionWordsFromMood({
        description: "   pikachu   ",
        mood: 5,
      })
    ).toEqual(["Pikachu"]);
    expect(
      getNormalizedDescriptionWordsFromMood({
        description: "  Bulbasaur pIkaChu  🙂   ",
        mood: 5,
      })
    ).toEqual(["Bulbasaur", "Pikachu", "🙂"]);
  });

  test("formatIsoDateInLocalTimezone", () => {
    expect(formatIsoDateInLocalTimezone(new Date("2020-09-01T00:00:00"))).toBe(
      "2020-09-01"
    );
    expect(formatIsoDateInLocalTimezone(new Date("2020-09-30T23:59:59"))).toBe(
      "2020-09-30"
    );
    expect(formatIsoDateInLocalTimezone(new Date("2020-10-01T00:00:01"))).toBe(
      "2020-10-01"
    );
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

  test("formatIsoYearInLocalTimezone", () => {
    expect(formatIsoYearInLocalTimezone(new Date("2020-01-01T00:00:00"))).toBe(
      "2020"
    );
    expect(formatIsoYearInLocalTimezone(new Date("2020-12-31T23:59:59"))).toBe(
      "2020"
    );
    expect(formatIsoYearInLocalTimezone(new Date("2021-01-01T00:00:00"))).toBe(
      "2021"
    );
  });

  test("getWeekdayIndex", () => {
    expect(getWeekdayIndex(new Date("2020-09-01T00:00:00"))).toBe(1);
    expect(getWeekdayIndex(new Date("2020-09-02T00:00:00"))).toBe(2);
    expect(getWeekdayIndex(new Date("2020-09-03T00:00:00"))).toBe(3);
    expect(getWeekdayIndex(new Date("2020-09-04T00:00:00"))).toBe(4);
    expect(getWeekdayIndex(new Date("2020-09-05T00:00:00"))).toBe(5);
    expect(getWeekdayIndex(new Date("2020-09-06T00:00:00"))).toBe(6);
    expect(getWeekdayIndex(new Date("2020-09-07T00:00:00"))).toBe(0);
    expect(getWeekdayIndex(new Date("2020-09-08T00:00:00"))).toBe(1);
  });

  test("isoDateFromIsoDateAndTime", () => {
    expect(isoDateFromIsoDateAndTime("2020-09-01T00:00:00")).toBe("2020-09-01");
    expect(isoDateFromIsoDateAndTime("2020-09-01T23:59:59")).toBe("2020-09-01");
  });

  test("mapRight", () => {
    expect(mapRight([], (x) => x + 1)).toEqual([]);
    expect(mapRight([1], (x) => x + 1)).toEqual([2]);
    expect(mapRight([1, 2, 3], (x) => x + 1)).toEqual([4, 3, 2]);
  });

  test("moodToColor", () => {
    expect(moodToColor(MOOD_RANGE[0])).toMatchInlineSnapshot(
      `"rgb(23, 71, 240)"`
    );
    expect(
      moodToColor(MOOD_RANGE[0] + (MOOD_RANGE[1] + MOOD_RANGE[0]) / 2)
    ).toMatchInlineSnapshot(`"rgb(0, 224, 224)"`);
    expect(moodToColor(MOOD_RANGE[1])).toMatchInlineSnapshot(
      `"rgb(48, 255, 32)"`
    );
    expect(
      moodToColor(MOOD_RANGE[0] + (MOOD_RANGE[1] - MOOD_RANGE[0]) / Math.PI)
    ).toMatchInlineSnapshot(`"rgb(0, 181, 250)"`);
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
