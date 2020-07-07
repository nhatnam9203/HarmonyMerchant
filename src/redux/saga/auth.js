import { put, takeLatest, all, select } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";

import apiConfigs from '../../configs/api';
import { requestAPI } from '../../utils';

function* login(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        //console.log('responses : ', responses);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SAVE_PROFILE_LOCAL',
                payload: {
                    profile: responses.data.merchant,
                    token: responses.data.token,
                }
            });
            yield put({
                type: 'LOGIN_APP_SUCCESS',
                payload: action.body && action.body.email ? action.body.email : "",
                isRememberMID: action.isRememberMID
            });
            yield put({ type: 'STOP_LOADING_ROOT' });
            NavigationServices.navigate('Splash');
        } else {
            yield put({
                type: 'LOGIN_APP_FAIL',
                payload: responses
            })
        }
    } catch (error) {
        yield put({
            type: 'LOGIN_APP_FAIL',
            payload: responses
        })
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* forgotPassword(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        //console.log('responses : ', responses);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            NavigationServices.navigate('SignIn');
            setTimeout(() => {
                alert(`Please check your email`)
            }, 300)
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* checkStaffPermission(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        //console.log('responses : ', responses);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "CHECK_STAFF_PERMISSION_SUCCESS"
            });
            yield put({ type: 'LOADING_ROOT' });

            if (action.tabName === "Invoice") {
                yield put({
                    type: "TOGGLE_INVOICE_TAB_PERMISSION",
                    payload: false
                });
                yield put({
                    type: 'GET_LIST_INVOICE_BY_MERCHANT',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}checkout?page=1&method=&status=&timeStart=&timeEnd=&key=&quickFilter=`,
                    token: true,
                    isShowLoading: true,
                    currentPage: 1,
                    isLoadMore: true
                })
            } else if (action.tabName === "Settlement") {
                yield put({
                    type: "TOGGLE_SETTLEMENT_TAB_PERMISSION",
                    payload: false
                });
                yield put({
                    type: 'GET_SETTLEMENT_WAITING',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}settlement/waiting`,
                    token: true,
                    isShowLoading: true
                })
            } else if (action.tabName === "Customer") {
                yield put({
                    type: "TOGGLE_CUSTOMER_TAB_PERMISSION",
                    payload: false
                });
                yield put({
                    type: 'GET_LIST_CUSTOMER_BY_MERCHANT',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}customer/bymerchant`,
                    token: true,
                    isShowLoading: true
                })
            } else if (action.tabName === "Inventory") {
                yield put({
                    type: "TOGGLE_PRODUCT_TAB_PERMISSION",
                    payload: false
                });
                yield put({
                    type: 'GET_PRODUCTS_BY_MERCHANR_ID',
                    method: 'GET',
                    token: true,
                    api: `${apiConfigs.BASE_API}product`,
                    isShowLoading: true
                })
            } else if (action.tabName === "Reports") {
                yield put({
                    type: "TOGGLE_REPORT_TAB_PERMISSION",
                    payload: false
                });
                yield put({
                    type: 'GET_LIST_STAFFS_SALARY_TOP',
                    method: 'GET',
                    token: true,
                    api: `${apiConfigs.BASE_API}staff/salary?quickFilter=thisWeek`,
                    isShowLoading: true
                })
            } else if (action.tabName === "Settings") {
                const state = yield select();
                //  console.log("----state : ",state);
                yield put({
                    type: 'GET_MERCHANT_BY_ID',
                    method: 'GET',
                    token: true,
                    api: `${apiConfigs.BASE_API}merchant/${state.dataLocal.profile.merchantId}`,
                    isRefresh: false
                })
            }


        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'CHECK_STAFF_PERMISSION_FAIL',
                message: responses.message
            });
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            })
        }
    } catch (error) {
        yield put({
            type: 'CHECK_STAFF_PERMISSION_FAIL',
            message: responses.message
        });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}




function* expiredToken(action) {
    NavigationServices.navigate('SignIn');
    yield put({ type: 'LOGOUT_APP' });
}


export default function* saga() {
    yield all([
        takeLatest('LOGIN_APP', login),
        takeLatest('UNAUTHORIZED', expiredToken),
        takeLatest('FORGOT_PASSWORD', forgotPassword),
        takeLatest('CHECK_STAFF_PERMISSION', checkStaffPermission),
    ])
}