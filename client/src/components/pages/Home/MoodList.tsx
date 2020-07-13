import { NavigateFn } from "@reach/router";
import { Card, Paper, SubHeading, Pagination } from "eri";
import * as React from "react";
import CardGroup from "eri/dist/components/Card/CardGroup";
import { moodToColor } from "../../../utils";
import { StateContext } from "../../AppState";

const PAGE_SIZE = 12;

interface Props {
  navigate: NavigateFn;
}

export default function MoodList({ navigate }: Props) {
  const state = React.useContext(StateContext);
  const [page, setPage] = React.useState(0);
  const pageCount = Math.ceil(state.moods.allIds.length / PAGE_SIZE);

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
                  "--color": moodToColor(mood.mood / 10),
                } as React.CSSProperties
              }
            >
              <h2 e-util="center">
                {mood.mood}
                <SubHeading>{new Date(id).toLocaleString()}</SubHeading>
              </h2>
            </Card>
          );
        })}
      </CardGroup>
      <Pagination onChange={setPage} page={page} pageCount={pageCount} />
    </Paper>
  );
}
