import { Card } from "eri";
import EVENT_TYPE_TO_LABELS from "../../constants/eventTypeToLabels";
import { EventTypeCategories } from "../../types";
import eventsSlice from "../../store/eventsSlice";
import { mapRight } from "../../utils";
import { useSelector } from "react-redux";

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
    const { CardComponent } = EVENT_TYPE_TO_LABELS[type];
    return <CardComponent id={id} key={id} />;
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
