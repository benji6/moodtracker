export type FluxStandardAction<
  Type extends string,
  Payload = undefined
> = Payload extends undefined
  ? { type: Type }
  : { payload: Payload; type: Type };

export interface NormalizedEvents {
  allIds: string[];
  byId: { [id: string]: AppEvent };
  idsToSync: string[];
  nextCursor: string | undefined;
}

export interface Mood {
  mood: number;
}

type MoodEvent<Type extends string, Payload> = {
  createdAt: string;
  payload: Payload;
  type: Type;
};

export type AppEvent =
  | MoodEvent<"moods/create", Mood>
  | MoodEvent<"moods/delete", string>
  | MoodEvent<"moods/update", Mood & { id: string }>;
