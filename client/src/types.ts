export type FluxStandardAction<
  Type extends string,
  Payload = undefined
> = Payload extends undefined
  ? { type: Type }
  : { payload: Payload; type: Type };

export interface NormalizedMoods {
  allIds: string[];
  byId: { [id: string]: Mood & { updatedAt?: string } };
}

export interface Mood {
  description?: string;
  mood: number;
}

export type ServerMood = Mood & { id: string };

type MoodEvent<Type extends string, Payload> = {
  createdAt: string;
  payload: Payload;
  type: Type;
};

export type AppEvent =
  | MoodEvent<"v1/moods/create", Mood>
  | MoodEvent<"v1/moods/delete", string>
  | MoodEvent<"v1/moods/update", ServerMood>;
