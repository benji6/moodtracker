import { Card, Icon } from "eri";
import { moodToColor } from "../../../../utils";
import MoodBar from "../../MoodBar";
import "./style.css";

interface Props {
  currentValue?: number;
  displayTrendSentiment?: boolean;
  format?(value: number): string;
  heading: string;
  isMood?: boolean;
  periodType: "day" | "month" | "week" | "year";
  previousValue?: number;
}

export default function MoodSummaryItem({
  currentValue,
  displayTrendSentiment = false,
  format = String,
  heading,
  isMood = false,
  periodType,
  previousValue,
}: Props) {
  if (currentValue === undefined) return null;

  const difference =
    previousValue === undefined ? undefined : currentValue - previousValue;

  const isDifferenceMaterial = difference
    ? difference <= -0.05 || difference >= 0.05
    : false;

  let color = "var(--color-balance)";
  if (isMood) color = moodToColor(currentValue);
  else if (displayTrendSentiment && isDifferenceMaterial && difference) {
    if (difference > 0) color = "var(--color-positive)";
    else color = "var(--color-negative)";
  }

  return (
    <Card color={color}>
      <div className="m-mood-summary-item">
        <div>
          <b>{heading}</b>
        </div>
        <div className="m-mood-summary-item__value">{format(currentValue)}</div>
        {isMood && (
          <div className="m-mood-summary-item__mood-bar">
            <MoodBar mood={currentValue} />
          </div>
        )}
        {difference !== undefined && (
          <div className="m-mood-summary-item__trend">
            <small>
              {!isDifferenceMaterial ? (
                <Icon draw margin="end" name="minus" />
              ) : difference < 0 ? (
                <span className={displayTrendSentiment ? "negative" : ""}>
                  <Icon draw margin="end" name="down" />
                </span>
              ) : (
                <span className={displayTrendSentiment ? "positive" : ""}>
                  <Icon draw margin="end" name="up" />
                </span>
              )}
              {isDifferenceMaterial
                ? `${format(Math.abs(difference))}
                ${difference < 0 ? "less" : "more"} than `
                : "The same as "}
              previous {periodType}
            </small>
          </div>
        )}
      </div>
    </Card>
  );
}
