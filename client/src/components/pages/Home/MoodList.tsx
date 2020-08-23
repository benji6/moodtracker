import { Card, Paper, SubHeading, Pagination } from "eri";
import * as React from "react";
import CardGroup from "eri/dist/components/Card/CardGroup";
import { moodToColor } from "../../../utils";
import { StateContext } from "../../AppState";
import { useNavigate, useLocation } from "@reach/router";

const PAGE_SIZE = 12;

export default function MoodList() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = React.useContext(StateContext);
  const pageCount = Math.ceil(state.moods.allIds.length / PAGE_SIZE);

  const pageStr = new URLSearchParams(location?.search).get("page");
  const page = pageStr === null ? 0 : parseInt(pageStr) - 1;

  if (pageStr && Number(pageStr) - 1 !== page) {
    navigate(page ? `?page=${page + 1}` : "/");
    return null;
  }

  if (pageStr === "1" || page < 0 || page >= pageCount) {
    navigate("/");
    return null;
  }

  const endIndex = state.moods.allIds.length - page * PAGE_SIZE;

  const visibleMoodIds = state.moods.allIds
    .slice(Math.max(endIndex - PAGE_SIZE, 0), endIndex)
    .reverse();

  return (
    <Paper data-test-id="mood-list">
      <h2>Mood list</h2>
      <CardGroup>
        {visibleMoodIds.map((id) => {
          const mood = state.moods.byId[id];
          return (
            <Card
              key={id}
              onClick={() => navigate(`edit/${id}`)}
              style={
                {
                  "--color": moodToColor(mood.mood),
                } as React.CSSProperties
              }
            >
              <h2 className="center">
                {mood.mood}
                <SubHeading>{new Date(id).toLocaleString()}</SubHeading>
              </h2>
            </Card>
          );
        })}
      </CardGroup>
      <Pagination
        onChange={(page) => navigate(page ? `?page=${page + 1}` : "/")}
        page={page}
        pageCount={pageCount}
      />
    </Paper>
  );
}
