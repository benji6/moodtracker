export default (() => {
  const keys = [
    "addMoodRadioButton",
    "dateAwokeInput",
    "descriptionInput",
    "deviceSpecificSettingsDialog",
    "eventAddPage",
    "eventAddSubmitButton",
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
    "pushUpsCardTime",
    "pushUpsCardValue",
    "pushUpsValueInput",
    "resetPasswordPage",
    "signInLink",
    "signOutButton",
    "signOutConfirmButton",
    "sleepCardValue",
    "statsOverviewPage",
    "weightCardTime",
    "weightCardValue",
    "weightValueInput",
  ] as const;
  const testIds = {} as {
    [k in (typeof keys)[number]]: (typeof keys)[number];
  };
  for (const key of keys) testIds[key] = key;
  return testIds;
})();
