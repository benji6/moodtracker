import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  moodToColor,
} from "../../../../utils";
import { useSelector } from "react-redux";
import { normalizedAveragesByMonthSelector } from "../../../../selectors";
import { monthShortFormatter } from "../../../../formatters/dateTimeFormatters";
import { useNavigate } from "react-router-dom";
import ColumnChart from "../../../shared/ColumnChart";
import { oneDecimalPlaceFormatter } from "../../../../formatters/numberFormatters";
import { MOOD_EXTENT } from "../../../../constants";

interface Props {
  months: Date[];
}

export default function MoodByMonthChart({ months }: Props) {
  const normalizedAveragesByMonth = useSelector(
    normalizedAveragesByMonthSelector
  );
  const navigate = useNavigate();

  return (
    <ColumnChart
      aria-label="Chart displaying average mood by month"
      data={months.map((month) => {
        const averageMood =
          normalizedAveragesByMonth.byId[formatIsoDateInLocalTimezone(month)];
        const label = monthShortFormatter.format(month);
        return {
          color:
            averageMood === undefined ? undefined : moodToColor(averageMood),
          key: label,
          label: label,
          title:
            averageMood === undefined
              ? undefined
              : `Average mood: ${oneDecimalPlaceFormatter.format(averageMood)}`,
          y: averageMood,
        };
      })}
      maxRange={MOOD_EXTENT}
      onBarClick={(i) =>
        navigate(`/stats/months/${formatIsoMonthInLocalTimezone(months[i])}`)
      }
      rotateXLabels
      xAxisTitle="Month"
      yAxisTitle="Average mood"
    />
  );
}
