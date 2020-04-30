import { get, set } from "idb-keyval";
import { NormalizedMoods } from "./types";

const makeCreatedMoodIdsStorageKey = (userId: string | undefined) =>
  `user-id:${userId || "UNAUTHENTICATED-USER"}:created-mood-ids`;
const makeDeletedMoodIdsStorageKey = (userId: string | undefined) =>
  `user-id:${userId || "UNAUTHENTICATED-USER"}:deleted-mood-ids`;
const makeMoodsStorageKey = (userId: string | undefined) =>
  `user-id:${userId || "UNAUTHENTICATED-USER"}:moods`;

export default {
  getCreatedMoodIds: (
    userId: string | undefined
  ): Promise<string[] | undefined> =>
    get<string[] | undefined>(makeCreatedMoodIdsStorageKey(userId)),
  getDeletedMoodIds: (
    userId: string | undefined
  ): Promise<string[] | undefined> =>
    get<string[] | undefined>(makeDeletedMoodIdsStorageKey(userId)),
  getMoods: (
    userId: string | undefined
  ): Promise<NormalizedMoods | undefined> =>
    get<NormalizedMoods | undefined>(makeMoodsStorageKey(userId)),
  setCreatedMoodIds: (
    userId: string | undefined,
    ids: string[]
  ): Promise<void> => set(makeCreatedMoodIdsStorageKey(userId), ids),
  setDeletedMoodIds: (
    userId: string | undefined,
    ids: string[]
  ): Promise<void> => set(makeDeletedMoodIdsStorageKey(userId), ids),
  setMoods: (
    userId: string | undefined,
    moods: NormalizedMoods
  ): Promise<void> => set(makeMoodsStorageKey(userId), moods),
};
