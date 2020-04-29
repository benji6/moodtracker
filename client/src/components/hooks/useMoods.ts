import * as React from "react";
import { DispatchContext, StateContext } from "../AppState";
import useInterval from "./useInterval";
import { getMoods, patchMoods } from "../../api";
import { NormalizedMoods, Patch } from "../../types";

const SYNC_INTERVAL = 6e4;

export default function useMoods() {
  const dispatch = React.useContext(DispatchContext);
  const state = React.useContext(StateContext);

  const syncFromServer = async (): Promise<void> => {
    if (state.isStorageLoading || !state.userEmail || state.isSyncingFromServer)
      return;
    dispatch({ type: "syncFromServer/start" });
    try {
      const serverMoods = await getMoods();
      const serverMoodIds = new Set(serverMoods.map((mood) => mood.createdAt));
      const newMoods = state.moods.allIds
        .filter(
          (id) => serverMoodIds.has(id) || state.createdMoodsIds.includes(id)
        )
        .map((id) => state.moods.byId[id])
        .concat(
          serverMoods.filter(
            (mood) =>
              !state.moods.byId.hasOwnProperty(mood.createdAt) &&
              !state.deletedMoodsIds.includes(mood.createdAt)
          )
        )
        .sort((a, b) =>
          a.createdAt > b.createdAt ? 1 : a.createdAt < b.createdAt ? -1 : 0
        );
      const byId: NormalizedMoods["byId"] = {};
      for (const mood of newMoods) byId[mood.createdAt] = mood;
      dispatch({
        type: "moods/set",
        payload: { allIds: newMoods.map((mood) => mood.createdAt), byId },
      });
      dispatch({ type: "syncFromServer/success" });
      dispatch({
        type: "lastSyncedFromServer/set",
        payload: new Date().toISOString(),
      });
    } catch {
      dispatch({ type: "syncFromServer/error" });
    }
  };

  const syncToServer = (): void =>
    void (async () => {
      if (
        state.isStorageLoading ||
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
        dispatch({
          payload: {
            createdIds: state.createdMoodsIds,
            deletedIds: state.deletedMoodsIds,
          },
          type: "syncToServer/success",
        });
      } catch {
        dispatch({ type: "syncToServer/error" });
      }
    })();

  const syncBidirectionally = () =>
    void (async () => {
      if (state.isStorageLoading || !state.userEmail) return;
      await syncFromServer();
      syncToServer();
    })();

  React.useEffect(syncToServer, [
    state.isStorageLoading,
    state.createdMoodsIds,
    state.deletedMoodsIds,
    state.moods,
    state.userEmail,
  ]);
  React.useEffect(syncBidirectionally, [
    state.isStorageLoading,
    state.userEmail,
  ]);
  useInterval(syncBidirectionally, SYNC_INTERVAL);
}
