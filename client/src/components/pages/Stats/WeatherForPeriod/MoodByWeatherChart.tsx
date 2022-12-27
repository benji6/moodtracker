import { Icon } from "eri";
import { ComponentProps } from "react";
import { useSelector } from "react-redux";
import { MOOD_EXTENT } from "../../../../constants";
import { oneDecimalPlaceFormatter } from "../../../../formatters/numberFormatters";
import { normalizedMoodsSelector } from "../../../../selectors";
import { getWeatherIconAndColor, moodToColor } from "../../../../utils";
import useMoodIdsWithLocationInPeriod from "../../../hooks/useMoodIdsWithLocationInPeriod";
import { useWeatherQueries } from "../../../hooks/useWeatherQueries";
import ColumnChart from "../../../shared/ColumnChart";

interface Props {
  fromDate: Date;
  toDate: Date;
}

export default function MoodByWeatherChart({ fromDate, toDate }: Props) {
  const normalizedMoods = useSelector(normalizedMoodsSelector);
  const moodIdsWithLocationInPeriod = useMoodIdsWithLocationInPeriod(
    fromDate,
    toDate
  );
  const weatherResults = useWeatherQueries(moodIdsWithLocationInPeriod);

  if (!moodIdsWithLocationInPeriod.length) return null;

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
    for (const { id: weatherId, main } of weatherData.weather) {
      const { iconName, weatherColor } = getWeatherIconAndColor({
        isDaytime: true,
        weatherId,
      });
      const key = `${main}:${iconName}:${weatherColor}`;
      chartData[key] =
        key in chartData
          ? {
              moodCount: chartData[key].moodCount + 1,
              sumOfMoods: chartData[key].sumOfMoods + mood,
            }
          : { moodCount: 1, sumOfMoods: mood };
    }
  }

  const meanMoodChartData = Object.entries(chartData)
    .map(([key, { moodCount, sumOfMoods }]) => {
      const [main, iconName, color] = key.split(":") as [
        string,
        ComponentProps<typeof Icon>["name"],
        string
      ];
      const meanMood = sumOfMoods / moodCount;
      return {
        color: moodToColor(meanMood),
        key,
        label: (
          <>
            <Icon color={color} draw name={iconName} />
            {main}
          </>
        ),
        main,
        title: `${main} (average of ${moodCount} mood${
          moodCount > 1 ? "s" : ""
        }): ${oneDecimalPlaceFormatter.format(meanMood)}`,
        y: meanMood,
      };
    })
    .sort((a, b) => {
      const yDifference = b.y - a.y;
      return yDifference || a.main.localeCompare(b.main);
    });

  if (!meanMoodChartData.length) return null;

  return (
    <>
      <h4>Average mood by weather</h4>
      <ColumnChart
        aria-label="Chart displaying average mood for different weather types"
        data={meanMoodChartData}
        maxRange={MOOD_EXTENT}
        rotateXLabels
        xAxisTitle="Weather"
        yAxisTitle="Average mood"
      />
    </>
  );
}
