import { Button, Icon, Paper } from "eri";
import { useEffect, useState } from "react";
import EventIcon from "../EventIcon";
import { capitalizeFirstLetter } from "../../../utils";

export type ActiveView =
  | "location"
  | "meditation"
  | "mood"
  | "sleep"
  | "weather"
  | "weight";

interface Props {
  onActiveViewChange: (activeView: ActiveView) => void;
}

export default function StatsViewControls({ onActiveViewChange }: Props) {
  const [activeView, setActiveView] = useState<ActiveView>("mood");

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
  );
}
