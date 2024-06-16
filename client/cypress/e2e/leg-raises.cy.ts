import { ERRORS, SELECTORS } from "./constants";

describe("leg raises", () => {
  beforeEach(() => {
    cy.login();
  });

  describe("adding leg raises", () => {
    beforeEach(() => {
      cy.visit("/leg-raises/add");
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

    it("errors when provided with text instead of number", () => {
      cy.get(SELECTORS.legRaisesValueInput).type("a{enter}");
      cy.get(SELECTORS.legRaisesValueInput).should("have.value", "");
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.required,
      );
    });

    it("errors when range overflows", () => {
      cy.get(SELECTORS.legRaisesValueInput).type("1001{enter}");
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.rangeOverflow,
      );
    });

    it("errors when range underflows", () => {
      cy.get(SELECTORS.legRaisesValueInput).type("0{enter}");
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.rangeUnderflow,
      );
    });

    it("errors when value is not an integer", () => {
      cy.get(SELECTORS.legRaisesValueInput).type("20.1{enter}");
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should("have.text", ERRORS.integer);
    });

    it("works when value is valid", () => {
      const testValue = "20";
      cy.get(SELECTORS.legRaisesValueInput).type(testValue);
      const expectedTime = Math.round(Date.now() / 1e3);
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.location("pathname").should("equal", "/leg-raises/log");
      cy.get(SELECTORS.eventCardValue)
        .first()
        .should("have.text", `${testValue} leg raises`);

      cy.get(SELECTORS.eventCardTime)
        .invoke("attr", "data-time")
        .then(Number)
        .should("be.closeTo", expectedTime, 1);
    });

    it("works with 1 leg raise", () => {
      cy.get(SELECTORS.legRaisesValueInput).type("1{enter}");
      cy.location("pathname").should("equal", "/leg-raises/log");
      cy.get(SELECTORS.eventCardValue)
        .first()
        .should("have.text", "1 leg raise");
    });
  });
});
