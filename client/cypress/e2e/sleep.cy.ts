import { ERRORS, SELECTORS } from "./constants";

const formatIsoDateInLocalTimezone = (date: Date): string =>
  `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;

describe("sleep", () => {
  beforeEach(() => {
    cy.login();
  });

  describe("adding a sleep", () => {
    beforeEach(() => {
      cy.visit("/sleeps/add");
      cy.get(SELECTORS.eventAddPage);
      cy.get(SELECTORS.dateAwokeInput).should(
        "have.value",
        formatIsoDateInLocalTimezone(new Date()),
      );
    });

    it("errors when there is no date awoke", () => {
      cy.get(SELECTORS.dateAwokeInput).clear();
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.required,
      );
    });

    it("errors when date awoke is in the future", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      cy.get(SELECTORS.dateAwokeInput).type(
        formatIsoDateInLocalTimezone(tomorrow),
      );
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.rangeOverflow,
      );
    });

    it("works when input is valid", () => {
      cy.get(SELECTORS.hoursSleptInput).select("8");
      cy.get(SELECTORS.minutesSleptInput).select("10");
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.location("pathname").should("equal", "/");
      cy.get(SELECTORS.sleepCardValue)
        .first()
        .should("have.text", "8 hr & 10 min");
    });
  });
});
