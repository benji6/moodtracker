export default (() => {
  const keys = [
    "addMoodRadioButton",
    "dateAwokeInput",
    "descriptionInput",
    "deviceSpecificSettingsDialog",
    "eventAddPage",
    "eventAddSubmitButton",
    "eventCardTime",
    "eventCardValue",
    "hoursSleptInput",
    "meditatePage",
    "meditationCustomTimeInput",
    "meditationPresetTimeButton",
    "meditationTimerPage",
    "minutesSleptInput",
    "moodCardMood",
    "moodCardTags",
    "moodCardTime",
    "moodList",
    "navButton",
    "pushUpsValueInput",
    "resetPasswordPage",
    "signInLink",
    "signOutButton",
    "signOutConfirmButton",
    "sitUpsValueInput",
    "sleepCardValue",
    "statsOverviewPage",
    "weightValueInput",
  ] as const;
  const testIds = {} as {
    [k in (typeof keys)[number]]: (typeof keys)[number];
  };
  for (const key of keys) testIds[key] = key;
  return testIds;
})();
