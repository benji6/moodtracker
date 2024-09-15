import { Spinner } from "eri";
import { UseQueryResult } from "@tanstack/react-query";
import { WeatherApiResponse } from "../../../../types";
import { integerPercentFormatter } from "../../../../formatters/numberFormatters";

interface Props {
  weatherResults: UseQueryResult<WeatherApiResponse, Error>[];
}

export default function WeatherLoadingStatus({ weatherResults }: Props) {
  let errorCount = 0;
  let loadingCount = 0;
  let successCount = 0;
  for (let i = 0; i < weatherResults.length; i++) {
    const result = weatherResults[i];
    if (result.isError) errorCount++;
    else if (result.isPending) loadingCount++;
    else if (result.data) successCount++;
  }

  if (!loadingCount && !errorCount) return;

  return (
    <p>
      <small>
        {Boolean(loadingCount) && (
          <>
            <Spinner inline margin="end" />
            Fetching weather data (may require an internet connection)...{" "}
            {integerPercentFormatter.format(
              successCount / weatherResults.length,
            )}
          </>
        )}
        {Boolean(errorCount && loadingCount) && <br />}
        {Boolean(errorCount) && (
          <span className="negative">
            Could not fetch weather for{" "}
            {integerPercentFormatter.format(errorCount / weatherResults.length)}{" "}
            of locations, please try again later
          </span>
        )}
      </small>
    </p>
  );
}
