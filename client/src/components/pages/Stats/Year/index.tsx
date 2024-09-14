import "./style.css";
import { Icon, Paper } from "eri";
import { ReactElement, useState } from "react";
import StatsViewControls, {
  ActiveView,
} from "../../../shared/StatsViewControls";
import { addMonths, addYears } from "date-fns";
import {
  monthNarrowFormatter,
  yearFormatter,
} from "../../../../formatters/dateTimeFormatters";
import { Link } from "react-router-dom";
import LocationForPeriod from "../LocationForPeriod";
import MeditationByMonthForPeriod from "./MeditationByMonthForPeriod";
import MeditationImpactForPeriod from "../MeditationImpactForPeriod";
import MoodBySleepForPeriod from "../MoodBySleepForPeriod";
import MoodGradientForPeriod from "../MoodGradientForPeriod";
import MoodViewForYear from "./MoodViewForYear";
import PrevNextControls from "../../../shared/PrevNextControls";
import SleepByMonthForPeriod from "./SleepByMonthForPeriod";
import WeatherForPeriod from "../WeatherForPeriod";
import WeightChartForPeriod from "../WeightChartForPeriod";
import { formatIsoYearInLocalTimezone } from "../../../../utils";
import withStatsPage from "../../../hocs/withStatsPage";

interface Props {
  date: Date;
  nextDate: Date;
  prevDate: Date;
  showNext: boolean;
  showPrevious: boolean;
}

function Year({ date, nextDate, prevDate, showNext, showPrevious }: Props) {
  const [activeView, setActiveView] = useState<ActiveView>("mood");
  const xLabels: string[] = [...Array(12).keys()].map((n) =>
    monthNarrowFormatter.format(addMonths(date, n)),
  );

  let view: ReactElement;
  switch (activeView) {
    case "location":
      view = <LocationForPeriod dateFrom={date} dateTo={nextDate} />;
      break;
    case "meditation":
      view = (
        <>
          <MeditationByMonthForPeriod dateFrom={date} dateTo={nextDate} />
          <MeditationImpactForPeriod dateFrom={date} dateTo={nextDate} />
        </>
      );
      break;
    case "mood":
      view = (
        <MoodViewForYear
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
          <SleepByMonthForPeriod dateFrom={date} dateTo={nextDate} />
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
        <h2>{yearFormatter.format(date)}</h2>
        <MoodGradientForPeriod dateFrom={date} dateTo={nextDate} />
        <PrevNextControls>
          {showPrevious ? (
            <Link to={`../${formatIsoYearInLocalTimezone(prevDate)}`}>
              <Icon margin="end" name="left" />
              {yearFormatter.format(prevDate)}
            </Link>
          ) : (
            <span />
          )}
          {showNext && (
            <Link to={`../${formatIsoYearInLocalTimezone(nextDate)}`}>
              {yearFormatter.format(nextDate)}
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
  addPeriod: addYears,
  Component: Year,
  dateRegex: /^\d{4}$/,
});
