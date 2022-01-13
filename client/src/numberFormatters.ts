export const integerFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

export const oneDecimalPlaceFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

export const percentFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  style: "percent",
});

export const twoDecimalPlacesFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});
