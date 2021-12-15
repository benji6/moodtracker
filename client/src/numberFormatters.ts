export const integerFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

export const minutesFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
  unit: "minute",
  unitDisplay: "long",
  style: "unit",
});

export const oneDecimalPlaceFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

export const twoDecimalPlacesFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});
