import { ComponentType } from "react";
import { EventTypeCategories } from "../types";
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
    plural: string;
    singular: string;
  }
> = {
  "leg-raises": {
    CardComponent: LegRaisesCard,
    default: "leg raises",
    plural: "leg raises",
    singular: "leg raise",
  },
  "push-ups": {
    CardComponent: PushUpsCard,
    default: "push-ups",
    plural: "push-ups",
    singular: "push-up",
  },
  runs: {
    CardComponent: RunCard,
    default: "run",
    plural: "runs",
    singular: "run",
  },
  "sit-ups": {
    CardComponent: SitUpsCard,
    default: "sit-ups",
    plural: "sit-ups",
    singular: "sit-up",
  },
  meditations: {
    CardComponent: MeditationCard,
    default: "meditation",
    plural: "meditations",
    singular: "meditation",
  },
  moods: {
    CardComponent: MoodCard,
    default: "mood",
    plural: "moods",
    singular: "mood",
  },
  sleeps: {
    CardComponent: SleepCard,
    default: "sleep",
    plural: "sleeps",
    singular: "sleep",
  },
  weights: {
    CardComponent: WeightCard,
    default: "weight",
    plural: "weights",
    singular: "weight",
  },
} as const;

export default EVENT_TYPE_TO_LABELS;
