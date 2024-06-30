import { ERRORS, SELECTORS } from "./constants";

describe("run", () => {
  beforeEach(() => {
    cy.login();
  });

  describe("adding", () => {
    beforeEach(() => {
      cy.visit("/runs/add");
      cy.get(SELECTORS.eventAddPage);
    });

    it("errors when nothing is input", () => {
      cy.get(SELECTORS.runNoInputErrorMessage).should("not.exist");
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.get(SELECTORS.runNoInputErrorMessage);
      cy.location("pathname").should("equal", "/runs/add");
    });

    it("errors when meters is too small", () => {
      cy.get(SELECTORS.runMetersInput).type("0{enter}");
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.rangeUnderflow,
      );
    });

    it("errors when meters is too large", () => {
      cy.get(SELECTORS.runMetersInput).type("60000{enter}");
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.rangeOverflow,
      );
    });

    it("errors when meters is not an integer", () => {
      cy.get(SELECTORS.runMetersInput).type("100.1{enter}");
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should("have.text", ERRORS.integer);
    });

    it("works when only provided with distance", () => {
      cy.get(SELECTORS.runMetersInput).type("1234{enter}");
      cy.location("pathname").should("equal", "/");
      cy.get(SELECTORS.runCardDistance).first().should("have.text", "1.2 km");
    });

    it("works when only provided with time", () => {
      cy.get(SELECTORS.runMinutesInput).select("9");
      cy.get(SELECTORS.runSecondsInput).select("30");
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.location("pathname").should("equal", "/");
      cy.get(SELECTORS.runCardTime).first().should("have.text", "09:30");
    });

    it("works when provided with both distance and time", () => {
      cy.get(SELECTORS.runMetersInput).type("123");
      cy.get(SELECTORS.runMinutesInput).select("10");
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.location("pathname").should("equal", "/");
      cy.get(SELECTORS.runCardDistance).first().should("have.text", "123 m");
      cy.get(SELECTORS.runCardTime).first().should("have.text", "10:00");
    });
  });
});
