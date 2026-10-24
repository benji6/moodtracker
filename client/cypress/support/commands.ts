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
      cy.env([
        "MOODTRACKER_TEST_USER_EMAIL",
        "MOODTRACKER_TEST_USER_PASSWORD",
      ]).then(
        ({
          MOODTRACKER_TEST_USER_EMAIL: email,
          MOODTRACKER_TEST_USER_PASSWORD: password,
        }) => {
          cy.get('[type="email"]').type(email, { log: false });
          cy.get('[type="password"]').type(password, { log: false });
        },
      );
      cy.get('form button[type="submit"]').click();
      cy.get(`${SELECTORS.deviceSetupDialog} .close-button`).click();
    },
    { cacheAcrossSpecs: true },
  );
});
