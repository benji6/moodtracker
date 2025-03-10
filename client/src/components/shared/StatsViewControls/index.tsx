import { Button, Icon, Paper } from "eri";
import { ReactElement, useEffect, useState } from "react";
import EventIcon from "../EventIcon";
import { RootState } from "../../../store";
import { capitalizeFirstLetter } from "../../../utils";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export type ActiveView =
  | "exercise"
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
  const hasEventsWithLocationInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.hasEventsWithLocationInPeriod(
      state,
      dateFrom,
      dateTo,
    ),
  );
  const hasMeditationsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.hasMeditationsInPeriod(state, dateFrom, dateTo),
  );
  const hasMoodsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.hasMoodsInPeriod(state, dateFrom, dateTo),
  );
  const hasPushUpsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.hasPushUpsInPeriod(state, dateFrom, dateTo),
  );
  const hasSleepsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.hasSleepsInPeriod(state, dateFrom, dateTo),
  );
  const hasWeightsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.hasWeightsInPeriod(state, dateFrom, dateTo),
  );

  useEffect(() => {
    if (
      (!hasEventsWithLocationInPeriod &&
        (activeView === "location" || activeView === "weather")) ||
      (!hasMeditationsInPeriod && activeView === "meditation") ||
      (!hasSleepsInPeriod && activeView === "sleep") ||
      (!hasWeightsInPeriod && activeView === "weight")
    )
      setActiveView("mood");
  }, [
    activeView,
    hasEventsWithLocationInPeriod,
    hasMeditationsInPeriod,
    hasSleepsInPeriod,
    hasWeightsInPeriod,
    onActiveViewChange,
  ]);

  useEffect(
    () => onActiveViewChange(activeView),
    [activeView, onActiveViewChange],
  );

  const buttons: { view: ActiveView; icon: ReactElement }[] = [];

  if (hasMoodsInPeriod)
    buttons.push({
      view: "mood",
      icon: <EventIcon eventType="moods" margin="end" />,
    });
  if (hasPushUpsInPeriod)
    buttons.push({
      view: "exercise",
      icon: <EventIcon eventType="runs" margin="end" />,
    });
  if (hasEventsWithLocationInPeriod) {
    buttons.push({
      view: "location",
      icon: <Icon name="location" margin="end" />,
    });
    buttons.push({
      view: "weather",
      icon: <Icon name="partly-cloudy-day" margin="end" />,
    });
  }
  if (hasSleepsInPeriod)
    buttons.push({
      view: "sleep",
      icon: <EventIcon eventType="sleeps" margin="end" />,
    });
  if (hasWeightsInPeriod)
    buttons.push({
      view: "weight",
      icon: <EventIcon eventType="weights" margin="end" />,
    });
  if (hasMeditationsInPeriod)
    buttons.push({
      view: "meditation",
      icon: <EventIcon eventType="meditations" margin="end" />,
    });

  if (!buttons.length) return;

  return (
    <Paper>
      <h3>Select data to view</h3>
      <div className="m-button-grid">
        {buttons.map(({ icon, view }) => (
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
