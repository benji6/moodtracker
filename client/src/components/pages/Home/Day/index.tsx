import addDays from "date-fns/addDays";
import { Card, Paper } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { dateWeekdayFormatter } from "../../../../formatters";
import { normalizedMoodsSelector } from "../../../../selectors";
import { createDateFromLocalDateString, mapRight } from "../../../../utils";
import MoodGradientForPeriod from "../../Stats/MoodGradientForPeriod";
import MoodCard from "./MoodCard";

interface Props {
  day: string;
  moodIds: string[];
}

export default function Day({ day: dayStr, moodIds }: Props) {
  const moods = useSelector(normalizedMoodsSelector);
  const day = createDateFromLocalDateString(dayStr);

  return (
    <Paper>
      <h3>{dateWeekdayFormatter.format(day)}</h3>
      <MoodGradientForPeriod fromDate={day} toDate={addDays(day, 1)} />
      <Card.Group>
        {mapRight(moodIds, (id) => (
          <MoodCard id={id} key={id} {...moods.byId[id]} />
        ))}
      </Card.Group>
    </Paper>
  );
}
