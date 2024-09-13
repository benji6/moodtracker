import { Button, Icon, Paper } from "eri";
import { useEffect, useState } from "react";
import EventIcon from "../EventIcon";
import { RootState } from "../../../store";
import { capitalizeFirstLetter } from "../../../utils";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export type ActiveView =
  | "location"
  | "meditation"
  | "mood"
  | "sleep"
  | "weather"
  | "weight";

interface Props {
  dateFrom: Date;
  dateTo: Date;
  onActiveViewChange: (activeView: ActiveView) => void;
}

export default function StatsViewControls({
  dateFrom,
  dateTo,
  onActiveViewChange,
}: Props) {
  const [activeView, setActiveView] = useState<ActiveView>("mood");
  const hasMeditationsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.hasMeditationsInPeriod(state, dateFrom, dateTo),
  );
  const hasEventsWithLocationInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.hasEventsWithLocationInPeriod(
      state,
      dateFrom,
      dateTo,
    ),
  );

  useEffect(
    () => onActiveViewChange(activeView),
    [activeView, onActiveViewChange],
  );

  return (
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
            {
              view: "meditation",
              icon: <EventIcon eventType="meditations" margin="end" />,
            },
          ] as const
        )
          .filter(({ view }) => hasMeditationsInPeriod || view !== "meditation")
          .filter(
            ({ view }) => hasEventsWithLocationInPeriod || view !== "location",
          )
          .map(({ icon, view }) => (
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
  );
}
