import { get, set } from "idb-keyval";
import { Mood } from "./types";

const createMoodsStorageKey = (userId: string | undefined) =>
  `user-id:${userId || "UNAUTHENTICATED-USER"}:moods`;

export default {
  getMoods: (userId: string | undefined): Promise<Mood[] | undefined> =>
    get(createMoodsStorageKey(userId)),
  setMoods: (userId: string | undefined, notes: Mood[]): Promise<void> =>
    set(createMoodsStorageKey(userId), notes),
};
