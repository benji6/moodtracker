import { RequireProperties } from "./typeUtilities";

export type NormalizedTrackedCategory<TrackedCategory> = {
  allIds: string[];
  byId: { [id: string]: TrackedCategory & { updatedAt?: string } };
};

export type NormalizedMeditations = NormalizedTrackedCategory<Meditation>;
export type NormalizedMoods = NormalizedTrackedCategory<Mood>;
export type NormalizedWeights = NormalizedTrackedCategory<Weight>;

export interface Meditation {
  location?: DeviceGeolocation;
  seconds: number;
}

export interface DeviceGeolocation {
  accuracy: number;
  latitude: number;
  longitude: number;
}

export interface Mood {
  description?: string;
  exploration?: string;
  location?: DeviceGeolocation;
  mood: number;
}

export interface UpdateMood {
  description?: string;
  exploration?: string;
  id: string;
  mood?: number;
}

export interface Weight {
  location?: DeviceGeolocation;
  value: number;
}

export interface UpdateWeight {
  id: string;
  value: number;
}

type EventTypeVersions = "v1";
export type EventTypeCategories = "meditations" | "moods" | "weights";
type EventTypeOperations = "create" | "update" | "delete";
type EventType =
  `${EventTypeVersions}/${EventTypeCategories}/${EventTypeOperations}`;

export type EventTypeTuple = [
  EventTypeVersions,
  EventTypeCategories,
  EventTypeOperations
];

type PayloadEvent<Type extends EventType, Payload> = {
  createdAt: string;
  payload: Payload;
  type: Type;
};

export type AppCreateEvent =
  | PayloadEvent<"v1/meditations/create", Meditation>
  | PayloadEvent<"v1/moods/create", Mood>
  | PayloadEvent<"v1/weights/create", Weight>;
export type AppEventWithLocation =
  | PayloadEvent<
      "v1/meditations/create",
      RequireProperties<Meditation, "location">
    >
  | PayloadEvent<"v1/moods/create", RequireProperties<Mood, "location">>
  | PayloadEvent<"v1/weights/create", RequireProperties<Weight, "location">>;

export type AppUpdateEvent =
  | PayloadEvent<"v1/moods/update", UpdateMood>
  | PayloadEvent<"v1/weights/update", UpdateWeight>;

export type AppEvent =
  | AppCreateEvent
  | AppUpdateEvent
  | PayloadEvent<"v1/meditations/delete", string>
  | PayloadEvent<"v1/moods/delete", string>
  | PayloadEvent<"v1/weights/delete", string>;

export interface Settings {
  updatedAt: string;
  recordLocation: boolean;
}

export interface Usage {
  confirmedUsers: number;
  CRR: number;
  DAUs: number;
  last28Days: {
    eventCountByWeekday: {
      0: number;
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
      6: number;
    };
  };
  last30Days: {
    count: number;
    meanMood: number;
    meditationSeconds: number;
    newUsers: number;
  };
  locationMAUs: number;
  MAUFunnel: {
    "<7 days": number;
    ">=7 & <30 days": number;
    ">=30 & <60 days": number;
    ">=60 & <90 days": number;
    ">=90 & <365 days": number;
    ">=365 days": number;
  };
  MAUs: number;
  meanMoodInLast7Days: number;
  meditationMAUs: number;
  usersWithWeeklyEmails: number;
  WAUs: number;
  weightMAUs: number;
}

// It appears basically everything could be optional "If you do not see some of the parameters in your API response it means that these weather phenomena are just not happened for the time of measurement for the city or location chosen. Only really measured or calculated data is displayed in API response."
export interface WeatherApiResponse {
  // Docs seem to indicated data array only ever has 1 value in it.
  // Probably this is for compatibility with previous API versions
  data: [
    {
      clouds: number;
      dew_point: number;
      dt: number;
      feels_like: number;
      humidity: number;
      pressure: number;
      rain?: number;
      snow?: number;
      sunrise: number;
      sunset: number;
      temp: number;
      uvi?: number;
      visibility: number;
      weather: {
        description: string;
        icon: string;
        id: number;
        main: string;
      }[];
      wind_deg: number;
      wind_gust?: number;
      wind_speed: number;
    }
  ];
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
}
