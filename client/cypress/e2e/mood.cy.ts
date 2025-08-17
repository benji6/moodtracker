import { ERRORS, SELECTORS } from "./constants";

describe("mood", () => {
  beforeEach(() => {
    cy.login();
  });

  describe("adding a mood", () => {
    beforeEach(() => {
      cy.visit("/moods/add");
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
        .then(Number)
        .should("be.closeTo", expectedTime, 1);
    });

    it("adds a mood with an emoji in the journal section", () => {
      const MOOD = Math.floor(Math.random() * 11);
      cy.get(`${SELECTORS.addMoodRadioButton}[value="${MOOD}"]`).click({
        force: true,
      });
      cy.get(SELECTORS.explorationInput).type("🧪");
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.get(SELECTORS.moodList);
      cy.location("pathname").should("equal", "/");
      cy.get(SELECTORS.moodCardMood).first().should("have.text", String(MOOD));
      cy.get(SELECTORS.moodCardTags).first().should("have.text", "🧪");
    });

    it("adds a mood with `experienceAt` 1 day ago", () => {
      const MOOD = Math.floor(Math.random() * 11);
      cy.get(`${SELECTORS.addMoodRadioButton}[value="${MOOD}"]`).click({
        force: true,
      });
      const experiencedAt = new Date();
      experiencedAt.setDate(experiencedAt.getDate() - 1);
      experiencedAt.setSeconds(0);
      experiencedAt.setMilliseconds(0);
      cy.get(SELECTORS.experiencedAtInput).type(
        `${experiencedAt.getFullYear()}-${String(experiencedAt.getMonth() + 1).padStart(2, "0")}-${String(
          experiencedAt.getDate(),
        ).padStart(
          2,
          "0",
        )}T${String(experiencedAt.getHours()).padStart(2, "0")}:${String(experiencedAt.getMinutes()).padStart(2, "0")}`,
      );
      cy.get(SELECTORS.eventAddSubmitButton).click();
      cy.get(SELECTORS.moodList);
      cy.location("pathname").should("equal", "/");
      cy.get(SELECTORS.moodCardTime).get(
        `[data-time="${experiencedAt.getTime() / 1e3}"]`,
      );
    });
  });
});
