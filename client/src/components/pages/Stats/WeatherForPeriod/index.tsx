import { Icon, Paper, Spinner, SubHeading } from "eri";
import { ComponentProps } from "react";
import { useSelector } from "react-redux";
import {
  integerPercentFormatter,
  oneDecimalPlaceFormatter,
} from "../../../../formatters/numberFormatters";
import { normalizedMoodsSelector } from "../../../../selectors";
import { getWeatherIconAndColor, moodToColor } from "../../../../utils";
import useEventIdsWithLocationInPeriod from "../../../hooks/useEventIdsWithLocationInPeriod";
import { useWeatherQueries } from "../../../hooks/useWeatherQueries";
import ColumnChart from "../../../shared/ColumnChart";
import TemperatureChart from "./TemperatureChart";

interface Props {
  fromDate: Date;
  toDate: Date;
  xLabels: [number, string][];
  xLines?: number[];
}

export default function WeatherForPeriod({
  fromDate,
  toDate,
  xLabels,
  xLines,
}: Props) {
  const normalizedMoods = useSelector(normalizedMoodsSelector);
  const eventIdsWithLocationInPeriod = useEventIdsWithLocationInPeriod(
    fromDate,
    toDate
  );
  const weatherResults = useWeatherQueries(eventIdsWithLocationInPeriod);

  if (!eventIdsWithLocationInPeriod.length) return null;

  let errorCount = 0;
  let loadingCount = 0;
  let successCount = 0;

  const chartData: {
    [nameAndColor: string]: {
      locationEventCount: number;
      moodCount: number;
      sumOfMoods: number;
    };
  } = {};

  for (let i = 0; i < weatherResults.length; i++) {
    const result = weatherResults[i];
    if (result.isError) errorCount++;
    else if (result.isLoading) loadingCount++;
    const { data } = result;
    if (!data) continue;
    successCount++;
    const [weatherData] = data.data;
    const eventId = eventIdsWithLocationInPeriod[i];
    for (let j = 0; j < weatherData.weather.length; j++) {
      const { iconName, weatherColor } = getWeatherIconAndColor({
        isDaytime: true,
        weatherId: weatherData.weather[j].id,
      });
      const { main } = weatherData.weather[j];
      const key = `${main}:${iconName}:${weatherColor}`;
      const mood =
        eventId in normalizedMoods.byId
          ? normalizedMoods.byId[eventId]
          : undefined;

      const moodToAddToSum = mood ? mood.mood : 0;
      const addToMoodCount = Number(mood !== undefined);
      chartData[key] =
        key in chartData
          ? {
              locationEventCount: chartData[key].locationEventCount + 1,
              moodCount: chartData[key].moodCount + addToMoodCount,
              sumOfMoods: chartData[key].sumOfMoods + moodToAddToSum,
            }
          : {
              locationEventCount: 1,
              moodCount: addToMoodCount,
              sumOfMoods: moodToAddToSum,
            };
    }
  }

  const frequencyChartData = Object.entries(chartData)
    .map(([key, { locationEventCount }]) => {
      const [main, iconName, color] = key.split(":") as [
        string,
        ComponentProps<typeof Icon>["name"],
        string
      ];
      return {
        color,
        iconName,
        key,
        label: (
          <>
            <Icon color={color} draw name={iconName} />
            {main}
          </>
        ),
        main,
        title: `${main}: ${locationEventCount}`,
        y: locationEventCount,
      };
    })
    .sort((a, b) => {
      const yDifference = b.y - a.y;
      return yDifference || a.main.localeCompare(b.main);
    });

  const meanMoodChartData = Object.entries(chartData)
    .filter(([_, { moodCount }]) => moodCount)
    .map(([key, { moodCount, sumOfMoods }]) => {
      const [main, iconName, color] = key.split(":") as [
        string,
        ComponentProps<typeof Icon>["name"],
        string
      ];
      const meanMood = sumOfMoods / moodCount;
      return {
        color: moodToColor(meanMood),
        iconName,
        key,
        label: (
          <>
            <Icon color={color} draw name={iconName} />
            {main}
          </>
        ),
        main,
        title: `${main}: ${oneDecimalPlaceFormatter.format(meanMood)}`,
        y: meanMood,
      };
    })
    .sort((a, b) => {
      const yDifference = b.y - a.y;
      return yDifference || a.main.localeCompare(b.main);
    });

  return (
    <Paper>
      <h3>
        Weather
        <SubHeading>
          {eventIdsWithLocationInPeriod.length} location
          {eventIdsWithLocationInPeriod.length > 1 ? "s" : ""} recorded for this
          period
        </SubHeading>
      </h3>
      {frequencyChartData.length && (
        <>
          <h4>Weather frequency</h4>
          <ColumnChart
            aria-label="Chart displaying the frequency at which different weather types were recorded"
            data={frequencyChartData}
            rotateXLabels
            xAxisTitle="Weather"
            yAxisTitle="Count"
          />
        </>
      )}
      {meanMoodChartData.length && (
        <>
          <h4>Average mood by weather</h4>
          <ColumnChart
            aria-label="Chart displaying average mood for different weather types"
            data={meanMoodChartData}
            maxRange={10}
            rotateXLabels
            xAxisTitle="Weather"
            yAxisTitle="Average mood"
          />
        </>
      )}
      <TemperatureChart
        fromDate={fromDate}
        toDate={toDate}
        xLabels={xLabels}
        xLines={xLines}
      />
      {loadingCount || errorCount ? (
        <p>
          <small>
            {Boolean(loadingCount) && (
              <>
                <Spinner inline margin="end" />
                Fetching weather data (may require an internet connection)...{" "}
                {integerPercentFormatter.format(
                  successCount / eventIdsWithLocationInPeriod.length
                )}
              </>
            )}
            {Boolean(errorCount && loadingCount) && <br />}
            {Boolean(errorCount) && (
              <span className="negative">
                Could not fetch weather for{" "}
                {integerPercentFormatter.format(
                  errorCount / eventIdsWithLocationInPeriod.length
                )}{" "}
                of locations, please try again later
              </span>
            )}
          </small>
        </p>
      ) : null}
    </Paper>
  );
}
