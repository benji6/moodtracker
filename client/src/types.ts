export interface Mood {
  createdAt: string;
  mood: number;
}

export interface Patch {
  delete?: string[];
  put?: Mood[];
}
