import { get, set } from "idb-keyval";
import { Mood } from "./types";

const makeCreatedMoodIdsStorageKey = (userId: string | undefined) =>
  `user-id:${userId || "UNAUTHENTICATED-USER"}:created-mood-ids`;
const makeMoodsStorageKey = (userId: string | undefined) =>
  `user-id:${userId || "UNAUTHENTICATED-USER"}:moods`;

export default {
  getCreatedMoodIds: (
    userId: string | undefined
  ): Promise<string[] | undefined> =>
    get<string[] | undefined>(makeCreatedMoodIdsStorageKey(userId)),
  setCreatedMoodIds: (
    userId: string | undefined,
    ids: string[]
  ): Promise<void> => set(makeCreatedMoodIdsStorageKey(userId), ids),
  getMoods: (userId: string | undefined): Promise<Mood[] | undefined> =>
    get<Mood[] | undefined>(makeMoodsStorageKey(userId)),
  setMoods: (userId: string | undefined, notes: Mood[]): Promise<void> =>
    set(makeMoodsStorageKey(userId), notes),
};
