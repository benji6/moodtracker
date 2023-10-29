import { Paper, Spinner, SubHeading } from "eri";
import { integerPercentFormatter } from "../../../../formatters/numberFormatters";
import useEventIdsWithLocationInPeriod from "../../../hooks/useEventIdsWithLocationInPeriod";
import { useWeatherQueries } from "../../../hooks/weatherHooks";
import { MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS } from "./constants";
import MoodByTemperatureForPeriod from "./MoodByTemperatureForPeriod";
import MoodByWeatherForPeriod from "./MoodByWeatherForPeriod";
import TemperatureForPeriod from "./TemperatureForPeriod";
import WeatherFrequencyForPeriod from "./WeatherFrequencyForPeriod";

interface Props {
  centerXAxisLabels?: boolean;
  dateFrom: Date;
  dateTo: Date;
  xLabels: string[];
}

export default function WeatherForPeriod({
  centerXAxisLabels = false,
  dateFrom,
  dateTo,
  xLabels,
}: Props) {
  const eventIdsWithLocationInPeriod = useEventIdsWithLocationInPeriod(
    dateFrom,
    dateTo,
  );
  const weatherResults = useWeatherQueries(eventIdsWithLocationInPeriod);

  if (!eventIdsWithLocationInPeriod.length) return;

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

  const loadingEl =
    loadingCount || errorCount ? (
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
    ) : null;

  return (
    <Paper>
      <h3>
        Weather
        <SubHeading>
          {eventIdsWithLocationInPeriod.length} location
          {eventIdsWithLocationInPeriod.length > 1 ? "s" : ""} recorded for this
          period
          {eventIdsWithLocationInPeriod.length <
            MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS && (
            <>
              {" "}
              (some weather charts will not be visible unless you have at least{" "}
              {MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS} locations)
            </>
          )}
        </SubHeading>
      </h3>
      {loadingEl}
      <WeatherFrequencyForPeriod dateFrom={dateFrom} dateTo={dateTo} />
      {eventIdsWithLocationInPeriod.length >=
        MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS && <>{loadingEl}</>}
      <MoodByWeatherForPeriod dateFrom={dateFrom} dateTo={dateTo} />
      {eventIdsWithLocationInPeriod.length >=
        MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS && <>{loadingEl}</>}
      <MoodByTemperatureForPeriod dateFrom={dateFrom} dateTo={dateTo} />
      {loadingEl}
      <TemperatureForPeriod
        centerXAxisLabels={centerXAxisLabels}
        dateFrom={dateFrom}
        dateTo={dateTo}
        xLabels={xLabels}
      />
      {loadingEl}
    </Paper>
  );
}
