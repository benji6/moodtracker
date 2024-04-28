import { HIGHLY_CACHED_QUERY_OPTIONS, QUERY_KEYS } from "../../constants";
import { useQueries, useQuery } from "@tanstack/react-query";
import { AppEventWithLocation } from "../../types";
import eventsSlice from "../../store/eventsSlice";
import { getReverseGeolocation } from "../../api";
import { useSelector } from "react-redux";

const roundQueryParameters = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): {
  latitude: number;
  longitude: number;
} => ({
  // Rounding latitude and longitude to 3 decimal places gives a resolution of about 100m (https://en.wikipedia.org/wiki/Decimal_degrees#Precision) and improves client-side caching
  latitude: Number(latitude.toFixed(3)),
  longitude: Number(longitude.toFixed(3)),
});

export const useReverseGeolocationQuery = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) =>
  useQuery({
    queryKey: [
      QUERY_KEYS.reverseGeolocation,
      roundQueryParameters({ latitude, longitude }),
    ],
    queryFn: getReverseGeolocation,
    ...HIGHLY_CACHED_QUERY_OPTIONS,
  });

type QueryKey = [
  typeof QUERY_KEYS.reverseGeolocation,
  { latitude: number; longitude: number },
];

export const useReverseGeolocationQueries = (ids: string[]) => {
  const eventsById = useSelector(eventsSlice.selectors.byId);

  return useQueries({
    queries: ids.map((id) => {
      const { latitude, longitude } = (eventsById[id] as AppEventWithLocation)
        .payload.location;
      const queryKey: QueryKey = [
        QUERY_KEYS.reverseGeolocation,
        roundQueryParameters({ latitude, longitude }),
      ];
      return {
        ...HIGHLY_CACHED_QUERY_OPTIONS,
        queryKey,
        queryFn: getReverseGeolocation,
      };
    }),
  });
};
