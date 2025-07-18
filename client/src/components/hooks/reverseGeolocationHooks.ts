import { HIGHLY_CACHED_QUERY_OPTIONS, QUERY_KEYS } from "../../constants";
import { useQueries, useQuery } from "@tanstack/react-query";
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
      QUERY_KEYS.reverseGeolocation,
      roundQueryParameters({ latitude, longitude }),
    ];
    return {
      queryKey,
      queryKeyString: `${queryKey[1].latitude},${queryKey[1].longitude}`,
    };
  });

  const queryStringToIndex = new Map<string, number>();
  const uniqueQueryKeys: QueryKey[] = [];
  for (const { queryKey, queryKeyString } of queryKeys) {
    if (queryStringToIndex.has(queryKeyString)) continue;
    queryStringToIndex.set(queryKeyString, uniqueQueryKeys.length);
    uniqueQueryKeys.push(queryKey);
  }

  // `useQueries` does not support duplicate query keys, hence we filter them out
  const results = useQueries({
    queries: uniqueQueryKeys.map((queryKey) => ({
      ...HIGHLY_CACHED_QUERY_OPTIONS,
      queryKey,
      queryFn: getReverseGeolocation,
    })),
  });

  return queryKeys.map(({ queryKeyString }) => {
    const index = queryStringToIndex.get(queryKeyString);
    if (index === undefined) throw Error("Expected index to be defined");
    return results[index];
  });
};
