import { Spinner } from "eri";
import { UseQueryResult } from "@tanstack/react-query";
import { WeatherApiResponse } from "../../../../types";
import { integerPercentFormatter } from "../../../../formatters/numberFormatters";

interface Props {
  weatherResultStatuses: Array<
    UseQueryResult<WeatherApiResponse, Error>["status"]
  >;
}

export default function WeatherLoadingStatus({ weatherResultStatuses }: Props) {
  let errorCount = 0;
  let loadingCount = 0;
  let successCount = 0;
  for (const status of weatherResultStatuses) {
    switch (status) {
      case "error":
        errorCount++;
        break;
      case "pending":
        loadingCount++;
        break;
      case "success":
        successCount++;
    }
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
              successCount / weatherResultStatuses.length,
            )}
          </>
        )}
        {Boolean(errorCount && loadingCount) && <br />}
        {Boolean(errorCount) && (
          <span className="negative">
            Could not fetch weather for{" "}
            {integerPercentFormatter.format(
              errorCount / weatherResultStatuses.length,
            )}{" "}
            of locations, please try again later
          </span>
        )}
      </small>
    </p>
  );
}
