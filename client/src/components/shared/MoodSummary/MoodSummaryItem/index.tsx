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
  const isDifferenceImmaterial = difference
    ? difference >= -0.05 && difference < 0.05
    : true;

  return (
    <Card
      color={
        isMood ? moodToColor(currentValue) : "var(--color-highlight-default)"
      }
    >
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
              {isDifferenceImmaterial ? (
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
              {isDifferenceImmaterial
                ? "The same as "
                : `${format(Math.abs(difference))}
              ${difference < 0 ? "less" : "more"} than `}
              previous {periodType}
            </small>
          </div>
        )}
      </div>
    </Card>
  );
}
