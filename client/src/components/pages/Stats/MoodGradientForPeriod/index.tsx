import { useSelector } from "react-redux";
import { normalizedMoodsSelector } from "../../../../selectors";
import { moodToColor } from "../../../../utils";
import useEnvelopingMoodIds from "../../../hooks/useEnvelopingMoodIds";
import "./style.css";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

const NO_DATA_COLOR = "var(--color-balance)";

export default function MoodGradientForPeriod({ dateFrom, dateTo }: Props) {
  const moods = useSelector(normalizedMoodsSelector);
  const fromTime = dateFrom.getTime();
  const toTime = dateTo.getTime();
  const timeInterval = toTime - fromTime;
  const envelopingMoodIds = useEnvelopingMoodIds(dateFrom, dateTo);

  if (envelopingMoodIds.length < 2) return null;

  const firstTime = new Date(envelopingMoodIds[0]).getTime();
  const lastTime = new Date(envelopingMoodIds.at(-1)!).getTime();

  let background = `linear-gradient(0.25turn`;

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

  return (
    <div
      aria-hidden="true"
      className="m-mood-gradient br-max"
      style={{ background }}
      title="Mood gradient"
    />
  );
}
