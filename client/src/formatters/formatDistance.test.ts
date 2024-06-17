import { formatMetersToOneNumberWithUnits } from "./formatDistance";

describe("formatDistance", () => {
  test("formatMetersToOneNumberWithUnits", () => {
    expect(formatMetersToOneNumberWithUnits(-1)).toBe("-1 m");
    expect(formatMetersToOneNumberWithUnits(0)).toBe("0 m");
    expect(formatMetersToOneNumberWithUnits(0.1)).toBe("0 m");
    expect(formatMetersToOneNumberWithUnits(0.49)).toBe("0 m");
    expect(formatMetersToOneNumberWithUnits(0.5)).toBe("1 m");
    expect(formatMetersToOneNumberWithUnits(999)).toBe("999 m");
    expect(formatMetersToOneNumberWithUnits(1e3)).toBe("1 km");
    expect(formatMetersToOneNumberWithUnits(1449)).toBe("1.4 km");
    expect(formatMetersToOneNumberWithUnits(1450)).toBe("1.5 km");
  });
});
