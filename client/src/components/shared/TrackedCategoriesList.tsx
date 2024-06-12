import { Card } from "eri";
import { ComponentType } from "react";
import { EventTypeCategories } from "../../types";
import LegRaisesCard from "./LegRaisesCard";
import MeditationCard from "./MeditationCard";
import MoodCard from "./MoodCard";
import PushUpsCard from "./PushUpsCard";
import SitUpsCard from "./SitUpsCard";
import SleepCard from "./SleepCard";
import WeightCard from "./WeightCard";
import eventsSlice from "../../store/eventsSlice";
import { mapRight } from "../../utils";
import { useSelector } from "react-redux";

const TRACKED_CATEGORY_TYPE_TO_CARD_COMPONENT: {
  [eventType in EventTypeCategories]: ComponentType<{ id: string }>;
} = {
  meditations: MeditationCard,
  moods: MoodCard,
  "leg-raises": LegRaisesCard,
  "push-ups": PushUpsCard,
  "sit-ups": SitUpsCard,
  sleeps: SleepCard,
  weights: WeightCard,
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

  const mapFn = ({ id, type }: { id: string; type: EventTypeCategories }) => {
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
