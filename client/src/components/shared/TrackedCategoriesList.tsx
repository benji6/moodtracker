import { Card } from "eri";
import { EventCategoryTypes } from "../../types";
import MeditationCard from "./MeditationCard";
import MoodCard from "./MoodCard";
import PushUpsCard from "./PushUpsCard";
import SleepCard from "./SleepCard";
import WeightCard from "./WeightCard";
import eventsSlice from "../../store/eventsSlice";
import { mapRight } from "../../utils";
import { useSelector } from "react-redux";

const TRACKED_CATEGORY_TYPE_TO_CARD_COMPONENT = {
  meditation: MeditationCard,
  mood: MoodCard,
  "push-ups": PushUpsCard,
  sleep: SleepCard,
  weight: WeightCard,
} as const;

interface Props {
  isoDateInLocalTimezone: string;
  reverse?: boolean;
}

export default function TrackedCategoriesList({
  isoDateInLocalTimezone,
  reverse = false,
}: Props) {
  const allDenormalizedTrackedCategoriesByDate = useSelector(
    eventsSlice.selectors.allDenormalizedTrackedCategoriesByDate,
  );
  const denormalizedTrackedCategories =
    allDenormalizedTrackedCategoriesByDate[isoDateInLocalTimezone];

  const mapFn = ({ id, type }: { id: string; type: EventCategoryTypes }) => {
    const Component = TRACKED_CATEGORY_TYPE_TO_CARD_COMPONENT[type];
    return <Component id={id} key={id} />;
  };

  return (
    denormalizedTrackedCategories && (
      <Card.Group>
        {reverse
          ? mapRight(denormalizedTrackedCategories, mapFn)
          : denormalizedTrackedCategories.map(mapFn)}
      </Card.Group>
    )
  );
}
