import { useQuery } from "@tanstack/react-query";
import { Spinner } from "eri";
import { ReactElement } from "react";
import { getReverseGeolocation } from "../../api";
import { HIGHLY_CACHED_QUERY_OPTIONS } from "../../constants";
import { captureException } from "../../sentry";

interface Props {
  errorFallback?: ReactElement;
  latitude: number;
  longitude: number;
  successPostfix?: ReactElement;
}

export default function LocationString({
  errorFallback,
  latitude,
  longitude,
  successPostfix,
}: Props) {
  const { data, isError, isLoading } = useQuery(
    [
      "reverse-geolocation",
      {
        // Rounding latitude and longitude to 3 decimal places gives a resolution of about 100m (https://en.wikipedia.org/wiki/Decimal_degrees#Precision) and improves client-side caching
        latitude: Number(latitude.toFixed(3)),
        longitude: Number(longitude.toFixed(3)),
      },
    ] as const,
    getReverseGeolocation,
    HIGHLY_CACHED_QUERY_OPTIONS
  );

  if (isLoading) return <Spinner inline />;
  if (isError) return errorFallback ?? null;
  if (!data?.Results?.[0].Place?.Municipality) {
    captureException(
      Error(
        `Municipality not defined for ${JSON.stringify({
          latitude,
          longitude,
        })}. Results: ${JSON.stringify(data?.Results)}`
      )
    );
    return errorFallback ?? null;
  }

  return (
    <>
      {data.Results[0].Place.Municipality}
      {successPostfix ?? null}
    </>
  );
}
