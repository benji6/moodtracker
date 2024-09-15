import { MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS } from "./constants";
import MoodByTemperatureChart from "../../../shared/MoodByTemperatureChart";
import { Paper } from "eri";
import { UseQueryResult } from "@tanstack/react-query";
import { WeatherApiResponse } from "../../../../types";
import WeatherLoadingStatus from "./WeatherLoadingStatus";
import { convertKelvinToCelcius } from "../../../../utils";
import eventsSlice from "../../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  moodIds: string[];
  weatherResultsData: Array<UseQueryResult<WeatherApiResponse, Error>["data"]>;
  weatherResultStatuses: Array<
    UseQueryResult<WeatherApiResponse, Error>["status"]
  >;
}

export default function MoodByTemperatureForPeriod({
  moodIds,
  weatherResultsData,
  weatherResultStatuses,
}: Props) {
  const normalizedMoods = useSelector(eventsSlice.selectors.normalizedMoods);

  if (moodIds.length < MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS) return;

  const fineGrainedData: {
    [celcius: string]: {
      moodCount: number;
      sumOfMoods: number;
    };
  } = {};
  const coarseGrainedData: {
    [celcius: string]: {
      moodCount: number;
      sumOfMoods: number;
    };
  } = {};

  for (let i = 0; i < weatherResultsData.length; i++) {
    const data = weatherResultsData[i];
    if (!data) continue;
    const celcius = convertKelvinToCelcius(data.data[0].temp);
    const { mood } = normalizedMoods.byId[moodIds[i]];
    fineGrainedData[celcius] =
      celcius in fineGrainedData
        ? {
            moodCount: fineGrainedData[celcius].moodCount + 1,
            sumOfMoods: fineGrainedData[celcius].sumOfMoods + mood,
          }
        : { moodCount: 1, sumOfMoods: mood };
    const roundedCelcius = Math.round(celcius);
    coarseGrainedData[roundedCelcius] =
      roundedCelcius in coarseGrainedData
        ? {
            moodCount: coarseGrainedData[roundedCelcius].moodCount + 1,
            sumOfMoods: coarseGrainedData[roundedCelcius].sumOfMoods + mood,
          }
        : { moodCount: 1, sumOfMoods: mood };
  }

  const fineGrainedDataEntries = Object.entries(fineGrainedData);
  if (fineGrainedDataEntries.length < MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS)
    return;
  const coarseGrainedDataEntries = Object.entries(coarseGrainedData);
  if (
    coarseGrainedDataEntries.length <
    MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS / 2
  )
    return;

  const fineGrainedDataToRender = fineGrainedDataEntries
    .map(([key, { moodCount, sumOfMoods }]): [number, number] => {
      const meanMood = sumOfMoods / moodCount;
      return [Number(key), meanMood];
    })
    .sort(([a], [b]) => a - b);

  const coarseGrainedDataToRender = coarseGrainedDataEntries
    .map(([key, { moodCount, sumOfMoods }]): [number, number] => {
      const meanMood = sumOfMoods / moodCount;
      return [Number(key), meanMood];
    })
    .sort(([a], [b]) => a - b);

  return (
    <Paper>
      <MoodByTemperatureChart
        coarseGrainedData={coarseGrainedDataToRender}
        fineGrainedData={fineGrainedDataToRender}
      />
      <WeatherLoadingStatus weatherResultStatuses={weatherResultStatuses} />
    </Paper>
  );
}
