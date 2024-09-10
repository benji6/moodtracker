import "./style.css";
import { Button, Icon, Paper } from "eri";
import { ReactElement, useState } from "react";
import { addMonths, addYears } from "date-fns";
import {
  capitalizeFirstLetter,
  formatIsoYearInLocalTimezone,
} from "../../../../utils";
import {
  monthNarrowFormatter,
  yearFormatter,
} from "../../../../formatters/dateTimeFormatters";
import EventIcon from "../../../shared/EventIcon";
import { Link } from "react-router-dom";
import LocationsForPeriod from "../LocationsForPeriod";
import MeditationByMonthForPeriod from "./MeditationByMonthForPeriod";
import MeditationImpactForPeriod from "../MeditationImpactForPeriod";
import MoodByLocationForPeriod from "../MoodByLocationForPeriod";
import MoodBySleepForPeriod from "../MoodBySleepForPeriod";
import MoodGradientForPeriod from "../MoodGradientForPeriod";
import MoodViewForYear from "./MoodViewForYear";
import PrevNextControls from "../../../shared/PrevNextControls";
import SleepByMonthForPeriod from "./SleepByMonthForPeriod";
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

function Year({ date, nextDate, prevDate, showNext, showPrevious }: Props) {
  const [activeView, setActiveView] = useState<
    "location" | "meditation" | "mood" | "sleep" | "weather" | "weight"
  >("mood");
  const xLabels: string[] = [...Array(12).keys()].map((n) =>
    monthNarrowFormatter.format(addMonths(date, n)),
  );

  let view: ReactElement;
  switch (activeView) {
    case "location":
      view = (
        <>
          <MoodByLocationForPeriod dateFrom={date} dateTo={nextDate} />
          <LocationsForPeriod dateFrom={date} dateTo={nextDate} />
        </>
      );
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
      <Paper>
        <h3>Select data to view</h3>
        <div className="m-button-grid">
          {(
            [
              {
                view: "mood",
                icon: <EventIcon eventType="moods" margin="end" />,
              },
              {
                view: "meditation",
                icon: <EventIcon eventType="meditations" margin="end" />,
              },
              {
                view: "location",
                icon: <Icon name="location" margin="end" />,
              },
              {
                view: "weather",
                icon: <Icon name="partly-cloudy-day" margin="end" />,
              },
              {
                view: "sleep",
                icon: <EventIcon eventType="sleeps" margin="end" />,
              },
              {
                view: "weight",
                icon: <EventIcon eventType="weights" margin="end" />,
              },
            ] as const
          ).map(({ icon, view }) => (
            <Button
              key={view}
              onClick={() => setActiveView(view)}
              variant={activeView === view ? "primary" : "secondary"}
            >
              {icon}
              {capitalizeFirstLetter(view)}
            </Button>
          ))}
        </div>
      </Paper>
      {view}
    </Paper.Group>
  );
}

export default withStatsPage({
  addPeriod: addYears,
  Component: Year,
  dateRegex: /^\d{4}$/,
});
