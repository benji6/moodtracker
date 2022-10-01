import { Fab, Icon } from "eri";
import { useLocation, useNavigate } from "react-router-dom";

const PATHS_TO_HIDE_ON = ["/add", "/edit", "/meditation"] as const;

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
