import type { AppEvent } from "../../src/types";
import { SELECTORS } from "./constants";

const day = "2024-03-10";
const range = `dateFrom=${day}&dateTo=${day}`;

function makeEvent(index: number): AppEvent {
  const createdAt = new Date(2024, 2, 10, 12, index).toISOString();
  switch (index % 8) {
    case 0:
      return {
        createdAt,
        type: "v1/leg-raises/create",
        payload: { value: 10 },
      };
    case 1:
      return {
        createdAt,
        type: "v1/meditations/create",
        payload: { seconds: 60 },
      };
    case 2:
      return { createdAt, type: "v1/moods/create", payload: { mood: 5 } };
    case 3:
      return { createdAt, type: "v1/push-ups/create", payload: { value: 10 } };
    case 4:
      return { createdAt, type: "v1/runs/create", payload: { meters: 1000 } };
    case 5:
      return { createdAt, type: "v1/sit-ups/create", payload: { value: 10 } };
    case 6:
      return {
        createdAt,
        type: "v1/sleeps/create",
        payload: { dateAwoke: day, minutesSlept: 480 },
      };
    default:
      return { createdAt, type: "v1/weights/create", payload: { value: 70 } };
  }
}

const events = Array.from({ length: 23 }, (_, i) => makeEvent(i));
const multiDayEvents = Array.from({ length: 16 }, (_, i) => {
  const date = new Date(2024, 2, 1 + i * 2, 12);
  return [
    {
      createdAt: date.toISOString(),
      type: "v1/moods/create",
      payload: { mood: 5 },
    },
    {
      createdAt: new Date(date.getTime() + 1000).toISOString(),
      type: "v1/meditations/create",
      payload: { seconds: 60 },
    },
  ] satisfies AppEvent[];
}).flat();

function cacheEvents(fixture?: AppEvent[]) {
  return cy.window().then(
    (win) =>
      new Cypress.Promise<void>((resolve, reject) => {
        const request = win.indexedDB.open("keyval-store");
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction("keyval", "readwrite");
          const store = transaction.objectStore("keyval");
          const user = store.get("moodtracker:user");
          user.onsuccess = () => {
            if (!user.result?.id) {
              transaction.abort();
              return reject(
                new Error("Authenticated user is missing from storage"),
              );
            }
            const key = `moodtracker:${user.result.id}:events`;
            if (fixture)
              store.put(
                {
                  allIds: fixture.map(({ createdAt }) => createdAt),
                  byId: Object.fromEntries(
                    fixture.map((event) => [event.createdAt, event]),
                  ),
                  hasLoadedFromServer: true,
                  idsToSync: [],
                  nextCursor: "synthetic-events",
                },
                key,
              );
            else store.delete(key);
          };
          transaction.oncomplete = () => {
            db.close();
            resolve();
          };
          transaction.onerror = () => {
            db.close();
            reject(transaction.error);
          };
        };
      }),
  );
}

describe("combined event log", () => {
  beforeEach(() => {
    cy.login();
    cy.intercept("GET", /\/api\/events(?:\/|\?|$)/, {
      events: [],
      hasNextPage: false,
      nextCursor: "synthetic-events",
    }).as("events");
    cy.intercept("POST", /\/api\/events(?:\/|\?|$)/, { statusCode: 200 }).as(
      "saveEvents",
    );
    cy.visit("/events");
    cy.wait("@events");
    cy.contains("h2", "Event log");
    cacheEvents(events);
    cy.reload();
    cy.wait("@events");
    cy.contains("h2", "Event log");
  });

  afterEach(() => {
    cacheEvents();
  });

  it("opens the event log from navigation and closes the menu", () => {
    cy.viewport(1000, 660);
    cy.visit("/about");
    cy.get(SELECTORS.navButton).click();
    cy.get('nav a[href="/events"]').should("have.text", "Event log").click();
    cy.location("pathname").should("equal", "/events");
    cy.contains("h2", "Event log");
    cy.get("nav.nav").should("not.exist");
  });

  it("paginates mixed events and restores the page through reload and history", () => {
    cacheEvents(multiDayEvents);
    cy.visit("/events");
    cy.get(".card").should("have.length", 14);
    cy.get('[aria-label="navigate to page 2"]').click();
    cy.location("search").should("contain", "page=2");
    cy.get(".card").should("have.length", 14);
    cy.reload();
    cy.get('[aria-label="navigate to page 2"]').should("be.disabled");
    cy.get('[aria-label="navigate to page 3"]').click();
    cy.get(".card").should("have.length", 4);
    cy.go("back");
    cy.get('[aria-label="navigate to page 2"]').should("be.disabled");
    cy.go("forward");
    cy.get('[aria-label="navigate to page 3"]').should("be.disabled");
  });

  it("keeps all mixed events for a busy day on one page", () => {
    cy.visit(`/events?${range}`);
    cy.get(".card").should("have.length", 23);
    cy.get(".pagination").should("not.exist");
  });

  it("updates inclusive date controls, resets pagination, and restores URL dates", () => {
    cacheEvents(multiDayEvents);
    cy.visit("/events?dateFrom=2024-03-01&dateTo=2024-03-31&page=2");
    cy.get('input[type="date"]').first().clear();
    cy.get('input[type="date"]').first().type("2024-03-03");
    cy.location("search")
      .should("contain", "dateFrom=2024-03-03")
      .and("not.contain", "page=");
    cy.get('[aria-label="navigate to page 2"]').click();
    cy.get('input[type="date"]').first().clear();
    cy.get('input[type="date"]').first().type("2024-03-31");
    cy.location("search").should("not.contain", "page=");
    cy.get(".card").should("have.length", 2);
    cy.get('input[type="date"]').last().clear();
    cy.get('input[type="date"]').last().type("2024-04-01");
    cy.location("search").should("contain", "dateTo=2024-04-01");
    cy.go("back");
    cy.get('input[type="date"]').last().should("have.value", "2024-03-31");
    cy.go("forward");
    cy.get('input[type="date"]').last().should("have.value", "2024-04-01");
  });

  it("keeps controls available for empty ranges and users without moods", () => {
    cy.visit("/events?dateFrom=2024-03-11&dateTo=2024-03-11");
    cy.contains("No events found");
    cy.get('input[type="date"]').should("have.length", 2);
    cy.get(".pagination").should("not.exist");
    cacheEvents(events.filter(({ type }) => type !== "v1/moods/create"));
    cy.visit(`/events?${range}`);
    cy.get(".card").should("have.length", 20);
    cy.get('input[type="date"]').first().clear();
    cy.get('input[type="date"]').first().type("2024-03-09");
    cy.location("search").should("contain", "dateFrom=2024-03-09");
    cacheEvents([]);
    cy.visit("/events");
    cy.contains("No events found");
    cy.get('input[type="date"]').should("have.length", 2);
  });

  it("redirects impossible and reversed dates and clamps invalid pages", () => {
    cacheEvents(multiDayEvents);
    for (const query of [
      "dateFrom=2024-02-30",
      "dateFrom=2024-03-11&dateTo=2024-03-10",
      "dateTo=invalid&page=2",
    ]) {
      cy.visit(`/events?${query}`);
      cy.location("search").should("equal", "");
      cy.get(".card").should("have.length", 14);
    }
    cy.visit("/events?page=999");
    cy.location("search").should("contain", "page=3");
    cy.get(".card").should("have.length", 4);
    cy.visit("/events?page=-1");
    cy.location("search").should("not.contain", "page=");
    cy.get(".card").should("have.length", 14);
  });

  it("preserves edit/save and delete actions", () => {
    cy.visit(`/events?${range}`);
    cy.get(SELECTORS.eventCardValue).first().click();
    cy.contains("h2", "Edit");
    cy.contains("button", "Back").click();
    cy.location("pathname").should("equal", "/events");
    cy.get(SELECTORS.eventCardValue).first().click();
    cy.contains("button", "Delete").click();
    cy.get("dialog[open]").contains("button", "Delete").click();
    cy.location("pathname").should("equal", "/");
    cy.visit(`/events?${range}`);
    cy.get(SELECTORS.moodCardMood).first().click();
    cy.get(SELECTORS.explorationInput).type("Synthetic event review");
    cy.contains("button", "Save").click();
    cy.location("pathname").should("equal", "/");
    cy.visit(`/events?${range}`);
    cy.contains("Synthetic event review");
  });

  it("clamps pagination when the last event on the last page is deleted", () => {
    cacheEvents(
      Array.from({ length: 8 }, (_, i): AppEvent => ({
        createdAt: new Date(2024, 2, i + 1, 12).toISOString(),
        type: "v1/meditations/create",
        payload: { seconds: 60 },
      })),
    );
    cy.visit("/events?page=2");
    cy.get(".card").should("have.length", 1);
    cy.get(".card button").click();
    cy.get("dialog[open]").contains("button", "Delete").click();
    cy.location("search").should("not.contain", "page=");
    cy.get(".card").should("have.length", 7);
    cy.get(".pagination").should("not.exist");
  });

  it("links Explore to the selected preset or custom date range", () => {
    cy.visit("/stats/explore");
    for (const preset of ["Today", "All time"]) {
      cy.get("select").first().select(preset);
      cy.get('input[type="date"]').then(($inputs) => {
        const from = $inputs.first().val();
        const to = $inputs.last().val();
        cy.contains("a", "View events").should(
          "have.attr",
          "href",
          `/events?dateFrom=${from}&dateTo=${to}`,
        );
      });
    }
    cy.get('input[type="date"]').first().clear();
    cy.get('input[type="date"]').first().type(day);
    cy.get('input[type="date"]').last().clear();
    cy.get('input[type="date"]').last().type(day);
    cy.contains("a", "View events")
      .should("have.attr", "href", `/events?${range}`)
      .click();
    cy.get('input[type="date"]').first().should("have.value", day);
    cy.get('input[type="date"]').last().should("have.value", day);
    cy.get(".card").should("have.length", 23);
  });

  it("links calendar stats to their complete periods", () => {
    for (const [path, from, to] of [
      ["/stats/days/2024-03-10", "2024-03-10", "2024-03-10"],
      ["/stats/weeks/2024-03-04", "2024-03-04", "2024-03-10"],
      ["/stats/months/2024-03", "2024-03-01", "2024-03-31"],
      ["/stats/years/2024", "2024-01-01", "2024-12-31"],
    ]) {
      cy.visit(path);
      cy.contains("a", "View events")
        .should("have.attr", "href", `/events?dateFrom=${from}&dateTo=${to}`)
        .click();
      cy.get('input[type="date"]').first().should("have.value", from);
      cy.get('input[type="date"]').last().should("have.value", to);
      cy.get(".card").should("have.length", 23);
    }
  });
});
