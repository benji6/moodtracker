import { EventTypeCategories } from "../types";
import { Icon } from "eri";
import { ReactNode } from "react";

const EVENT_TYPE_TO_LABELS: {
  [eventType in EventTypeCategories]: {
    default: string;
    icon: ReactNode;
    plural: string;
    singular: string;
  };
} = {
  "leg-raises": {
    default: "leg raises",
    icon: "🦵",
    plural: "leg raises",
    singular: "leg raise",
  },
  "push-ups": {
    default: "push-ups",
    icon: "💪",
    plural: "push-ups",
    singular: "push-up",
  },
  "sit-ups": {
    default: "sit-ups",
    icon: "🏋️",
    plural: "sit-ups",
    singular: "sit-up",
  },
  meditations: {
    default: "meditation",
    icon: <Icon name="bell" />,
    plural: "meditations",
    singular: "meditation",
  },
  moods: {
    default: "mood",
    icon: <Icon name="heart" />,
    plural: "moods",
    singular: "mood",
  },
  sleeps: {
    default: "sleep",
    icon: <Icon name="moon" />,
    plural: "sleeps",
    singular: "sleep",
  },
  weights: {
    default: "weight",
    icon: <Icon name="weight" />,
    plural: "weights",
    singular: "weight",
  },
} as const;

export default EVENT_TYPE_TO_LABELS;
