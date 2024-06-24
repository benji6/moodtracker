import {
  formatMinutesAsTime,
  formatMinutesToDurationStringLong,
  formatMinutesToDurationStringShort,
  formatSecondsAsTime,
  formatSecondsToDurationStringLong,
  formatSecondsToDurationStringShort,
  formatSecondsToOneNumberWithUnits,
} from "./formatDuration";

// HACK: conditionals on `process.env.CI`: really should
// set locale explicitly, but could not figure that out easily
// and lost patience

describe("formatDuration", () => {
  test("formatMinutesToDurationStringShort", () => {
    expect(formatMinutesToDurationStringShort(0)).toBe(
      process.env.CI ? "0 min" : "0 mins",
    );
    expect(formatMinutesToDurationStringShort(0.49)).toBe(
      process.env.CI ? "0 min" : "0 mins",
    );
    expect(formatMinutesToDurationStringShort(0.5)).toBe("1 min");
    expect(formatMinutesToDurationStringShort(1)).toBe("1 min");
    expect(formatMinutesToDurationStringShort(2)).toBe(
      process.env.CI ? "2 min" : "2 mins",
    );
    expect(formatMinutesToDurationStringShort(59)).toBe(
      process.env.CI ? "59 min" : "59 mins",
    );
    expect(formatMinutesToDurationStringShort(60)).toBe("1 hr");
    expect(formatMinutesToDurationStringShort(61)).toBe("1 hr & 1 min");
    expect(formatMinutesToDurationStringShort(62)).toBe(
      process.env.CI ? "1 hr & 2 min" : "1 hr & 2 mins",
    );
    expect(formatMinutesToDurationStringShort(119)).toBe(
      process.env.CI ? "1 hr & 59 min" : "1 hr & 59 mins",
    );
    expect(formatMinutesToDurationStringShort(120)).toBe(
      process.env.CI ? "2 hr" : "2 hrs",
    );
    expect(formatMinutesToDurationStringShort(121)).toBe(
      process.env.CI ? "2 hr & 1 min" : "2 hrs & 1 min",
    );
    expect(formatMinutesToDurationStringShort(122)).toBe(
      process.env.CI ? "2 hr & 2 min" : "2 hrs & 2 mins",
    );
    expect(formatMinutesToDurationStringShort(432)).toBe(
      process.env.CI ? "7 hr & 12 min" : "7 hrs & 12 mins",
    );
    expect(formatMinutesToDurationStringShort(432.123)).toBe(
      process.env.CI ? "7 hr & 12 min" : "7 hrs & 12 mins",
    );
    expect(formatMinutesToDurationStringShort(1439)).toBe(
      process.env.CI ? "23 hr & 59 min" : "23 hrs & 59 mins",
    );
  });

  test("formatMinutesToDurationStringLong", () => {
    expect(formatMinutesToDurationStringLong(0)).toBe("0 minutes");
    expect(formatMinutesToDurationStringLong(0.49)).toBe("0 minutes");
    expect(formatMinutesToDurationStringLong(0.5)).toBe("1 minute");
    expect(formatMinutesToDurationStringLong(1)).toBe("1 minute");
    expect(formatMinutesToDurationStringLong(2)).toBe("2 minutes");
    expect(formatMinutesToDurationStringLong(59)).toBe("59 minutes");
    expect(formatMinutesToDurationStringLong(60)).toBe("1 hour");
    expect(formatMinutesToDurationStringLong(61)).toBe("1 hour & 1 minute");
    expect(formatMinutesToDurationStringLong(62)).toBe("1 hour & 2 minutes");
    expect(formatMinutesToDurationStringLong(119)).toBe("1 hour & 59 minutes");
    expect(formatMinutesToDurationStringLong(120)).toBe("2 hours");
    expect(formatMinutesToDurationStringLong(121)).toBe("2 hours & 1 minute");
    expect(formatMinutesToDurationStringLong(122)).toBe("2 hours & 2 minutes");
    expect(formatMinutesToDurationStringLong(432)).toBe("7 hours & 12 minutes");
    expect(formatMinutesToDurationStringLong(432.123)).toBe(
      "7 hours & 12 minutes",
    );
    expect(formatMinutesToDurationStringLong(1439)).toBe(
      "23 hours & 59 minutes",
    );
  });

  test("formatMinutesAsTime", () => {
    expect(formatMinutesAsTime(0)).toBe("00:00");
    expect(formatMinutesAsTime(1)).toBe("00:01");
    expect(formatMinutesAsTime(59)).toBe("00:59");
    expect(formatMinutesAsTime(60)).toBe("01:00");
    expect(formatMinutesAsTime(61)).toBe("01:01");
    expect(formatMinutesAsTime(119)).toBe("01:59");
    expect(formatMinutesAsTime(120)).toBe("02:00");
    expect(formatMinutesAsTime(432)).toBe("07:12");
    expect(formatMinutesAsTime(432.49)).toBe("07:12");
    expect(formatMinutesAsTime(432.5)).toBe("07:13");
    expect(formatMinutesAsTime(479.5)).toBe("08:00");
    expect(formatMinutesAsTime(480)).toBe("08:00");
    expect(formatMinutesAsTime(480.000001)).toBe("08:00");
    expect(formatMinutesAsTime(1439)).toBe("23:59");
  });

  test("formatSecondsAsTime", () => {
    expect(formatSecondsAsTime(0)).toBe("00:00");
    expect(formatSecondsAsTime(1)).toBe("00:01");
    expect(formatSecondsAsTime(59)).toBe("00:59");
    expect(formatSecondsAsTime(60)).toBe("01:00");
    expect(formatSecondsAsTime(123)).toBe("02:03");
    expect(formatSecondsAsTime(600)).toBe("10:00");
    expect(formatSecondsAsTime(6001)).toBe("100:01");
    expect(formatSecondsAsTime(60011)).toBe("1000:11");
  });

  describe("formatSecondsToDurationStringLong", () => {
    test("with 0 seconds", () => {
      expect(formatSecondsToDurationStringLong(0)).toBe("0 seconds");
    });

    test("with 1 second", () => {
      expect(formatSecondsToDurationStringLong(1)).toBe("1 second");
    });

    test("with 12345 second", () => {
      expect(formatSecondsToDurationStringLong(12345)).toBe(
        "3 hours, 25 minutes & 45 seconds",
      );
    });
  });

  describe("formatSecondsToDurationStringShort", () => {
    test("with 0 seconds", () => {
      expect(formatSecondsToDurationStringShort(0)).toBe(
        process.env.CI ? "0 sec" : "0 secs",
      );
    });

    test("with 1 second", () => {
      expect(formatSecondsToDurationStringShort(1)).toBe("1 sec");
    });

    test("with 12345 second", () => {
      expect(formatSecondsToDurationStringShort(12345)).toBe(
        process.env.CI ? "3 hr, 25 min & 45 sec" : "3 hrs, 25 mins & 45 secs",
      );
    });
  });

  test("formatSecondsToOneNumberWithUnits", () => {
    expect(formatSecondsToOneNumberWithUnits(-1)).toBe("-1 sec");
    expect(formatSecondsToOneNumberWithUnits(0)).toBe(
      process.env.CI ? "0 sec" : "0 secs",
    );
    expect(formatSecondsToOneNumberWithUnits(0.1)).toBe(
      process.env.CI ? "0 sec" : "0 secs",
    );
    expect(formatSecondsToOneNumberWithUnits(0.49)).toBe(
      process.env.CI ? "0 sec" : "0 secs",
    );
    expect(formatSecondsToOneNumberWithUnits(0.5)).toBe("1 sec");
    expect(formatSecondsToOneNumberWithUnits(59)).toBe(
      process.env.CI ? "59 sec" : "59 secs",
    );
    expect(formatSecondsToOneNumberWithUnits(60)).toBe("1 min");
    expect(formatSecondsToOneNumberWithUnits(62)).toBe("1 min");
    expect(formatSecondsToOneNumberWithUnits(63)).toBe(
      process.env.CI ? "1.1 min" : "1.1 mins",
    );
    expect(formatSecondsToOneNumberWithUnits(116)).toBe(
      process.env.CI ? "1.9 min" : "1.9 mins",
    );
    expect(formatSecondsToOneNumberWithUnits(117)).toBe(
      process.env.CI ? "2 min" : "2 mins",
    );
    expect(formatSecondsToOneNumberWithUnits(3594)).toBe(
      process.env.CI ? "59.9 min" : "59.9 mins",
    );
    expect(formatSecondsToOneNumberWithUnits(3600)).toBe("1 hr");
    expect(formatSecondsToOneNumberWithUnits(1e4)).toBe(
      process.env.CI ? "2.8 hr" : "2.8 hrs",
    );
    expect(formatSecondsToOneNumberWithUnits(1e5)).toBe(
      process.env.CI ? "27.8 hr" : "27.8 hrs",
    );
  });
});
