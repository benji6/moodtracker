import { Paper, Spinner } from "eri";
import MoodByLocationTable from "../../../shared/MoodByLocationTable";
import { RootState } from "../../../../store";
import { captureException } from "../../../../sentry";
import eventsSlice from "../../../../store/eventsSlice";
import { integerPercentFormatter } from "../../../../formatters/numberFormatters";
import { useReverseGeolocationQueries } from "../../../hooks/reverseGeolocationHooks";
import { useSelector } from "react-redux";
import MoodByCountryTable from "./MoodByCountryTable";
import { defaultDict } from "../../../../utils";
import { alpha3ToAlpha2 } from "i18n-iso-countries";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodByLocationForPeriod({ dateFrom, dateTo }: Props) {
  const moodsWithLocationOrderedByExperiencedAtInPeriod = useSelector(
    (state: RootState) =>
      eventsSlice.selectors.moodsWithLocationOrderedByExperiencedAtInPeriod(
        state,
        dateFrom,
        dateTo,
      ),
  );
  const reverseGeolocationResults = useReverseGeolocationQueries(
    moodsWithLocationOrderedByExperiencedAtInPeriod.map(
      (mood) => mood.createdAt,
    ),
  );

  if (!moodsWithLocationOrderedByExperiencedAtInPeriod.length) return;

  const moodsByCountry = defaultDict<number[]>(() => []);
  const moodsByLocation = defaultDict<number[]>(() => []);

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
      moodsWithLocationOrderedByExperiencedAtInPeriod[i];
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
    } else {
      moodsByLocation[locationName].push(mood);
      const countryAlpha3 = Place?.Country;
      if (!countryAlpha3) {
        if (!location) throw Error("location should be defined");
        const { latitude, longitude } = location;
        captureException(
          Error(
            `Failed to derive country for ${JSON.stringify({
              latitude,
              longitude,
            })}. Results: ${JSON.stringify(data.Results)}`,
          ),
        );
        continue;
      }
      const countryAlpha2 = alpha3ToAlpha2(countryAlpha3);
      if (!countryAlpha2) {
        captureException(
          Error(
            `Failed to derive country alpha-2 code from country alpha-3 code = ${countryAlpha3}. Results: ${JSON.stringify(data.Results)}`,
          ),
        );
        continue;
      }
      const countryName = new Intl.DisplayNames(undefined, {
        type: "region",
      }).of(countryAlpha2);
      if (!countryName) {
        captureException(
          Error(
            `Failed to derive country name from alpha-2 code = ${countryAlpha2}. Results: ${JSON.stringify(data.Results)}`,
          ),
        );
        continue;
      }
      moodsByCountry[countryName].push(mood);
    }
  }

  const loadingProgressEl =
    loadingCount || errorCount ? (
      <p>
        <small>
          {Boolean(loadingCount) && (
            <>
              <Spinner inline margin="end" />
              Fetching location data (may require an internet connection)...{" "}
              {integerPercentFormatter.format(
                successCount /
                  moodsWithLocationOrderedByExperiencedAtInPeriod.length,
              )}
            </>
          )}
          {Boolean(errorCount && loadingCount) && <br />}
          {Boolean(errorCount) && (
            <span className="negative">
              Could not fetch location for{" "}
              {integerPercentFormatter.format(
                errorCount /
                  moodsWithLocationOrderedByExperiencedAtInPeriod.length,
              )}{" "}
              of moods, please try again later
            </span>
          )}
        </small>
      </p>
    ) : null;

  return (
    <>
      {Object.keys(moodsByCountry).length > 1 && (
        <Paper>
          <h3>Average mood by country</h3>
          <MoodByCountryTable moodsByCountry={moodsByCountry} />
          {loadingProgressEl}
        </Paper>
      )}
      <Paper>
        <h3>Average mood by location</h3>
        <MoodByLocationTable moodsByLocation={moodsByLocation} />
        {loadingProgressEl}
      </Paper>
    </>
  );
}
