import {
  DenormalizedEvents,
  EventTypeCategories,
  WeatherApiResponse,
} from "../../types";
import { Button } from "eri";
import { formatIsoDateInLocalTimezone } from "../../utils";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";
import { useWeatherQueries } from "../hooks/weatherHooks";
import getDataForRenderingWeather from "./Location/Weather/getDataForRenderingWeather";

const createFilename = (
  dataType: EventTypeCategories,
  extension: "csv" | "json",
): string =>
  `moodtracker-${dataType}-export-${formatIsoDateInLocalTimezone(
    new Date(),
  )}.${extension}`;

type FlattenedDatum = Record<string, number | string>;

const downloadCsv = (
  dataType: EventTypeCategories,
  denormalizedData: DenormalizedEvents,
  weatherData: Record<string, WeatherApiResponse>,
) => {
  const columns = new Set<string>();
  const flattenedDenormalizedData: FlattenedDatum[] = [];

  for (const datum of denormalizedData) {
    const flattenedDatum: FlattenedDatum = {};
    for (const [key, val] of Object.entries(datum)) {
      if (typeof val !== "object") {
        flattenedDatum[key] = val;
        columns.add(key);
        continue;
      }
      for (const [k, v] of Object.entries(
        val as Record<string, number | string>,
      )) {
        const flattenedKey = `${key}:${k}`;
        flattenedDatum[flattenedKey] = v;
        columns.add(flattenedKey);
      }
    }

    const weather = weatherData[datum.createdAt]?.data?.[0];
    if (weather) {
      for (const { name, displayValue } of getDataForRenderingWeather(
        weather,
      )) {
        const flattenedKey = `weather:${name}`;
        flattenedDatum[flattenedKey] = displayValue;
        columns.add(flattenedKey);
      }
    }

    flattenedDenormalizedData.push(flattenedDatum);
  }

  saveAs(
    new Blob(
      [
        unparse(flattenedDenormalizedData, {
          columns: [...columns].sort((a, b) => a.localeCompare(b)),
        }),
      ],
      {
        type: "text/csv",
      },
    ),
    createFilename(dataType, "csv"),
  );
};

const downloadJson = (
  dataType: EventTypeCategories,
  denormalizedData: DenormalizedEvents,
  weatherData: Record<string, WeatherApiResponse>,
) => {
  saveAs(
    new Blob(
      [
        JSON.stringify(
          denormalizedData.map((datum) => {
            const weather = weatherData[datum.createdAt];
            return weather?.data?.[0]
              ? { ...datum, weather: weather.data[0] }
              : datum;
          }),
        ),
      ],
      {
        type: "application/json",
      },
    ),
    createFilename(dataType, "json"),
  );
};

interface Props {
  category: EventTypeCategories;
  denormalizedData: DenormalizedEvents;
}

export default function ExportControls({ category, denormalizedData }: Props) {
  const eventsWithLocation = denormalizedData.filter((d) => "location" in d);
  const weatherResults = useWeatherQueries(
    eventsWithLocation.map(({ createdAt }) => createdAt),
  );

  const eventIdToWeather: Record<string, WeatherApiResponse> = {};
  for (let i = 0; i < weatherResults.length; i++) {
    const weather = weatherResults[i];
    if (weather?.data)
      eventIdToWeather[eventsWithLocation[i].createdAt] = weather;
  }

  return denormalizedData.length ? (
    <Button.Group>
      <Button
        onClick={() =>
          downloadCsv(category, denormalizedData, eventIdToWeather)
        }
        type="button"
      >
        Export as CSV
      </Button>
      <Button
        onClick={() =>
          downloadJson(category, denormalizedData, eventIdToWeather)
        }
        type="button"
        variant="secondary"
      >
        Export as JSON
      </Button>
    </Button.Group>
  ) : null;
}
