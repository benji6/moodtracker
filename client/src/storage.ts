import { get, set } from "idb-keyval";
import { NormalizedEvents } from "./types";

const makeEventsStorageKey = (userId: string | undefined) =>
  `user-id:${userId || "UNAUTHENTICATED-USER"}:events`;

export default {
  getEvents: (
    userId: string | undefined
  ): Promise<NormalizedEvents | undefined> =>
    get<NormalizedEvents | undefined>(makeEventsStorageKey(userId)),
  setEvents: (
    userId: string | undefined,
    events: NormalizedEvents
  ): Promise<void> => set(makeEventsStorageKey(userId), events),
};
