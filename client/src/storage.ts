import { EventTypeCategories, Settings, WeatherApiResponse } from "./types";
import { del, delMany, get, getMany, keys, set, setMany } from "idb-keyval";
import { EventsStateToStore } from "./store/eventsSlice";
import { UserDetails } from "./store/userSlice";

const APPLICATION_NAME = "moodtracker";
const USER_KEY = `${APPLICATION_NAME}:user`;
const WEATHER_KEY_PREFIX = `${APPLICATION_NAME}:weather`;

const makeEventsKey = (userId: string): string =>
  `${APPLICATION_NAME}:${userId}:events`;
const makeEventTrackingDisabledKeysKey = (userId: string): string =>
  `${APPLICATION_NAME}:${userId}:event-tracking-disabled-keys`;
const makeSettingsKey = (userId: string): string =>
  `${APPLICATION_NAME}:${userId}:settings`;
const makeWeatherKey = ({
  latitude,
  longitude,
  timestamp,
}: {
  latitude: string;
  longitude: string;
  timestamp: number;
}): string => `${WEATHER_KEY_PREFIX}:${timestamp},${latitude},${longitude}`;

export default {
  // events
  deleteEvents: (userId: string): Promise<void> => del(makeEventsKey(userId)),
  setEvents: (userId: string, events: EventsStateToStore): Promise<void> =>
    set(makeEventsKey(userId), events),

  // event tracking
  setEventTrackingDisabledKeys: (
    userId: string,
    eventTypes: EventTypeCategories[],
  ): Promise<void> => {
    if (eventTypes.length)
      return set(makeEventTrackingDisabledKeysKey(userId), eventTypes);
    return del(makeEventTrackingDisabledKeysKey(userId));
  },

  // user
  deleteUser: (): Promise<void> => del(USER_KEY),
  getUser: (): Promise<UserDetails | undefined> => get(USER_KEY),
  setUser: (user: UserDetails): Promise<void> => set(USER_KEY, user),

  // weather
  deleteWeathers: async (): Promise<void> => {
    const ks = await keys();
    const weatherKeys = ks.filter(
      (k) => typeof k === "string" && k.startsWith(WEATHER_KEY_PREFIX),
    );
    return delMany(weatherKeys);
  },
  getWeather: ({
    latitude,
    longitude,
    timestamp,
  }: {
    latitude: string;
    longitude: string;
    timestamp: number;
  }): Promise<WeatherApiResponse | undefined> =>
    get(makeWeatherKey({ latitude, longitude, timestamp })),
  getWeathers: (
    parameterList: {
      latitude: string;
      longitude: string;
      timestamp: number;
    }[],
  ): Promise<(WeatherApiResponse | undefined)[]> =>
    getMany(parameterList.map(makeWeatherKey)),
  setWeather: (
    key: { latitude: string; longitude: string; timestamp: number },
    weather: WeatherApiResponse,
  ): Promise<void> => set(makeWeatherKey(key), weather),

  // multiple
  setEventsAndSettings: (
    userId: string,
    events: EventsStateToStore,
    settings: Settings,
  ): Promise<void> =>
    setMany([
      [makeEventsKey(userId), events],
      [makeSettingsKey(userId), settings],
    ]),
  getUserDataAndSettings: (
    userId: string,
  ): Promise<
    [
      EventsStateToStore | undefined,
      EventTypeCategories[] | undefined,
      Settings | undefined,
    ]
  > =>
    getMany([
      makeEventsKey(userId),
      makeEventTrackingDisabledKeysKey(userId),
      makeSettingsKey(userId),
    ]) as Promise<
      [
        EventsStateToStore | undefined,
        EventTypeCategories[] | undefined,
        Settings | undefined,
      ]
    >,
};
