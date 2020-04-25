import * as React from "react";
import { getIdToken } from "../../cognito";
import { DispatchContext } from "../AppState";

export default function useUser(): void {
  const dispatch = React.useContext(DispatchContext);

  React.useEffect(
    () =>
      void (async () => {
        try {
          const idToken = await getIdToken();
          dispatch({ type: "user/setEmail", payload: idToken.payload.email });
        } catch (e) {
          if (e.message === "No current user")
            dispatch({ type: "user/clearEmail" });
        }
      })(),
    []
  );
}
