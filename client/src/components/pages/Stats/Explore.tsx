import * as React from "react";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import { Paper, Spinner, DateField } from "eri";
import {
  roundDateUp,
  roundDateDown,
  formatIsoDateInLocalTimezone,
  getIdsInInterval,
  computeSecondsMeditatedInInterval,
} from "../../../utils";
import MoodChartForPeriod from "./MoodChartForPeriod";
import {
  eventsSelector,
  hasMeditationsSelector,
  normalizedMeditationsSelector,
  normalizedMoodsSelector,
} from "../../../selectors";
import { useSelector } from "react-redux";
import GetStartedCta from "../../shared/GetStartedCta";
import { TIME } from "../../../constants";
import MoodByHourForPeriod from "./MoodByHourForPeriod";
import { dayMonthFormatter } from "../../../formatters/dateTimeFormatters";
import MoodByWeekdayForPeriod from "./MoodByWeekdayForPeriod";
import MoodFrequencyForPeriod from "./MoodFrequencyForPeriod";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import formatDurationFromSeconds from "../../../formatters/formatDurationFromSeconds";
import LocationsForPeriod from "./LocationsForPeriod";

const MILLISECONDS_IN_A_DAY = 86400000;
const MILLISECONDS_IN_HALF_A_DAY = MILLISECONDS_IN_A_DAY / 2;
const X_LABELS_COUNT = 4; // must be at least 2

const convertDateToLabel = (date: Date): [number, string] => [
  Number(date),
  dayMonthFormatter.format(date),
];

const createXLabels = (
  domain: [number, number],
  now: number
): [number, string][] => {
  const labels: [number, string][] = [];

  labels.push(convertDateToLabel(roundDateUp(new Date(domain[0]))));

  const roundFn =
    now - roundDateDown(new Date(now)).getTime() < MILLISECONDS_IN_HALF_A_DAY
      ? roundDateUp
      : roundDateDown;

  for (let i = 1; i < X_LABELS_COUNT - 1; i++) {
    const label = convertDateToLabel(
      roundFn(
        new Date(
          domain[0] + ((domain[1] - domain[0]) * i) / (X_LABELS_COUNT - 1)
        )
      )
    );
    if (!labels.some(([x]) => x === label[0])) labels.push(label);
  }

  const label = convertDateToLabel(roundDateDown(new Date(domain[1])));
  if (!labels.some(([x]) => x === label[0])) labels.push(label);
  return labels;
};

export default function Explore() {
  const dateNow = new Date();
  const [dateFrom, setDateFrom] = React.useState(
    roundDateDown(subDays(dateNow, TIME.daysPerWeek))
  );
  const maxDate = roundDateUp(dateNow);
  const [dateTo, setDateTo] = React.useState(maxDate);
  const events = useSelector(eventsSelector);
  const meditations = useSelector(normalizedMeditationsSelector);
  const showMeditationStats = useSelector(hasMeditationsSelector);
  const moods = useSelector(normalizedMoodsSelector);

  if (!events.hasLoadedFromServer) return <Spinner />;
  if (!moods.allIds.length)
    return (
      <Paper.Group>
        <GetStartedCta />
      </Paper.Group>
    );

  const domain: [number, number] = [dateFrom.getTime(), dateTo.getTime()];
  const meditationIdsInPeriod = getIdsInInterval(
    meditations.allIds,
    dateFrom,
    dateTo
  );
  const moodIdsInPeriod = getIdsInInterval(moods.allIds, dateFrom, dateTo);

  return (
    <Paper.Group>
      <Paper>
        <h2>Explore</h2>
        <MoodGradientForPeriod fromDate={dateFrom} toDate={dateTo} />
        <DateField
          label="From"
          max={formatIsoDateInLocalTimezone(subDays(dateTo, 1))}
          min={formatIsoDateInLocalTimezone(new Date(moods.allIds[0]))}
          onChange={(e) => {
            const date = new Date(e.target.value);
            if (
              date < roundDateDown(dateTo) &&
              date >= roundDateDown(new Date(moods.allIds[0]))
            )
              setDateFrom(new Date(e.target.value));
          }}
          value={formatIsoDateInLocalTimezone(dateFrom)}
        />
        <DateField
          label="To"
          max={formatIsoDateInLocalTimezone(maxDate)}
          min={formatIsoDateInLocalTimezone(addDays(dateFrom, 1))}
          onChange={(e) => {
            const date = new Date(e.target.value);
            if (date > dateFrom && date <= maxDate)
              setDateTo(new Date(e.target.value));
          }}
          value={formatIsoDateInLocalTimezone(dateTo)}
        />
      </Paper>
      {!meditationIdsInPeriod.length && !moodIdsInPeriod.length ? (
        <Paper>
          <p>No data for the selected period</p>
        </Paper>
      ) : (
        <>
          {moodIdsInPeriod.length ? (
            <>
              <Paper>
                <h3>Mood chart</h3>
                <MoodChartForPeriod
                  fromDate={dateFrom}
                  hidePoints
                  toDate={dateTo}
                  xLabels={createXLabels(domain, dateNow.getTime())}
                />
              </Paper>
              <MoodByWeekdayForPeriod fromDate={dateFrom} toDate={dateTo} />
              <MoodByHourForPeriod fromDate={dateFrom} toDate={dateTo} />
              <MoodFrequencyForPeriod fromDate={dateFrom} toDate={dateTo} />
              <LocationsForPeriod fromDate={dateFrom} toDate={dateTo} />
            </>
          ) : (
            <Paper>
              <p>No mood data for the selected period</p>
            </Paper>
          )}
          {showMeditationStats && (
            <Paper>
              <h3>Time meditated</h3>
              <p>
                {formatDurationFromSeconds(
                  computeSecondsMeditatedInInterval(
                    meditations,
                    dateFrom,
                    dateTo
                  )
                )}
              </p>
            </Paper>
          )}
        </>
      )}
    </Paper.Group>
  );
}
