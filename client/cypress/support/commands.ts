import { SELECTORS } from "../e2e/constants";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(): Chainable;
    }
  }
}

Cypress.Commands.add("login", () => {
  cy.session(
    [],
    () => {
      cy.visit("/");
      cy.get(SELECTORS.signInLink).click();
      cy.get('[type="email"]').type(Cypress.env("MOODTRACKER_TEST_USER_EMAIL"));
      cy.get('[type="password"]').type(
        Cypress.env("MOODTRACKER_TEST_USER_PASSWORD"),
        { log: false },
      );
      cy.get('form button[type="submit"]').click();
      cy.get(`${SELECTORS.deviceSpecificSettingsDialog} .close-button`).click();
    },
    { cacheAcrossSpecs: true },
  );
});
