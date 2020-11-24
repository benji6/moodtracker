import {
  noPunctuationValidator,
  PUNCTUATION_ERROR_MESSAGE,
} from "./validators";

describe("validators", () => {
  test("noPunctuationValidator", () => {
    expect(noPunctuationValidator("happy joy")).toBeUndefined();
    expect(noPunctuationValidator("happy, joy")).toBe(
      PUNCTUATION_ERROR_MESSAGE
    );
  });
});
