import { request } from '@shared/services/api';
import { all, call, takeLatest } from 'redux-saga/effects';
import { actions } from '@redux/saga/merchant/app';
/**
|--------------------------------------------------
| APP SAGA
|--------------------------------------------------
*/
// function* showLoading({ payload }) {
//   try {
//   } catch (e) {
//     console.log(e);
//   }
// }

export default function* saga() {
  // yield all([takeLatest(actions.showLoading().type, showLoading)]);
}
