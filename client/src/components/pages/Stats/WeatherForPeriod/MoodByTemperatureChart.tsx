import { Chart } from "eri";
import { useSelector } from "react-redux";
import { MOOD_INTEGERS, MOOD_RANGE } from "../../../../constants";
import { integerFormatter } from "../../../../formatters/numberFormatters";
import { normalizedMoodsSelector } from "../../../../selectors";
import { convertKelvinToCelcius } from "../../../../utils";
import useMoodIdsWithLocationInPeriod from "../../../hooks/useMoodIdsWithLocationInPeriod";
import { useWeatherQueries } from "../../../hooks/useWeatherQueries";

const X_LABELS_COUNT = 11;

interface Props {
  fromDate: Date;
  toDate: Date;
}

export default function MoodByTemperatureChart({ fromDate, toDate }: Props) {
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

  const yLabels: [number, string][] = MOOD_INTEGERS.map((y) => [y, String(y)]);

  const domain: [number, number] = [
    Math.floor(coarseGrainedDataToRender[0][0]),
    Math.ceil(coarseGrainedDataToRender.at(-1)![0]),
  ];
  const domainExtent = domain[1] - domain[0];
  const xLabels: [number, string][] = [];
  for (let i = 0; i < X_LABELS_COUNT; i++) {
    const x = Math.round(domain[0] + (domainExtent * i) / (X_LABELS_COUNT - 1));
    xLabels.push([x, integerFormatter.format(x)]);
  }

  return (
    <>
      <h4>Average mood by temperature</h4>
      <Chart.LineChart
        aria-label="Chart displaying average mood by temperature"
        domain={domain}
        range={MOOD_RANGE}
        xAxisTitle="Temperature (°C)"
        yAxisTitle="Mood"
      >
        <Chart.XGridLines lines={xLabels.map(([n]) => n)} />
        <Chart.YGridLines lines={yLabels.map(([y]) => y)} />
        <Chart.PlotArea>
          <Chart.Line data={fineGrainedDataToRender} thickness={0} />
          <Chart.Line data={coarseGrainedDataToRender} thickness={2} />
        </Chart.PlotArea>
        <Chart.XAxis labels={xLabels} markers />
        <Chart.YAxis labels={yLabels} markers />
      </Chart.LineChart>
    </>
  );
}
