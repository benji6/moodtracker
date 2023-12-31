import {
  formatMinutesAsTimeStringLong,
  formatMinutesAsTimeStringShort,
} from "./formatMinutesAsTimeString";

test("formatMinutesAsTimeStringShort", () => {
  expect(formatMinutesAsTimeStringShort(0)).toBe("00:00");
  expect(formatMinutesAsTimeStringShort(1)).toBe("00:01");
  expect(formatMinutesAsTimeStringShort(59)).toBe("00:59");
  expect(formatMinutesAsTimeStringShort(60)).toBe("01:00");
  expect(formatMinutesAsTimeStringShort(61)).toBe("01:01");
  expect(formatMinutesAsTimeStringShort(119)).toBe("01:59");
  expect(formatMinutesAsTimeStringShort(120)).toBe("02:00");
  expect(formatMinutesAsTimeStringShort(432)).toBe("07:12");
  expect(formatMinutesAsTimeStringShort(432.49)).toBe("07:12");
  expect(formatMinutesAsTimeStringShort(432.5)).toBe("07:13");
  expect(formatMinutesAsTimeStringShort(1439)).toBe("23:59");
});

test("formatMinutesAsTimeStringLong", () => {
  expect(formatMinutesAsTimeStringLong(0)).toBe("0 minutes");
  expect(formatMinutesAsTimeStringLong(1)).toBe("1 minute");
  expect(formatMinutesAsTimeStringLong(2)).toBe("2 minutes");
  expect(formatMinutesAsTimeStringLong(59)).toBe("59 minutes");
  expect(formatMinutesAsTimeStringLong(60)).toBe("1 hour");
  expect(formatMinutesAsTimeStringLong(61)).toBe("1 hour & 1 minute");
  expect(formatMinutesAsTimeStringLong(62)).toBe("1 hour & 2 minutes");
  expect(formatMinutesAsTimeStringLong(119)).toBe("1 hour & 59 minutes");
  expect(formatMinutesAsTimeStringLong(120)).toBe("2 hours");
  expect(formatMinutesAsTimeStringLong(121)).toBe("2 hours & 1 minute");
  expect(formatMinutesAsTimeStringLong(122)).toBe("2 hours & 2 minutes");
  expect(formatMinutesAsTimeStringLong(432)).toBe("7 hours & 12 minutes");
  expect(formatMinutesAsTimeStringLong(1439)).toBe("23 hours & 59 minutes");
});
