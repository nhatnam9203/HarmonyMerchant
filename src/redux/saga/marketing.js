import { put, takeLatest, all, join } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";

import { requestAPI, uploadFromData } from '../../utils';
import apiConfigs from '../../configs/api';

function* getBannerMerchant(action) {
    try {
        action.isLoading ? yield put({ type: 'LOADING_ROOT' }) : null;
        const responses = yield requestAPI(action);
        //console.log('getBannerMerchant : ', responses);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_BANNER_MERCHANT_SUCCESS',
                payload: responses.data
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
        yield put({
            type: 'GET_BANNER_MERCHANT_FAIL',
        });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* deleteBannerMerchant(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        //console.log('deleteBannerMerchant : ', responses);
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_BANNER_MERCHANT',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}merchantbanner/getbymerchant/${action.merchantId}`
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


function* addBannerWithInfo(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        //console.log('addBannerWithInfo : ', responses);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_BANNER_MERCHANT',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}merchantbanner/getbymerchant/${action.merchantId}`
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
// ---------- Handle Promotion -----

function* getPromotionByMerchant(action) {
    try {
        // yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        //console.log('getPromotionByMerchant : ', JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_PROMOTION_BY_MERCHANT_SUCCESS',
                payload: responses.data
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            });
            yield put({
                type: 'GET_PROMOTION_BY_MERCHANT_FAIL',
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses.message
            });
            yield put({
                type: 'GET_PROMOTION_BY_MERCHANT_FAIL',
            })
        }
    } catch (error) {
        yield put({
            type: 'GET_PROMOTION_BY_MERCHANT_FAIL',
        })
        // alert(`error-getPromotionByMerchant: ${error}`)
        yield put({ type: error });
    } finally {
        // yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* updatePromotionByMerchant(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        // console.log('updatePromotionByMerchant : ', JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SET_STATUS_APPLY_BUTTON',
                payload: false
            });
            yield put({
                type: 'GET_PROMOTION_BY_MERCHANT',
                method: 'GET',
                token: true,
                api: `${apiConfigs.BASE_API}merchantpromotion`
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

function* getPromotionByAppointment(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log('getPromotionByAppointment : ', JSON.stringify(responses));
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            if(action.isBlock){
                yield put({
                    type: 'GET_PROMOTION_BY_BLOCK_APPOINTMENT_SUCCESS',
                    payload: responses.data,
                    appointmentId: action.appointmentId
                })
            }else{
                yield put({
                    type: 'GET_PROMOTION_BY_APPOINTMENT_SUCCESS',
                    payload: responses.data,
                    appointmentId: action.appointmentId
                })
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
        yield put({ type: 'STOP_LOADING_ROOT' });
        setTimeout(() => {
            alert(`error-getPromotionByAppointment: ${error}`)
        }, 2000);
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}


function* changeStylist(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        //console.log('responses : ', JSON.stringify(action.body));
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        //console.log('responses : ', JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            action.isGroup ? yield put({
                type: 'GET_GROUP_APPOINTMENT_BY_ID',
                method: 'GET',
                api: `${apiConfigs.BASE_API}appointment/getGroupById/${action.appointmentId ? action.appointmentId : "changeStylist"}`,
                token: true
            }) :
                yield put({
                    type: 'GET_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}appointment/${action.appointmentId}`,
                    token: true
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

function* customPromotion(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        //console.log('responses : ', JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            if(!action.isBlock){
                action.isGroup ? yield put({
                    type: 'GET_GROUP_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}appointment/getGroupById/${action.appointmentid ? action.appointmentid : "customPromotion"}`,
                    token: true
                }) :
                    yield put({
                        type: 'GET_APPOINTMENT_BY_ID',
                        method: 'GET',
                        api: `${apiConfigs.BASE_API}appointment/${action.appointmentid}`,
                        token: true
                    })
            }else{
                yield put({
                    type: 'GET_BLOCK_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}appointment/${action.appointmentid}`,
                    token: true,
                    appointmentId: action.appointmentid
                })
            }
           
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: `${responses.message}-${codeNumber}`
            })
        }
    } catch (error) {
        alert(`error-customPromotion: ${error}`)
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* sendNotificationByPromotionId(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        //console.log('sendNotificationByPromotionId : ', JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            // yield put({
            //     type: 'GET_APPOINTMENT_BY_ID',
            //     method: 'GET',
            //     api: `${apiConfigs.BASE_API}appointment/${action.appointmentid}`,
            //     token: true
            // })
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
        takeLatest('GET_BANNER_MERCHANT', getBannerMerchant),
        takeLatest('DELETE_BANNER_MERCHANT', deleteBannerMerchant),
        takeLatest('ADD_BANNER_WITH_INFO', addBannerWithInfo),
        takeLatest('GET_PROMOTION_BY_MERCHANT', getPromotionByMerchant),
        takeLatest('UPDATE_PROMOTION_BY_MERCHANT', updatePromotionByMerchant),
        takeLatest('GET_PROMOTION_BY_APPOINTMENT', getPromotionByAppointment),
        takeLatest('CHANGE_STYLIST', changeStylist),
        takeLatest('CUSTOM_PROMOTION', customPromotion),
        takeLatest('SEND_NOTI_BY_PROMOTION_ID', sendNotificationByPromotionId),

    ])
}