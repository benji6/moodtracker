import { Icon } from "eri";
import { ComponentProps } from "react";
import { useSelector } from "react-redux";
import { oneDecimalPlaceFormatter } from "../../../../formatters/numberFormatters";
import { normalizedMoodsSelector } from "../../../../selectors";
import { getWeatherDisplayData, moodToColor } from "../../../../utils";
import useMoodIdsWithLocationInPeriod from "../../../hooks/useMoodIdsWithLocationInPeriod";
import { useWeatherQueries } from "../../../hooks/weatherHooks";
import MoodByWeatherChart from "../../../shared/MoodByWeatherChart";
import { MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS } from "./constants";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodByWeatherForPeriod({ dateFrom, dateTo }: Props) {
  const normalizedMoods = useSelector(normalizedMoodsSelector);
  const moodIdsWithLocationInPeriod = useMoodIdsWithLocationInPeriod(
    dateFrom,
    dateTo,
  );
  const weatherResults = useWeatherQueries(moodIdsWithLocationInPeriod);

  if (
    moodIdsWithLocationInPeriod.length < MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS
  )
    return null;

  const chartData: {
    [nameAndColor: string]: {
      moodCount: number;
      sumOfMoods: number;
    };
  } = {};

  for (let i = 0; i < weatherResults.length; i++) {
    const result = weatherResults[i];
    const { data } = result;
    if (!data) continue;
    const [weatherData] = data.data;
    const { mood } = normalizedMoods.byId[moodIdsWithLocationInPeriod[i]];
    for (const { id: weatherId } of weatherData.weather) {
      const { iconName, label, weatherColor } = getWeatherDisplayData({
        isDaytime: true,
        weatherId,
      });
      const key = `${label}:${iconName}:${weatherColor}`;
      chartData[key] =
        key in chartData
          ? {
              moodCount: chartData[key].moodCount + 1,
              sumOfMoods: chartData[key].sumOfMoods + mood,
            }
          : { moodCount: 1, sumOfMoods: mood };
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

  if (!data.length) return null;

  return <MoodByWeatherChart data={data} />;
}
