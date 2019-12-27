import { put, takeLatest, all, join } from "redux-saga/effects";
import RNFetchBlob from 'rn-fetch-blob';

import NavigationServices from "../../navigators/NavigatorServices";
import { requestAPI } from '../../utils';
import apiConfigs from '../../configs/api';

function* addProductByMerchant(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
    //console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_PRODUCTS_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}product`,
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
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getProductsByMerchantId(action) {
    try {
        action.isShowLoading ? yield put({ type: 'LOADING_ROOT' }) : '';
        const responses = yield requestAPI(action);
    //console.log(responses);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_PRODUCTS_BY_MERCHANR_ID_SUCCESS',
                payload: responses.data
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({ type: 'GET_PRODUCTS_BY_MERCHANR_ID_FAIL' });
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            })
        }
    } catch (error) {
        yield put({ type: 'GET_PRODUCTS_BY_MERCHANR_ID_FAIL' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* archiveProduct(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
    //console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_PRODUCTS_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}product`,
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
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* restoreProduct(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
    //console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_PRODUCTS_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}product`,
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
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* editProduct(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
    //console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_PRODUCTS_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}product`,
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
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* searchProduct(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
    //console.log('--- responses : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SEARCH_PRODUCT_SUCCESS',
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
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* restockProduct(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
    //console.log('--- restockProduct : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_PRODUCTS_BY_MERCHANR_ID',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}product`,
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
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* exportInventory(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
    //console.log('--- exportInventory : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            const dirs = RNFetchBlob.fs.dirs;
            const fileDownload = yield RNFetchBlob.config({
                title: `${action.fileName}.csv`,
                fileCache: true,
                appendExt: 'csv',
                useDownloadManager: true,
                mediaScannable: true,
                notification: true,
                description: 'File downloaded by download manager.',
                path: `${dirs.DocumentDir}/${action.fileName}.csv`,
            }).fetch('GET', responses.data.path, {});
            yield put({
                type: 'DOWNLOAD_INVENTORY_SUCCESS',
                payload: fileDownload.path()
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
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* updateProductsPosition(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
    //console.log('--- updateProductsPosition : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
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

function* checkSKUIsExist(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
    //console.log('--- checkSKUIsExist : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            
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
        takeLatest('ADD_PRODUCR_BY_MERCHANT_ID', addProductByMerchant),
        takeLatest('GET_PRODUCTS_BY_MERCHANR_ID', getProductsByMerchantId),
        takeLatest('ARCHIVE_PRODUCT', archiveProduct),
        takeLatest('RESTORE_PRODUCT', restoreProduct),
        takeLatest('EDIT_PRODUCT', editProduct),
        takeLatest('SEARCH_PRODUCT', searchProduct),
        takeLatest('RESTOCK_PRODUCT', restockProduct),
        takeLatest('EXPORT_INVENTORY', exportInventory),
        takeLatest('UPDATE_PRODUCTS_POSITION', updateProductsPosition),
        takeLatest('CHECK_SKU_IS_EXIST', checkSKUIsExist),
    ])
} 