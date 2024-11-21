import {
  Card,
  Pagination,
  Paper,
  Select,
  SubHeading,
  TextField,
  Toggle,
} from "eri";
import { FIELDS, MOOD_INTEGERS } from "../../../constants";
import {
  createDateFromLocalDateString,
  defaultDict,
  formatIsoDateInLocalTimezone,
  mapRight,
  roundDateDown,
  roundDateUp,
} from "../../../utils";
import { useEffect, useState } from "react";
import DateRangeSelector from "../../shared/DateRangeSelector";
import ExportControls from "../../shared/ExportControls";
import Fuse from "fuse.js";
import { Link, useSearchParams } from "react-router-dom";
import MoodCard from "../../shared/MoodCard";
import MoodGradientForPeriod from "../Stats/MoodGradientForPeriod";
import OptionalMoodCell from "../Home/OptionalMoodCell";
import { addDays } from "date-fns";
import { dateWeekdayFormatter } from "../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

const DAYS_PER_PAGE = 7;

const groupMoodIdsByDay = (
  moodIds: string[],
): [dateStr: string, moodIds: string[]][] => {
  const moodsByDate = defaultDict((): string[] => []);
  for (const id of moodIds)
    moodsByDate[formatIsoDateInLocalTimezone(new Date(id))].push(id);
  return Object.entries(moodsByDate);
};

export default function MoodLog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const moods = useSelector(eventsSlice.selectors.normalizedMoods);
  const [shouldShowFilter, setShouldShowFilter] = useState(
    Boolean(searchParams.size),
  );
  const denormalizedMoods = useSelector(
    eventsSlice.selectors.denormalizedMoods,
  );
  const moodIdsByDate = useSelector(eventsSlice.selectors.moodIdsByDate);
  const dateNow = new Date();

  const dateFromParam = searchParams.get("dateFrom");
  const dateFrom: Date = dateFromParam
    ? new Date(dateFromParam)
    : roundDateDown(new Date(moods.allIds[0]));
  const dateToParam = searchParams.get("dateTo");
  const dateTo: Date = dateToParam
    ? new Date(dateToParam)
    : roundDateUp(dateNow);

  useEffect(() => {
    if (searchParams.has("dateFrom") && searchParams.has("dateTo")) return;
    setSearchParams(
      new URLSearchParams({
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        ...Object.fromEntries(searchParams),
      }),
    );
  }, []);

  const filterFeatureAvailable = moods.allIds.length >= 5;

  let filteredMoodIds = moods.allIds;
  if (shouldShowFilter) {
    let filteredMoods = denormalizedMoods.filter((mood) => {
      const moodQuery = searchParams.get("mood");
      if (moodQuery && mood.mood !== Number(moodQuery)) return false;

      const date = new Date(mood.createdAt);
      return date >= dateFrom && date <= dateTo;
    });
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      const fuse = new Fuse(filteredMoods, {
        distance: Infinity,
        includeScore: true,
        keys: ["description", "exploration"],
        shouldSort: false,
        threshold: 0.25,
        useExtendedSearch: true,
      });
      const result = fuse.search(searchQuery);
      filteredMoods = result.map(({ item }) => item);
    }
    filteredMoodIds = filteredMoods.map(({ createdAt }) => createdAt);
  }

  const filteredMoodsGroupedByDay = shouldShowFilter
    ? groupMoodIdsByDay(filteredMoodIds)
    : Object.entries(moodIdsByDate);

  const pageCount = Math.max(
    Math.ceil(filteredMoodsGroupedByDay.length / DAYS_PER_PAGE),
    1,
  );

  let averageMood: undefined | number;

  if (filteredMoodIds.length) {
    let moodsSum = 0;
    for (const id of filteredMoodIds) moodsSum += moods.byId[id].mood;
    averageMood = moodsSum / filteredMoodIds.length;
  }

  const endIndex =
    filteredMoodsGroupedByDay.length -
    Math.max(0, Number(searchParams.get("page")) - 1) * DAYS_PER_PAGE;

  return (
    <Paper.Group>
      <Paper>
        <h2>Mood log</h2>
        <h3>
          Export
          <SubHeading>
            Export all your moods (choose CSV format if you want to load your
            data into a spreadsheet)
          </SubHeading>
        </h3>
        <ExportControls category="moods" denormalizedData={denormalizedMoods} />
        {filterFeatureAvailable && (
          <>
            <h3>Search</h3>
            <Toggle
              checked={shouldShowFilter}
              label="Toggle search"
              onChange={(e) => setShouldShowFilter(e.target.checked)}
            />
            {shouldShowFilter && (
              <div className="slide-in">
                <TextField
                  label="Search"
                  supportiveText=<>
                    Search is fuzzy by default, use double quotes for phrases
                    (e.g. &quot;I am happy&quot;) and prefix with &apos; for
                    exact matches (e.g. &apos;happy). See{" "}
                    <a href="https://www.fusejs.io/examples.html#extended-search">
                      Fuse.js docs
                    </a>{" "}
                    for details on how to create more advanced searches.
                  </>
                  onChange={(e) => {
                    const newSearchParams = new URLSearchParams(searchParams);
                    if (e.target.value)
                      newSearchParams.set("q", e.target.value);
                    else newSearchParams.delete("q");
                    setSearchParams(newSearchParams);
                  }}
                  required={false}
                  type="search"
                  value={searchParams.get("q") ?? ""}
                />
                <Select
                  label={FIELDS.mood.label}
                  onChange={(e) => {
                    const newSearchParams = new URLSearchParams(searchParams);
                    if (e.target.value)
                      newSearchParams.set("mood", e.target.value);
                    else newSearchParams.delete("mood");
                    setSearchParams(newSearchParams);
                  }}
                  required={false}
                  value={searchParams.get("mood") ?? ""}
                  supportiveText="Search for a specific mood value"
                >
                  <option value="">Any mood</option>
                  {MOOD_INTEGERS.map((mood) => (
                    <option key={mood} value={mood}>
                      {mood}
                    </option>
                  ))}
                </Select>
                <DateRangeSelector
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  setDateFrom={(date) =>
                    setSearchParams({
                      ...Object.fromEntries(searchParams),
                      dateFrom: date.toISOString(),
                    })
                  }
                  setDateTo={(date) =>
                    setSearchParams({
                      ...Object.fromEntries(searchParams),
                      dateTo: date.toISOString(),
                    })
                  }
                />
                <table>
                  <thead>
                    <tr>
                      <th>Stat</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total moods</td>
                      <td>{filteredMoodIds.length}</td>
                    </tr>
                    <tr>
                      <td>Average mood</td>
                      <OptionalMoodCell mood={averageMood} />
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Paper>
      {filteredMoodsGroupedByDay.length ? (
        mapRight(
          filteredMoodsGroupedByDay.slice(
            Math.max(endIndex - DAYS_PER_PAGE, 0),
            endIndex,
          ),
          ([dayStr, ids]) => {
            const day = createDateFromLocalDateString(dayStr);
            return (
              <Paper key={dayStr}>
                <h3>
                  <Link to={`/stats/days/${dayStr}`}>
                    {dateWeekdayFormatter.format(day)}
                  </Link>
                </h3>
                <MoodGradientForPeriod
                  dateFrom={day}
                  dateTo={addDays(day, 1)}
                />
                <Card.Group>
                  {mapRight(ids, (id) => (
                    <MoodCard id={id} key={id} />
                  ))}
                </Card.Group>
              </Paper>
            );
          },
        )
      ) : (
        <Paper>
          <h3>No results found</h3>
          <p>Try again with a different search</p>
        </Paper>
      )}
      {pageCount > 1 && (
        <Paper>
          <Pagination
            onChange={(page) => {
              const newSearchParams = new URLSearchParams(searchParams);
              if (page) newSearchParams.set("page", String(page + 1));
              else newSearchParams.delete("page");
              setSearchParams(newSearchParams);
            }}
            page={Math.max(0, Number(searchParams.get("page")) - 1)}
            pageCount={pageCount}
          />
        </Paper>
      )}
    </Paper.Group>
  );
}
