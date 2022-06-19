import { Card, Icon } from "eri";
import {
  integerFormatter,
  oneDecimalPlaceFormatter,
} from "../../../../numberFormatters";
import { moodToColor } from "../../../../utils";
import MoodBar from "../../MoodBar";
import "./style.css";

interface Props {
  currentValue?: number;
  decimalPlaces?: 0 | 1;
  displayTrendSentiment?: boolean;
  heading: string;
  isMood?: boolean;
  periodType: "day" | "month" | "week" | "year";
  previousValue?: number;
}

export default function MoodSummaryItem({
  currentValue,
  decimalPlaces = 0,
  displayTrendSentiment = false,
  heading,
  isMood = false,
  periodType,
  previousValue,
}: Props) {
  if (currentValue === undefined) return null;
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
  if (isMood) color = moodToColor(currentValue);
  else if (displayTrendSentiment && difference) {
    if (difference > 0) color = "var(--color-positive)";
    else color = "var(--color-negative)";
  }

  const format = decimalPlaces
    ? oneDecimalPlaceFormatter.format
    : integerFormatter.format;

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
                ? `${format(difference)}
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
