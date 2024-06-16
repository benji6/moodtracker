import { ComponentType, ReactNode } from "react";
import { EventTypeCategories } from "../types";
import { Icon } from "eri";
import LegRaisesCard from "../components/shared/LegRaisesCard";
import MeditationCard from "../components/shared/MeditationCard";
import MoodCard from "../components/shared/MoodCard";
import PushUpsCard from "../components/shared/PushUpsCard";
import RunCard from "../components/shared/RunCard";
import SitUpsCard from "../components/shared/SitUpsCard";
import SleepCard from "../components/shared/SleepCard";
import WeightCard from "../components/shared/WeightCard";

const EVENT_TYPE_TO_LABELS: Record<
  EventTypeCategories,
  {
    CardComponent: ComponentType<{ id: string }>;
    default: string;
    icon: ReactNode;
    plural: string;
    singular: string;
  }
> = {
  "leg-raises": {
    CardComponent: LegRaisesCard,
    default: "leg raises",
    icon: "🦵",
    plural: "leg raises",
    singular: "leg raise",
  },
  "push-ups": {
    CardComponent: PushUpsCard,
    default: "push-ups",
    icon: "💪",
    plural: "push-ups",
    singular: "push-up",
  },
  runs: {
    CardComponent: RunCard,
    default: "run",
    icon: "🏃",
    plural: "runs",
    singular: "run",
  },
  "sit-ups": {
    CardComponent: SitUpsCard,
    default: "sit-ups",
    icon: "🏋️",
    plural: "sit-ups",
    singular: "sit-up",
  },
  meditations: {
    CardComponent: MeditationCard,
    default: "meditation",
    icon: <Icon name="bell" />,
    plural: "meditations",
    singular: "meditation",
  },
  moods: {
    CardComponent: MoodCard,
    default: "mood",
    icon: <Icon name="heart" />,
    plural: "moods",
    singular: "mood",
  },
  sleeps: {
    CardComponent: SleepCard,
    default: "sleep",
    icon: <Icon name="moon" />,
    plural: "sleeps",
    singular: "sleep",
  },
  weights: {
    CardComponent: WeightCard,
    default: "weight",
    icon: <Icon name="weight" />,
    plural: "weights",
    singular: "weight",
  },
} as const;

export default EVENT_TYPE_TO_LABELS;
