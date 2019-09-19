import { put, takeLatest, all, join } from "redux-saga/effects";

import NavigationServices from "../../navigators/NavigatorServices";
import { requestAPI } from '../../utils';
import apiConfigs from '../../configs/api';

function* addStaffByMerchant(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('--- addStaffByMerchant : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_STAFF_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}staff`,
                isShowLoading: true
            })
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
        if (`${error}` == 'TypeError: Network request failed') {
            yield put({
                type: 'NET_WORK_REQUEST_FAIL',
            });
        } else if (`${error}` == 'timeout') {
            yield put({
                type: 'TIME_OUT',
            });
        }
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getStaffByMerchantId(action) {
    try {

        action.isShowLoading ? yield put({ type: 'LOADING_ROOT' }) : '';
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_STAFF_BY_MERCHANR_ID_SUCCESS',
                payload: responses.data
            });
            yield put({
                type: 'SWICH_ADD_STAFF',
                payload: false
            })
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
        if (`${error}` == 'TypeError: Network request failed') {
            yield put({
                type: 'NET_WORK_REQUEST_FAIL',
            });
        } else if (`${error}` == 'timeout') {
            yield put({
                type: 'TIME_OUT',
            });
        }
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
        if (action.isCreateAdmin && action.isCreateAdmin) {
            setTimeout(() => {
                alert(`Create admin success `);

            }, 200)
        }
    }
}

function* searchStaffByName(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('searchStaffByName : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SEARCH_STAFF_BY_NAME_SUCCESS',
                payload: responses.data
            });
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
        // console.log(error);
        if (`${error}` == 'TypeError: Network request failed') {
            yield put({
                type: 'NET_WORK_REQUEST_FAIL',
            });
        } else if (`${error}` == 'timeout') {
            yield put({
                type: 'TIME_OUT',
            });
        }
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* archiveStaff(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('archiveStaff : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({ type: 'IS_GET_LIST_SEARCH_STAFF' });
            yield put({
                type: 'GET_STAFF_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}staff`,
                isShowLoading: true
            });
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
        if (`${error}` == 'TypeError: Network request failed') {
            yield put({
                type: 'NET_WORK_REQUEST_FAIL',
            });
        } else if (`${error}` == 'timeout') {
            yield put({
                type: 'TIME_OUT',
            });
        }
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* restoreStaff(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('restoreStaff : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({ type: 'IS_GET_LIST_SEARCH_STAFF' });
            yield put({
                type: 'GET_STAFF_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}staff`,
                isShowLoading: true
            });
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
        if (`${error}` == 'TypeError: Network request failed') {
            yield put({
                type: 'NET_WORK_REQUEST_FAIL',
            });
        } else if (`${error}` == 'timeout') {
            yield put({
                type: 'TIME_OUT',
            });
        }
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* createAdmin(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('createAdmin : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'RESET_INFO_ADMIN',
            });
            yield put({
                type: 'GET_STAFF_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}staff`,
                isCreateAdmin: true,
                isShowLoading: true
            });

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
        if (`${error}` == 'TypeError: Network request failed') {
            yield put({
                type: 'NET_WORK_REQUEST_FAIL',
            });
        } else if (`${error}` == 'timeout') {
            yield put({
                type: 'TIME_OUT',
            });
        }
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* editStaff(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('editStaff : ' + JSON.stringify(responses));
        // console.log('body : ' + JSON.stringify(action.body));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_STAFF_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}staff`,
                isShowLoading: true
            });
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
        if (`${error}` == 'TypeError: Network request failed') {
            yield put({
                type: 'NET_WORK_REQUEST_FAIL',
            });
        } else if (`${error}` == 'timeout') {
            yield put({
                type: 'TIME_OUT',
            });
        }
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* loginStaff(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('loginStaff : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'UPDATE_PROFILE_STAFF_SUCCESS',
                payload: responses.data
            });
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
        if (`${error}` == 'TypeError: Network request failed') {
            yield put({
                type: 'NET_WORK_REQUEST_FAIL',
            });
        } else if (`${error}` == 'timeout') {
            yield put({
                type: 'TIME_OUT',
            });
        }
        // console.log('error : ',error);
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* forgotPin(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        console.log('forgotPin : ' + JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'RESET_VISIBLE_FORGOT_PIN',
                payload: false
            });
            yield put({ type: 'STOP_LOADING_ROOT' });
            setTimeout(() => {
                alert(`Please check email : ${action.email}`)
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
        if (`${error}` == 'TypeError: Network request failed') {
            yield put({
                type: 'NET_WORK_REQUEST_FAIL',
            });
        } else if (`${error}` == 'timeout') {
            yield put({
                type: 'TIME_OUT',
            });
        }
        // console.log('error : ',error);
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

export default function* saga() {
    yield all([
        takeLatest('ADD_STAFF_BY_MERCHANT', addStaffByMerchant),
        takeLatest('GET_STAFF_BY_MERCHANR_ID', getStaffByMerchantId),
        takeLatest('SEARCH_STAFF_BY_NAME', searchStaffByName),
        takeLatest('ARCHICVE_STAFF', archiveStaff),
        takeLatest('RESTORE_STAFF', restoreStaff),
        takeLatest('CREATE_ADMIN', createAdmin),
        takeLatest('EDIT_STAFF_BY_MERCHANT', editStaff),
        takeLatest('LOGIN_STAFF', loginStaff),
        takeLatest('FORGOT_PIN', forgotPin),
    ])
}