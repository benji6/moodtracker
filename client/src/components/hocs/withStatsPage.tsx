import { Paper, Spinner } from "eri";
import { ComponentType } from "react";
import GetStartedCta from "../shared/GetStartedCta";
import RedirectHome from "../shared/RedirectHome";
import { createDateFromLocalDateString } from "../../utils";
import eventsSlice from "../../store/eventsSlice";
import { isValid } from "date-fns";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

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
  Component: ComponentType<Props>;
}) {
  return function WithStatsPage(
    props: Omit<
      Props,
      "date" | "nextDate" | "prevDate" | "showNext" | "showPrevious"
    >,
  ) {
    const { date: dateStr } = useParams();
    const eventsHasLoadedFromServer = useSelector(
      eventsSlice.selectors.hasLoadedFromServer,
    );
    const moods = useSelector(eventsSlice.selectors.normalizedMoods);

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
