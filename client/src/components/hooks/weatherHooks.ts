import { HIGHLY_CACHED_QUERY_OPTIONS, QUERY_KEYS, TIME } from "../../constants";
import { useQueries, useQuery } from "@tanstack/react-query";
import { AppEventWithLocation } from "../../types";
import eventsSlice from "../../store/eventsSlice";
import { fetchWeather } from "../../api";
import { useSelector } from "react-redux";

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

export const useWeatherQueries = (ids: string[]) => {
  const eventsById = useSelector(eventsSlice.selectors.byId);

  return useQueries({
    queries: ids.map((id) => {
      const { latitude, longitude } = (eventsById[id] as AppEventWithLocation)
        .payload.location;
      const queryKey: QueryKey = [
        QUERY_KEYS.weather,
        roundQueryParameters({ date: new Date(id), latitude, longitude }),
      ];
      return {
        ...HIGHLY_CACHED_QUERY_OPTIONS,
        queryKey,
        queryFn: fetchWeather,
      };
    }),
  });
};
