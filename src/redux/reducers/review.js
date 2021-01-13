import AsyncStorage from "@react-native-community/async-storage";
import { persistReducer } from "redux-persist";

const initialState = {
  summaryReview: {},
  listReview: [],
  isLoadMoreReviewList: false,
  totalPages: 0,
  currentPage: 0,
  isGetReview: false,
};

function reviewReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_LIST_REVIEW":
      return {
        ...state,
        isLoadMoreReviewList: action.isShowLoadMore,
        isGetReview: false,
      };
    case "GET_SUMMARY_REVIEW_SUCCESS":
      return {
        ...state,
        summaryReview: action.payload,
        isGetReview: true,
      };
    case "GET_SUMMARY_REVIEW_FAIL":
      return {
        ...state,
        isGetReview: false,
      };

    case "GET_LIST_REVIEW_SUCCESS":
      return {
        ...state,
        listReview:
          action.currentPage === 1
            ? action.payload
            : state.listReview.concat(action.payload),
        totalPages: action.totalPages,
        currentPage: action.currentPage,
        isLoadMoreReviewList: false,
      };
    case "GET_LIST_REVIEW_FAIL":
      return {
        ...state,
        isLoadMoreInvoiceList: false,
      };

    // case "SHOW_RATING_REVIEW_SUCCESS":
    //   return {
    //     ...state,
    //   };

    // case "SHOW_RATING_REVIEW_FAIL":
    //   return {
    //     ...state,
    //   };

    // case "HIDE_RATING_REVIEW_SUCCESS":
    //   return {
    //     ...state,
    //   };
    // case "HIDE_RATING_REVIEW_FAIL":
    //   return {
    //     ...state,
    //   };
    case "RESET_IS_LIST_REVIEW":
      return {
        ...state,
        isGetReview: false,
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
