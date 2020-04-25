import * as React from "react";
import { DispatchContext, StateContext } from "../AppState";
import storage from "../../storage";

export default function useMoods() {
  const dispatch = React.useContext(DispatchContext);
  const state = React.useContext(StateContext);
  const [isLoadedFromStorage, setIsLoadedFromStorage] = React.useState(false);

  React.useEffect(
    () =>
      void (async () => {
        try {
          await Promise.all([
            storage.getMoods(undefined).then((moods) => {
              if (moods) dispatch({ type: "moods/set", payload: moods });
            }),
            storage.getCreatedMoodIds(undefined).then((createdMoodIds) => {
              if (createdMoodIds)
                dispatch({
                  type: "createdMoodIds/set",
                  payload: createdMoodIds,
                });
            }),
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
    storage.setMoods(undefined, state.moods);
  }, [isLoadedFromStorage, state.moods]);
}
