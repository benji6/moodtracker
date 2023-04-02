import { useSelector } from "react-redux";
import { useReverseGeolocationQueries } from "../../hooks/reverseGeolocationHooks";
import { normalizedMoodsSelector } from "../../../selectors";
import useMoodIdsWithLocationInPeriod from "../../hooks/useMoodIdsWithLocationInPeriod";
import { computeMean } from "../../../utils";
import MoodCell from "../../shared/MoodCell";
import { Paper, Spinner } from "eri";
import { integerPercentFormatter } from "../../../formatters/numberFormatters";
import { captureException } from "../../../sentry";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodByLocationForPeriod({ dateFrom, dateTo }: Props) {
  const normalizedMoods = useSelector(normalizedMoodsSelector);
  const moodIdsWithLocationInPeriod = useMoodIdsWithLocationInPeriod(
    dateFrom,
    dateTo
  );
  const reverseGeolocationResults = useReverseGeolocationQueries(
    moodIdsWithLocationInPeriod
  );

  if (!moodIdsWithLocationInPeriod.length) return null;

  const moodsByLocation = new Map();

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

    const key = data.Results?.[0]?.Place?.Municipality;
    if (!key) {
      const { latitude, longitude } = location!;
      captureException(
        Error(
          `Municipality not defined for ${JSON.stringify({
            latitude,
            longitude,
          })}. Results: ${JSON.stringify(data.Results)}`
        )
      );
      continue;
    }
    const val = moodsByLocation.get(key);
    if (val) val.push(mood);
    else moodsByLocation.set(key, [mood]);
  }

  return (
    <Paper>
      <h3>Average mood by location</h3>
      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>Total moods</th>
            <th>Average mood</th>
          </tr>
        </thead>
        <tbody>
          {[...moodsByLocation.entries()]
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([location, moods]) => (
              <tr key={location}>
                <td>{location}</td>
                <td>{moods.length}</td>
                <MoodCell mood={computeMean(moods)} />
              </tr>
            ))}
        </tbody>
      </table>
      {loadingCount || errorCount ? (
        <p>
          <small>
            {Boolean(loadingCount) && (
              <>
                <Spinner inline margin="end" />
                Fetching location data (may require an internet connection)...{" "}
                {integerPercentFormatter.format(
                  successCount / moodIdsWithLocationInPeriod.length
                )}
              </>
            )}
            {Boolean(errorCount && loadingCount) && <br />}
            {Boolean(errorCount) && (
              <span className="negative">
                Could not fetch location for{" "}
                {integerPercentFormatter.format(
                  errorCount / moodIdsWithLocationInPeriod.length
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
