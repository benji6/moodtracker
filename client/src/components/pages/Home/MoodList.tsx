import { Card, Paper, SubHeading, Pagination } from "eri";
import * as React from "react";
import CardGroup from "eri/dist/components/Card/CardGroup";
import { moodToColor } from "../../../utils";
import { StateContext } from "../../AppState";
import { useNavigate, useLocation } from "@reach/router";
import { NormalizedMoods } from "../../../types";

const DAYS_PER_PAGE = 6;

const dateFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
});

const timeFormatter = Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

const groupByDay = (moods: NormalizedMoods): [string, string[]][] => {
  const moodsGroupedByDate: { [date: string]: string[] } = {};

  for (const id of moods.allIds) {
    const key = id.split("T", 1)[0];
    if (moodsGroupedByDate[key]) moodsGroupedByDate[key].push(id);
    else moodsGroupedByDate[key] = [id];
  }

  return Object.entries(moodsGroupedByDate);
};

export default function MoodList() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = React.useContext(StateContext);

  const pageStr = new URLSearchParams(location?.search).get("page");
  const page = pageStr === null ? 0 : parseInt(pageStr) - 1;

  if (pageStr && Number(pageStr) - 1 !== page) {
    navigate(page ? `?page=${page + 1}` : "/");
    return null;
  }

  const moodsGroupedByDay = React.useMemo(() => groupByDay(state.moods), [
    state.moods,
  ]);
  const pageCount = Math.ceil(moodsGroupedByDay.length / DAYS_PER_PAGE);

  if (pageStr === "1" || page < 0 || page >= pageCount) {
    navigate("/");
    return null;
  }

  const endIndex = moodsGroupedByDay.length - page * DAYS_PER_PAGE;

  return (
    <>
      <Paper data-test-id="mood-list">
        <h2>Mood list</h2>
      </Paper>
      {moodsGroupedByDay
        .slice(Math.max(endIndex - DAYS_PER_PAGE, 0), endIndex)
        .reverse()
        .map(([date, ids]) => (
          <Paper key={date}>
            <h3>{dateFormatter.format(new Date(date))}</h3>
            <CardGroup>
              {ids.map((id) => {
                const mood = state.moods.byId[id];
                return (
                  <Card
                    color={moodToColor(mood.mood)}
                    key={id}
                    onClick={() => navigate(`edit/${id}`)}
                  >
                    <h3 className="center">
                      {mood.mood}
                      <SubHeading>
                        {timeFormatter.format(new Date(id))}
                      </SubHeading>
                    </h3>
                  </Card>
                );
              })}
            </CardGroup>
          </Paper>
        ))}
      <Paper>
        <Pagination
          onChange={(page) => navigate(page ? `?page=${page + 1}` : "/")}
          page={page}
          pageCount={pageCount}
        />
      </Paper>
    </>
  );
}
