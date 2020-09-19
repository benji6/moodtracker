import {
  moodToColor,
  trapeziumArea,
  mapRight,
  computeAverageMoodInInterval,
  roundDateDown,
  roundDateUp,
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
