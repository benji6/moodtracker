import { useQueries } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchWeather } from "../../api";
import { WEATHER_QUERY_OPTIONS } from "../../constants";
import { eventsByIdSelector } from "../../selectors";
import { AppEventWithLocation } from "../../types";

type QueryKey = [
  "weather",
  { date: Date; latitude: number; longitude: number }
];

export function useWeatherQueries(ids: string[]) {
  const eventsById = useSelector(eventsByIdSelector);

  return useQueries({
    queries: ids.map((id) => {
      const { latitude, longitude } = (eventsById[id] as AppEventWithLocation)
        .payload.location;
      const queryKey: QueryKey = [
        "weather",
        { date: new Date(id), latitude, longitude },
      ];
      return { ...WEATHER_QUERY_OPTIONS, queryKey, queryFn: fetchWeather };
    }),
  });
}
