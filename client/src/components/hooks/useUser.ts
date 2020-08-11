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
          dispatch({ type: "user/clear" });
        }
      })(),
    []
  );
}
