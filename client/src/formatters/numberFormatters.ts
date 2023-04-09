import { convertKelvinToCelcius } from "../utils";

const celciusFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  style: "unit",
  unit: "celsius",
});

export const formatKelvinToCelcius = (kelvin: number): string =>
  celciusFormatter.format(convertKelvinToCelcius(kelvin));

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

export const integerDegreeFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
  style: "unit",
  unit: "degree",
});
export const floatDegreeFormatter = Intl.NumberFormat(undefined, {
  style: "unit",
  unit: "degree",
});

export const integerMeterFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
  style: "unit",
  unit: "meter",
});

export const integerPercentFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
  style: "percent",
});

export const twoDecimalPlacesFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});
