import { useSelector } from "react-redux";
import { normalizedMoodsSelector } from "../../../../selectors";
import { convertKelvinToCelcius } from "../../../../utils";
import useMoodIdsWithLocationInPeriod from "../../../hooks/useMoodIdsWithLocationInPeriod";
import { useWeatherQueries } from "../../../hooks/useWeatherQueries";
import MoodByTemperatureChart from "../../../shared/MoodByTemperatureChart";

interface Props {
  fromDate: Date;
  toDate: Date;
}

export default function MoodByTemperatureForPeriod({
  fromDate,
  toDate,
}: Props) {
  const normalizedMoods = useSelector(normalizedMoodsSelector);
  const moodIdsWithLocationInPeriod = useMoodIdsWithLocationInPeriod(
    fromDate,
    toDate
  );
  const weatherResults = useWeatherQueries(moodIdsWithLocationInPeriod);

  if (!moodIdsWithLocationInPeriod.length) return null;

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

  for (let i = 0; i < weatherResults.length; i++) {
    const result = weatherResults[i];
    const { data } = result;
    if (!data) continue;
    const celcius = convertKelvinToCelcius(data.data[0].temp);
    const { mood } = normalizedMoods.byId[moodIdsWithLocationInPeriod[i]];
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

  const fineGrainedDataToRender = Object.entries(fineGrainedData)
    .map(([key, { moodCount, sumOfMoods }]): [number, number] => {
      const meanMood = sumOfMoods / moodCount;
      return [Number(key), meanMood];
    })
    .sort(([a], [b]) => a - b);

  if (!fineGrainedDataToRender.length) return null;

  const coarseGrainedDataToRender = Object.entries(coarseGrainedData)
    .map(([key, { moodCount, sumOfMoods }]): [number, number] => {
      const meanMood = sumOfMoods / moodCount;
      return [Number(key), meanMood];
    })
    .sort(([a], [b]) => a - b);

  return (
    <MoodByTemperatureChart
      coarseGrainedData={coarseGrainedDataToRender}
      fineGrainedData={fineGrainedDataToRender}
    />
  );
}
