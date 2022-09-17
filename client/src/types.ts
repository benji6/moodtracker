export type FluxStandardAction<
  Type extends string,
  Payload = undefined
> = Payload extends undefined
  ? { type: Type }
  : { payload: Payload; type: Type };

type NormalizedTrackedCategory<TrackedCategory> = {
  allIds: string[];
  byId: { [id: string]: TrackedCategory & { updatedAt?: string } };
};

export type NormalizedMeditations = NormalizedTrackedCategory<Meditation>;
export type NormalizedMoods = NormalizedTrackedCategory<Mood>;

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

type PayloadEvent<Type extends string, Payload> = {
  createdAt: string;
  payload: Payload;
  type: Type;
};

export type AppEvent =
  | PayloadEvent<"v1/meditations/create", Meditation>
  | PayloadEvent<"v1/meditations/delete", string>
  | PayloadEvent<"v1/moods/create", Mood>
  | PayloadEvent<"v1/moods/delete", string>
  | PayloadEvent<"v1/moods/update", UpdateMood>;

export interface Settings {
  updatedAt: string;
  recordLocation: boolean;
}

export interface Usage {
  confirmedUsers: number;
  eventsInLast30Days: number;
  meanMoodInLast7Days: number;
  meanMoodInLast30Days: number;
  meditationMAUs: number;
  meditationSecondsInLast30Days: number;
  newUsersInLast30Days: number;
  usersWithWeeklyEmails: number;
  CRR: number;
  DAUs: number;
  MAUs: number;
  WAUs: number;
}
