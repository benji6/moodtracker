export const integerFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

export const minutesFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
  unit: "minute",
  unitDisplay: "long",
  style: "unit",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any); // TODO - remove any once types are up-to-date

export const oneDecimalPlaceFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});
