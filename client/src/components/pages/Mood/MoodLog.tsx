import {
  Card,
  Pagination,
  Paper,
  Select,
  SubHeading,
  TextField,
  Toggle,
} from "eri";
import { parseAsInteger, parseAsIsoDate, useQueryState } from "nuqs";
import { FIELDS, MOOD_INTEGERS } from "../../../constants";
import {
  createDateFromLocalDateString,
  defaultDict,
  formatIsoDateInLocalTimezone,
  mapRight,
  roundDateDown,
} from "../../../utils";
import { useState } from "react";
import DateRangeSelector from "../../shared/DateRangeSelector";
import ExportControls from "../../shared/ExportControls";
import Fuse from "fuse.js";
import { Link } from "react-router";
import MoodCard from "../../shared/MoodCard";
import MoodGradientForPeriod from "../Stats/MoodGradientForPeriod";
import OptionalMoodCell from "../Home/OptionalMoodCell";
import { addDays } from "date-fns";
import { dateWeekdayFormatter } from "../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";
import { DenormalizedMoodWithExperiencedAt } from "../../../types";

const DAYS_PER_PAGE = 7;

const groupMoodsByDay = (
  moods: DenormalizedMoodWithExperiencedAt[],
): [dateStr: string, moodIds: string[]][] => {
  const moodsByDate = defaultDict((): string[] => []);
  for (const mood of moods)
    moodsByDate[
      formatIsoDateInLocalTimezone(new Date(mood.experiencedAt))
    ].push(mood.createdAt);
  return Object.entries(moodsByDate);
};

export default function MoodLog() {
  const denormalizedMoodsOrderedByExperiencedAt = useSelector(
    eventsSlice.selectors.denormalizedMoodsOrderedByExperiencedAt,
  );
  const moodIdsByDate = useSelector(eventsSlice.selectors.moodIdsByDate);
  const [dateFrom, setDateFrom] = useQueryState(
    "dateFrom",
    parseAsIsoDate.withDefault(
      roundDateDown(
        new Date(denormalizedMoodsOrderedByExperiencedAt[0].experiencedAt),
      ),
    ),
  );
  const dateNow = new Date();
  const [dateTo, setDateTo] = useQueryState(
    "dateTo",
    parseAsIsoDate.withDefault(new Date(dateNow)),
  );
  const [moodQuery, setMoodQuery] = useQueryState("mood", parseAsInteger);
  const [searchQuery, setSearchQuery] = useQueryState("q");
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const [shouldShowFilter, setShouldShowFilter] = useState(
    Boolean(window.location.search),
  );

  const dateToPlus1Day = addDays(dateTo, 1);

  const filterFeatureAvailable =
    denormalizedMoodsOrderedByExperiencedAt.length >= 5;

  let filteredMoods = denormalizedMoodsOrderedByExperiencedAt;
  if (shouldShowFilter) {
    filteredMoods = denormalizedMoodsOrderedByExperiencedAt.filter((mood) => {
      if (moodQuery && mood.mood !== moodQuery) return false;

      const date = new Date(mood.experiencedAt);
      return date >= dateFrom && date <= dateToPlus1Day;
    });
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
  }

  const filteredMoodsGroupedByDay = shouldShowFilter
    ? groupMoodsByDay(filteredMoods)
    : Object.entries(moodIdsByDate);

  const pageCount = Math.max(
    Math.ceil(filteredMoodsGroupedByDay.length / DAYS_PER_PAGE),
    1,
  );

  let averageMood: undefined | number;

  if (filteredMoods.length) {
    let moodsSum = 0;
    for (const mood of filteredMoods) moodsSum += mood.mood;
    averageMood = moodsSum / filteredMoods.length;
  }

  const endIndex =
    filteredMoodsGroupedByDay.length - Math.max(0, page - 1) * DAYS_PER_PAGE;

  return (
    <Paper.Group>
      <Paper>
        <h2>Mood log</h2>
        <h3>
          Export
          <SubHeading>
            Export {shouldShowFilter || "all"} your{" "}
            {shouldShowFilter && "filtered"} moods (choose CSV format if you
            want to load your data into a spreadsheet)
          </SubHeading>
        </h3>
        <ExportControls
          category="moods"
          denormalizedData={
            shouldShowFilter
              ? filteredMoods
              : denormalizedMoodsOrderedByExperiencedAt
          }
        />
        {filterFeatureAvailable && (
          <search>
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
                  onChange={(e) => setSearchQuery(e.target.value || null)}
                  required={false}
                  type="search"
                  value={searchQuery ?? ""}
                />
                <Select
                  label={FIELDS.mood.label}
                  onChange={(e) =>
                    setMoodQuery(e.target.value ? Number(e.target.value) : null)
                  }
                  required={false}
                  value={moodQuery ?? ""}
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
                  setDateFrom={setDateFrom}
                  setDateTo={setDateTo}
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
                      <td>{filteredMoods.length}</td>
                    </tr>
                    <tr>
                      <td>Average mood</td>
                      <OptionalMoodCell mood={averageMood} />
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </search>
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
            onChange={(page) => setPage(page ? page + 1 : null)}
            page={Math.max(0, page - 1)}
            pageCount={pageCount}
          />
        </Paper>
      )}
    </Paper.Group>
  );
}
