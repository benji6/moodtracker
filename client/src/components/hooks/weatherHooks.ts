import { HIGHLY_CACHED_QUERY_OPTIONS, QUERY_KEYS, TIME } from "../../constants";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import eventsSlice from "../../store/eventsSlice";
import { fetchWeather, fetchWeatherBatch } from "../../api";
import { useSelector } from "react-redux";
import { WeatherApiResponse } from "../../types";

const getUnixTimestampRoundedToNearestHourAndInPast = (date: Date) => {
  const roundedTime =
    Math.round(date.getTime() / 1e3 / TIME.secondsPerHour) *
    TIME.secondsPerHour;
  return (
    roundedTime - (roundedTime > Date.now() / 1e3 ? TIME.secondsPerHour : 0)
  );
};

const roundQueryParameters = ({
  date,
  latitude,
  longitude,
}: {
  date: Date;
  latitude: number;
  longitude: number;
}): {
  date: number;
  latitude: string;
  longitude: string;
} => ({
  // Date is rounded to the nearest hour, although finer resolution is likely available from many stations. The rounding should increase feasibility of caching on the backend
  date: getUnixTimestampRoundedToNearestHourAndInPast(date),
  // Rounding latitude and longitude to 1 decimal place is required by the API and gives a resolution of about 10km (https://en.wikipedia.org/wiki/Decimal_degrees#Precision). More detail in API code
  latitude: latitude.toFixed(1),
  longitude: longitude.toFixed(1),
});

export const useWeatherQuery = (queryParameters: {
  date: Date;
  latitude: number;
  longitude: number;
}) =>
  useQuery({
    queryKey: [QUERY_KEYS.weather, roundQueryParameters(queryParameters)],
    queryFn: fetchWeather,
    ...HIGHLY_CACHED_QUERY_OPTIONS,
  });

type QueryKey = [
  typeof QUERY_KEYS.weather,
  { date: number; latitude: string; longitude: string },
];

export const useWeatherQueries = (
  ids: string[],
): (WeatherApiResponse | undefined)[] => {
  const eventsById = useSelector(eventsSlice.selectors.byId);

  const queryKeys = ids.map((id) => {
    const { payload } = eventsById[id];
    if (
      typeof payload === "string" ||
      !("location" in payload) ||
      payload.location === undefined
    )
      throw Error("Expected payload to have a location");
    const {
      location: { latitude, longitude },
    } = payload;
    const queryKey: QueryKey = [
      QUERY_KEYS.weather,
      roundQueryParameters({ date: new Date(id), latitude, longitude }),
    ];
    return {
      queryKey,
      queryKeyString: `${queryKey[1].date},${queryKey[1].latitude},${queryKey[1].longitude}`,
    };
  });

  // TODO: switch back to using `useQueries` instead of `fetchWeatherBatch` when https://github.com/TanStack/query/issues/8604 is resolved.
  // This code used to use `useQueries` but it hit serious performance issues.
  // Deduplicating the queries was needed because it did not support duplicate query keys.
  // We should aim to revert to `useQueries` if/when the performance issue is resolved so the deduplicatoin logic is left in place for now.
  const queryStringToIndex = new Map<string, number>();
  const uniqueQueryKeys: QueryKey[] = [];
  for (const { queryKey, queryKeyString } of queryKeys) {
    if (queryStringToIndex.has(queryKeyString)) continue;
    queryStringToIndex.set(queryKeyString, uniqueQueryKeys.length);
    uniqueQueryKeys.push(queryKey);
  }

  const results: UseQueryResult<WeatherApiResponse[], Error> = useQuery({
    queryKey: [
      QUERY_KEYS.weatherBatch,
      uniqueQueryKeys.map(([, { latitude, longitude, date: timestamp }]) => ({
        latitude,
        longitude,
        timestamp,
      })),
    ],
    queryFn: fetchWeatherBatch,
    ...HIGHLY_CACHED_QUERY_OPTIONS,
    staleTime: TIME.millisecondsPerDay,
    gcTime: TIME.millisecondsPerDay,
  });

  return queryKeys.map(({ queryKeyString }) => {
    const index = queryStringToIndex.get(queryKeyString);
    if (index === undefined) throw Error("Expected index to be defined");
    return results.data?.[index];
  });
};
