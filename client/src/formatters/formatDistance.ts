export const integerMeterFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
  style: "unit",
  unit: "meter",
});

const kilometerFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  style: "unit",
  unit: "kilometer",
});

export const formatMetersToOneNumberWithUnits = (meters: number) =>
  meters < 1000
    ? integerMeterFormatter.format(meters)
    : kilometerFormatter.format(meters / 1e3);
