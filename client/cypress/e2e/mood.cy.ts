import { ERRORS, PATHS, SELECTORS } from "./constants";

describe("mood", () => {
  beforeEach(() => {
    cy.login();
  });

  describe("adding a mood", () => {
    beforeEach(() => {
      cy.visit(PATHS.moodAdd);
      cy.get(SELECTORS.eventAddPage);
    });

    it("errors when mood is not valid", () => {
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.required,
      );
      cy.get(SELECTORS.addMoodRadioButton).eq(5).click({ force: true });
      cy.get('[data-eri-id="field-error"]').should("not.exist");
    });

    it("errors when description is not valid", () => {
      cy.get(SELECTORS.descriptionInput).type('hello"world{enter}');
      cy.get('[data-eri-id="field-error"]').should("have.length", 2);
      cy.get('[data-eri-id="field-error"]')
        .last()
        .should("have.text", ERRORS.specialCharacters);

      cy.get(SELECTORS.descriptionInput).clear();
      cy.get(SELECTORS.descriptionInput).type("hello world{enter}");
      cy.get('[data-eri-id="field-error"]').should("have.length", 1);
      cy.get('[data-eri-id="field-error"]').should(
        "have.text",
        ERRORS.required,
      );
    });

    it("adds a mood with only a mood value", () => {
      const MOOD = Math.floor(Math.random() * 11);
      cy.get(`${SELECTORS.addMoodRadioButton}[value="${MOOD}"]`).click({
        force: true,
      });
      const expectedTime = Math.round(Date.now() / 1e3);
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.get(SELECTORS.moodList);
      cy.location("pathname").should("equal", "/");
      cy.get(SELECTORS.moodCardMood).first().should("have.text", String(MOOD));
      cy.get(SELECTORS.moodCardTime)
        .invoke("attr", "data-time")
        .should("equal", String(expectedTime));
    });

    it("adds a mood with an emoji tag", () => {
      const MOOD = Math.floor(Math.random() * 11);
      cy.get(`${SELECTORS.addMoodRadioButton}[value="${MOOD}"]`).click({
        force: true,
      });
      cy.get(SELECTORS.descriptionInput).type("🧪");
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.get(SELECTORS.moodList);
      cy.location("pathname").should("equal", "/");
      cy.get(SELECTORS.moodCardMood).first().should("have.text", String(MOOD));
      cy.get(SELECTORS.moodCardTags).first().should("have.text", "🧪");
    });
  });
});
