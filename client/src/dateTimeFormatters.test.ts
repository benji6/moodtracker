import { formatDurationFromSeconds } from "./dateTimeFormatters";

describe("dateTimeFormatters", () => {
  describe("formatDurationFromSeconds", () => {
    test("with 0 seconds", () => {
      expect(formatDurationFromSeconds(0)).toBe("N/A");
    });

    test("with 1 second", () => {
      expect(formatDurationFromSeconds(1)).toBe("1 second");
    });

    test("with 12345 second", () => {
      expect(formatDurationFromSeconds(12345)).toBe(
        "3 hours 25 minutes 45 seconds"
      );
    });
  });
});
