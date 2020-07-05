import { del, get, set } from "idb-keyval";
import { NormalizedEvents } from "./types";

const getEventsKey = (userId: string): string => `moodtracker:${userId}:events`;

export default {
  deleteEvents: (userId: string): Promise<void> => del(getEventsKey(userId)),
  getEvents: (userId: string): Promise<NormalizedEvents | undefined> =>
    get<NormalizedEvents | undefined>(getEventsKey(userId)),
  setEvents: (userId: string, events: NormalizedEvents): Promise<void> =>
    set(getEventsKey(userId), events),
};
