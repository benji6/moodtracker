import { initialState, reducer, State } from "./MoodList";

const createState = (props?: Partial<State>): State => ({
  ...initialState,
  ...props,
});

describe("MoodList", () => {
  describe("reducer", () => {
    test("filterDescription/set", () => {
      expect(
        reducer(createState({ filterDescription: "foo", page: 3 }), {
          payload: "bar",
          type: "filterDescription/set",
        })
      ).toEqual(createState({ filterDescription: "bar", page: 0 }));
    });

    test("filterExploration/set", () => {
      expect(
        reducer(createState({ filterExploration: "foo", page: 3 }), {
          payload: "bar",
          type: "filterExploration/set",
        })
      ).toEqual(createState({ filterExploration: "bar", page: 0 }));
    });

    test("filterMood/clear", () => {
      expect(
        reducer(createState({ filterMood: 5, page: 3 }), {
          type: "filterMood/clear",
        })
      ).toEqual(createState({ filterMood: undefined, page: 0 }));
    });

    test("filterMood/set", () => {
      expect(
        reducer(createState({ filterMood: 5, page: 3 }), {
          payload: 7,
          type: "filterMood/set",
        })
      ).toEqual(createState({ filterMood: 7, page: 0 }));
    });

    test("page/set", () => {
      expect(
        reducer(createState({ page: 5 }), {
          payload: 7,
          type: "page/set",
        })
      ).toEqual(createState({ page: 7 }));
    });

    describe("shouldShowFilter/set", () => {
      let state: State;

      beforeEach(() => {
        state = {
          filterDescription: "foo",
          filterExploration: "bar",
          filterMood: 5,
          page: 3,
          shouldShowFilter: true,
        };
      });

      test("when payload is false", () => {
        expect(
          reducer(state, {
            payload: false,
            type: "shouldShowFilter/set",
          })
        ).toEqual(createState());
      });

      test("when payload is true", () => {
        expect(
          reducer(state, {
            payload: true,
            type: "shouldShowFilter/set",
          })
        ).toEqual({ ...state, shouldShowFilter: true });
      });
    });
  });
});
