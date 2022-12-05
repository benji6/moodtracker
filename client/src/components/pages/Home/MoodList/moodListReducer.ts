import { FluxStandardAction } from "../../../../types";

type Action =
  | FluxStandardAction<"filterDescription/set", string>
  | FluxStandardAction<"filterMood/clear">
  | FluxStandardAction<"filterMood/set", number>
  | FluxStandardAction<"page/set", number>
  | FluxStandardAction<"searchString/set", string>
  | FluxStandardAction<"shouldShowFilter/set", boolean>;

export interface State {
  filterDescription: string;
  filterMood: number | undefined;
  page: number;
  searchString: string;
  shouldShowFilter: boolean;
}

export const initialState: State = {
  filterDescription: "",
  filterMood: undefined,
  page: 0,
  searchString: "",
  shouldShowFilter: false,
};

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "filterDescription/set":
      return { ...state, filterDescription: action.payload, page: 0 };
    case "filterMood/clear":
      return { ...state, filterMood: undefined, page: 0 };
    case "filterMood/set":
      return { ...state, filterMood: action.payload, page: 0 };
    case "page/set":
      return { ...state, page: action.payload };
    case "searchString/set":
      return { ...state, searchString: action.payload, page: 0 };
    case "shouldShowFilter/set":
      if (action.payload)
        return {
          ...state,
          shouldShowFilter: action.payload,
        };
      return { ...initialState };
  }
};
