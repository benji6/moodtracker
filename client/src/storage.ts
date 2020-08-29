import { del, get, set } from "idb-keyval";
import { NormalizedEvents, UserDetails } from "./types";

const USER_KEY = "moodtracker:user";
const getEventsKey = (userId: string): string => `moodtracker:${userId}:events`;

export default {
  // user
  deleteUser: (): Promise<void> => del(USER_KEY),
  getUser: (): Promise<UserDetails | undefined> => get(USER_KEY),
  setUser: (user: UserDetails): Promise<void> => set(USER_KEY, user),

  //events
  deleteEvents: (userId: string): Promise<void> => del(getEventsKey(userId)),
  getEvents: (userId: string): Promise<NormalizedEvents | undefined> =>
    get<NormalizedEvents | undefined>(getEventsKey(userId)),
  setEvents: (userId: string, events: NormalizedEvents): Promise<void> =>
    set(getEventsKey(userId), events),
};
