import { useSelector } from "react-redux";
import { useReverseGeolocationQueries } from "../../hooks/reverseGeolocationHooks";
import { normalizedMoodsSelector } from "../../../selectors";
import useMoodIdsWithLocationInPeriod from "../../hooks/useMoodIdsWithLocationInPeriod";
import { Paper, Spinner } from "eri";
import { integerPercentFormatter } from "../../../formatters/numberFormatters";
import { captureException } from "../../../sentry";
import MoodByLocationTable from "../../shared/MoodByLocationTable";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodByLocationForPeriod({ dateFrom, dateTo }: Props) {
  const normalizedMoods = useSelector(normalizedMoodsSelector);
  const moodIdsWithLocationInPeriod = useMoodIdsWithLocationInPeriod(
    dateFrom,
    dateTo,
  );
  const reverseGeolocationResults = useReverseGeolocationQueries(
    moodIdsWithLocationInPeriod,
  );

  if (!moodIdsWithLocationInPeriod.length) return;

  const moodsByLocation: { [location: string]: number[] } = {};

  let errorCount = 0;
  let loadingCount = 0;
  let successCount = 0;

  for (let i = 0; i < reverseGeolocationResults.length; i++) {
    const result = reverseGeolocationResults[i];
    const { mood, location } =
      normalizedMoods.byId[moodIdsWithLocationInPeriod[i]];
    if (result.isError) errorCount++;
    else if (result.isLoading) loadingCount++;
    const { data } = result;
    if (!data) continue;
    successCount++;

    const Place = data?.Results?.[0]?.Place;
    const locationName = Place?.Municipality ?? Place?.Label;
    if (!locationName) {
      const { latitude, longitude } = location!;
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
