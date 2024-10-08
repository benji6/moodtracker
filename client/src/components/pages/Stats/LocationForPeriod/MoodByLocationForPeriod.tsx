import { Paper, Spinner } from "eri";
import MoodByLocationTable from "../../../shared/MoodByLocationTable";
import { RootState } from "../../../../store";
import { captureException } from "../../../../sentry";
import eventsSlice from "../../../../store/eventsSlice";
import { integerPercentFormatter } from "../../../../formatters/numberFormatters";
import { useReverseGeolocationQueries } from "../../../hooks/reverseGeolocationHooks";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodByLocationForPeriod({ dateFrom, dateTo }: Props) {
  const normalizedMoods = useSelector(eventsSlice.selectors.normalizedMoods);
  const moodIdsWithLocationInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.moodIdsWithLocationInPeriod(state, dateFrom, dateTo),
  );
  const reverseGeolocationResults = useReverseGeolocationQueries(
    moodIdsWithLocationInPeriod,
  );

  if (!moodIdsWithLocationInPeriod.length) return;

  const moodsByLocation: Record<string, number[]> = {};

  let errorCount = 0;
  let loadingCount = 0;
  let successCount = 0;
  for (let i = 0; i < reverseGeolocationResults.length; i++) {
    const { data, status } = reverseGeolocationResults[i];
    if (status === "error") {
      errorCount++;
      continue;
    }
    if (status === "pending") {
      loadingCount++;
      continue;
    }
    successCount++;

    const { mood, location } =
      normalizedMoods.byId[moodIdsWithLocationInPeriod[i]];
    const Place = data?.Results?.[0]?.Place;
    const locationName = Place?.Municipality ?? Place?.Label;
    if (!locationName) {
      if (!location) throw Error("location should be defined");
      const { latitude, longitude } = location;
      captureException(
        Error(
          `Failed to derive location name for ${JSON.stringify({
            latitude,
            longitude,
          })}. Results: ${JSON.stringify(data.Results)}`,
        ),
      );
      continue;
    }
    const val = moodsByLocation[locationName];
    if (val) val.push(mood);
    else moodsByLocation[locationName] = [mood];
  }

  return (
    <Paper>
      <h3>Average mood by location</h3>
      <MoodByLocationTable moodsByLocation={moodsByLocation} />
      {loadingCount || errorCount ? (
        <p>
          <small>
            {Boolean(loadingCount) && (
              <>
                <Spinner inline margin="end" />
                Fetching location data (may require an internet connection)...{" "}
                {integerPercentFormatter.format(
                  successCount / moodIdsWithLocationInPeriod.length,
                )}
              </>
            )}
            {Boolean(errorCount && loadingCount) && <br />}
            {Boolean(errorCount) && (
              <span className="negative">
                Could not fetch location for{" "}
                {integerPercentFormatter.format(
                  errorCount / moodIdsWithLocationInPeriod.length,
                )}{" "}
                of moods, please try again later
              </span>
            )}
          </small>
        </p>
      ) : null}
    </Paper>
  );
}
