import { EventTypeCategories } from "../types";
import { Icon } from "eri";
import { ReactNode } from "react";

export const EVENT_TYPE_TO_LABEL: {
  [eventType in EventTypeCategories]: string;
} = {
  "leg-raises": "leg raises",
  "push-ups": "push-ups",
  "sit-ups": "sit-ups",
  meditations: "meditation",
  moods: "mood",
  sleeps: "sleep",
  weights: "weight",
} as const;

export const EVENT_TYPE_TO_ICON: {
  [eventType in EventTypeCategories]: ReactNode;
} = {
  "leg-raises": "🦵",
  "push-ups": "💪",
  "sit-ups": "🏋️",
  meditations: <Icon name="bell" />,
  moods: <Icon name="heart" />,
  sleeps: <Icon name="moon" />,
  weights: <Icon name="weight" />,
} as const;

export const EVENT_TYPE_TO_LABEL_PLURAL: {
  [eventType in EventTypeCategories]: string;
} = {
  "leg-raises": "leg raises",
  "push-ups": "push-ups",
  "sit-ups": "sit-ups",
  meditations: "meditations",
  moods: "moods",
  sleeps: "sleeps",
  weights: "weights",
} as const;

export const EVENT_TYPE_TO_LABEL_SINGULAR: {
  [eventType in EventTypeCategories]: string;
} = {
  "leg-raises": "leg raise",
  "push-ups": "push-up",
  "sit-ups": "sit-up",
  meditations: "meditation",
  moods: "mood",
  sleeps: "sleep",
  weights: "weight",
} as const;
