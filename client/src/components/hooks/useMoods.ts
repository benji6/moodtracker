import * as React from "react";
import { DispatchContext, StateContext } from "../AppState";
import storage from "../../storage";
import useInterval from "./useInterval";
import { getMoods, patchMoods } from "../../api";
import { NormalizedMoods, Patch } from "../../types";

const SYNC_INTERVAL = 6e4;

export default function useMoods() {
  const dispatch = React.useContext(DispatchContext);
  const state = React.useContext(StateContext);
  const [isLoadedFromStorage, setIsLoadedFromStorage] = React.useState(false);

  React.useEffect(
    () =>
      void (async () => {
        const loadCreatedMoodIds = async (): Promise<void> => {
          const ids = await storage.getCreatedMoodIds(undefined);
          if (ids) dispatch({ type: "createdMoodIds/set", payload: ids });
        };
        const loadDeletedMoodIds = async (): Promise<void> => {
          const ids = await storage.getDeletedMoodIds(undefined);
          if (ids) dispatch({ type: "deletedMoodIds/set", payload: ids });
        };
        const loadMoods = async (): Promise<void> => {
          const moods = await storage.getMoods(undefined);
          if (moods) dispatch({ type: "moods/set", payload: moods });
        };
        try {
          await Promise.all([
            loadCreatedMoodIds(),
            loadDeletedMoodIds(),
            loadMoods(),
          ]);
        } finally {
          setIsLoadedFromStorage(true);
        }
      })(),
    []
  );

  React.useEffect(() => {
    if (!isLoadedFromStorage) return;
    storage.setCreatedMoodIds(undefined, state.createdMoodsIds);
  }, [isLoadedFromStorage, state.createdMoodsIds]);

  React.useEffect(() => {
    if (!isLoadedFromStorage) return;
    storage.setDeletedMoodIds(undefined, state.deletedMoodsIds);
  }, [isLoadedFromStorage, state.deletedMoodsIds]);

  React.useEffect(() => {
    if (!isLoadedFromStorage) return;
    storage.setMoods(undefined, state.moods);
  }, [isLoadedFromStorage, state.moods]);

  const syncFromServer = () =>
    void (async () => {
      if (!isLoadedFromStorage || !state.userEmail || state.isSyncingFromServer)
        return;
      dispatch({ type: "syncFromServer/start" });
      try {
        const serverMoods = await getMoods();
        const byId: NormalizedMoods["byId"] = {};
        for (const mood of serverMoods) byId[mood.createdAt] = mood;
        dispatch({
          type: "moods/set",
          payload: { allIds: serverMoods.map((mood) => mood.createdAt), byId },
        });
        dispatch({ type: "syncFromServer/success" });
      } catch {
        dispatch({ type: "syncFromServer/error" });
      }
    })();

  const syncToServer = async (): Promise<void> => {
    if (
      !isLoadedFromStorage ||
      !state.userEmail ||
      state.isSyncingToServer ||
      !(state.deletedMoodsIds.length || state.createdMoodsIds.length)
    )
      return;
    let patch: Patch = {};
    if (state.createdMoodsIds.length)
      patch.put = state.createdMoodsIds.map((id) => state.moods.byId[id]);
    if (state.deletedMoodsIds.length) patch.delete = state.deletedMoodsIds;
    dispatch({ type: "syncToServer/start" });
    try {
      await patchMoods(patch);
      dispatch({ type: "syncToServer/success" });
    } catch {
      dispatch({ type: "syncToServer/error" });
    }
  };

  const syncBidirectionally = () =>
    void (async () => {
      if (!isLoadedFromStorage || !state.userEmail) return;
      await syncToServer();
      syncFromServer();
    })();

  React.useEffect(() => void syncToServer(), [
    isLoadedFromStorage,
    state.createdMoodsIds,
    state.deletedMoodsIds,
    state.moods,
    state.userEmail,
  ]);
  React.useEffect(syncBidirectionally, [isLoadedFromStorage, state.userEmail]);
  useInterval(syncBidirectionally, SYNC_INTERVAL);
}
