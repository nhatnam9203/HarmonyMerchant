import { put, takeLatest, all, join } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";


import { requestAPI, uploadFromData } from '../../utils';

function* uploadAvatar(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield uploadFromData(action);
        // console.log('uploadAvatar : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'UPLOAD_AVATAR_SUCCESS',
                payload: responses.data
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



export default function* saga() {
    yield all([
        takeLatest('UPLOAD_AVATAR', uploadAvatar),

    ])
}