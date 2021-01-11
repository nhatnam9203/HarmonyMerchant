import AsyncStorage from "@react-native-community/async-storage";
import { persistReducer } from "redux-persist";

const initialState = {
  summaryReview: {},
  listReview: [],
};

function reviewReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_SUMMARY_REVIEW_SUCCESS":
        console.log(action.payload)
      return {
        ...state,
        summaryReview: action.payload,
      };
    case "GET_SUMMARY_REVIEW_FAIL":
      return {
        ...state,
      };

    case "GET_LIST_REVIEW_SUCCESS":
      return {
        ...state,
        listReview: action.payload,
      };
    case "GET_LIST_REVIEW_FAIL":
      return {
        ...state,
      };

    case "SHOW_RATING_REVIEW_SUCCESS":
      return {
        ...state,
      };

    case "SHOW_RATING_REVIEW_FAIL":
      return {
        ...state,
      };

    case "HIDE_RATING_REVIEW_SUCCESS":
      return {
        ...state,
      };
    case "HIDE_RATING_REVIEW_FAIL":
      return {
        ...state,
      };

    default:
      return state;
  }
}

module.exports = persistReducer(
  {
    key: "review",
    storage: AsyncStorage,
  },
  reviewReducer
);
