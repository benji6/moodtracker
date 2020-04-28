export interface Mood {
  createdAt: string;
  mood: number;
}

export interface NormalizedMoods {
  allIds: string[];
  byId: { [id: string]: Mood };
}

export interface Patch {
  delete?: string[];
  put?: Mood[];
}
