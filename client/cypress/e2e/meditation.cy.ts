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
});
