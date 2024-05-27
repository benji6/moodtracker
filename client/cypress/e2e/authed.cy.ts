import { PATHS, ROOT_DOCUMENT_TITLE, SELECTORS } from "./constants";

describe("authed", () => {
  beforeEach(() => {
    cy.login();
  });

  it("does not allow access to routes which are not available to authenticated users", () => {
    cy.visit(PATHS.resetPassword);
    cy.get(SELECTORS.moodList);
    cy.location("pathname").should("equal", "/");
    cy.title().should("equal", ROOT_DOCUMENT_TITLE);
  });

  it("allows access to protected routes", () => {
    cy.visit(PATHS.statsOverview);
    cy.get(SELECTORS.statsOverviewPage);
    cy.location("pathname").should("equal", PATHS.statsOverview);
    cy.title().should("equal", "MoodTracker - Stats overview");
  });

  it("allows user to sign out and sign back in", () => {
    cy.visit("/");
    cy.get(SELECTORS.navButton).click();
    cy.get(SELECTORS.signOutButton).click();
    cy.get(SELECTORS.signOutConfirmButton).click();
    cy.get(SELECTORS.signInLink);
    cy.login();
  });
});
