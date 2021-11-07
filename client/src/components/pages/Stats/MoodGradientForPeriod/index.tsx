import { useSelector } from "react-redux";
import { normalizedMoodsSelector } from "../../../../selectors";
import { getEnvelopingMoodIds, moodToColor } from "../../../../utils";
import "./style.css";

interface Props {
  fromDate: Date;
  toDate: Date;
}

const NO_DATA_COLOR = "var(--color-balance)";

export default function MoodGradientForPeriod({ fromDate, toDate }: Props) {
  const moods = useSelector(normalizedMoodsSelector);
  const fromTime = fromDate.getTime();
  const toTime = toDate.getTime();
  const timeInterval = toTime - fromTime;
  const envelopingMoodIds = getEnvelopingMoodIds(
    moods.allIds,
    fromDate,
    toDate
  );

  let background = NO_DATA_COLOR;
  let title = "No data for this period";

  if (envelopingMoodIds.length > 1) {
    const firstTime = new Date(envelopingMoodIds[0]).getTime();
    const lastTime = new Date(
      envelopingMoodIds[envelopingMoodIds.length - 1]
    ).getTime();

    background = `linear-gradient(0.25turn`;

    if (firstTime > fromTime) {
      const percentage = ((firstTime - fromTime) / timeInterval) * 100;
      background += `,${NO_DATA_COLOR} ${percentage - 0.01}%`;
    }
    for (const id of envelopingMoodIds) {
      const time = new Date(id).getTime();
      const percentage = ((time - fromTime) / timeInterval) * 100;
      background += `,${moodToColor(moods.byId[id].mood)} ${percentage}%`;
    }
    if (lastTime < toTime) {
      const percentage = ((lastTime - fromTime) / timeInterval) * 100;
      background += `,${NO_DATA_COLOR} ${percentage + 0.01}%`;
    }
    background += `)`;
    title = "Mood gradient";
  }

  return (
    <div
      aria-label="Visualization of mood for this period as a color gradient over time"
      className="m-mood-gradient br-max"
      style={{ background }}
      title={title}
    />
  );
}
