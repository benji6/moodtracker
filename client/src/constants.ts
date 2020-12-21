export const DAYS_PER_WEEK = 7;
export const HOURS_PER_DAY = 24;
export const MOOD_RANGE: [number, number] = [0, 10];
export const MOOD_INTEGERS = [
  ...Array(MOOD_RANGE[1] - MOOD_RANGE[0] + 1).keys(),
] as const;
export const NETWORK_ERROR_MESSAGE =
  "Something went wrong, check your internet connection and try again";

// extracted from the cognito console and update manually for now
// if it ever starts increasing quickly then we can automate this
export const TOTAL_USERS = 31;
