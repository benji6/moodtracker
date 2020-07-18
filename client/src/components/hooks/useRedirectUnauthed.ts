import { useNavigate } from "@reach/router";
import * as React from "react";
import { StateContext } from "../AppState";

export default function useRedirectUnauthed() {
  const navigate = useNavigate();
  const { user } = React.useContext(StateContext);
  React.useEffect(() => {
    if (!user.email) navigate("/");
  }, []);
}
