import { RootState } from "../../../../store";
import { Spinner } from "eri";
import eventsSlice from "../../../../store/eventsSlice";
import { integerPercentFormatter } from "../../../../formatters/numberFormatters";
import { useSelector } from "react-redux";
import { useWeatherQueries } from "../../../hooks/weatherHooks";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function WeatherLoadingStatus({ dateFrom, dateTo }: Props) {
  const eventIdsWithLocationInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.idsWithLocationInPeriod(state, dateFrom, dateTo),
  );
  const weatherResults = useWeatherQueries(eventIdsWithLocationInPeriod);
  let errorCount = 0;
  let loadingCount = 0;
  let successCount = 0;
  for (let i = 0; i < weatherResults.length; i++) {
    const result = weatherResults[i];
    if (result.isError) errorCount++;
    else if (result.isPending) loadingCount++;
    const { data } = result;
    if (!data) continue;
    successCount++;
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
              successCount / eventIdsWithLocationInPeriod.length,
            )}
          </>
        )}
        {Boolean(errorCount && loadingCount) && <br />}
        {Boolean(errorCount) && (
          <span className="negative">
            Could not fetch weather for{" "}
            {integerPercentFormatter.format(
              errorCount / eventIdsWithLocationInPeriod.length,
            )}{" "}
            of locations, please try again later
          </span>
        )}
      </small>
    </p>
  );
}
