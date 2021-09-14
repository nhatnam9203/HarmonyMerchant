import { put, takeLatest, all } from "redux-saga/effects";

import { requestAPI } from "../../utils";
import Configs from "@configs";

function* addCategory(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      const searchFilter = action?.searchFilter || {
        keySearch: "",
        category: "",
        status: "",
      };
      const { keySearch, category, status } = searchFilter;
      yield put({
        type: "GET_CATEGORIES_BY_MERCHANR_ID",
        method: "GET",
        token: true,
        api: `category/search?name=${keySearch}&status=${status}&type=${category}`,
        isShowLoading: true,
        searchFilter: action?.searchFilter || false,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* getCategoriesByMerchantId(action) {
  try {
    if (action.isShowLoading) {
      yield put({ type: "LOADING_ROOT" });
    }
    const responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      const searchFilter = action?.searchFilter || {
        keySearch: "",
        category: "",
        status: "",
      };
      const { keySearch, category, status } = searchFilter;
      const tempSearchFilter = keySearch || category || status ? true : false;
      yield put({
        type: "GET_CATEGORIES_BY_MERCHANR_ID_SUCCESS",
        payload: responses.data,
        searchFilter: tempSearchFilter,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({ type: "GET_CATEGORIES_BY_MERCHANR_ID_FAIL" });
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: "GET_CATEGORIES_BY_MERCHANR_ID_FAIL" });
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* archiveCategory(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      const searchFilter = action?.searchFilter || {
        keySearch: "",
        category: "",
        status: "",
      };
      const { keySearch, category, status } = searchFilter;
      yield put({ type: "IS_GET_LIST_SEARCH_CATEGORIES" });
      yield put({
        type: "GET_CATEGORIES_BY_MERCHANR_ID",
        method: "GET",
        token: true,
        api: `category/search?name=${keySearch}&status=${status}&type=${category}`,
        isShowLoading: true,
        searchFilter: action?.searchFilter || false,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* restoreCategory(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      const searchFilter = action?.searchFilter || {
        keySearch: "",
        category: "",
        status: "",
      };
      const { keySearch, category, status } = searchFilter;
      yield put({ type: "IS_GET_LIST_SEARCH_CATEGORIES" });
      yield put({
        type: "GET_CATEGORIES_BY_MERCHANR_ID",
        method: "GET",
        token: true,
        api: `category/search?name=${keySearch}&status=${status}&type=${category}`,
        isShowLoading: true,
        searchFilter: action?.searchFilter || false,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* editCategory(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      const searchFilter = action?.searchFilter || {
        keySearch: "",
        category: "",
        status: "",
      };
      const { keySearch, category, status } = searchFilter;
      yield put({ type: "IS_GET_LIST_SEARCH_CATEGORIES" });
      yield put({
        type: "GET_CATEGORIES_BY_MERCHANR_ID",
        method: "GET",
        token: true,
        api: `category/search?name=${keySearch}&status=${status}&type=${category}`,
        isShowLoading: true,
        searchFilter: action?.searchFilter || false,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* searchCategories(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "SEARCH_CATEGORIES_SUCCESS",
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* updatePositionCategories(action) {
  try {
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* getCategoriesByStaff(action) {
  try {
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      if (action.callBack) {
        action.callBack(responses.data ?? []);
      }
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

export default function* saga() {
  yield all([
    takeLatest("ADD_CATEGORY", addCategory),
    takeLatest("GET_CATEGORIES_BY_MERCHANR_ID", getCategoriesByMerchantId),
    takeLatest("ARCHIVE_CATEGORY", archiveCategory),
    takeLatest("RESTORE_CATEGORY", restoreCategory),
    takeLatest("EDIT_CATEGORY", editCategory),
    takeLatest("SEARCH_CATEGORIES", searchCategories),
    takeLatest("UPDATE_POSITION_CATEGORIES", updatePositionCategories),
    takeLatest("GET_CATEGORIES_BY_STAFF", getCategoriesByStaff),
  ]);
}
