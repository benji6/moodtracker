export type NormalizedTrackedCategory<TrackedCategory> = {
  allIds: string[];
  byId: { [id: string]: TrackedCategory & { updatedAt?: string } };
};

export type NormalizedAllCategories = {
  allIds: string[];
  byId: {
    [id: string]: (
      | (Meditation & { type: "meditations" })
      | (Mood & { type: "moods" })
      | (PushUps & { type: "push-ups" })
      | (Sleep & { type: "sleeps" })
      | (Weight & { type: "weights" })
    ) & {
      updatedAt?: string;
    };
  };
};
export type NormalizedMeditations = NormalizedTrackedCategory<Meditation>;
export type NormalizedMoods = NormalizedTrackedCategory<Mood>;
export type NormalizedPushUps = NormalizedTrackedCategory<PushUps>;
export type NormalizedSleeps = NormalizedTrackedCategory<Sleep>;
export type NormalizedWeights = NormalizedTrackedCategory<Weight>;

export type NormalizedEvents =
  | NormalizedMeditations
  | NormalizedMoods
  | NormalizedPushUps
  | NormalizedSleeps
  | NormalizedWeights;
export type DenormalizedEvents =
  | Meditation[]
  | Mood[]
  | PushUps[]
  | Sleep[]
  | Weight[];

export interface Meditation {
  location?: DeviceGeolocation;
  seconds: number;
}

export interface DeviceGeolocation {
  accuracy: number;

  // Altitude properties were added 2023-04-09
  altitude?: number;
  altitudeAccuracy?: number;

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

interface PushUps {
  location?: DeviceGeolocation;
  value: number;
}
export interface Weight {
  location?: DeviceGeolocation;
  value: number;
}
export interface UpdateWeight {
  id: string;
  value: number;
}

export interface Sleep {
  dateAwoke: string;
  minutesSlept: number;
}
export interface UpdateSleep extends Sleep {
  id: string;
}

type EventTypeVersions = "v1";
export type EventTypeCategories =
  | "meditations"
  | "moods"
  | "push-ups"
  | "sleeps"
  | "weights";
type EventTypeOperations = "create" | "update" | "delete";
type EventType =
  `${EventTypeVersions}/${EventTypeCategories}/${EventTypeOperations}`;

export type EventTypeTuple = [
  EventTypeVersions,
  EventTypeCategories,
  EventTypeOperations,
];

type PayloadEvent<Type extends EventType, Payload> = {
  createdAt: string;
  payload: Payload;
  type: Type;
};

export type AppCreateEvent =
  | PayloadEvent<"v1/meditations/create", Meditation>
  | PayloadEvent<"v1/moods/create", Mood>
  | PayloadEvent<"v1/push-ups/create", PushUps>
  | PayloadEvent<"v1/sleeps/create", Sleep>
  | PayloadEvent<"v1/weights/create", Weight>;

export type AppUpdateEvent =
  | PayloadEvent<"v1/moods/update", UpdateMood>
  | PayloadEvent<"v1/push-ups/update", UpdateWeight>
  | PayloadEvent<"v1/sleeps/update", UpdateSleep>
  | PayloadEvent<"v1/weights/update", UpdateWeight>;

export type AppEvent =
  | AppCreateEvent
  | AppUpdateEvent
  | PayloadEvent<"v1/meditations/delete", string>
  | PayloadEvent<"v1/moods/delete", string>
  | PayloadEvent<"v1/push-ups/delete", string>
  | PayloadEvent<"v1/sleeps/delete", string>
  | PayloadEvent<"v1/weights/delete", string>;

export interface Settings {
  updatedAt: string;
  recordLocation: boolean;
}

export interface Usage {
  byMonth?: {
    [month: string]: { users: { confirmed: number; unconfirmed: number } };
  };
  confirmedUsers: number;
  CRR: number;
  DAUs: number;
  last28Days?: {
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
    eventCount: number;
    meanMood: number;
    meditationSeconds: number;
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
  sleepMAUs?: number;
  totalWebPushTokens?: number;
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
    },
  ];
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
}
