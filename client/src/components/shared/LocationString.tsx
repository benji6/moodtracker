import { Spinner } from "eri";
import { ReactElement } from "react";
import { captureException } from "../../sentry";
import { useReverseGeolocationQuery } from "../hooks/reverseGeolocationHooks";

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
  const { data, isError, isPending } = useReverseGeolocationQuery({
    latitude,
    longitude,
  });

  if (isPending) return <Spinner inline />;
  if (isError) return errorFallback ?? null;
  const Place = data.Results?.[0]?.Place;
  const locationName = Place?.Municipality ?? Place?.Label;
  if (!locationName) {
    captureException(
      Error(
        `Failed to derive location name for ${JSON.stringify({
          latitude,
          longitude,
        })}. Results: ${JSON.stringify(data.Results)}`,
      ),
    );
    return errorFallback ?? null;
  }

  return (
    <>
      {locationName}
      {successPostfix ?? null}
    </>
  );
}
