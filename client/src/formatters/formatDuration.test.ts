import {
  formatMinutesToDurationStringLong,
  formatMinutesToDurationStringShort,
  formatSecondsToDurationStringLong,
  formatSecondsToOneNumberWithUnits,
} from "./formatDuration";

describe("formatDuration", () => {
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

  test("formatMinutesToDurationStringShort", () => {
    expect(formatMinutesToDurationStringShort(0)).toBe("00:00");
    expect(formatMinutesToDurationStringShort(1)).toBe("00:01");
    expect(formatMinutesToDurationStringShort(59)).toBe("00:59");
    expect(formatMinutesToDurationStringShort(60)).toBe("01:00");
    expect(formatMinutesToDurationStringShort(61)).toBe("01:01");
    expect(formatMinutesToDurationStringShort(119)).toBe("01:59");
    expect(formatMinutesToDurationStringShort(120)).toBe("02:00");
    expect(formatMinutesToDurationStringShort(432)).toBe("07:12");
    expect(formatMinutesToDurationStringShort(432.49)).toBe("07:12");
    expect(formatMinutesToDurationStringShort(432.5)).toBe("07:13");
    expect(formatMinutesToDurationStringShort(479.5)).toBe("08:00");
    expect(formatMinutesToDurationStringShort(480)).toBe("08:00");
    expect(formatMinutesToDurationStringShort(480.000001)).toBe("08:00");
    expect(formatMinutesToDurationStringShort(1439)).toBe("23:59");
  });

  describe("formatSecondsToDurationStringLong", () => {
    test("with 0 seconds", () => {
      expect(formatSecondsToDurationStringLong(0)).toBe("N/A");
    });

    test("with 1 second", () => {
      expect(formatSecondsToDurationStringLong(1)).toBe("1 second");
    });

    test("with 12345 second", () => {
      expect(formatSecondsToDurationStringLong(12345)).toBe(
        "3 hours 25 minutes 45 seconds",
      );
    });
  });

  // HACK: really should set locale explicitly,
  // but could not figure that out easily and lost patience
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
