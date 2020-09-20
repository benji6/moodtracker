export const monthFormatter = Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});

export const moodFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});
