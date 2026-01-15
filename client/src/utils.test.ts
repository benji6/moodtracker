import { MOOD_EXTENT, MOOD_RANGE } from "./constants";
import {
  bisectLeft,
  bisectLeftOnExperiencedAt,
  bisectRightOnExperiencedAt,
  capitalizeFirstLetter,
  compareFunctionForStringSorting,
  computeAverageMoodInInterval,
  computeCompletePopulationMssd,
  computeCompletePopulationStandardDeviation,
  computeMean,
  computeMeanSafe,
  convertKelvinToCelcius,
  counter,
  createChartExtent,
  createDateFromLocalDateString,
  defaultDict,
  formatIsoDateHourInLocalTimezone,
  formatIsoDateHourMinuteInLocalTimezone,
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
  getEnvelopingEvents,
  getEnvelopingIds,
  getEventsInInterval,
  getIdsInInterval,
  getNormalizedWordCloudWords,
  getWeatherDisplayData,
  getWeekdayIndex,
  hasEventsInInterval,
  hasIdsInInterval,
  mapRight,
  moodToColor,
  roundDateDown,
  roundDateUp,
  roundDownToNearest10,
  roundUpToNearest10,
  trapeziumArea,
} from "./utils";

describe("utils", () => {
  test("bisectLeft", () => {
    expect(bisectLeft([], "2020")).toBe(0);
    expect(bisectLeft(["2019"], "2020")).toBe(1);
    expect(bisectLeft(["2020"], "2020")).toBe(0);
    expect(bisectLeft(["2021"], "2020")).toBe(0);

    const testArray = [
      "2015",
      "2017",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
    ];

    expect(bisectLeft(testArray, "2014")).toBe(0);
    expect(bisectLeft(testArray, "2015")).toBe(0);
    expect(bisectLeft(testArray, "2016")).toBe(1);
    expect(bisectLeft(testArray, "2017")).toBe(1);
    expect(bisectLeft(testArray, "2020")).toBe(5);
    expect(bisectLeft(testArray, "2025")).toBe(10);
    expect(bisectLeft(testArray, "2026")).toBe(11);
    expect(bisectLeft(testArray, "2027")).toBe(11);

    expect(bisectLeft(testArray, "2014", 1)).toBe(1);
    expect(bisectLeft(testArray, "2015", 2)).toBe(2);
    expect(bisectLeft(testArray, "2020", 100)).toBe(100);
    expect(bisectLeft(testArray, "2025", 100)).toBe(100);
    expect(bisectLeft(testArray, "2026", 100)).toBe(100);
    expect(bisectLeft(testArray, "2027", 100)).toBe(100);
    expect(bisectLeft(testArray, "2020", 4)).toBe(5);
    expect(bisectLeft(testArray, "2020", 5)).toBe(5);
  });

  describe("bisectLeftOnExperiencedAt", () => {
    test("with empty array", () => {
      expect(bisectLeftOnExperiencedAt([], "2020-01-01T00:00:00.000Z")).toBe(0);
    });

    test("with single element", () => {
      const singleItem = [{ experiencedAt: "2020-06-15T12:00:00.000Z" }];
      expect(
        bisectLeftOnExperiencedAt(singleItem, "2020-01-01T00:00:00.000Z"),
      ).toBe(0);
      expect(
        bisectLeftOnExperiencedAt(singleItem, "2020-06-15T12:00:00.000Z"),
      ).toBe(0);
      expect(
        bisectLeftOnExperiencedAt(singleItem, "2020-12-31T23:59:59.999Z"),
      ).toBe(1);
    });

    describe("with multiple elements", () => {
      const testArray = [
        { experiencedAt: "2020-01-15T08:00:00.000Z" },
        { experiencedAt: "2020-03-20T14:30:00.000Z" },
        { experiencedAt: "2020-03-20T14:30:00.000Z" },
        { experiencedAt: "2020-06-10T09:15:00.000Z" },
        { experiencedAt: "2020-08-05T16:45:00.000Z" },
        { experiencedAt: "2020-10-12T11:20:00.000Z" },
        { experiencedAt: "2020-12-25T00:00:00.000Z" },
        { experiencedAt: "2021-02-14T13:30:00.000Z" },
        { experiencedAt: "2021-05-01T10:00:00.000Z" },
        { experiencedAt: "2021-08-15T17:45:00.000Z" },
        { experiencedAt: "2021-12-31T23:59:59.999Z" },
      ];

      test("searching before first element", () => {
        expect(
          bisectLeftOnExperiencedAt(testArray, "2019-12-31T23:59:59.999Z"),
        ).toBe(0);
      });

      test("searching for exact matches", () => {
        expect(
          bisectLeftOnExperiencedAt(testArray, "2020-01-15T08:00:00.000Z"),
        ).toBe(0);
        expect(
          bisectLeftOnExperiencedAt(testArray, "2020-03-20T14:30:00.000Z"),
        ).toBe(1);
        expect(
          bisectLeftOnExperiencedAt(testArray, "2020-10-12T11:20:00.000Z"),
        ).toBe(5);
        expect(
          bisectLeftOnExperiencedAt(testArray, "2021-12-31T23:59:59.999Z"),
        ).toBe(10);
      });

      test("searching between elements", () => {
        expect(
          bisectLeftOnExperiencedAt(testArray, "2020-02-01T00:00:00.000Z"),
        ).toBe(1);
        expect(
          bisectLeftOnExperiencedAt(testArray, "2020-07-01T12:00:00.000Z"),
        ).toBe(4);
        expect(
          bisectLeftOnExperiencedAt(testArray, "2021-01-01T00:00:00.000Z"),
        ).toBe(7);
      });

      test("searching after last element", () => {
        expect(
          bisectLeftOnExperiencedAt(testArray, "2022-01-01T00:00:00.000Z"),
        ).toBe(11);
        expect(
          bisectLeftOnExperiencedAt(testArray, "2025-12-31T23:59:59.999Z"),
        ).toBe(11);
      });

      test("with left parameter (start searching from a specific index)", () => {
        expect(
          bisectLeftOnExperiencedAt(testArray, "2019-12-31T23:59:59.999Z", 1),
        ).toBe(1);
        expect(
          bisectLeftOnExperiencedAt(testArray, "2020-01-15T08:00:00.000Z", 2),
        ).toBe(2);
        expect(
          bisectLeftOnExperiencedAt(testArray, "2020-10-12T11:20:00.000Z", 100),
        ).toBe(100);
        expect(
          bisectLeftOnExperiencedAt(testArray, "2021-12-31T23:59:59.999Z", 100),
        ).toBe(100);
        expect(
          bisectLeftOnExperiencedAt(testArray, "2022-01-01T00:00:00.000Z", 100),
        ).toBe(100);
        expect(
          bisectLeftOnExperiencedAt(testArray, "2020-10-12T11:20:00.000Z", 4),
        ).toBe(5);
        expect(
          bisectLeftOnExperiencedAt(testArray, "2020-10-12T11:20:00.000Z", 5),
        ).toBe(5);
      });
    });

    test("with objects that have additional properties", () => {
      const moodArray = [
        {
          experiencedAt: "2020-01-01T10:00:00.000Z",
          mood: 5,
          createdAt: "2020-01-01T10:01:00.000Z",
        },
        {
          experiencedAt: "2020-01-02T15:30:00.000Z",
          mood: 7,
          createdAt: "2020-01-02T15:31:00.000Z",
        },
        {
          experiencedAt: "2020-01-03T20:15:00.000Z",
          mood: 3,
          createdAt: "2020-01-03T20:16:00.000Z",
        },
      ];

      expect(
        bisectLeftOnExperiencedAt(moodArray, "2019-12-31T23:59:59.999Z"),
      ).toBe(0);
      expect(
        bisectLeftOnExperiencedAt(moodArray, "2020-01-01T10:00:00.000Z"),
      ).toBe(0);
      expect(
        bisectLeftOnExperiencedAt(moodArray, "2020-01-02T00:00:00.000Z"),
      ).toBe(1);
      expect(
        bisectLeftOnExperiencedAt(moodArray, "2020-01-02T15:30:00.000Z"),
      ).toBe(1);
      expect(
        bisectLeftOnExperiencedAt(moodArray, "2020-01-03T20:15:00.000Z"),
      ).toBe(2);
      expect(
        bisectLeftOnExperiencedAt(moodArray, "2020-01-04T00:00:00.000Z"),
      ).toBe(3);
    });
  });

  describe("bisectRightOnExperiencedAt", () => {
    test("with empty array", () => {
      expect(bisectRightOnExperiencedAt([], "2020-01-01T00:00:00.000Z")).toBe(
        0,
      );
    });

    test("with single element", () => {
      const singleItem = [{ experiencedAt: "2020-06-15T12:00:00.000Z" }];
      expect(
        bisectRightOnExperiencedAt(singleItem, "2020-01-01T00:00:00.000Z"),
      ).toBe(0);
      expect(
        bisectRightOnExperiencedAt(singleItem, "2020-06-15T12:00:00.000Z"),
      ).toBe(1);
      expect(
        bisectRightOnExperiencedAt(singleItem, "2020-12-31T23:59:59.999Z"),
      ).toBe(1);
    });

    describe("with multiple elements (sorted array)", () => {
      const testArray = [
        { experiencedAt: "2020-01-15T08:00:00.000Z" },
        { experiencedAt: "2020-03-20T14:30:00.000Z" },
        { experiencedAt: "2020-03-20T14:30:00.000Z" }, // Duplicate to test equal values
        { experiencedAt: "2020-06-10T09:15:00.000Z" },
        { experiencedAt: "2020-08-05T16:45:00.000Z" },
        { experiencedAt: "2020-10-12T11:20:00.000Z" },
        { experiencedAt: "2020-12-25T00:00:00.000Z" },
        { experiencedAt: "2021-02-14T13:30:00.000Z" },
        { experiencedAt: "2021-05-01T10:00:00.000Z" },
        { experiencedAt: "2021-08-15T17:45:00.000Z" },
        { experiencedAt: "2021-12-31T23:59:59.999Z" },
      ];

      test("searching before first element", () => {
        expect(
          bisectRightOnExperiencedAt(testArray, "2019-12-31T23:59:59.999Z"),
        ).toBe(0);
      });

      test("searching for exact matches", () => {
        expect(
          bisectRightOnExperiencedAt(testArray, "2020-01-15T08:00:00.000Z"),
        ).toBe(1);
        expect(
          bisectRightOnExperiencedAt(testArray, "2020-03-20T14:30:00.000Z"),
        ).toBe(3);
        expect(
          bisectRightOnExperiencedAt(testArray, "2020-10-12T11:20:00.000Z"),
        ).toBe(6);
        expect(
          bisectRightOnExperiencedAt(testArray, "2021-12-31T23:59:59.999Z"),
        ).toBe(11);
      });

      test("searching between elements", () => {
        expect(
          bisectRightOnExperiencedAt(testArray, "2020-02-01T00:00:00.000Z"),
        ).toBe(1);
        expect(
          bisectRightOnExperiencedAt(testArray, "2020-07-01T12:00:00.000Z"),
        ).toBe(4);
        expect(
          bisectRightOnExperiencedAt(testArray, "2021-01-01T00:00:00.000Z"),
        ).toBe(7);
      });

      test("searching after last element", () => {
        expect(
          bisectRightOnExperiencedAt(testArray, "2022-01-01T00:00:00.000Z"),
        ).toBe(11);
        expect(
          bisectRightOnExperiencedAt(testArray, "2025-12-31T23:59:59.999Z"),
        ).toBe(11);
      });

      test("with left parameter (start searching from a specific index)", () => {
        expect(
          bisectRightOnExperiencedAt(testArray, "2019-12-31T23:59:59.999Z", 1),
        ).toBe(1);
        expect(
          bisectRightOnExperiencedAt(testArray, "2020-01-15T08:00:00.000Z", 2),
        ).toBe(2);
        expect(
          bisectRightOnExperiencedAt(
            testArray,
            "2020-10-12T11:20:00.000Z",
            100,
          ),
        ).toBe(100);
        expect(
          bisectRightOnExperiencedAt(
            testArray,
            "2021-12-31T23:59:59.999Z",
            100,
          ),
        ).toBe(100);
        expect(
          bisectRightOnExperiencedAt(
            testArray,
            "2022-01-01T00:00:00.000Z",
            100,
          ),
        ).toBe(100);
        expect(
          bisectRightOnExperiencedAt(testArray, "2020-10-12T11:20:00.000Z", 4),
        ).toBe(6);
        expect(
          bisectRightOnExperiencedAt(testArray, "2020-10-12T11:20:00.000Z", 5),
        ).toBe(6);
      });
    });

    test("with objects that have additional properties", () => {
      const moodArray = [
        {
          experiencedAt: "2020-01-01T10:00:00.000Z",
          mood: 5,
          createdAt: "2020-01-01T10:01:00.000Z",
        },
        {
          experiencedAt: "2020-01-02T15:30:00.000Z",
          mood: 7,
          createdAt: "2020-01-02T15:31:00.000Z",
        },
        {
          experiencedAt: "2020-01-03T20:15:00.000Z",
          mood: 3,
          createdAt: "2020-01-03T20:16:00.000Z",
        },
      ];

      expect(
        bisectRightOnExperiencedAt(moodArray, "2019-12-31T23:59:59.999Z"),
      ).toBe(0);
      expect(
        bisectRightOnExperiencedAt(moodArray, "2020-01-01T10:00:00.000Z"),
      ).toBe(1);
      expect(
        bisectRightOnExperiencedAt(moodArray, "2020-01-02T00:00:00.000Z"),
      ).toBe(1);
      expect(
        bisectRightOnExperiencedAt(moodArray, "2020-01-02T15:30:00.000Z"),
      ).toBe(2);
      expect(
        bisectRightOnExperiencedAt(moodArray, "2020-01-03T20:15:00.000Z"),
      ).toBe(3);
      expect(
        bisectRightOnExperiencedAt(moodArray, "2020-01-04T00:00:00.000Z"),
      ).toBe(3);
    });
  });

  test("capitalizeFirstLetter", () => {
    expect(capitalizeFirstLetter("")).toBe("");
    expect(capitalizeFirstLetter("a")).toBe("A");
    expect(capitalizeFirstLetter("A")).toBe("A");
    expect(capitalizeFirstLetter("foo")).toBe("Foo");
    expect(capitalizeFirstLetter("fooBar")).toBe("Foobar");
    expect(capitalizeFirstLetter("Foo Bar Baz")).toBe("Foo bar baz");
  });

  test("compareFunctionForStringSorting", () => {
    expect(compareFunctionForStringSorting("2020-06-01", "2020-06-01")).toBe(0);
    expect(compareFunctionForStringSorting("2020-06-01", "2020-05-31")).toBe(1);
    expect(compareFunctionForStringSorting("2020-06-01", "2020-06-02")).toBe(
      -1,
    );
    expect(
      compareFunctionForStringSorting("2020-06-01T:00:00", "2020-06-01"),
    ).toBe(1);
    expect(
      compareFunctionForStringSorting("2020-06-01", "2020-06-01T:00:00"),
    ).toBe(-1);
  });

  describe("computeAverageMoodInInterval", () => {
    describe("when the dateFrom is after the dateTo", () => {
      it("returns undefined", () => {
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
            ],
            new Date("2020-07-31T00:00:00.000Z"),
            new Date("2020-07-30T00:00:00.000Z"),
          ),
        ).toBeUndefined();
      });
    });

    describe("when there are 0 moods", () => {
      it("returns undefined", () => {
        expect(
          computeAverageMoodInInterval(
            [],
            new Date("2020-07-30T00:00:00.000Z"),
            new Date("2020-07-31T00:00:00.000Z"),
          ),
        ).toBeUndefined();
      });
    });

    describe("when there is 1 mood", () => {
      it("returns an average mood when the mood intersects with the interval", () => {
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
            ],
            new Date("2020-07-28T00:00:00.000Z"),
            new Date("2020-07-28T00:00:00.000Z"),
          ),
        ).toEqual(5);
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
            ],
            new Date("2020-07-27T00:00:00.000Z"),
            new Date("2020-07-28T00:00:00.000Z"),
          ),
        ).toEqual(5);
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
            ],
            new Date("2020-07-28T00:00:00.000Z"),
            new Date("2020-07-29T00:00:00.000Z"),
          ),
        ).toEqual(5);
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
            ],
            new Date("2020-07-27T00:00:00.000Z"),
            new Date("2020-07-29T00:00:00.000Z"),
          ),
        ).toEqual(5);
      });

      it("returns undefined when the mood does not intersect with the interval", () => {
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
            ],
            new Date("2020-07-25T00:00:00.000Z"),
            new Date("2020-07-25T00:00:00.000Z"),
          ),
        ).toBeUndefined();
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
            ],
            new Date("2020-07-24T00:00:00.000Z"),
            new Date("2020-07-25T00:00:00.000Z"),
          ),
        ).toBeUndefined();
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
            ],
            new Date("2020-07-30T00:00:00.000Z"),
            new Date("2020-07-30T00:00:00.000Z"),
          ),
        ).toBeUndefined();
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
            ],
            new Date("2020-07-30T00:00:00.000Z"),
            new Date("2020-07-31T00:00:00.000Z"),
          ),
        ).toBeUndefined();
      });
    });

    describe("when there are multiple moods", () => {
      it("works with 2 moods in the interval", () => {
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
              {
                createdAt: "2020-07-29T00:00:00.000Z",
                experiencedAt: "2020-07-29T00:00:00.000Z",
                mood: 7,
              },
            ],
            new Date("2020-07-28T00:00:00.000Z"),
            new Date("2020-07-29T00:00:00.000Z"),
          ),
        ).toEqual(6);
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
              {
                createdAt: "2020-07-29T00:00:00.000Z",
                experiencedAt: "2020-07-29T00:00:00.000Z",
                mood: 7,
              },
            ],
            new Date("2020-07-27T00:00:00.000Z"),
            new Date("2020-07-29T00:00:00.000Z"),
          ),
        ).toEqual(6);
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
              {
                createdAt: "2020-07-29T00:00:00.000Z",
                experiencedAt: "2020-07-29T00:00:00.000Z",
                mood: 7,
              },
            ],
            new Date("2020-07-28T00:00:00.000Z"),
            new Date("2020-07-30T00:00:00.000Z"),
          ),
        ).toEqual(6);
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
              {
                createdAt: "2020-07-29T00:00:00.000Z",
                experiencedAt: "2020-07-29T00:00:00.000Z",
                mood: 7,
              },
            ],
            new Date("2020-07-27T00:00:00.000Z"),
            new Date("2020-08-02T00:00:00.000Z"),
          ),
        ).toEqual(6);
      });

      it("uses `experiencedAt` instead of `createdAt`", () => {
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-01-01T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
              {
                createdAt: "2020-02-01T00:00:00.000Z",
                experiencedAt: "2020-07-29T00:00:00.000Z",
                mood: 7,
              },
            ],
            new Date("2020-07-27T00:00:00.000Z"),
            new Date("2020-07-29T00:00:00.000Z"),
          ),
        ).toEqual(6);
      });

      it("works with 2 moods and only one in the interval", () => {
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-24T00:00:00.000Z",
                experiencedAt: "2020-07-24T00:00:00.000Z",
                mood: 4,
              },
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
            ],
            new Date("2020-07-26T00:00:00.000Z"),
            new Date("2020-08-02T00:00:00.000Z"),
          ),
        ).toEqual(4.75);
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-24T00:00:00.000Z",
                experiencedAt: "2020-07-24T00:00:00.000Z",
                mood: 4,
              },
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
            ],
            new Date("2020-07-23T00:00:00.000Z"),
            new Date("2020-07-24T00:00:00.000Z"),
          ),
        ).toEqual(4);
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-24T00:00:00.000Z",
                experiencedAt: "2020-07-24T00:00:00.000Z",
                mood: 4,
              },
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
            ],
            new Date("2020-07-28T00:00:00.000Z"),
            new Date("2020-08-02T00:00:00.000Z"),
          ),
        ).toEqual(5);
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-24T00:00:00.000Z",
                experiencedAt: "2020-07-24T00:00:00.000Z",
                mood: 4,
              },
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
            ],
            new Date("2020-07-20T00:00:00.000Z"),
            new Date("2020-07-25T00:00:00.000Z"),
          ),
        ).toEqual(4.125);
      });

      it("works with 2 moods and both outside the interval", () => {
        expect(
          computeAverageMoodInInterval(
            [
              {
                createdAt: "2020-07-24T00:00:00.000Z",
                experiencedAt: "2020-07-24T00:00:00.000Z",
                mood: 4,
              },
              {
                createdAt: "2020-07-28T00:00:00.000Z",
                experiencedAt: "2020-07-28T00:00:00.000Z",
                mood: 5,
              },
            ],
            new Date("2020-07-25T00:00:00.000Z"),
            new Date("2020-07-27T00:00:00.000Z"),
          ),
        ).toEqual(4.5);
      });
    });
  });

  const sharedMeanTests = (
    computeMeanFn: (xs: number[]) => number | undefined,
  ) => {
    expect(computeMeanFn([5])).toBe(5);
    expect(computeMeanFn([1, 5])).toBe(3);
    expect(computeMeanFn([1, 2, 3, 4, 5, 6, 7])).toBe(4);
  };

  test("computeMean", () => {
    expect(() => computeMean([])).toThrow(
      Error("Need at least one number to compute mean"),
    );
    sharedMeanTests(computeMean);
  });

  test("computeMeanSafe", () => {
    expect(computeMeanSafe([])).toBeUndefined();
    sharedMeanTests(computeMeanSafe);
  });

  test("convertKelvinToCelsius", () => {
    expect(convertKelvinToCelcius(0)).toMatchInlineSnapshot(`-273.15`);
    expect(convertKelvinToCelcius(0.01)).toMatchInlineSnapshot(`-273.14`);
    expect(convertKelvinToCelcius(1)).toMatchInlineSnapshot(`-272.15`);
    expect(convertKelvinToCelcius(10)).toMatchInlineSnapshot(`-263.15`);
  });

  test("counter", () => {
    expect(counter([])).toEqual({});
    expect(counter(["foo"])).toEqual({ foo: 1 });
    expect(counter(["foo", "bar", "baz", "foo", "foo", "bar"])).toEqual({
      bar: 2,
      baz: 1,
      foo: 3,
    });
  });

  test("createChartExtent", () => {
    expect(() => createChartExtent([])).toThrow(
      Error("`createChartExtent` requires at least 2 values but received 0"),
    );
    expect(() => createChartExtent([0])).toThrow(
      "`createChartExtent` requires at least 2 values but received 1",
    );
    expect(createChartExtent([0, 0])).toEqual([-5, 5]);
    expect(createChartExtent([0.1, 0.1])).toEqual([-5, 5]);
    expect(createChartExtent([0.49, 0.49])).toEqual([-5, 5]);
    expect(createChartExtent([0.5, 0.5])).toEqual([-4, 6]);
    expect(createChartExtent([0, 0.1])).toEqual([-5, 5]);
    expect(createChartExtent([0.1, 9.9])).toEqual([0, 10]);
    expect(createChartExtent([0, 10])).toEqual([-5, 15]);
    expect(createChartExtent([0, 10.1])).toEqual([-5, 15]);
    expect(createChartExtent([8, 1, 2, 9.9, 4, 5, 6, 9, 0, 7, 3])).toEqual([
      -0, 10,
    ]);
    expect(createChartExtent([8, 1, 2, 10, 4, 5, 6, 9, 0, 7, 3])).toEqual([
      -5, 15,
    ]);
  });

  test("createDateFromLocalDateString", () => {
    expect(createDateFromLocalDateString("2021-01-01")).toEqual(
      new Date("2021-01-01T00:00:00.000Z"),
    );
  });

  describe("computeCompletePopulationStandardDeviation", () => {
    it("returns undefined when the array is empty", () => {
      expect(computeCompletePopulationStandardDeviation([])).toBeUndefined();
    });

    it("returns 0 when the array contains a single item", () => {
      expect(computeCompletePopulationStandardDeviation([5])).toBe(0);
    });

    it("returns 0 when all items in the array are the same", () => {
      expect(computeCompletePopulationStandardDeviation([5, 5, 5, 5, 5])).toBe(
        0,
      );
    });

    it("returns the correct standard deviation", () => {
      expect(
        computeCompletePopulationStandardDeviation([
          727.7, 1086.5, 1091, 1361.3, 1490.5, 1956.1,
        ]),
      ).toBeCloseTo(384.28);
    });
  });

  describe("computeCompletePopulationMssd", () => {
    it("returns undefined when the array is empty", () => {
      expect(computeCompletePopulationMssd([])).toBeUndefined();
    });

    it("returns undefined when the array contains a single item", () => {
      expect(computeCompletePopulationMssd([5])).toBeUndefined();
    });

    it("returns 0 when all items in the array are the same", () => {
      expect(computeCompletePopulationMssd([5, 5, 5, 5, 5])).toBe(0);
    });

    it("returns the correct mssd for two elements", () => {
      expect(computeCompletePopulationMssd([1, 3])).toBe(2);
    });

    it("returns the correct mssd for multiple elements with constant differences", () => {
      expect(computeCompletePopulationMssd([1, 2, 3, 4])).toBe(0.75);
    });

    it("returns the correct mssd for multiple elements with varying differences", () => {
      expect(computeCompletePopulationMssd([1, 2, 4, 7])).toBe(3.5);
    });
  });

  describe("defaultDict", () => {
    test("has no prototype keys", () => {
      const x = defaultDict(() => void 0);
      expect("toString" in x).toBe(false);
    });
    test("default to 0", () => {
      const numberDefaultDict = defaultDict(() => 0);
      expect({ ...numberDefaultDict }).toEqual({});
      numberDefaultDict["a"] += 1;
      expect({ ...numberDefaultDict }).toEqual({ a: 1 });
    });
    test("default to Number", () => {
      const numberDefaultDict = defaultDict(Number);
      expect({ ...numberDefaultDict }).toEqual({});
      numberDefaultDict["a"] += 1;
      expect({ ...numberDefaultDict }).toEqual({ a: 1 });
    });

    test("default to array", () => {
      const arrayDefaultDict = defaultDict((): number[] => []);
      expect({ ...arrayDefaultDict }).toEqual({});
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      arrayDefaultDict["a"];
      expect({ ...arrayDefaultDict }).toEqual({ a: [] });
      arrayDefaultDict["b"].push(1);
      expect({ ...arrayDefaultDict }).toEqual({ a: [], b: [1] });
    });
  });

  describe("getEnvelopingIds", () => {
    it("throws an error when the dateFrom is after the dateTo", () => {
      expect(() =>
        getEnvelopingIds(
          [],
          new Date("2020-09-01T00:00:00.000Z"),
          new Date("2020-09-01T00:00:00.000Z"),
        ),
      ).not.toThrow();
      expect(() =>
        getEnvelopingIds(
          [],
          new Date("2020-09-01T00:00:01.000Z"),
          new Date("2020-09-01T00:00:00.000Z"),
        ),
      ).toThrow(Error("`dateFrom` should not be after `dateTo`"));
    });

    it("returns the first ID when the range is before the mood ID range", () => {
      const allIds = [
        "2020-10-04T00:00:00.000Z",
        "2020-10-05T00:00:00.000Z",
        "2020-10-06T00:00:00.000Z",
      ];
      expect(
        getEnvelopingIds(
          allIds,
          new Date("2020-09-01T00:00:00.000Z"),
          new Date("2020-09-02T00:00:00.000Z"),
        ),
      ).toEqual(["2020-10-04T00:00:00.000Z"]);
    });

    it("returns the last ID when the range is after the mood ID range", () => {
      const allIds = [
        "2020-10-04T00:00:00.000Z",
        "2020-10-05T00:00:00.000Z",
        "2020-10-06T00:00:00.000Z",
      ];
      expect(
        getEnvelopingIds(
          allIds,
          new Date("2020-11-01T00:00:00.000Z"),
          new Date("2020-11-02T00:00:00.000Z"),
        ),
      ).toEqual(["2020-10-06T00:00:00.000Z"]);
    });

    it("returns all IDs when the date range encompasses all IDs", () => {
      const allIds = [
        "2020-10-04T00:00:00.000Z",
        "2020-10-05T00:00:00.000Z",
        "2020-10-06T00:00:00.000Z",
      ];
      expect(
        getEnvelopingIds(
          allIds,
          new Date("2020-10-01T00:00:00.000Z"),
          new Date("2020-10-31T00:00:00.000Z"),
        ),
      ).toEqual(allIds);
    });

    it("returns all IDs when the date range is equal to the mood IDs range", () => {
      const allIds = [
        "2020-10-04T00:00:00.000Z",
        "2020-10-05T00:00:00.000Z",
        "2020-10-06T00:00:00.000Z",
      ];
      expect(
        getEnvelopingIds(
          allIds,
          new Date("2020-10-04T00:00:00.000Z"),
          new Date("2020-10-06T00:00:00.000Z"),
        ),
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
        getEnvelopingIds(
          allIds,
          new Date("2020-10-04T00:00:02.000Z"),
          new Date("2020-10-06T00:00:00.000Z"),
        ),
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
        getEnvelopingIds(
          allIds,
          new Date("2020-10-04T00:00:00.000Z"),
          new Date("2020-10-06T00:00:00.000Z"),
        ),
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
        getEnvelopingIds(
          allIds,
          new Date("2020-10-04T00:00:02.000Z"),
          new Date("2020-10-06T00:00:00.000Z"),
        ),
      ).toEqual([
        "2020-10-04T00:00:01.000Z",
        "2020-10-04T00:00:02.000Z",
        "2020-10-05T00:00:00.000Z",
        "2020-10-06T00:00:00.000Z",
        "2020-10-06T00:00:01.000Z",
      ]);
    });
  });

  describe("getEnvelopingEvents", () => {
    it("throws an error when the dateFrom is after the dateTo", () => {
      expect(() =>
        getEnvelopingEvents(
          [],
          new Date("2020-09-01T00:00:00.000Z"),
          new Date("2020-09-01T00:00:00.000Z"),
        ),
      ).not.toThrow();
      expect(() =>
        getEnvelopingEvents(
          [],
          new Date("2020-09-01T00:00:01.000Z"),
          new Date("2020-09-01T00:00:00.000Z"),
        ),
      ).toThrow(Error("`dateFrom` should not be after `dateTo`"));
    });

    it("returns the first event when the range is before the event range", () => {
      const events = [
        { experiencedAt: "2020-10-04T00:00:00.000Z" },
        { experiencedAt: "2020-10-05T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:00.000Z" },
      ];
      expect(
        getEnvelopingEvents(
          events,
          new Date("2020-09-01T00:00:00.000Z"),
          new Date("2020-09-02T00:00:00.000Z"),
        ),
      ).toEqual([{ experiencedAt: "2020-10-04T00:00:00.000Z" }]);
    });

    it("returns the last event when the range is after the event range", () => {
      const events = [
        { experiencedAt: "2020-10-04T00:00:00.000Z" },
        { experiencedAt: "2020-10-05T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:00.000Z" },
      ];
      expect(
        getEnvelopingEvents(
          events,
          new Date("2020-11-01T00:00:00.000Z"),
          new Date("2020-11-02T00:00:00.000Z"),
        ),
      ).toEqual([{ experiencedAt: "2020-10-06T00:00:00.000Z" }]);
    });

    it("returns all events when the date range encompasses all events", () => {
      const events = [
        { experiencedAt: "2020-10-04T00:00:00.000Z" },
        { experiencedAt: "2020-10-05T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:00.000Z" },
      ];
      expect(
        getEnvelopingEvents(
          events,
          new Date("2020-10-01T00:00:00.000Z"),
          new Date("2020-10-31T00:00:00.000Z"),
        ),
      ).toEqual(events);
    });

    it("returns all events when the date range is equal to the event range", () => {
      const events = [
        { experiencedAt: "2020-10-04T00:00:00.000Z" },
        { experiencedAt: "2020-10-05T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:00.000Z" },
      ];
      expect(
        getEnvelopingEvents(
          events,
          new Date("2020-10-04T00:00:00.000Z"),
          new Date("2020-10-06T00:00:00.000Z"),
        ),
      ).toEqual(events);
    });

    it("returns first event before range", () => {
      const events = [
        { experiencedAt: "2020-10-04T00:00:00.000Z" },
        { experiencedAt: "2020-10-04T00:00:01.000Z" },
        { experiencedAt: "2020-10-04T00:00:02.000Z" },
        { experiencedAt: "2020-10-05T00:00:00.000Z" },
      ];
      expect(
        getEnvelopingEvents(
          events,
          new Date("2020-10-04T00:00:02.000Z"),
          new Date("2020-10-06T00:00:00.000Z"),
        ),
      ).toEqual([
        { experiencedAt: "2020-10-04T00:00:01.000Z" },
        { experiencedAt: "2020-10-04T00:00:02.000Z" },
        { experiencedAt: "2020-10-05T00:00:00.000Z" },
      ]);
    });

    it("returns first event after range", () => {
      const events = [
        { experiencedAt: "2020-10-04T00:00:00.000Z" },
        { experiencedAt: "2020-10-05T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:01.000Z" },
        { experiencedAt: "2020-10-06T00:00:02.000Z" },
      ];
      expect(
        getEnvelopingEvents(
          events,
          new Date("2020-10-04T00:00:00.000Z"),
          new Date("2020-10-06T00:00:00.000Z"),
        ),
      ).toEqual([
        { experiencedAt: "2020-10-04T00:00:00.000Z" },
        { experiencedAt: "2020-10-05T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:01.000Z" },
      ]);
    });

    it("returns first event before range and first event after range", () => {
      const events = [
        { experiencedAt: "2020-10-04T00:00:00.000Z" },
        { experiencedAt: "2020-10-04T00:00:01.000Z" },
        { experiencedAt: "2020-10-04T00:00:02.000Z" },
        { experiencedAt: "2020-10-05T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:01.000Z" },
        { experiencedAt: "2020-10-06T00:00:02.000Z" },
      ];
      expect(
        getEnvelopingEvents(
          events,
          new Date("2020-10-04T00:00:02.000Z"),
          new Date("2020-10-06T00:00:00.000Z"),
        ),
      ).toEqual([
        { experiencedAt: "2020-10-04T00:00:01.000Z" },
        { experiencedAt: "2020-10-04T00:00:02.000Z" },
        { experiencedAt: "2020-10-05T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:01.000Z" },
      ]);
    });

    it("works with events that have additional properties", () => {
      const events = [
        {
          experiencedAt: "2020-10-04T00:00:00.000Z",
          mood: 5,
          createdAt: "2020-10-04T00:01:00.000Z",
        },
        {
          experiencedAt: "2020-10-05T00:00:00.000Z",
          mood: 7,
          createdAt: "2020-10-05T00:01:00.000Z",
        },
        {
          experiencedAt: "2020-10-06T00:00:00.000Z",
          mood: 3,
          createdAt: "2020-10-06T00:01:00.000Z",
        },
      ];
      expect(
        getEnvelopingEvents(
          events,
          new Date("2020-10-05T00:00:00.000Z"),
          new Date("2020-10-05T00:00:00.000Z"),
        ),
      ).toEqual([
        {
          experiencedAt: "2020-10-04T00:00:00.000Z",
          mood: 5,
          createdAt: "2020-10-04T00:01:00.000Z",
        },
        {
          experiencedAt: "2020-10-05T00:00:00.000Z",
          mood: 7,
          createdAt: "2020-10-05T00:01:00.000Z",
        },
        {
          experiencedAt: "2020-10-06T00:00:00.000Z",
          mood: 3,
          createdAt: "2020-10-06T00:01:00.000Z",
        },
      ]);
    });

    it("returns empty array when no events are provided", () => {
      expect(
        getEnvelopingEvents(
          [],
          new Date("2020-10-04T00:00:00.000Z"),
          new Date("2020-10-05T00:00:00.000Z"),
        ),
      ).toEqual([]);
    });

    describe("handling duplicate experiencedAt values", () => {
      const events = [
        { experiencedAt: "2020-10-04T00:00:00.000Z", id: 1 },
        { experiencedAt: "2020-10-05T00:00:00.000Z", id: 2 },
        { experiencedAt: "2020-10-05T00:00:00.000Z", id: 3 },
        { experiencedAt: "2020-10-05T00:00:00.000Z", id: 4 },
        { experiencedAt: "2020-10-06T00:00:00.000Z", id: 5 },
        { experiencedAt: "2020-10-07T00:00:00.000Z", id: 6 },
      ];

      test("range that includes duplicates", () => {
        expect(
          getEnvelopingEvents(
            events,
            new Date("2020-10-05T00:00:00.000Z"),
            new Date("2020-10-05T00:00:00.000Z"),
          ),
        ).toEqual([
          { experiencedAt: "2020-10-04T00:00:00.000Z", id: 1 },
          { experiencedAt: "2020-10-05T00:00:00.000Z", id: 2 },
          { experiencedAt: "2020-10-05T00:00:00.000Z", id: 3 },
          { experiencedAt: "2020-10-05T00:00:00.000Z", id: 4 },
          { experiencedAt: "2020-10-06T00:00:00.000Z", id: 5 },
        ]);
      });

      test("range that spans across duplicates", () => {
        expect(
          getEnvelopingEvents(
            events,
            new Date("2020-10-04T12:00:00.000Z"),
            new Date("2020-10-05T12:00:00.000Z"),
          ),
        ).toEqual([
          { experiencedAt: "2020-10-04T00:00:00.000Z", id: 1 },
          { experiencedAt: "2020-10-05T00:00:00.000Z", id: 2 },
          { experiencedAt: "2020-10-05T00:00:00.000Z", id: 3 },
          { experiencedAt: "2020-10-05T00:00:00.000Z", id: 4 },
          { experiencedAt: "2020-10-06T00:00:00.000Z", id: 5 },
        ]);
      });

      test("range that starts and ends on duplicate values", () => {
        expect(
          getEnvelopingEvents(
            events,
            new Date("2020-10-05T00:00:00.000Z"),
            new Date("2020-10-05T00:00:00.000Z"),
          ),
        ).toEqual([
          { experiencedAt: "2020-10-04T00:00:00.000Z", id: 1 },
          { experiencedAt: "2020-10-05T00:00:00.000Z", id: 2 },
          { experiencedAt: "2020-10-05T00:00:00.000Z", id: 3 },
          { experiencedAt: "2020-10-05T00:00:00.000Z", id: 4 },
          { experiencedAt: "2020-10-06T00:00:00.000Z", id: 5 },
        ]);
      });
    });
  });

  describe("getIdsInInterval", () => {
    it("throws an error when the dateFrom is after the dateTo", () => {
      expect(() =>
        getIdsInInterval(
          [],
          new Date("2020-09-01T00:00:00.000Z"),
          new Date("2020-09-01T00:00:00.000Z"),
        ),
      ).not.toThrow();
      expect(() =>
        getIdsInInterval(
          [],
          new Date("2020-09-01T00:00:01.000Z"),
          new Date("2020-09-01T00:00:00.000Z"),
        ),
      ).toThrow(Error("`dateFrom` should not be after `dateTo`"));
    });

    it("returns an empty array when there are no mood IDs provided", () => {
      expect(
        getIdsInInterval(
          [],
          new Date("2020-09-02T00:00:00.000Z"),
          new Date("2020-09-03T00:00:00.000Z"),
        ),
      ).toEqual([]);
    });

    it("returns an empty array when there are no moods within the interval", () => {
      expect(
        getIdsInInterval(
          ["2020-09-01T23:59:59.000Z", "2020-09-03T00:00:01.000Z"],
          new Date("2020-09-02T00:00:00.000Z"),
          new Date("2020-09-03T00:00:00.000Z"),
        ),
      ).toEqual([]);
    });

    it("returns all moods when all moods are within the interval", () => {
      expect(
        getIdsInInterval(
          ["2020-09-02T00:00:00.000Z", "2020-09-03T00:00:00.000Z"],
          new Date("2020-09-02T00:00:00.000Z"),
          new Date("2020-09-03T00:00:00.000Z"),
        ),
      ).toEqual(["2020-09-02T00:00:00.000Z", "2020-09-03T00:00:00.000Z"]);
    });

    it("only returns moods that are within the interval", () => {
      expect(
        getIdsInInterval(
          [
            "2020-09-01T23:59:59.000Z",
            "2020-09-02T00:00:00.000Z",
            "2020-09-03T00:00:00.000Z",
            "2020-09-03T00:00:01.000Z",
          ],
          new Date("2020-09-02T00:00:00.000Z"),
          new Date("2020-09-03T00:00:00.000Z"),
        ),
      ).toEqual(["2020-09-02T00:00:00.000Z", "2020-09-03T00:00:00.000Z"]);
    });
  });

  describe("getEventsInInterval", () => {
    it("throws an error when the dateFrom is after the dateTo", () => {
      expect(() =>
        getEventsInInterval(
          [],
          new Date("2020-09-01T00:00:00.000Z"),
          new Date("2020-09-01T00:00:00.000Z"),
        ),
      ).not.toThrow();
      expect(() =>
        getEventsInInterval(
          [],
          new Date("2020-09-01T00:00:01.000Z"),
          new Date("2020-09-01T00:00:00.000Z"),
        ),
      ).toThrow(Error("`dateFrom` should not be after `dateTo`"));
    });

    it("returns an empty array when there are no events provided", () => {
      expect(
        getEventsInInterval(
          [],
          new Date("2020-10-04T00:00:00.000Z"),
          new Date("2020-10-05T00:00:00.000Z"),
        ),
      ).toEqual([]);
    });

    it("returns an empty array when there are no events within the interval", () => {
      const events = [
        { experiencedAt: "2020-10-01T00:00:00.000Z" },
        { experiencedAt: "2020-10-02T00:00:00.000Z" },
        { experiencedAt: "2020-10-08T00:00:00.000Z" },
        { experiencedAt: "2020-10-09T00:00:00.000Z" },
      ];
      expect(
        getEventsInInterval(
          events,
          new Date("2020-10-04T00:00:00.000Z"),
          new Date("2020-10-06T00:00:00.000Z"),
        ),
      ).toEqual([]);
    });

    it("returns all events when all events are within the interval", () => {
      const events = [
        { experiencedAt: "2020-10-04T00:00:00.000Z" },
        { experiencedAt: "2020-10-05T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:00.000Z" },
      ];
      expect(
        getEventsInInterval(
          events,
          new Date("2020-10-01T00:00:00.000Z"),
          new Date("2020-10-31T00:00:00.000Z"),
        ),
      ).toEqual(events);
    });

    it("returns all events when the date range is equal to the event range", () => {
      const events = [
        { experiencedAt: "2020-10-04T00:00:00.000Z" },
        { experiencedAt: "2020-10-05T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:00.000Z" },
      ];
      expect(
        getEventsInInterval(
          events,
          new Date("2020-10-04T00:00:00.000Z"),
          new Date("2020-10-06T00:00:00.000Z"),
        ),
      ).toEqual(events);
    });

    it("only returns events that are within the interval", () => {
      const events = [
        { experiencedAt: "2020-10-01T00:00:00.000Z" },
        { experiencedAt: "2020-10-04T00:00:00.000Z" },
        { experiencedAt: "2020-10-05T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:00.000Z" },
        { experiencedAt: "2020-10-09T00:00:00.000Z" },
      ];
      expect(
        getEventsInInterval(
          events,
          new Date("2020-10-04T00:00:00.000Z"),
          new Date("2020-10-06T00:00:00.000Z"),
        ),
      ).toEqual([
        { experiencedAt: "2020-10-04T00:00:00.000Z" },
        { experiencedAt: "2020-10-05T00:00:00.000Z" },
        { experiencedAt: "2020-10-06T00:00:00.000Z" },
      ]);
    });

    it("handles events with exact boundary dates", () => {
      const events = [
        { experiencedAt: "2020-10-04T00:00:00.000Z" },
        { experiencedAt: "2020-10-04T00:00:01.000Z" },
        { experiencedAt: "2020-10-05T23:59:59.999Z" },
        { experiencedAt: "2020-10-06T00:00:00.000Z" },
        { experiencedAt: "2020-10-07T00:00:00.000Z" },
      ];
      expect(
        getEventsInInterval(
          events,
          new Date("2020-10-04T00:00:01.000Z"),
          new Date("2020-10-06T00:00:00.000Z"),
        ),
      ).toEqual([
        { experiencedAt: "2020-10-04T00:00:01.000Z" },
        { experiencedAt: "2020-10-05T23:59:59.999Z" },
        { experiencedAt: "2020-10-06T00:00:00.000Z" },
      ]);
    });

    it("works with events that have additional properties", () => {
      const events = [
        {
          experiencedAt: "2020-10-04T00:00:00.000Z",
          mood: 5,
          createdAt: "2020-10-04T00:01:00.000Z",
        },
        {
          experiencedAt: "2020-10-05T00:00:00.000Z",
          mood: 7,
          createdAt: "2020-10-05T00:01:00.000Z",
        },
        {
          experiencedAt: "2020-10-06T00:00:00.000Z",
          mood: 3,
          createdAt: "2020-10-06T00:01:00.000Z",
        },
        {
          experiencedAt: "2020-10-07T00:00:00.000Z",
          mood: 8,
          createdAt: "2020-10-07T00:01:00.000Z",
        },
      ];
      expect(
        getEventsInInterval(
          events,
          new Date("2020-10-05T00:00:00.000Z"),
          new Date("2020-10-06T00:00:00.000Z"),
        ),
      ).toEqual([
        {
          experiencedAt: "2020-10-05T00:00:00.000Z",
          mood: 7,
          createdAt: "2020-10-05T00:01:00.000Z",
        },
        {
          experiencedAt: "2020-10-06T00:00:00.000Z",
          mood: 3,
          createdAt: "2020-10-06T00:01:00.000Z",
        },
      ]);
    });

    it("returns single event when interval contains only one event", () => {
      const events = [
        { experiencedAt: "2020-10-01T00:00:00.000Z" },
        { experiencedAt: "2020-10-05T00:00:00.000Z" },
        { experiencedAt: "2020-10-09T00:00:00.000Z" },
      ];
      expect(
        getEventsInInterval(
          events,
          new Date("2020-10-05T00:00:00.000Z"),
          new Date("2020-10-05T00:00:00.000Z"),
        ),
      ).toEqual([{ experiencedAt: "2020-10-05T00:00:00.000Z" }]);
    });

    it("handles duplicate experiencedAt values", () => {
      const events = [
        { experiencedAt: "2020-10-04T00:00:00.000Z", id: 1 },
        { experiencedAt: "2020-10-05T00:00:00.000Z", id: 2 },
        { experiencedAt: "2020-10-05T00:00:00.000Z", id: 3 },
        { experiencedAt: "2020-10-06T00:00:00.000Z", id: 4 },
      ];
      expect(
        getEventsInInterval(
          events,
          new Date("2020-10-05T00:00:00.000Z"),
          new Date("2020-10-05T00:00:00.000Z"),
        ),
      ).toEqual([
        { experiencedAt: "2020-10-05T00:00:00.000Z", id: 2 },
        { experiencedAt: "2020-10-05T00:00:00.000Z", id: 3 },
      ]);
    });
  });

  describe("hasIdsInInterval", () => {
    it("throws an error when the dateFrom is after the dateTo", () => {
      expect(() =>
        hasIdsInInterval(
          [],
          new Date("2020-09-01T00:00:00.000Z"),
          new Date("2020-09-01T00:00:00.000Z"),
        ),
      ).not.toThrow();
      expect(() =>
        hasIdsInInterval(
          [],
          new Date("2020-09-01T00:00:01.000Z"),
          new Date("2020-09-01T00:00:00.000Z"),
        ),
      ).toThrow(Error("`dateFrom` should not be after `dateTo`"));
    });

    it("returns false when there are no mood IDs provided", () => {
      expect(
        hasIdsInInterval(
          [],
          new Date("2020-09-02T00:00:00.000Z"),
          new Date("2020-09-03T00:00:00.000Z"),
        ),
      ).toBe(false);
    });

    it("returns false when there are no moods within the interval", () => {
      expect(
        hasIdsInInterval(
          ["2020-09-01T23:59:59.000Z", "2020-09-03T00:00:01.000Z"],
          new Date("2020-09-02T00:00:00.000Z"),
          new Date("2020-09-03T00:00:00.000Z"),
        ),
      ).toBe(false);
    });

    it("returns true when all moods are within the interval", () => {
      expect(
        hasIdsInInterval(
          ["2020-09-02T00:00:00.000Z", "2020-09-03T00:00:00.000Z"],
          new Date("2020-09-02T00:00:00.000Z"),
          new Date("2020-09-03T00:00:00.000Z"),
        ),
      ).toBe(true);
    });

    it("returns true when some moods are within the interval", () => {
      expect(
        hasIdsInInterval(
          [
            "2020-09-01T23:59:59.000Z",
            "2020-09-02T00:00:00.000Z",
            "2020-09-03T00:00:00.000Z",
            "2020-09-03T00:00:01.000Z",
          ],
          new Date("2020-09-02T00:00:00.000Z"),
          new Date("2020-09-03T00:00:00.000Z"),
        ),
      ).toBe(true);
    });
  });

  describe("hasEventsInInterval", () => {
    it("throws an error when the dateFrom is after the dateTo", () => {
      expect(() =>
        hasEventsInInterval(
          [],
          new Date("2020-09-01T00:00:00.000Z"),
          new Date("2020-09-01T00:00:00.000Z"),
        ),
      ).not.toThrow();
      expect(() =>
        hasEventsInInterval(
          [],
          new Date("2020-09-01T00:00:01.000Z"),
          new Date("2020-09-01T00:00:00.000Z"),
        ),
      ).toThrow(Error("`dateFrom` should not be after `dateTo`"));
    });

    it("returns false when there are no events provided", () => {
      expect(
        hasEventsInInterval(
          [],
          new Date("2020-09-02T00:00:00.000Z"),
          new Date("2020-09-03T00:00:00.000Z"),
        ),
      ).toBe(false);
    });

    it("returns false when there are no events within the interval", () => {
      expect(
        hasEventsInInterval(
          [
            { experiencedAt: "2020-09-01T23:59:59.000Z" },
            { experiencedAt: "2020-09-03T00:00:01.000Z" },
          ],
          new Date("2020-09-02T00:00:00.000Z"),
          new Date("2020-09-03T00:00:00.000Z"),
        ),
      ).toBe(false);
    });

    it("returns true when all events are within the interval", () => {
      expect(
        hasEventsInInterval(
          [
            { experiencedAt: "2020-09-02T00:00:00.000Z" },
            { experiencedAt: "2020-09-03T00:00:00.000Z" },
          ],
          new Date("2020-09-02T00:00:00.000Z"),
          new Date("2020-09-03T00:00:00.000Z"),
        ),
      ).toBe(true);
    });

    it("returns true when some events are within the interval", () => {
      expect(
        hasEventsInInterval(
          [
            { experiencedAt: "2020-09-01T23:59:59.000Z" },
            { experiencedAt: "2020-09-02T00:00:00.000Z" },
            { experiencedAt: "2020-09-03T00:00:00.000Z" },
            { experiencedAt: "2020-09-03T00:00:01.000Z" },
          ],
          new Date("2020-09-02T00:00:00.000Z"),
          new Date("2020-09-03T00:00:00.000Z"),
        ),
      ).toBe(true);
    });

    it("returns true when events are at the exact boundary", () => {
      expect(
        hasEventsInInterval(
          [{ experiencedAt: "2020-09-02T00:00:00.000Z" }],
          new Date("2020-09-02T00:00:00.000Z"),
          new Date("2020-09-02T00:00:00.000Z"),
        ),
      ).toBe(true);
    });

    it("handles events with additional properties", () => {
      expect(
        hasEventsInInterval(
          [
            {
              experiencedAt: "2020-09-02T12:00:00.000Z",
              mood: 5,
              note: "Good day",
            },
            { experiencedAt: "2020-09-02T18:00:00.000Z", value: 100 },
          ],
          new Date("2020-09-02T00:00:00.000Z"),
          new Date("2020-09-03T00:00:00.000Z"),
        ),
      ).toBe(true);
    });
  });

  test.each(
    [
      200, 232, 300, 321, 500, 531, 600, 622, 701, 762, 771, 781, 800, 801, 802,
      803, 804,
    ].flatMap((weatherId) =>
      [true, false].map((isDaytime) => ({ isDaytime, weatherId })),
    ),
  )("getWeatherDisplayData(%p)", (x) => {
    expect(getWeatherDisplayData(x)).toMatchSnapshot();
  });

  test("getNormalizedDescriptionWordsFromMood", () => {
    expect(getNormalizedWordCloudWords("")).toEqual([]);
    expect(getNormalizedWordCloudWords("   ")).toEqual([]);
    expect(getNormalizedWordCloudWords("pikachu")).toEqual(["Pikachu"]);
    expect(getNormalizedWordCloudWords("   pikachu   ")).toEqual(["Pikachu"]);
    expect(getNormalizedWordCloudWords("  Bulbasaur pIkaChu  🙂   ")).toEqual([
      "Bulbasaur",
      "Pikachu",
      "🙂",
    ]);
    expect(getNormalizedWordCloudWords("   pi.k,a;c:hu!   ")).toEqual([
      "Pikachu",
    ]);
    expect(getNormalizedWordCloudWords("   pika-chu   ")).toEqual(["Pika-chu"]);
  });

  test("formatIsoDateHourMinuteInLocalTimezone", () => {
    expect(
      formatIsoDateHourMinuteInLocalTimezone(
        new Date("2020-09-01T01:00:00.000Z"),
      ),
    ).toBe("2020-09-01T01:00");
    expect(
      formatIsoDateHourMinuteInLocalTimezone(new Date("2020-09-30T23:59:59")),
    ).toBe("2020-09-30T23:59");
    expect(
      formatIsoDateHourMinuteInLocalTimezone(
        new Date("2020-10-01T00:01:01.000Z"),
      ),
    ).toBe("2020-10-01T00:01");
  });

  test("formatIsoDateInLocalTimezone", () => {
    expect(
      formatIsoDateInLocalTimezone(new Date("2020-09-01T00:00:00.000Z")),
    ).toBe("2020-09-01");
    expect(formatIsoDateInLocalTimezone(new Date("2020-09-30T23:59:59"))).toBe(
      "2020-09-30",
    );
    expect(
      formatIsoDateInLocalTimezone(new Date("2020-10-01T00:00:01.000Z")),
    ).toBe("2020-10-01");
  });

  test("formatIsoDateHourInLocalTimezone", () => {
    expect(
      formatIsoDateHourInLocalTimezone(new Date("2021-02-14T00:01:01")),
    ).toBe("2021-02-14T00:00:00.000Z");
    expect(
      formatIsoDateHourInLocalTimezone(new Date("2021-02-14T00:00:00.000Z")),
    ).toBe("2021-02-14T00:00:00.000Z");
    expect(
      formatIsoDateHourInLocalTimezone(new Date("2021-02-13T23:59:59")),
    ).toBe("2021-02-13T23:00:00.000Z");
  });

  test("formatIsoMonthInLocalTimezone", () => {
    expect(
      formatIsoMonthInLocalTimezone(new Date("2020-09-01T00:00:00.000Z")),
    ).toBe("2020-09");
    expect(formatIsoMonthInLocalTimezone(new Date("2020-09-30T23:59:59"))).toBe(
      "2020-09",
    );
    expect(
      formatIsoMonthInLocalTimezone(new Date("2020-10-01T00:00:00.000Z")),
    ).toBe("2020-10");
  });

  test("formatIsoYearInLocalTimezone", () => {
    expect(
      formatIsoYearInLocalTimezone(new Date("2020-01-01T00:00:00.000Z")),
    ).toBe("2020");
    expect(formatIsoYearInLocalTimezone(new Date("2020-12-31T23:59:59"))).toBe(
      "2020",
    );
    expect(
      formatIsoYearInLocalTimezone(new Date("2021-01-01T00:00:00.000Z")),
    ).toBe("2021");
  });

  test("getWeekdayIndex", () => {
    expect(getWeekdayIndex(new Date("2020-09-01T00:00:00.000Z"))).toBe(1);
    expect(getWeekdayIndex(new Date("2020-09-02T00:00:00.000Z"))).toBe(2);
    expect(getWeekdayIndex(new Date("2020-09-03T00:00:00.000Z"))).toBe(3);
    expect(getWeekdayIndex(new Date("2020-09-04T00:00:00.000Z"))).toBe(4);
    expect(getWeekdayIndex(new Date("2020-09-05T00:00:00.000Z"))).toBe(5);
    expect(getWeekdayIndex(new Date("2020-09-06T00:00:00.000Z"))).toBe(6);
    expect(getWeekdayIndex(new Date("2020-09-07T00:00:00.000Z"))).toBe(0);
    expect(getWeekdayIndex(new Date("2020-09-08T00:00:00.000Z"))).toBe(1);
  });

  test("mapRight", () => {
    expect(mapRight([], (x) => x + 1)).toEqual([]);
    expect(mapRight([1], (x) => x + 1)).toEqual([2]);
    expect(mapRight([1, 2, 3], (x) => x + 1)).toEqual([4, 3, 2]);
  });

  test("moodToColor", () => {
    expect(moodToColor(MOOD_RANGE[0])).toMatchInlineSnapshot(
      `"rgb(23, 71, 240)"`,
    );
    expect(
      moodToColor(MOOD_RANGE[0] + (MOOD_RANGE[1] + MOOD_RANGE[0]) / 2),
    ).toMatchInlineSnapshot(`"rgb(0, 224, 224)"`);
    expect(moodToColor(MOOD_RANGE[1])).toMatchInlineSnapshot(
      `"rgb(16, 255, 0)"`,
    );
    expect(
      moodToColor(MOOD_RANGE[0] + MOOD_EXTENT / Math.PI),
    ).toMatchInlineSnapshot(`"rgb(0, 181, 250)"`);
  });

  test("roundDateDown", () => {
    expect(roundDateDown(new Date("2020-09-09T00:00:00.000"))).toEqual(
      new Date("2020-09-09T00:00:00.000"),
    );
    expect(roundDateDown(new Date("2020-09-09T00:00:00.001"))).toEqual(
      new Date("2020-09-09T00:00:00.000"),
    );
    expect(roundDateDown(new Date("2020-09-09T23:59:59.999"))).toEqual(
      new Date("2020-09-09T00:00:00.000"),
    );
  });

  test("roundDateUp", () => {
    expect(roundDateUp(new Date("2020-09-08T00:00:00.000"))).toEqual(
      new Date("2020-09-08T00:00:00.000"),
    );
    expect(roundDateUp(new Date("2020-09-08T00:00:00.001"))).toEqual(
      new Date("2020-09-09T00:00:00.000"),
    );
    expect(roundDateUp(new Date("2020-09-07T23:59:59.999"))).toEqual(
      new Date("2020-09-08T00:00:00.000"),
    );
  });

  test("roundDownToNearest10", () => {
    expect(roundDownToNearest10(0)).toBe(0);
    expect(roundDownToNearest10(0.1)).toBe(0);
    expect(roundDownToNearest10(9.9)).toBe(0);
    expect(roundDownToNearest10(10)).toBe(10);
    expect(roundDownToNearest10(10.1)).toBe(10);
    expect(roundDownToNearest10(-0.1)).toBe(-10);
    expect(roundDownToNearest10(-9.9)).toBe(-10);
    expect(roundDownToNearest10(-10)).toBe(-10);
    expect(roundDownToNearest10(-10.1)).toBe(-20);
  });

  test("roundUpToNearest10", () => {
    expect(roundUpToNearest10(0)).toBe(0);
    expect(roundUpToNearest10(0.1)).toBe(10);
    expect(roundUpToNearest10(9.9)).toBe(10);
    expect(roundUpToNearest10(10)).toBe(10);
    expect(roundUpToNearest10(10.1)).toBe(20);
    expect(roundUpToNearest10(-0.1)).toBe(-0);
    expect(roundUpToNearest10(-9.9)).toBe(-0);
    expect(roundUpToNearest10(-10)).toBe(-10);
  });

  test("trapeziumArea", () => {
    expect(trapeziumArea(1, 2, 3)).toBe(4.5);
    expect(trapeziumArea(2, 4, 5)).toBe(15);
    expect(trapeziumArea(3, 3, 3)).toBe(9);
  });
});
