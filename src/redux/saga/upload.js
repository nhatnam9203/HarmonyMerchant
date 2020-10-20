import { put, takeLatest, all } from "redux-saga/effects";
import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from "react-native";
import Share from 'react-native-share';

import { requestAPI, uploadFromData } from '../../utils';
import apiConfigs from '../../configs/api';


function* uploadAvatar(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield uploadFromData(action);
        //console.log('uploadAvatar : ', responses);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'UPLOAD_AVATAR_SUCCESS',
                payload: responses.data
            });
            // yield put({ type: 'LOADING_ROOT' });
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
        //console.log('deleteBannerMerchant : ', responses);
        yield put({ type: 'LOADING_ROOT' });
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

function* exportBatchHistory(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const pdfPath = responses.data && responses.data.path ? responses.data.path : "";

            const dirs = RNFetchBlob.fs.dirs;
            const fileDownload = yield RNFetchBlob.config({
                fileCache: true,
                appendExt: 'pdf',
                path: `${dirs.DocumentDir}/BatchHistory.pdf`,
            }).fetch('GET', pdfPath, {});

            const filePath = fileDownload.path();
            try {
                if (Platform.OS === 'ios') {
                    RNFetchBlob.ios.previewDocument(filePath)
                } else {
                    // const android = RNFetchBlob.android;
                    // android.actionViewIntent(filePath, 'application/vnd.android.package-archive')
                    const shareResponse = yield Share.open({
                        url: `file://${filePath}`
                    });
                }
            } catch (error) {
                // throw error;
            }


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

function* exportBatchDetail(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const pdfPath = responses.data && responses.data.path ? responses.data.path : "";
            const dirs = RNFetchBlob.fs.dirs;
            const fileDownload = yield RNFetchBlob.config({
                fileCache: true,
                appendExt: 'pdf',
                path: `${dirs.DocumentDir}/BatchDetail.pdf`,
            }).fetch('GET', pdfPath, {});

            const filePath = fileDownload.path();
            try {
                if (Platform.OS === 'ios') {
                    RNFetchBlob.ios.previewDocument(filePath)
                } else {
                    // const android = RNFetchBlob.android;
                    // android.actionViewIntent(filePath, 'application/vnd.android.package-archive')
                    const shareResponse = yield Share.open({
                        url: `file://${filePath}`
                    });
                }
            } catch (error) {
                // throw error;
            }


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

export default function* saga() {
    yield all([
        takeLatest('UPLOAD_AVATAR', uploadAvatar),
        takeLatest('UPLOAD_BANNER', uploadBanner),
        takeLatest('EXPORT_BATCH_HISTORY', exportBatchHistory),
        takeLatest('EXPORT_BATCH_DETAIL', exportBatchDetail),
    ])
}