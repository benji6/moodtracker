import { describe, expect, it } from "vitest";
import { AppEvent } from "../../../../types";
import EmotionCircumplexForPeriod from ".";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import eventsSlice from "../../../../store/eventsSlice";
import { renderToStaticMarkup } from "react-dom/server";

function renderPeriod(events: AppEvent[], previousDateFrom?: Date) {
  const store = configureStore({
    reducer: { events: eventsSlice.reducer },
  });
  for (const event of events) store.dispatch(eventsSlice.actions.add(event));

  return renderToStaticMarkup(
    <Provider store={store}>
      <EmotionCircumplexForPeriod
        dateFrom={new Date("2024-10-01T00:00:00.000Z")}
        dateTo={new Date("2024-10-02T00:00:00.000Z")}
        previousDateFrom={previousDateFrom}
      />
    </Provider>,
  );
}

describe("EmotionCircumplexForPeriod", () => {
  it("hides the entire card when there are no entries", () => {
    expect(renderPeriod([])).toBe("");
  });

  it("shows zero coverage without a chart or invalid stats for unmatched entries", () => {
    const markup = renderPeriod([
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T01:00:00.000Z",
        payload: { mood: 5, exploration: "A walk in the park" },
      },
    ]);
    expect(markup).toContain(
      "<strong>Match coverage</strong>: 0.0% (0 of 1 entries)",
    );
    expect(markup).toContain("No emotion matches in this period.");
    expect(markup).not.toContain("<svg");
    expect(markup).not.toContain("NaN");
    expect(markup).not.toContain("Mean valence");
  });

  it("shows a single match without requiring enough words for a mood cloud", () => {
    const markup = renderPeriod([
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T01:00:00.000Z",
        payload: { mood: 5, exploration: "happy" },
      },
    ]);
    expect(markup).toContain("<h3>Emotion circumplex</h3>");
    expect(markup).toContain("<title>Happy: 1 entry</title>");
    expect(markup).toContain("<strong>Mean valence</strong>: 0.85");
    expect(markup).toContain("<strong>Mean arousal</strong>: 0.12");
    expect(markup).toContain("<strong>Valence spread</strong>: 0.00");
    expect(markup).toContain("<strong>Arousal spread</strong>: 0.00");
    expect(markup).toContain(
      "No emotion matches in the previous period to compare.",
    );
    expect(markup).toContain("not measurements of your emotional state");
    expect(markup).toContain("not an exhaustive list of emotions");
    expect(markup).toContain("Matching does not interpret context or negation");
    expect(markup).toContain('href="https://doi.org/10.1037/h0077714"');
  });

  it("weights means by entry counts and excludes unmatched entries", () => {
    const markup = renderPeriod([
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T01:00:00.000Z",
        payload: { mood: 5, exploration: "happy happy" },
      },
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T02:00:00.000Z",
        payload: { mood: 5, exploration: "happy excited" },
      },
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T03:00:00.000Z",
        payload: { mood: 5, exploration: "A walk in the park" },
      },
    ]);
    expect(markup).toContain("<strong>Mean valence</strong>: 0.76");
    expect(markup).toContain("<strong>Mean arousal</strong>: 0.30");
    expect(markup).toContain("<strong>Valence spread</strong>: 0.13");
    expect(markup).toContain("<strong>Arousal spread</strong>: 0.25");
    expect(markup).toContain(
      "<strong>Match coverage</strong>: 66.7% (2 of 3 entries)",
    );
    expect(markup).toContain(
      "<title>Pleasant, high energy: 100.0% of emotion matches</title>",
    );
  });

  it("lays out quadrant shares like the circumplex and keeps axis matches separate", () => {
    const markup = renderPeriod([
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T01:00:00.000Z",
        payload: { mood: 5, exploration: "happy calm angry sad neutral" },
      },
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T02:00:00.000Z",
        payload: { mood: 5, exploration: "happy calm angry" },
      },
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T03:00:00.000Z",
        payload: { mood: 5, exploration: "happy calm" },
      },
    ]);

    expect(markup).not.toContain("<table");
    for (const [label, percentage] of [
      ["Unpleasant, high energy", "20.0%"],
      ["Pleasant, high energy", "30.0%"],
      ["Unpleasant, low energy", "10.0%"],
      ["Pleasant, low energy", "30.0%"],
    ]) {
      expect(markup).toContain(
        `<title>${label}: ${percentage} of emotion matches</title>`,
      );
    }
    expect(markup).toContain("<p><strong>On an axis</strong>: 10.0%");
  });

  it("compares the preceding equal-length range without sharing the start boundary", () => {
    const markup = renderPeriod([
      {
        type: "v1/moods/create",
        createdAt: "2024-09-29T23:59:59.999Z",
        payload: { mood: 5, exploration: "sad" },
      },
      {
        type: "v1/moods/create",
        createdAt: "2024-09-30T00:00:00.000Z",
        payload: { mood: 5, exploration: "excited" },
      },
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T03:00:00.000Z",
        payload: {
          mood: 5,
          exploration: "excited",
          experiencedAt: "2024-09-30T23:59:59.999Z",
        },
      },
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T00:00:00.000Z",
        payload: { mood: 5, exploration: "happy" },
      },
    ]);
    expect(markup).toContain(
      "<strong>Valence change from previous period</strong>: +0.27",
    );
    expect(markup).toContain(
      "<strong>Arousal change from previous period</strong>: -0.53",
    );
    expect(markup).toContain(
      "<strong>Match coverage</strong>: 100.0% (1 of 1 entries)",
    );
  });

  it("uses an explicit previous calendar period instead of the current duration", () => {
    const markup = renderPeriod(
      [
        {
          type: "v1/moods/create",
          createdAt: "2024-08-31T23:59:59.999Z",
          payload: { mood: 5, exploration: "sad" },
        },
        {
          type: "v1/moods/create",
          createdAt: "2024-09-01T00:00:00.000Z",
          payload: { mood: 5, exploration: "excited" },
        },
        {
          type: "v1/moods/create",
          createdAt: "2024-10-01T01:00:00.000Z",
          payload: { mood: 5, exploration: "happy" },
        },
      ],
      new Date("2024-09-01T00:00:00.000Z"),
    );
    expect(markup).toContain(
      "<strong>Valence change from previous period</strong>: +0.27",
    );
    expect(markup).toContain(
      "<strong>Arousal change from previous period</strong>: -0.53",
    );
  });

  it("displays unchanged zero-valued means and changes", () => {
    const markup = renderPeriod([
      {
        type: "v1/moods/create",
        createdAt: "2024-09-30T01:00:00.000Z",
        payload: { mood: 5, exploration: "neutral" },
      },
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T01:00:00.000Z",
        payload: { mood: 5, exploration: "neutral" },
      },
    ]);
    expect(markup).toContain("<strong>Mean valence</strong>: 0.00");
    expect(markup).toContain("<strong>Mean arousal</strong>: 0.00");
    expect(markup).toContain(
      "<strong>Valence change from previous period</strong>: 0.00",
    );
    expect(markup).toContain(
      "<strong>Arousal change from previous period</strong>: 0.00",
    );
    expect(markup).toContain("<p><strong>On an axis</strong>: 100.0%");
    expect(markup.match(/fill-opacity="0"/g)).toHaveLength(4);
  });

  it("shows added emotions matched from journal text and legacy tags", () => {
    const markup = renderPeriod([
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T01:00:00.000Z",
        payload: {
          mood: 5,
          description: "anxious grieving",
          exploration:
            "Some anxiety and grief, then relief, gratitude and belonging",
        },
      },
    ]);
    expect(markup).toContain("<title>Anxious: 1 entry</title>");
    expect(markup).toContain("<title>Relieved: 1 entry</title>");
    expect(markup).toContain("<title>Grateful: 1 entry</title>");
    expect(markup).toContain("<title>Grieving: 1 entry</title>");
    expect(markup).toContain("<title>Connected: 1 entry</title>");
  });

  it("uses experienced dates, creation fallback, and existing inclusive boundaries", () => {
    const markup = renderPeriod([
      {
        type: "v1/moods/create",
        createdAt: "2024-09-30T12:00:00.000Z",
        payload: {
          mood: 5,
          description: "happy",
          experiencedAt: "2024-10-01T00:00:00.000Z",
        },
      },
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T01:00:00.000Z",
        payload: {
          mood: 5,
          exploration: "angry",
          experiencedAt: "2024-09-30T12:00:00.000Z",
        },
      },
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T12:00:00.000Z",
        payload: { mood: 5, exploration: "calm" },
      },
      {
        type: "v1/moods/create",
        createdAt: "2024-10-02T00:00:00.000Z",
        payload: { mood: 5, exploration: "sad" },
      },
      {
        type: "v1/moods/create",
        createdAt: "2024-10-02T00:00:00.001Z",
        payload: { mood: 5, exploration: "excited" },
      },
    ]);
    expect(markup).toContain("<title>Happy: 1 entry</title>");
    expect(markup).toContain("<title>Calm: 1 entry</title>");
    expect(markup).toContain("<title>Sad: 1 entry</title>");
    expect(markup).not.toContain("<title>Angry:");
    expect(markup).not.toContain("<title>Excited:");
  });

  it("reflects journal edits, deletions, and changes to experienced dates", () => {
    const markup = renderPeriod([
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T00:00:00.000Z",
        payload: { mood: 5, exploration: "happy" },
      },
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T01:00:00.000Z",
        payload: { mood: 5, description: "sad" },
      },
      {
        type: "v1/moods/create",
        createdAt: "2024-10-01T02:00:00.000Z",
        payload: { mood: 5, exploration: "angry" },
      },
      {
        type: "v1/moods/update",
        createdAt: "2024-10-01T03:00:00.000Z",
        payload: {
          id: "2024-10-01T00:00:00.000Z",
          exploration: "calm",
        },
      },
      {
        type: "v1/moods/delete",
        createdAt: "2024-10-01T04:00:00.000Z",
        payload: "2024-10-01T01:00:00.000Z",
      },
      {
        type: "v1/moods/update",
        createdAt: "2024-10-01T05:00:00.000Z",
        payload: {
          id: "2024-10-01T02:00:00.000Z",
          experiencedAt: "2024-10-03T00:00:00.000Z",
        },
      },
    ]);
    expect(markup).toContain("<title>Calm: 1 entry</title>");
    expect(markup).not.toContain("<title>Happy:");
    expect(markup).not.toContain("<title>Sad:");
    expect(markup).not.toContain("<title>Angry:");
  });
});
