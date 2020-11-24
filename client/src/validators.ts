const punctuationRegex = /[\‒\–\—\―|$&~=\\\/⁄@+*!?({[\]})<>‹›«».;:^‘’“”'",،、`·\•†‡°″¡¿※#№÷×%‰\−‱¶′‴§_‖¦]/;

export const PUNCTUATION_ERROR_MESSAGE =
  "This field must not contain any special characters";

export const noPunctuationValidator = (s: string): string | undefined =>
  punctuationRegex.test(s) ? PUNCTUATION_ERROR_MESSAGE : undefined;
