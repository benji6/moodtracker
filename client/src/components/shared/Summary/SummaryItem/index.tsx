import "./style.css";
import { Card, Icon } from "eri";
import EventIcon from "../../EventIcon";
import { EventTypeCategories } from "../../../../types";
import MoodBar from "../../MoodBar";
import { integerFormatter } from "../../../../formatters/numberFormatters";
import { moodToColor } from "../../../../utils";

interface Props {
  currentValue?: number;
  displayTrendSentiment?: boolean;
  eventType: EventTypeCategories;
  format?(n: number): string;
  heading: string;
  periodType?: "day" | "month" | "week" | "year";
  previousValue?: number;
}

export default function SummaryItem({
  currentValue,
  displayTrendSentiment = false,
  eventType,
  format = integerFormatter.format,
  heading,
  periodType,
  previousValue,
}: Props) {
  if (currentValue === undefined) return;
  const round = (n: number): number =>
    n ? Math.round((n + Number.EPSILON) * 10) / 10 : Math.round(n);
  const roundedCurrentValue = round(currentValue);
  const roundedPreviousValue =
    previousValue === undefined ? undefined : round(previousValue);
  const difference =
    roundedPreviousValue === undefined
      ? undefined
      : round(roundedCurrentValue - roundedPreviousValue);

  let color = "var(--color-balance)";
  if (eventType === "moods") color = moodToColor(currentValue);
  else if (displayTrendSentiment && difference) {
    if (difference > 0) color = "var(--color-positive)";
    else color = "var(--color-negative)";
  }

  return (
    <Card color={color}>
      <div className="m-summary-item">
        <div className="m-summary-item__heading">
          <span className="m-summary-item__icon">
            <EventIcon eventType={eventType} margin="end" />
          </span>
          {heading}
        </div>
        <div className="m-summary-item__value">{format(currentValue)}</div>
        {eventType === "moods" && (
          <div className="m-summary-item__mood-bar">
            <MoodBar mood={currentValue} />
          </div>
        )}
        {difference !== undefined && (
          <div className="m-summary-item__trend">
            {difference < 0 ? (
              <span className={displayTrendSentiment ? "negative" : ""}>
                <Icon draw margin="end" name="down" />
              </span>
            ) : difference > 0 ? (
              <span className={displayTrendSentiment ? "positive" : ""}>
                <Icon draw margin="end" name="up" />
              </span>
            ) : (
              <Icon draw margin="end" name="minus" />
            )}
            {difference
              ? `${format(Math.abs(difference))}
                ${difference < 0 ? "less" : "more"} than `
              : "The same as "}
            previous {` ${periodType}`}
          </div>
        )}
      </div>
    </Card>
  );
}
