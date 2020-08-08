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
          dispatch({
            type: "user/set",
            payload: { email: idToken.payload.email, id: idToken.payload.sub },
          });
        } catch (e) {
          console.error("useUser Error: ", e); // TODO - remove at some point
          if (e.message === "No current user") dispatch({ type: "user/clear" });
        }
      })(),
    []
  );
}
