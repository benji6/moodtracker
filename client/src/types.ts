export interface NormalizedTrackedCategory<TrackedCategory> {
  allIds: string[];
  byId: Record<string, TrackedCategory & { updatedAt?: string }>;
}

export interface NormalizedAllCategories {
  allIds: string[];
  byId: Record<
    string,
    (
      | (Meditation & { type: "meditations" })
      | (Mood & { type: "moods" })
      | (Run & { type: "runs" })
      | (Sleep & { type: "sleeps" })
      | (ValueAndLocationEvent & { type: "leg-raises" })
      | (ValueAndLocationEvent & { type: "push-ups" })
      | (ValueAndLocationEvent & { type: "sit-ups" })
      | (ValueAndLocationEvent & { type: "weights" })
    ) & {
      updatedAt?: string;
    }
  >;
}
export type NormalizedLegRaises =
  NormalizedTrackedCategory<ValueAndLocationEvent>;
export type NormalizedMeditations = NormalizedTrackedCategory<Meditation>;
export type NormalizedMoods = NormalizedTrackedCategory<Mood>;
export type NormalizedPushUps =
  NormalizedTrackedCategory<ValueAndLocationEvent>;
export type NormalizedRuns = NormalizedTrackedCategory<Run>;
export type NormalizedSitUps = NormalizedTrackedCategory<ValueAndLocationEvent>;
export type NormalizedSleeps = NormalizedTrackedCategory<Sleep>;
export type NormalizedWeights =
  NormalizedTrackedCategory<ValueAndLocationEvent>;

export type NormalizedEvents =
  | NormalizedMeditations
  | NormalizedMoods
  | NormalizedPushUps
  | NormalizedRuns
  | NormalizedSleeps
  | NormalizedWeights;
export type DenormalizedEvents =
  | (Meditation & { createdAt: string })[]
  | (Mood & { createdAt: string })[]
  | (Run & { createdAt: string })[]
  | (ValueAndLocationEvent & { createdAt: string })[]
  | (Sleep & { createdAt: string })[];

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
  // `description` is deprecated and is retained for backwards compatibility
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

export type Run =
  | {
      location?: DeviceGeolocation;
      meters: number;
      seconds?: number | null;
    }
  | {
      location?: DeviceGeolocation;
      meters?: number;
      seconds: number | null;
    };

export type UpdateRun =
  | {
      id: string;
      meters: number;
      seconds?: number | null;
    }
  | {
      id: string;
      meters?: number;
      seconds: number | null;
    };

interface ValueAndLocationEvent {
  location?: DeviceGeolocation;
  value: number;
}

interface ValueUpdateEvent {
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
  | "leg-raises"
  | "meditations"
  | "moods"
  | "push-ups"
  | "runs"
  | "sit-ups"
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

interface PayloadEvent<Type extends EventType, Payload> {
  createdAt: string;
  payload: Payload;
  type: Type;
}

export type AppCreateEvent =
  | PayloadEvent<"v1/leg-raises/create", ValueAndLocationEvent>
  | PayloadEvent<"v1/meditations/create", Meditation>
  | PayloadEvent<"v1/moods/create", Mood>
  | PayloadEvent<"v1/push-ups/create", ValueAndLocationEvent>
  | PayloadEvent<"v1/runs/create", Run>
  | PayloadEvent<"v1/sit-ups/create", ValueAndLocationEvent>
  | PayloadEvent<"v1/sleeps/create", Sleep>
  | PayloadEvent<"v1/weights/create", ValueAndLocationEvent>;

export type AppUpdateEvent =
  | PayloadEvent<"v1/leg-raises/update", ValueUpdateEvent>
  | PayloadEvent<"v1/moods/update", UpdateMood>
  | PayloadEvent<"v1/push-ups/update", ValueUpdateEvent>
  | PayloadEvent<"v1/runs/update", UpdateRun>
  | PayloadEvent<"v1/sit-ups/update", ValueUpdateEvent>
  | PayloadEvent<"v1/sleeps/update", UpdateSleep>
  | PayloadEvent<"v1/weights/update", ValueUpdateEvent>;

export type AppEvent =
  | AppCreateEvent
  | AppUpdateEvent
  | PayloadEvent<`v1/${EventTypeCategories}/delete`, string>;

export interface Settings {
  updatedAt: string;
  recordLocation: boolean;
}

export interface Usage {
  byMonth?: Record<
    string,
    { users: { confirmed: number; unconfirmed: number } }
  >;
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
      rain?: { "1h": number };
      snow?: { "1h": number };
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
