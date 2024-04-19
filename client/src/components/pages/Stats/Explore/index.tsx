import { Paper, Select, Spinner } from "eri";
import { addDays, subDays } from "date-fns";
import DateRangeSelector from "../../../shared/DateRangeSelector";
import { FluxStandardAction } from "../../../../typeUtilities";
import GetStartedCta from "../../../shared/GetStartedCta";
import LocationsForPeriod from "../LocationsForPeriod";
import MeditationImpactForPeriod from "../MeditationImpactForPeriod";
import MoodByHourForPeriod from "../MoodByHourForPeriod";
import MoodByLocationForPeriod from "../MoodByLocationForPeriod";
import MoodBySleepForPeriod from "../MoodBySleepForPeriod";
import MoodByWeekdayForPeriod from "../MoodByWeekdayForPeriod";
import MoodChartForPeriod from "../MoodChartForPeriod";
import MoodCloudForPeriod from "../MoodCloudForPeriod";
import MoodFrequencyForPeriod from "../MoodFrequencyForPeriod";
import MoodGradientForPeriod from "../MoodGradientForPeriod";
import MoodSummaryForPeriod from "./MoodSummaryForPeriod";
import { RootState } from "../../../../store";
import { TIME } from "../../../../constants";
import WeatherForPeriod from "../WeatherForPeriod";
import WeightChartForPeriod from "../WeightChartForPeriod";
import eventsSlice from "../../../../store/eventsSlice";
import { roundDateDown } from "../../../../utils";
import { scaleTime } from "d3-scale";
import { useReducer } from "react";
import { useSelector } from "react-redux";

const DATE_RANGE_OPTIONS = [
  "Today",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "Last half year",
  "Last year",
  "All time",
  "Custom",
] as const;
type DateRangeString = (typeof DATE_RANGE_OPTIONS)[number];

type Action =
  | FluxStandardAction<"dateFrom/set", Date>
  | FluxStandardAction<"dateRange/set", DateRangeString>
  | FluxStandardAction<"displayDateTo/set", Date>;

interface State {
  dateFrom: Date;
  dateRange: DateRangeString;
  displayDateTo: Date;
}

export default function Explore() {
  const dateNow = new Date();
  const moods = useSelector(eventsSlice.selectors.normalizedMoods);
  const allNormalizedTrackedCategories = useSelector(
    eventsSlice.selectors.allNormalizedTrackedCategories,
  );
  const firstTrackedCategoryDateRoundedDown = roundDateDown(
    new Date(allNormalizedTrackedCategories.allIds[0]),
  );
  const dateToToday = roundDateDown(dateNow);

  const calculateDateFrom = (days: number) => {
    const dateFrom = subDays(dateToToday, days - 1);
    return dateFrom < firstTrackedCategoryDateRoundedDown
      ? firstTrackedCategoryDateRoundedDown
      : dateFrom;
  };

  const initialState: State = {
    dateRange: `Last ${TIME.daysPerWeek} days`,
    dateFrom: calculateDateFrom(TIME.daysPerWeek),
    displayDateTo: dateToToday,
  };

  const [localState, localDispatch] = useReducer(
    (state: State, action: Action): State => {
      switch (action.type) {
        case "dateFrom/set":
          return {
            ...state,
            dateFrom: action.payload,
            dateRange: "Custom",
          };
        case "displayDateTo/set":
          return {
            ...state,
            dateRange: "Custom",
            displayDateTo: action.payload,
          };
        case "dateRange/set":
          switch (action.payload) {
            case "All time":
              return {
                dateRange: action.payload,
                dateFrom: firstTrackedCategoryDateRoundedDown,
                displayDateTo: dateToToday,
              };
            case "Custom":
              return { ...state, dateRange: action.payload };
            case "Last 7 days":
              return {
                dateRange: action.payload,
                dateFrom: calculateDateFrom(TIME.daysPerWeek),
                displayDateTo: dateToToday,
              };
            case "Last 30 days":
              return {
                dateRange: action.payload,
                dateFrom: calculateDateFrom(30),
                displayDateTo: dateToToday,
              };
            case "Last 90 days":
              return {
                dateRange: action.payload,
                dateFrom: calculateDateFrom(90),
                displayDateTo: dateToToday,
              };
            case "Last half year":
              return {
                dateRange: action.payload,
                dateFrom: calculateDateFrom(183),
                displayDateTo: dateToToday,
              };
            case "Last year":
              return {
                dateRange: action.payload,
                dateFrom: calculateDateFrom(365),
                displayDateTo: dateToToday,
              };
            case "Today":
              return {
                dateRange: action.payload,
                dateFrom: dateToToday,
                displayDateTo: dateToToday,
              };
          }
      }
    },
    initialState,
  );

  const eventsHasLoadedFromServer = useSelector(
    eventsSlice.selectors.hasLoadedFromServer,
  );

  const dateTo = addDays(localState.displayDateTo, 1);
  const moodIdsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.moodIdsInPeriod(state, localState.dateFrom, dateTo),
  );

  if (!eventsHasLoadedFromServer) return <Spinner />;
  if (!moods.allIds.length)
    return (
      <Paper.Group>
        <GetStartedCta />
      </Paper.Group>
    );

  const x = scaleTime()
    .domain([localState.dateFrom.getTime(), dateTo.getTime()])
    .nice(6);
  const xTicks = x.ticks(6);
  const xLabels = xTicks.map(x.tickFormat());

  return (
    <Paper.Group>
      <Paper>
        <h2>Explore</h2>
        <MoodGradientForPeriod dateFrom={localState.dateFrom} dateTo={dateTo} />
        <Select
          label="Date range"
          onChange={(e) =>
            localDispatch({
              payload: e.target.value as DateRangeString,
              type: "dateRange/set",
            })
          }
          value={localState.dateRange}
        >
          {DATE_RANGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <DateRangeSelector
          dateFrom={localState.dateFrom}
          dateTo={localState.displayDateTo}
          setDateFrom={(payload) =>
            localDispatch({ payload, type: "dateFrom/set" })
          }
          setDateTo={(payload) =>
            localDispatch({ payload, type: "displayDateTo/set" })
          }
        />
      </Paper>
      <MoodSummaryForPeriod
        dateFrom={localState.dateFrom}
        dateTo={localState.displayDateTo}
      />
      {moodIdsInPeriod.length ? (
        <>
          <MoodChartForPeriod
            dateFrom={xTicks[0]}
            dateTo={xTicks.at(-1)!}
            hidePoints
            xLabels={xLabels}
          />
          <MoodByWeekdayForPeriod
            dateFrom={localState.dateFrom}
            dateTo={dateTo}
          />
          <MoodByHourForPeriod dateFrom={localState.dateFrom} dateTo={dateTo} />
          <MoodCloudForPeriod dateFrom={localState.dateFrom} dateTo={dateTo} />
          <MoodFrequencyForPeriod
            dateFrom={localState.dateFrom}
            dateTo={dateTo}
          />
          <MoodByLocationForPeriod
            dateFrom={localState.dateFrom}
            dateTo={dateTo}
          />
          <WeatherForPeriod
            dateFrom={xTicks[0]}
            dateTo={xTicks.at(-1)!}
            xLabels={xLabels}
          />
        </>
      ) : null}
      <MoodBySleepForPeriod dateFrom={localState.dateFrom} dateTo={dateTo} />
      <WeightChartForPeriod
        dateFrom={xTicks[0]}
        dateTo={xTicks.at(-1)!}
        xLabels={xLabels}
      />
      <MeditationImpactForPeriod
        dateFrom={localState.dateFrom}
        dateTo={dateTo}
      />
      <LocationsForPeriod dateFrom={localState.dateFrom} dateTo={dateTo} />
    </Paper.Group>
  );
}
