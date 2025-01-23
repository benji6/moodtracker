import { Icon, Paper, SubHeading } from "eri";
import { ReactElement, useState } from "react";
import StatsViewControls, {
  ActiveView,
} from "../../../shared/StatsViewControls";
import { addDays, addMonths, differenceInCalendarDays } from "date-fns";
import {
  dayMonthFormatter,
  monthLongFormatter,
  yearFormatter,
} from "../../../../formatters/dateTimeFormatters";
import {
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
} from "../../../../utils";
import { Link } from "react-router-dom";
import LocationForPeriod from "../LocationForPeriod";
import MeditationImpactForPeriod from "../MeditationImpactForPeriod";
import MoodBySleepForPeriod from "../MoodBySleepForPeriod";
import MoodGradientForPeriod from "../MoodGradientForPeriod";
import MoodViewForMonth from "./MoodViewForMonth";
import PrevNextControls from "../../../shared/PrevNextControls";
import WeatherForPeriod from "../WeatherForPeriod";
import WeightChartForPeriod from "../WeightChartForPeriod";
import withStatsPage from "../../../hocs/withStatsPage";
import ExerciseForPeriod from "../ExerciseForPeriod";

const X_LABELS_COUNT = 5;

interface Props {
  date: Date;
  nextDate: Date;
  prevDate: Date;
  showNext: boolean;
  showPrevious: boolean;
}

function Month({ date, nextDate, prevDate, showNext, showPrevious }: Props) {
  const [activeView, setActiveView] = useState<ActiveView>("mood");
  const monthLength = differenceInCalendarDays(nextDate, date);

  const xLabels: string[] = [];
  for (let i = 0; i < X_LABELS_COUNT; i++)
    xLabels.push(
      dayMonthFormatter.format(
        addDays(date, Math.round((i * monthLength) / (X_LABELS_COUNT - 1))),
      ),
    );

  let view: ReactElement;
  switch (activeView) {
    case "exercise":
      view = <ExerciseForPeriod dateFrom={date} dateTo={nextDate} />;
      break;
    case "location":
      view = <LocationForPeriod dateFrom={date} dateTo={nextDate} />;
      break;
    case "meditation":
      view = <MeditationImpactForPeriod dateFrom={date} dateTo={nextDate} />;
      break;
    case "mood":
      view = (
        <MoodViewForMonth
          date={date}
          nextDate={nextDate}
          prevDate={prevDate}
          xLabels={xLabels}
        />
      );
      break;
    case "sleep":
      view = <MoodBySleepForPeriod dateFrom={date} dateTo={nextDate} />;
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
          {monthLongFormatter.format(date)}
          <SubHeading>
            <Link to={`../../years/${formatIsoYearInLocalTimezone(date)}`}>
              {yearFormatter.format(date)}
            </Link>
          </SubHeading>
        </h2>
        <MoodGradientForPeriod dateFrom={date} dateTo={nextDate} />
        <PrevNextControls>
          {showPrevious ? (
            <Link to={`../${formatIsoMonthInLocalTimezone(prevDate)}`}>
              <Icon margin="end" name="left" />
              {monthLongFormatter.format(prevDate)}
            </Link>
          ) : (
            <span />
          )}
          {showNext && (
            <Link to={`../${formatIsoMonthInLocalTimezone(nextDate)}`}>
              {monthLongFormatter.format(nextDate)}
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
  addPeriod: addMonths,
  dateRegex: /^\d{4}-\d{2}$/,
  Component: Month,
});
