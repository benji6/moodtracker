import { PATHS, ROOT_DOCUMENT_TITLE } from "./constants";

describe("when unauthed", () => {
  it("allows access to routes which are not available to authenticated users", () => {
    cy.visit(PATHS.resetPassword);
    cy.title().should("equal", "MoodTracker - Reset password");
    cy.location("pathname").should("equal", PATHS.resetPassword);
  });

  it("does not allow access to protected routes", () => {
    cy.visit(PATHS.moodAdd);
    cy.title().should("equal", ROOT_DOCUMENT_TITLE);
    cy.location("pathname").should("equal", "/");
  });
});
