import * as React from "react";
import { DispatchContext, StateContext } from "../AppState";
import storage from "../../storage";
import useInterval from "./useInterval";
import { deleteMoods, getMoods, putMoods } from "../../api";

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
        dispatch({ type: "moods/set", payload: serverMoods });
        dispatch({ type: "syncFromServer/success" });
      } catch {
        dispatch({ type: "syncFromServer/error" });
      }
    })();

  const syncToServer = async (): Promise<void> => {
    if (!isLoadedFromStorage || !state.userEmail) return;
    const syncCreatedToServer = async () => {
      if (!state.createdMoodsIds.length || state.isSyncingCreatedToServer)
        return;
      const newMoods = state.moods.filter((mood) =>
        state.createdMoodsIds.includes(mood.createdAt)
      );
      dispatch({ type: "syncCreatedToServer/start" });
      try {
        await putMoods(newMoods);
        dispatch({ type: "syncCreatedToServer/success" });
      } catch {
        dispatch({ type: "syncCreatedToServer/error" });
      }
    };
    const syncDeletedToServer = async () => {
      if (!state.deletedMoodsIds.length || state.isSyncingDeletedToServer)
        return;
      dispatch({ type: "syncDeletedToServer/start" });
      try {
        await deleteMoods(state.deletedMoodsIds);
        dispatch({ type: "syncDeletedToServer/success" });
      } catch {
        dispatch({ type: "syncDeletedToServer/error" });
      }
    };
    await Promise.all([syncCreatedToServer(), syncDeletedToServer()]);
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
