import { Icon, Paper } from "eri";
import {
  defaultDict,
  getWeatherDisplayData,
  moodToColor,
} from "../../../../utils";
import { ComponentProps } from "react";
import { MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS } from "./constants";
import MoodByWeatherChart from "../../../shared/MoodByWeatherChart";
import { UseQueryResult } from "@tanstack/react-query";
import { WeatherApiResponse } from "../../../../types";
import WeatherLoadingStatus from "./WeatherLoadingStatus";
import eventsSlice from "../../../../store/eventsSlice";
import { oneDecimalPlaceFormatter } from "../../../../formatters/numberFormatters";
import { useSelector } from "react-redux";

interface Props {
  moodIds: string[];
  weatherResultsData: (WeatherApiResponse | undefined)[];
  weatherResultStatuses: UseQueryResult<WeatherApiResponse, Error>["status"][];
}

export default function MoodByWeatherForPeriod({
  moodIds,
  weatherResultsData,
  weatherResultStatuses,
}: Props) {
  const normalizedMoods = useSelector(eventsSlice.selectors.normalizedMoods);

  if (moodIds.length < MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS) return;

  const chartData = defaultDict(() => ({ moodCount: 0, sumOfMoods: 0 }));
  for (let i = 0; i < weatherResultsData.length; i++) {
    const data = weatherResultsData[i];
    if (!data) continue;
    const [weatherData] = data.data;
    const { mood } = normalizedMoods.byId[moodIds[i]];
    for (const { id: weatherId } of weatherData.weather) {
      const { iconName, label, weatherColor } = getWeatherDisplayData({
        isDaytime: true,
        weatherId,
      });
      const key = `${label}:${iconName}:${weatherColor}`;
      chartData[key].moodCount += 1;
      chartData[key].sumOfMoods += mood;
    }
  }

  const data = Object.entries(chartData)
    .map(([key, { moodCount, sumOfMoods }]) => {
      const [label, iconName, weatherColor] = key.split(":") as [
        string,
        ComponentProps<typeof Icon>["name"],
        string,
      ];
      const meanMood = sumOfMoods / moodCount;
      return {
        iconName,
        key,
        moodColor: moodToColor(meanMood),
        title: `${label} (average of ${moodCount} mood${
          moodCount > 1 ? "s" : ""
        }): ${oneDecimalPlaceFormatter.format(meanMood)}`,
        labelText: label,
        weatherColor,
        y: meanMood,
      };
    })
    .sort((a, b) => {
      const yDifference = b.y - a.y;
      return yDifference || a.labelText.localeCompare(b.labelText);
    });

  if (!data.length) return;

  return (
    <Paper>
      <MoodByWeatherChart data={data} />
      <WeatherLoadingStatus weatherResultStatuses={weatherResultStatuses} />
    </Paper>
  );
}
