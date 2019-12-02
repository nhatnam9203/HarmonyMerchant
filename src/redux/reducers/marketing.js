import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

const initialState = {
    listBanners: [],
    isUploadBanner: false,
    promotions: [],
    discount: [],
    visibleModalDiscount: false,
    isApplyPromotion: false,
    appointmentIdUpdatePromotion: -1
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'REHYDRATE_MARKETINGS':
            return {
                ...initialState,
                listBanners: action.listBanners,
                promotions: action.promotions
            }
        case 'GET_BANNER_MERCHANT_SUCCESS':
            return {
                ...state,
                listBanners: action.payload,
                isUploadBanner: true
            }
        case 'RESET_STATE_UPLOAD_BANNER':
            return {
                ...state,
                isUploadBanner: false
            }
        case 'GET_PROMOTION_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                promotions: action.payload,
            }
        case 'GET_PROMOTION_BY_APPOINTMENT_SUCCESS':
            return {
                ...state,
                discount: action.payload,
                visibleModalDiscount: true,
                appointmentIdUpdatePromotion: action.appointmentId
            }
        case 'CLOSE_MODAL_DISCOUNT':
            return {
                ...state,
                visibleModalDiscount: false,
                discount: [],
            }
        case 'OPEN_MODAL_DISCOUNT':
            return {
                ...state,
                visibleModalDiscount: true,
            }
        case 'SET_STATUS_APPLY_BUTTON':
            return {
                ...state,
                isApplyPromotion: action.payload,
            }
        default:
            return state
    }
}

const persistConfig = {
    key: 'marketing',
    storage: AsyncStorage,
    whitelist: ['listBanners', 'promotions']
};

module.exports = persistReducer(persistConfig, appReducer);
