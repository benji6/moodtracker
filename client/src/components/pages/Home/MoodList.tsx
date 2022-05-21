import {
  Paper,
  Pagination,
  TextField,
  Toggle,
  Select,
  ComboBox,
  Card,
} from "eri";
import * as React from "react";
import {
  createDateFromLocalDateString,
  formatIsoDateInLocalTimezone,
  mapRight,
} from "../../../utils";
import {
  moodIdsByDateSelector,
  normalizedDescriptionWordsSelector,
  normalizedMoodsSelector,
} from "../../../selectors";
import { useSelector } from "react-redux";
import {
  DESCRIPTION_MAX_LENGTH,
  FIELDS,
  MOOD_INTEGERS,
  TEST_IDS,
} from "../../../constants";
import OptionalMoodCell from "./OptionalMoodCell";
import { FluxStandardAction } from "../../../types";
import MoodGradientForPeriod from "../Stats/MoodGradientForPeriod";
import { dateWeekdayFormatter } from "../../../dateTimeFormatters";
import MoodCard from "../../shared/MoodCard";
import addDays from "date-fns/addDays";
import { Link } from "react-router-dom";

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

type Action =
  | FluxStandardAction<"filterDescription/set", string>
  | FluxStandardAction<"filterExploration/set", string>
  | FluxStandardAction<"filterMood/clear">
  | FluxStandardAction<"filterMood/set", number>
  | FluxStandardAction<"page/set", number>
  | FluxStandardAction<"shouldShowFilter/set", boolean>;

export interface State {
  filterDescription: string;
  filterExploration: string;
  filterMood: number | undefined;
  page: number;
  shouldShowFilter: boolean;
}

export const initialState: State = {
  filterDescription: "",
  filterExploration: "",
  filterMood: undefined,
  page: 0,
  shouldShowFilter: false,
};

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "filterDescription/set":
      return { ...state, filterDescription: action.payload, page: 0 };
    case "filterExploration/set":
      return { ...state, filterExploration: action.payload, page: 0 };
    case "filterMood/clear":
      return { ...state, filterMood: undefined, page: 0 };
    case "filterMood/set":
      return { ...state, filterMood: action.payload, page: 0 };
    case "page/set":
      return { ...state, page: action.payload };
    case "shouldShowFilter/set":
      if (action.payload)
        return {
          ...state,
          shouldShowFilter: action.payload,
        };
      return { ...initialState };
  }
};

export default function MoodList() {
  const moods = useSelector(normalizedMoodsSelector);
  const moodIdsByDate = useSelector(moodIdsByDateSelector);
  const [localState, localDispatch] = React.useReducer(reducer, initialState);
  const normalizedDescriptionWords = useSelector(
    normalizedDescriptionWordsSelector
  );

  const filterDescriptions = localState.filterDescription
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const normalizedFilterExploration = localState.filterExploration
    .trim()
    .toLowerCase();

  const filterFeatureAvailable = moods.allIds.length >= 5;

  const shouldFilter = Boolean(
    filterFeatureAvailable &&
      (localState.filterMood !== undefined ||
        filterDescriptions.length ||
        normalizedFilterExploration)
  );

  const filteredMoodIds = shouldFilter
    ? moods.allIds.filter((id) => {
        const mood = moods.byId[id];
        if (
          localState.filterMood !== undefined &&
          mood.mood !== localState.filterMood
        )
          return false;
        if (filterDescriptions.length) {
          const normalizedMoodDescription = mood.description?.toLowerCase();
          if (
            !filterDescriptions.every((description) =>
              normalizedMoodDescription?.includes(description)
            )
          )
            return false;
        }
        if (
          normalizedFilterExploration &&
          !mood.exploration?.toLowerCase().includes(normalizedFilterExploration)
        )
          return false;
        return true;
      })
    : moods.allIds;

  const filteredMoodsGroupedByDay = shouldFilter
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
    <>
      <Paper data-test-id={TEST_IDS.moodList}>
        <h2>Mood list</h2>
        {filterFeatureAvailable && (
          <>
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
                >
                  <option value="">Any mood</option>
                  {MOOD_INTEGERS.map((mood) => (
                    <option key={mood} value={mood}>
                      {mood}
                    </option>
                  ))}
                </Select>
                <ComboBox
                  label={FIELDS.description.label}
                  maxLength={DESCRIPTION_MAX_LENGTH}
                  onChange={(e) =>
                    localDispatch({
                      payload: e.target.value,
                      type: "filterDescription/set",
                    })
                  }
                  options={normalizedDescriptionWords}
                  required={false}
                  value={localState.filterDescription}
                />
                <TextField
                  label={FIELDS.exploration.label}
                  onChange={(e) =>
                    localDispatch({
                      payload: e.target.value,
                      type: "filterExploration/set",
                    })
                  }
                  required={false}
                  value={localState.filterExploration}
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
                  fromDate={day}
                  toDate={addDays(day, 1)}
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
    </>
  );
}
