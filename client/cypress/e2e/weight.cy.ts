import { ERRORS, PATHS, SELECTORS } from "./constants";

describe("weight", () => {
  beforeEach(() => {
    cy.login();
  });

  describe("adding a weight", () => {
    beforeEach(() => {
      cy.visit(PATHS.weightAdd);
      cy.get(SELECTORS.eventAddPage);
    });

    it("errors when there is no value", () => {
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.required,
      );
    });

    it("errors when text is typed instead of a number", () => {
      cy.get(SELECTORS.weightValueInput).type("a{enter}");
      cy.get(SELECTORS.weightValueInput).should("have.value", "");
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.required,
      );
    });

    it("errors when range overflows", () => {
      cy.get(SELECTORS.weightValueInput).type("650.1{enter}");
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.rangeOverflow,
      );
    });

    it("errors when range underflows", () => {
      cy.get(SELECTORS.weightValueInput).type("-0.01{enter}");
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.rangeUnderflow,
      );
    });

    it("works when the value is valid", () => {
      const testValue = "70";
      cy.get(SELECTORS.weightValueInput).type(`${testValue}{enter}`);
      const expectedTime = Math.round(Date.now() / 1e3);

      cy.location("pathname").should("equal", PATHS.weightLog);
      cy.get(SELECTORS.weightCardValue)
        .first()
        .should("have.text", `${testValue}kg`);

      cy.get(SELECTORS.weightCardTime)
        .invoke("attr", "data-time")
        .should("equal", String(expectedTime));
    });
  });
});
