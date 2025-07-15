import { Icon } from "eri";
import { WeatherApiResponse } from "../../../../types";
import { ComponentProps } from "react";
import { capitalizeFirstLetter } from "../../../../utils";
import {
  formatKelvinToCelcius,
  integerDegreeFormatter,
  integerFormatter,
  integerPercentFormatter,
  twoDecimalPlacesFormatter,
} from "../../../../formatters/numberFormatters";
import { integerMeterFormatter } from "../../../../formatters/formatDistance";
import { timeFormatter } from "../../../../formatters/dateTimeFormatters";

interface WeatherRenderData {
  displayValue: string;
  iconName: ComponentProps<typeof Icon>["name"];
  name: string;
  supportiveText?: string;
  value: number;
}

export default function getDataForRenderingWeather(
  weatherData: WeatherApiResponse["data"][0],
): WeatherRenderData[] {
  const renderData: WeatherRenderData[] = [];

  for (const [k, v] of Object.entries(weatherData)) {
    if (k === "dt" || !v) continue;

    const name =
      k === "uvi"
        ? "Ultraviolet index"
        : capitalizeFirstLetter(k.replaceAll("_", " "));

    let iconName: ComponentProps<typeof Icon>["name"];
    if (k === "sunrise" || k === "sunset") iconName = k;
    else if (k === "clouds") iconName = "cloud";
    else if (k === "dew_point") iconName = "dew-point";
    else if (k === "feels_like") iconName = "thermometer";
    else if (k === "humidity") iconName = "droplet";
    else if (k === "temp") iconName = "thermometer";
    else if (k === "uvi") iconName = "sun";
    else if (k === "visibility") iconName = "eye";
    else if (k === "wind_deg") iconName = "compass";
    else if (k === "wind_gust") iconName = "wind";
    else if (k === "wind_speed") iconName = "wind";
    else iconName = "chart";

    let supportiveText: string | undefined = undefined;
    switch (k) {
      case "dew_point":
        supportiveText =
          "The temperature to which air must be cooled to become saturated with water vapor";
        break;
      case "pressure":
        supportiveText =
          "Typical sea-level air pressure is about 1013 hPa & 1 hPa is equal to 1 millibar";
        break;
      case "uvi":
        supportiveText =
          "The strength of sunburn-producing ultraviolet radiation";
    }

    if (typeof v === "number") {
      let displayValue = String(v);
      switch (k) {
        case "clouds":
        case "humidity":
          displayValue = integerPercentFormatter.format(v / 100);
          break;
        case "dew_point":
        case "feels_like":
        case "temp":
          displayValue = formatKelvinToCelcius(v);
          break;
        case "pressure":
          displayValue = `${integerFormatter.format(v)} hPa`;
          break;
        case "sunrise":
        case "sunset":
          displayValue = timeFormatter.format(new Date(v * 1e3));
          break;
        case "visibility":
          displayValue = integerMeterFormatter.format(v);
          break;
        case "wind_deg":
          displayValue = integerDegreeFormatter.format(v);
          break;
        case "wind_speed":
        case "wind_gust":
          displayValue = `${twoDecimalPlacesFormatter.format(v)} m/s`;
      }

      renderData.push({
        displayValue,
        iconName,
        name,
        supportiveText,
        value: v,
      });
      continue;
    }

    if ("1h" in v) {
      renderData.push({
        displayValue: `${twoDecimalPlacesFormatter.format(v["1h"])} mm/hour`,
        iconName,
        name,
        supportiveText,
        value: v["1h"],
      });
    }
  }

  return renderData;
}
