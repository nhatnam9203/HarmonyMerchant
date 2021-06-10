import Configs from "@configs";

// TAB REVIEW

export function getSummaryReview(id = 1, isShowLoading = true) {
  return {
    type: "GET_SUMMARY_REVIEW",
    method: "GET",
    api: `Rating/merchant/summary/${id}`,
    token: true,
    isShowLoading,
  };
}

export function getListReview(
  status = "all",
  review = "all",
  page = 1,
  isShowLoading = true,
  isShowLoadMore = false
) {
  return {
    type: "GET_LIST_REVIEW",
    method: "GET",
    api: `rating/merchant/filters?status=${status}&review=${review}&page=${page}`,
    token: true,
    isShowLoading,
    currentPage: page,
    isShowLoadMore,
  };
}

export function showRating(id = 1, isShowLoading = true) {
  return {
    type: "SHOW_RATING_REVIEW",
    method: "PUT",
    api: `rating/restore/${id}`,
    token: true,
    isShowLoading,
  };
}

export function hideRating(id = 1, isShowLoading = true) {
  return {
    type: "HIDE_RATING_REVIEW",
    method: "PUT",
    api: `rating/archive/${id}`,
    token: true,
    isShowLoading,
  };
}

// TAB MARKET PLACE

export function getListMarketPlace(
  page = 1,
  isShowLoading = true,
  isShowLoadMore = false
) {
  return {
    type: "GET_LIST_MARKET_PLACE",
    method: "GET",
    api: `MarketPlace?page=${page}`,
    token: true,
    isShowLoading,
    currentPage: page,
    isShowLoadMore,
  };
}

