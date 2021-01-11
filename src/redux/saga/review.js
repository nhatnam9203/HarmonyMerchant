import { put, takeLatest, all } from "redux-saga/effects";

import { requestAPI } from "../../utils";
import apiConfigs from "../../configs/api";

function* getSummaryReview(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "GET_SUMMARY_REVIEW_SUCCESS",
        payload: responses?.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "GET_SUMMARY_REVIEW_FAIL",
      });
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

function* getListReview(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "GET_LIST_REVIEW_SUCCESS",
        payload: responses?.data || [],
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "GET_LIST_REVIEW_FAIL",
      });
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

function* showReview(action) {
  try {
    // yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "SHOW_RATING_REVIEW_SUCCESS",
        payload: responses?.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_RATING_REVIEW_FAIL",
      });
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    // yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* hideReview(action) {
  try {
    // yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "HIDE_RATING_REVIEW_SUCCESS",
        payload: responses?.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "HIDE_RATING_REVIEW_FAIL",
      });
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    // yield put({ type: "STOP_LOADING_ROOT" });
  }
}

export default function* saga() {
  yield all([takeLatest("GET_SUMMARY_REVIEW", getSummaryReview)]);
  yield all([takeLatest("GET_LIST_REVIEW", getListReview)]);
  yield all([takeLatest("SHOW_RATING_REVIEW", showReview)]);
  yield all([takeLatest("HIDE_RATING_REVIEW", hideReview)]);
}
