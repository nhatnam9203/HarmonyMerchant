import { put, takeLatest, all } from "redux-saga/effects";

import { requestAPI } from '../../utils';
import Configs from '@configs';
import { getPromotionByMerchant } from "../actions/marketing";

import actions from '@actions';

function* getBannerMerchant(action) {
    try {
        if (action.isLoading) {
            yield put({ type: 'LOADING_ROOT' });
        }
        const responses = yield requestAPI(action);
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
                message: responses?.message
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
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_BANNER_MERCHANT',
                method: 'GET',
                token: true,
                api: `merchantbanner/getbymerchant/${action.merchantId}`
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
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
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_BANNER_MERCHANT',
                method: 'GET',
                token: true,
                api: `merchantbanner/getbymerchant/${action.merchantId}`
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}
// ---------- Handle Promotion -----

function* getPromotionByMerchantSaga(action) {
    try {
        if (action.isLoading) {
            yield put({ type: 'LOADING_ROOT' })
        }
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'GET_PROMOTION_BY_MERCHANT_SUCCESS',
                payload: responses?.data || []
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            });
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            });
            yield put({
                type: 'GET_PROMOTION_BY_MERCHANT_FAIL',
            })
        }
    } catch (error) {
        yield put({
            type: 'GET_PROMOTION_BY_MERCHANT_FAIL',
        })
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* updatePromotionByMerchant(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: 'SET_STATUS_APPLY_BUTTON',
                payload: false,
                promotionId: action.promotionId
            });
            yield put({
                type: 'GET_PROMOTION_BY_MERCHANT',
                method: 'GET',
                token: true,
                api: `merchantpromotion`,
                isLoading: true
            });
            if (action.isSendNoti) {
                yield put({
                    type: 'SEND_NOTI_BY_PROMOTION_ID',
                    method: 'GET',
                    token: true,
                    api: `merchantpromotion/promotion/${action.promotionId}`
                });
            }


        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
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
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            if (action.isBlock) {
                yield put({
                    type: 'GET_PROMOTION_BY_BLOCK_APPOINTMENT_SUCCESS',
                    payload: responses?.data?.promotions || [],
                    appointmentId: action.appointmentId,
                    promotionNotes: responses?.data?.notes || {},
                    discountByOwner: responses?.data.discountByOwner || true,
                })
            } else {
                yield put({
                    type: 'GET_PROMOTION_BY_APPOINTMENT_SUCCESS',
                    payload: responses?.data?.promotions || [],
                    appointmentId: action.appointmentId,
                    promotionNotes: responses?.data?.notes || {},
                    discountByOwner: responses?.data.discountByOwner || true,
                })
            }
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'GET_PROMOTION_BY_APPOINTMENT_FAIL',
            });
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: 'STOP_LOADING_ROOT' });
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}


function* changeStylist(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        yield put({ type: 'STOP_LOADING_ROOT' });
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            action.isGroup ? yield put({
                type: 'GET_GROUP_APPOINTMENT_BY_ID',
                method: 'GET',
                api: `appointment/getGroupById/${action?.appointmentId || "changeStylist"}`,
                token: true
            }) :
                yield put({
                    type: 'GET_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `appointment/${action.appointmentId}`,
                    token: true
                })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
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
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            if (!action.isBlock) {
                action.isGroup ? yield put({
                    type: 'GET_GROUP_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `appointment/getGroupById/${action?.appointmentid || "customPromotion"}`,
                    token: true
                }) :
                    yield put({
                        type: 'GET_APPOINTMENT_BY_ID',
                        method: 'GET',
                        api: `appointment/${action.appointmentid}`,
                        token: true
                    })
            } else {
                yield put({
                    type: 'GET_BLOCK_APPOINTMENT_BY_ID',
                    method: 'GET',
                    api: `appointment/${action.appointmentid}`,
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
                message: responses?.message
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
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* updatePromotionNote(action) {
    try {
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* addPromotionNote(action) {
    try {
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* disablePromotionById(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put(getPromotionByMerchant());
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* enablePromotionById(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put(getPromotionByMerchant());
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}


function* getPromotionDetailById(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "GET_PROMOTION_DETAIL_BY_ID_SUCCESS",
                payload: responses?.data || {}
            });

            yield put(actions.marketing.getSMSInformation(action?.conditionId || 0));
            // if (action?.conditionId) {
            //     yield put(actions.marketing.getSMSInformation(action?.conditionId || 0));
            // }

        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* updatePromotionById(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put(getPromotionByMerchant());
            yield put({
                type: "UPDATE_PROMOTION_BY_ID_SUCCESS"
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* createNewCampaign(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put(getPromotionByMerchant());
            yield put({
                type: "UPDATE_PROMOTION_BY_ID_SUCCESS"
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
            })
        }
    } catch (error) {
        yield put({ type: error });
    } finally {
        yield put({ type: 'STOP_LOADING_ROOT' });
    }
}

function* getSMSInformation(action) {
    try {
        yield put({ type: 'LOADING_ROOT' });
        const responses = yield requestAPI(action);
        // console.log("----- getSMSInformation: ", JSON.stringify(responses));
        const { codeNumber } = responses;
        if (parseInt(codeNumber) == 200) {
            yield put({
                type: "GET_SMS_INFORMATION_SUCCESS",
                payload: responses?.data || {}
            })
        } else if (parseInt(codeNumber) === 401) {
            yield put({
                type: 'UNAUTHORIZED'
            })
        } else {
            yield put({
                type: 'SHOW_ERROR_MESSAGE',
                message: responses?.message
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
        takeLatest('GET_PROMOTION_BY_MERCHANT', getPromotionByMerchantSaga),
        takeLatest('UPDATE_PROMOTION_BY_MERCHANT', updatePromotionByMerchant),
        takeLatest('GET_PROMOTION_BY_APPOINTMENT', getPromotionByAppointment),
        takeLatest('CHANGE_STYLIST', changeStylist),
        takeLatest('CUSTOM_PROMOTION', customPromotion),
        takeLatest('SEND_NOTI_BY_PROMOTION_ID', sendNotificationByPromotionId),
        takeLatest('UPDATE_PROMOTION_NOTE', updatePromotionNote),
        takeLatest('ADD_PROMOTION_NOTE', addPromotionNote),

        // -------------- New Promotion API ------------
        takeLatest('DISABLE_PROMOTION_BY_ID', disablePromotionById),
        takeLatest('ENABLE_PROMOTION_BY_ID', enablePromotionById),
        takeLatest('GET_PROMOTION_DETAIL_BY_ID', getPromotionDetailById),
        takeLatest('UPDATE_PROMOTION_BY_ID', updatePromotionById),
        takeLatest('CREATE_NEW_CAMPAIGN', createNewCampaign),
        takeLatest('GET_SMS_INFORMATION', getSMSInformation),


    ])
}
