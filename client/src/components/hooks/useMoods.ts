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
          const storedMoods = await storage.getMoods(undefined);
          if (!storedMoods) return;
          dispatch({ type: "moods/set", payload: storedMoods });
        } finally {
          setIsLoadedFromStorage(true);
        }
      })(),
    []
  );

  React.useEffect(() => {
    if (!isLoadedFromStorage) return;
    storage.setMoods(undefined, state.moods);
  }, [isLoadedFromStorage, state.moods]);
}
