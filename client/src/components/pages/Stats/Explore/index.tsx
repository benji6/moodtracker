import { Paper, Select, Spinner } from "eri";
import { addDays, differenceInDays, subDays } from "date-fns";
import { roundDateDown, roundDateUp } from "../../../../utils";
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
import { dayMonthFormatter } from "../../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../../store/eventsSlice";
import { useReducer } from "react";
import { useSelector } from "react-redux";

const MILLISECONDS_IN_HALF_A_DAY = TIME.millisecondsPerDay / 2;

const getFactors = (n: number): number[] => {
  const factors = [];
  for (let i = 1; i <= n; i++) if (!(n % i)) factors.push(i);
  return factors;
};

const createXLabels = (domain: [number, number], now: number): string[] => {
  const numberOfDays = differenceInDays(domain[1], domain[0]);
  const factors = getFactors(numberOfDays);
  const factorsValidForLabelCount = factors.filter((n) => n <= 10 && n > 1);
  const labelCount = Math.max(2, ...factorsValidForLabelCount) + 1;

  const roundFn =
    now - roundDateDown(new Date(now)).getTime() < MILLISECONDS_IN_HALF_A_DAY
      ? roundDateUp
      : roundDateDown;

  return [...Array(labelCount).keys()].map((n) =>
    dayMonthFormatter.format(
      roundFn(
        new Date(domain[0] + ((domain[1] - domain[0]) * n) / (labelCount - 1)),
      ),
    ),
  );
};

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

  const domain: [number, number] = [
    localState.dateFrom.getTime(),
    dateTo.getTime(),
  ];
  const xLabels = createXLabels(domain, dateNow.getTime());

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
            dateFrom={localState.dateFrom}
            hidePoints
            dateTo={dateTo}
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
            dateFrom={localState.dateFrom}
            dateTo={dateTo}
            xLabels={xLabels}
          />
        </>
      ) : null}
      <MoodBySleepForPeriod dateFrom={localState.dateFrom} dateTo={dateTo} />
      <WeightChartForPeriod
        dateFrom={localState.dateFrom}
        dateTo={dateTo}
        xLabels={createXLabels(domain, dateNow.getTime())}
      />
      <MeditationImpactForPeriod
        dateFrom={localState.dateFrom}
        dateTo={dateTo}
      />
      <LocationsForPeriod dateFrom={localState.dateFrom} dateTo={dateTo} />
    </Paper.Group>
  );
}
