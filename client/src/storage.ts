import { del, get, set } from "idb-keyval";
import { NormalizedEvents } from "./types";

const EVENTS_KEY = "moodtracker:events";

export default {
  deleteEvents: (): Promise<void> => del(EVENTS_KEY),
  getEvents: (): Promise<NormalizedEvents | undefined> =>
    get<NormalizedEvents | undefined>(EVENTS_KEY),
  setEvents: (events: NormalizedEvents): Promise<void> =>
    set(EVENTS_KEY, events),
};
