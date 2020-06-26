import { homeReducer, HomeState } from ".";

describe("homeReducer", () => {
  let state: HomeState;

  beforeEach(() => {
    state = { dayCount: 7, page: 3 };
  });

  describe("moods/setDaysToShow", () => {
    test("when days to show is a number", () => {
      expect(
        homeReducer(state, {
          payload: 14,
          type: "moods/setDaysToShow",
        })
      ).toEqual({ dayCount: 14, page: 0 });
    });

    test("when days to show is undefined", () => {
      expect(
        homeReducer(state, {
          payload: undefined,
          type: "moods/setDaysToShow",
        })
      ).toEqual({ dayCount: undefined, page: 0 });
    });
  });

  test("moods/setPage", () => {
    expect(homeReducer(state, { payload: 2, type: "moods/setPage" })).toEqual({
      dayCount: 7,
      page: 2,
    });
  });
});
