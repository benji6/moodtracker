import { del, get, getMany, set, setMany } from "idb-keyval";
import { EventsStateToStore } from "./store/eventsSlice";
import { Settings } from "./types";
import { UserDetails } from "./store/userSlice";

const APPLICATION_NAME = "moodtracker";
const USER_KEY = `${APPLICATION_NAME}:user`;

const makeEventsKey = (userId: string): string =>
  `${APPLICATION_NAME}:${userId}:events`;
const makeSettingsKey = (userId: string): string =>
  `${APPLICATION_NAME}:${userId}:settings`;

export default {
  // events
  deleteEvents: (userId: string): Promise<void> => del(makeEventsKey(userId)),
  setEvents: (userId: string, events: EventsStateToStore): Promise<void> =>
    set(makeEventsKey(userId), events),

  // user
  deleteUser: (): Promise<void> => del(USER_KEY),
  getUser: (): Promise<UserDetails | undefined> => get(USER_KEY),
  setUser: (user: UserDetails): Promise<void> => set(USER_KEY, user),

  // events & settings
  setEventsAndSettings: (
    userId: string,
    events: EventsStateToStore,
    settings: Settings,
  ): Promise<void> =>
    setMany([
      [makeEventsKey(userId), events],
      [makeSettingsKey(userId), settings],
    ]),
  getEventsAndSettings: (
    userId: string,
  ): Promise<[EventsStateToStore | undefined, Settings | undefined]> =>
    getMany([makeEventsKey(userId), makeSettingsKey(userId)]) as Promise<
      [EventsStateToStore | undefined, Settings | undefined]
    >,
};
