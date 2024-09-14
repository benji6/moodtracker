import { Icon, Paper, SubHeading } from "eri";
import { ReactElement, useState } from "react";
import StatsViewControls, {
  ActiveView,
} from "../../../shared/StatsViewControls";
import {
  WEEK_OPTIONS,
  formatWeek,
  monthLongFormatter,
  weekdayShortFormatter,
  yearFormatter,
} from "../../../../formatters/dateTimeFormatters";
import { addDays, addWeeks, startOfWeek, subDays } from "date-fns";
import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
} from "../../../../utils";
import { Link } from "react-router-dom";
import LocationForPeriod from "../LocationForPeriod";
import MeditationImpactForPeriod from "../MeditationImpactForPeriod";
import MoodBySleepForPeriod from "../MoodBySleepForPeriod";
import MoodGradientForPeriod from "../MoodGradientForPeriod";
import MoodViewForWeek from "./MoodViewForWeek";
import PrevNextControls from "../../../shared/PrevNextControls";
import SleepChartForWeek from "../SleepChartForWeek";
import { TIME } from "../../../../constants";
import WeatherForPeriod from "../WeatherForPeriod";
import WeightChartForPeriod from "../WeightChartForPeriod";
import withStatsPage from "../../../hocs/withStatsPage";

interface Props {
  date: Date;
  nextDate: Date;
  prevDate: Date;
  showNext: boolean;
  showPrevious: boolean;
}

function Week({ date, nextDate, prevDate, showNext, showPrevious }: Props) {
  const [activeView, setActiveView] = useState<ActiveView>("mood");

  const lastDayOfWeek = subDays(nextDate, 1);

  const xLabels: string[] = [];
  for (let i = 0; i < TIME.daysPerWeek; i++)
    xLabels.push(weekdayShortFormatter.format(addDays(date, i)));

  let view: ReactElement;
  switch (activeView) {
    case "location":
      view = <LocationForPeriod dateFrom={date} dateTo={nextDate} />;
      break;
    case "meditation":
      view = <MeditationImpactForPeriod dateFrom={date} dateTo={nextDate} />;
      break;
    case "mood":
      view = (
        <MoodViewForWeek
          date={date}
          nextDate={nextDate}
          prevDate={prevDate}
          xLabels={xLabels}
        />
      );
      break;
    case "sleep":
      view = (
        <>
          <SleepChartForWeek dateFrom={date} />
          <MoodBySleepForPeriod dateFrom={date} dateTo={nextDate} />
        </>
      );
      break;
    case "weather":
      view = (
        <WeatherForPeriod
          centerXAxisLabels
          dateFrom={date}
          dateTo={nextDate}
          xLabels={xLabels}
        />
      );
      break;
    case "weight":
      view = (
        <WeightChartForPeriod
          centerXAxisLabels
          dateFrom={date}
          dateTo={nextDate}
          xLabels={xLabels}
        />
      );
  }

  return (
    <Paper.Group>
      <Paper>
        <h2>
          {formatWeek(date)}
          <SubHeading>
            <Link
              to={`../../months/${formatIsoMonthInLocalTimezone(
                lastDayOfWeek,
              )}`}
            >
              {monthLongFormatter.format(lastDayOfWeek)}
            </Link>{" "}
            |{" "}
            <Link
              to={`../../years/${formatIsoYearInLocalTimezone(lastDayOfWeek)}`}
            >
              {yearFormatter.format(lastDayOfWeek)}
            </Link>
          </SubHeading>
        </h2>
        <MoodGradientForPeriod dateFrom={date} dateTo={nextDate} />
        <PrevNextControls>
          {showPrevious ? (
            <Link to={`../${formatIsoDateInLocalTimezone(prevDate)}`}>
              <Icon margin="end" name="left" />
              Previous week
            </Link>
          ) : (
            <span />
          )}
          {showNext && (
            <Link to={`../${formatIsoDateInLocalTimezone(nextDate)}`}>
              Next week
              <Icon margin="start" name="right" />
            </Link>
          )}
        </PrevNextControls>
      </Paper>
      <StatsViewControls
        dateFrom={date}
        dateTo={nextDate}
        onActiveViewChange={setActiveView}
      />
      {view}
    </Paper.Group>
  );
}

export default withStatsPage({
  addPeriod: addWeeks,
  adjustDate: (date) => startOfWeek(date, WEEK_OPTIONS),
  Component: Week,
});
