import AsyncStorage from "@react-native-community/async-storage";
import { persistReducer } from "redux-persist";

const initialState = {
  summaryReview: {},
  listReview: [],
  isLoadMoreReviewList: false,
  totalPages: 0,
  currentPage: 0,
  isGetReview: false,
  listMarketPlace: [],
  isLoadMoreMarketList: false,
};

function reviewReducer(state = initialState, action) {
  switch (action.type) {
    // TAB REVIEW

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

    // TAB MARKET PLACE

    case "GET_LIST_MARKET_PLACE":
      return {
        ...state,
        isLoadMoreMarketList: action.isShowLoadMore,
        isGetReview: false,
      };

    case "GET_LIST_MARKET_PLACE_SUCCESS":
      return {
        ...state,
        listMarketPlace:
          action.currentPage === 1
            ? action.payload
            : state.listMarketPlace.concat(action.payload),
        totalPages: action.totalPages,
        currentPage: action.currentPage,
        isLoadMoreMarketList: false,
      };
    case "GET_LIST_MARKET_PLACE_FAIL":
      return {
        ...state,
        isLoadMoreMarketList: false,
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
