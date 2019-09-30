import { put, takeLatest, all, join } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";

import { requestAPI, uploadFromData } from '../../utils';
import apiConfigs from '../../configs/api';


function* uploadAvatar(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield uploadFromData(action);
        // console.log('uploadAvatar : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({ type: 'LOADING_ROOT' });
            yield put({
                type: 'UPLOAD_AVATAR_SUCCESS',
                payload: responses.data
            });
            yield put({ type: 'LOADING_ROOT' });
        } else {
            yield put({
                type: 'UPLOAD_AVATAR_FAIL',
            })
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

function* uploadBanner(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield uploadFromData(action);
        // console.log('deleteBannerMerchant : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'ADD_BANNER_WITH_INFO',
                method: 'POST',
                token: true,
                api: `${apiConfigs.BASE_API}merchantbanner`,
                body: {
                    ...action.infoBanner,
                    fileId: responses.data.fileId
                },
                merchantId: action.merchantId
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


export default function* saga() {
    yield all([
        takeLatest('UPLOAD_AVATAR', uploadAvatar),
        takeLatest('UPLOAD_BANNER', uploadBanner),

    ])
}