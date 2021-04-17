import { useLocation, useNavigate } from "@reach/router";
import { Fab, Icon } from "eri";
import * as React from "react";

const PATHS_TO_HIDE_ON = ["/add", "/edit", "/meditate"];

interface Props {
  hide: boolean;
}

export default function AddMoodFab({ hide }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Fab
      hide={hide || PATHS_TO_HIDE_ON.some((path) => pathname.startsWith(path))}
      onClick={() => navigate(`/add`)}
    >
      <Icon name="plus" size="4" />
      Add mood
    </Fab>
  );
}
