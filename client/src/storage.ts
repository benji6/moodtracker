import { del, get, set } from "idb-keyval";
import { EventsStateToStore } from "./store/eventsSlice";
import { UserDetails } from "./store/userSlice";

const USER_KEY = "moodtracker:user";
const makeEventsKey = (userId: string): string =>
  `moodtracker:${userId}:events`;

export default {
  // user
  deleteUser: (): Promise<void> => del(USER_KEY),
  getUser: (): Promise<UserDetails | undefined> => get(USER_KEY),
  setUser: (user: UserDetails): Promise<void> => set(USER_KEY, user),

  //events
  deleteEvents: (userId: string): Promise<void> => del(makeEventsKey(userId)),
  getEvents: (userId: string): Promise<EventsStateToStore | undefined> =>
    get<EventsStateToStore | undefined>(makeEventsKey(userId)),
  setEvents: (userId: string, events: EventsStateToStore): Promise<void> =>
    set(makeEventsKey(userId), events),
};
