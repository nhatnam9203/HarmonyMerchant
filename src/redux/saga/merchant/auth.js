import { appMerchant, authMerchant } from '@redux/slices';
import { request } from '@shared/services/api';
import { getFcmToken } from '@shared/storages/fcmToken';
import { all, call, takeLatest, put } from 'redux-saga/effects';
import { saveAuthToken } from '@shared/storages/authToken';

/**
|--------------------------------------------------
| MERCHANT SAGA
|--------------------------------------------------
*/
// function* merchantLogin(actions) {
//   try {
//     // show loading here
//     yield put({ type: appMerchant.showLoading().type });

//     // need fcmToken(optional), deviceId, body (email, password, terminalId)
//     const fcmToken = yield call(getFcmToken);

//     let { payload } = actions;
//     let body = payload?.body || {};

//     body = Object.assign({}, body, {
//       firebaseToken: fcmToken,
//     });
//     payload.body = body;

//     const response = yield call(request, actions);

//     yield put({ type: appMerchant.hideLoading().type });
//   } catch (e) {
//     console.log(e);
//   }
// }

function* signInSuccess(actions) {
  try {
    let { payload } = actions;
    yield call(saveAuthToken, payload?.token);
    delete payload.token;
  } catch (e) {
    console.log(e);
  }
}

function* staffSignInSuccess(actions) {
  try {
    let { payload } = actions;
    yield call(saveAuthToken, payload?.token);
    delete payload.token;
  } catch (e) {
    console.log(e);
  }
}

function* signOutApp(actions) {
  try {
    yield call(saveAuthToken, null);
  } catch (e) {
    console.log(e);
  }
}

export default function* saga() {
  yield all([
    // takeLatest(authMerchantActions.merchantLogin().type, merchantLogin),
    takeLatest(authMerchant.signInSuccess().type, signInSuccess),
    takeLatest(authMerchant.signOutApp().type, signOutApp),
    takeLatest(authMerchant.staffSignIn().type, staffSignInSuccess),
  ]);
}
