import { Paper, Select, Spinner } from "eri";
import { ReactElement, useReducer, useState } from "react";
import StatsViewControls, {
  ActiveView,
} from "../../../shared/StatsViewControls";
import { addDays, subDays } from "date-fns";
import DateRangeSelector from "../../../shared/DateRangeSelector";
import { FluxStandardAction } from "../../../../typeUtilities";
import GetStartedCta from "../../../shared/GetStartedCta";
import LocationForPeriod from "../LocationForPeriod";
import MeditationImpactForPeriod from "../MeditationImpactForPeriod";
import MoodByHourForPeriod from "../MoodByHourForPeriod";
import MoodBySleepForPeriod from "../MoodBySleepForPeriod";
import MoodByWeekdayForPeriod from "../MoodByWeekdayForPeriod";
import MoodChartForPeriod from "../MoodChartForPeriod";
import MoodCloudForPeriod from "../MoodCloudForPeriod";
import MoodFrequencyForPeriod from "../MoodFrequencyForPeriod";
import MoodGradientForPeriod from "../MoodGradientForPeriod";
import SummaryForPeriod from "./SummaryForPeriod";
import { TIME } from "../../../../constants";
import WeatherForPeriod from "../WeatherForPeriod";
import WeightChartForPeriod from "../WeightChartForPeriod";
import eventsSlice from "../../../../store/eventsSlice";
import { roundDateDown } from "../../../../utils";
import { scaleTime } from "d3-scale";
import { useSelector } from "react-redux";
import ExerciseForPeriod from "../ExerciseForPeriod";

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
  const [activeView, setActiveView] = useState<ActiveView>("mood");
  const dateNow = new Date();
  const normalizedMoods = useSelector(eventsSlice.selectors.normalizedMoods);
  const firstEventExperiencedAt = useSelector(
    eventsSlice.selectors.firstEventExperiencedAt,
  );

  if (!firstEventExperiencedAt) return;
  const firstEventExperiencedAtRoundedDown = roundDateDown(
    new Date(firstEventExperiencedAt),
  );
  const dateToToday = roundDateDown(dateNow);

  const calculateDateFrom = (days: number) => {
    const dateFrom = subDays(dateToToday, days - 1);
    return dateFrom < firstEventExperiencedAtRoundedDown
      ? firstEventExperiencedAtRoundedDown
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
                dateFrom: firstEventExperiencedAtRoundedDown,
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

  if (!eventsHasLoadedFromServer) return <Spinner />;
  if (!normalizedMoods.allIds.length)
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

  let view: ReactElement;
  switch (activeView) {
    case "exercise":
      view = (
        <ExerciseForPeriod dateFrom={localState.dateFrom} dateTo={dateTo} />
      );
      break;
    case "location":
      view = (
        <LocationForPeriod dateFrom={localState.dateFrom} dateTo={dateTo} />
      );
      break;
    case "meditation":
      view = (
        <MeditationImpactForPeriod
          dateFrom={localState.dateFrom}
          dateTo={dateTo}
        />
      );
      break;
    case "mood":
      view = (
        <>
          <SummaryForPeriod
            dateFrom={localState.dateFrom}
            dateTo={localState.displayDateTo}
          />
          <MoodChartForPeriod
            dateFrom={xTicks[0]}
            dateTo={xTicks[xTicks.length - 1]}
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
        </>
      );
      break;
    case "sleep":
      view = (
        <MoodBySleepForPeriod dateFrom={localState.dateFrom} dateTo={dateTo} />
      );
      break;
    case "weather":
      view = (
        <WeatherForPeriod
          centerXAxisLabels
          dateFrom={localState.dateFrom}
          dateTo={dateTo}
          xLabels={xLabels}
        />
      );
      break;
    case "weight":
      view = (
        <WeightChartForPeriod
          centerXAxisLabels
          dateFrom={localState.dateFrom}
          dateTo={dateTo}
          xLabels={xLabels}
        />
      );
  }

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
      <StatsViewControls
        dateFrom={localState.dateFrom}
        dateTo={dateTo}
        onActiveViewChange={setActiveView}
      />
      {view}
    </Paper.Group>
  );
}
