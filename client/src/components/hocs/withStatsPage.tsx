import isValid from "date-fns/isValid";
import { Paper, Spinner } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  eventsHasLoadedFromServerSelector,
  normalizedMoodsSelector,
} from "../../selectors";
import { createDateFromLocalDateString } from "../../utils";
import RedirectHome from "../shared/RedirectHome";
import GetStartedCta from "../shared/GetStartedCta";

// TODO probably a nicer way of writing this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props extends Record<string, any> {
  date: Date;
  nextDate: Date;
  prevDate: Date;
  showNext: boolean;
  showPrevious: boolean;
}

export default function withStatsPage({
  addPeriod,
  Component,
  adjustDate = (x) => x,
  dateRegex = /^\d{4}-\d{2}-\d{2}$/,
}: {
  addPeriod(date: number | Date, amount: number): Date;
  adjustDate?: (date: Date) => Date;
  dateRegex?: RegExp;
  Component: React.ComponentType<Props>;
}) {
  return function WithStatsPage(
    props: Omit<
      Props,
      "date" | "nextDate" | "prevDate" | "showNext" | "showPrevious"
    >
  ) {
    const { date: dateStr } = useParams();
    const eventsHasLoadedFromServer = useSelector(
      eventsHasLoadedFromServerSelector
    );
    const moods = useSelector(normalizedMoodsSelector);

    if (!dateStr || !dateRegex.test(dateStr)) return <RedirectHome />;
    const date = adjustDate(createDateFromLocalDateString(dateStr));
    if (!isValid(date)) return <RedirectHome />;
    if (!eventsHasLoadedFromServer) return <Spinner />;
    if (!moods.allIds.length)
      return (
        <Paper.Group>
          <GetStartedCta />
        </Paper.Group>
      );

    const firstMoodDate = new Date(moods.allIds[0]);
    const nextDate = addPeriod(date, 1);

    return (
      <Component
        {...props}
        date={date}
        nextDate={nextDate}
        prevDate={addPeriod(date, -1)}
        showNext={nextDate <= new Date()}
        showPrevious={date > firstMoodDate}
      />
    );
  };
}
