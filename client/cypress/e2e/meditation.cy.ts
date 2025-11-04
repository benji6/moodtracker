import { ERRORS, PATHS, SELECTORS } from "./constants";

describe("meditation", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(PATHS.meditation);
    cy.get(SELECTORS.meditatePage);
  });

  it("works when using a preset time", () => {
    cy.get(
      `${SELECTORS.meditationPresetTimeButton}[data-minutes="10"]`,
    ).click();
    cy.get(SELECTORS.meditationTimerPage);
    cy.location("pathname").should("equal", PATHS.meditationTimer);
    cy.location("search").should("equal", "?t=600");
  });

  describe("custom time", () => {
    beforeEach(() => {
      cy.get('[data-eri-id="field-error"]').should("not.exist");
    });

    it("errors when there is no value", () => {
      cy.get(SELECTORS.meditationCustomTimeInput).type("{enter}");
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.required,
      );
    });

    it("errors when value is not an integer", () => {
      cy.get(SELECTORS.meditationCustomTimeInput).type("6e1{enter}");
      cy.get('[data-eri-id="field-error"]').should("have.text", ERRORS.integer);
    });

    it("errors when value is too large", () => {
      cy.get(SELECTORS.meditationCustomTimeInput).type("181{enter}");
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        "The maximum allowed time is 180 minutes",
      );
    });

    it("works when value is valid", () => {
      cy.get(SELECTORS.meditationCustomTimeInput).type("60{enter}");
      cy.get('[data-eri-id="field-error"]').should("not.exist");
      cy.get(SELECTORS.meditationTimerPage);
      cy.location("pathname").should("equal", PATHS.meditationTimer);
      cy.location("search").should("equal", "?t=3600");
    });
  });

  describe("adding", () => {
    beforeEach(() => {
      cy.visit("/meditation/add");
      cy.get(SELECTORS.eventAddPage);
    });

    it("errors when no time is provided", () => {
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.contains("Please provide a time");
      cy.location("pathname").should("equal", "/meditation/add");
    });

    it("works with only minutes", () => {
      cy.get('select[name="minutes"]').select("5");
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.location("pathname").should("equal", "/");
      cy.get(SELECTORS.meditationCardDuration)
        .first()
        .should("have.text", "5 min");
    });

    it("works with only seconds", () => {
      cy.get('select[name="seconds"]').select("30");
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.location("pathname").should("equal", "/");
      cy.get(SELECTORS.meditationCardDuration)
        .first()
        .should("have.text", "30 sec");
    });

    it("works with both minutes and seconds", () => {
      cy.get('select[name="minutes"]').select("10");
      cy.get('select[name="seconds"]').select("45");
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.location("pathname").should("equal", "/");
      cy.get(SELECTORS.meditationCardDuration)
        .first()
        .should("have.text", "10 min & 45 sec");
    });
  });
});
