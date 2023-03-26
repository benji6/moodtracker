import {
  Paper,
  Pagination,
  TextField,
  Toggle,
  Select,
  ComboBox,
  Card,
  SubHeading,
} from "eri";
import Fuse from "fuse.js";
import * as React from "react";
import {
  createDateFromLocalDateString,
  formatIsoDateInLocalTimezone,
  mapRight,
  roundDateDown,
  roundDateUp,
} from "../../../../utils";
import {
  denormalizedMoodsSelector,
  moodIdsByDateSelector,
  normalizedDescriptionWordsSelector,
  normalizedMoodsSelector,
} from "../../../../selectors";
import { useSelector } from "react-redux";
import {
  DESCRIPTION_MAX_LENGTH,
  FIELDS,
  MOOD_INTEGERS,
} from "../../../../constants";
import MoodGradientForPeriod from "../../Stats/MoodGradientForPeriod";
import { dateWeekdayFormatter } from "../../../../formatters/dateTimeFormatters";
import MoodCard from "../../../shared/MoodCard";
import addDays from "date-fns/addDays";
import { Link } from "react-router-dom";
import DateRangeSelector from "../../../shared/DateRangeSelector";
import { initialState, reducer } from "./moodLogReducer";
import OptionalMoodCell from "../../Home/OptionalMoodCell";
import ExportControls from "../../Settings/Export/ExportControls";

const DAYS_PER_PAGE = 7;

const groupMoodIdsByDay = (
  moodIds: string[]
): [dateStr: string, moodIds: string[]][] => {
  const moodsGroupedByDate: { [date: string]: string[] } = {};

  for (let i = 0; i < moodIds.length; i++) {
    const id = moodIds[i];
    const key = formatIsoDateInLocalTimezone(new Date(id));
    if (moodsGroupedByDate[key]) moodsGroupedByDate[key].push(id);
    else moodsGroupedByDate[key] = [id];
  }

  return Object.entries(moodsGroupedByDate);
};

export default function MoodLog() {
  const moods = useSelector(normalizedMoodsSelector);
  const denormalizedMoods = useSelector(denormalizedMoodsSelector);
  const moodIdsByDate = useSelector(moodIdsByDateSelector);
  const [localState, localDispatch] = React.useReducer(reducer, initialState);
  const normalizedDescriptionWords = useSelector(
    normalizedDescriptionWordsSelector
  );
  const dateNow = new Date();
  const [dateTo, setDateTo] = React.useState(roundDateUp(dateNow));
  const [dateFrom, setDateFrom] = React.useState(
    roundDateDown(new Date(moods.allIds[0]))
  );

  const filterDescriptions = localState.filterDescription
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const filterFeatureAvailable = moods.allIds.length >= 5;

  let filteredMoodIds = moods.allIds;
  if (localState.shouldShowFilter) {
    let filteredMoods = denormalizedMoods.filter((mood) => {
      if (
        localState.filterMood !== undefined &&
        mood.mood !== localState.filterMood
      )
        return false;

      const date = new Date(mood.createdAt);
      if (date < dateFrom || date > dateTo) return false;

      if (filterDescriptions.length) {
        const normalizedMoodDescription = mood.description?.toLowerCase();
        if (
          !filterDescriptions.every((description) =>
            normalizedMoodDescription?.includes(description)
          )
        )
          return false;
      }

      return true;
    });
    if (localState.searchString) {
      const fuse = new Fuse(filteredMoods, {
        distance: Infinity,
        includeScore: true,
        keys: [{ name: "description", weight: 2 }, "exploration"],
        shouldSort: false,
        threshold: 0.25,
      });

      const result = fuse.search(localState.searchString);
      filteredMoods = result.map(({ item }) => item);
    }
    filteredMoodIds = filteredMoods.map(({ createdAt }) => createdAt);
  }

  const filteredMoodsGroupedByDay = localState.shouldShowFilter
    ? groupMoodIdsByDay(filteredMoodIds)
    : Object.entries(moodIdsByDate);

  const pageCount = Math.max(
    Math.ceil(filteredMoodsGroupedByDay.length / DAYS_PER_PAGE),
    1
  );

  let averageMood: undefined | number;

  if (filteredMoodIds.length) {
    let moodsSum = 0;
    for (let i = 0; i < filteredMoodIds.length; i++)
      moodsSum += moods.byId[filteredMoodIds[i]].mood;
    averageMood = moodsSum / filteredMoodIds.length;
  }

  const endIndex =
    filteredMoodsGroupedByDay.length - localState.page * DAYS_PER_PAGE;

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
              checked={localState.shouldShowFilter}
              label="Toggle search"
              onChange={(e) =>
                localDispatch({
                  payload: e.target.checked,
                  type: "shouldShowFilter/set",
                })
              }
            />
            {localState.shouldShowFilter && (
              <div className="slide-in">
                <TextField
                  label="Search"
                  supportiveText="Fuzzy search across mood tags and journal entries"
                  onChange={(e) =>
                    localDispatch({
                      payload: e.target.value,
                      type: "searchString/set",
                    })
                  }
                  required={false}
                  type="search"
                  value={localState.searchString}
                />
                <ComboBox
                  label={FIELDS.description.label}
                  supportiveText="Search for a specific mood tag"
                  maxLength={DESCRIPTION_MAX_LENGTH}
                  onChange={(e) =>
                    localDispatch({
                      payload: e.target.value,
                      type: "filterDescription/set",
                    })
                  }
                  options={normalizedDescriptionWords}
                  required={false}
                  type="search"
                  value={localState.filterDescription}
                />
                <Select
                  label={FIELDS.mood.label}
                  onChange={(e) =>
                    localDispatch(
                      e.target.value
                        ? {
                            payload: Number(e.target.value),
                            type: "filterMood/set",
                          }
                        : { type: "filterMood/clear" }
                    )
                  }
                  required={false}
                  value={
                    localState.filterMood === undefined
                      ? ""
                      : localState.filterMood
                  }
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
            endIndex
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
                  {mapRight(ids!, (id) => (
                    <MoodCard id={id} key={id} />
                  ))}
                </Card.Group>
              </Paper>
            );
          }
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
            onChange={(page) =>
              localDispatch({ payload: page, type: "page/set" })
            }
            page={localState.page}
            pageCount={pageCount}
          />
        </Paper>
      )}
    </Paper.Group>
  );
}
