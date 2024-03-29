import {
  defaultDict,
  getWeatherDisplayData,
  moodToColor,
} from "../../../../utils";
import { ComponentProps } from "react";
import { Icon } from "eri";
import { MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS } from "./constants";
import MoodByWeatherChart from "../../../shared/MoodByWeatherChart";
import { RootState } from "../../../../store";
import eventsSlice from "../../../../store/eventsSlice";
import { oneDecimalPlaceFormatter } from "../../../../formatters/numberFormatters";
import { useSelector } from "react-redux";
import { useWeatherQueries } from "../../../hooks/weatherHooks";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodByWeatherForPeriod({ dateFrom, dateTo }: Props) {
  const normalizedMoods = useSelector(eventsSlice.selectors.normalizedMoods);
  const moodIdsWithLocationInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.moodIdsWithLocationInPeriod(state, dateFrom, dateTo),
  );
  const weatherResults = useWeatherQueries(moodIdsWithLocationInPeriod);

  if (
    moodIdsWithLocationInPeriod.length < MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS
  )
    return;

  const chartData = defaultDict(() => ({ moodCount: 0, sumOfMoods: 0 }));
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

  return <MoodByWeatherChart data={data} />;
}
