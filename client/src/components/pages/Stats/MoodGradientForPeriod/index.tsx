import "./style.css";
import { RootState } from "../../../../store";
import eventsSlice from "../../../../store/eventsSlice";
import { moodToColor } from "../../../../utils";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

const NO_DATA_COLOR = "var(--color-balance)";

export default function MoodGradientForPeriod({ dateFrom, dateTo }: Props) {
  const fromTime = dateFrom.getTime();
  const toTime = dateTo.getTime();
  const timeInterval = toTime - fromTime;
  const envelopingMoods = useSelector((state: RootState) =>
    eventsSlice.selectors.envelopingDenormalizedMoodsOrderedByExperiencedAt(
      state,
      dateFrom,
      dateTo,
    ),
  );

  if (envelopingMoods.length < 2) return;

  const firstTime = new Date(envelopingMoods[0].experiencedAt).getTime();
  const lastTime = new Date(
    envelopingMoods[envelopingMoods.length - 1].experiencedAt,
  ).getTime();

  let background = `linear-gradient(0.25turn`;

  if (firstTime > fromTime) {
    const percentage = ((firstTime - fromTime) / timeInterval) * 100;
    background += `,${NO_DATA_COLOR} ${percentage - 0.01}%`;
  }
  for (const { experiencedAt, mood } of envelopingMoods) {
    const time = new Date(experiencedAt).getTime();
    const percentage = ((time - fromTime) / timeInterval) * 100;
    background += `,${moodToColor(mood)} ${percentage}%`;
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
