import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

const initialState = {
    listBanners: [],
    isUploadBanner: false,
    promotions: [],
    discount: [],
    visibleModalDiscount: false,
    isApplyPromotion: false,
    appointmentIdUpdatePromotion: -1,
    refreshingPromotion: false,
    refreshBannerList: false,
    isGetPromotionByMerchant: false,
    visibleModalBlockDiscount: false,
    marketingTabPermission: false,
    isGoToTabMarketing: false
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'REHYDRATE_MARKETINGS':
            return {
                ...initialState,
                listBanners: action.listBanners,
                promotions: action.promotions
            }
        case 'RESET_GROUP_APPOINTMENT':
            return {
                ...state,
                appointmentIdUpdatePromotion: -1,
            }
        case 'GET_BANNER_MERCHANT':
            return {
                ...state,
                refreshBannerList: action.isRefresh ? true : false
            }
        case 'GET_BANNER_MERCHANT_SUCCESS':
            return {
                ...state,
                listBanners: action.payload,
                isUploadBanner: true,
                refreshBannerList: false
            }
        case 'GET_BANNER_MERCHANT_FAIL':
            return {
                ...state,
                refreshBannerList: false
            }
        case 'RESET_STATE_UPLOAD_BANNER':
            return {
                ...state,
                isUploadBanner: false
            }
        case 'GET_PROMOTION_BY_MERCHANT':
            return {
                ...state,
                refreshingPromotion: !action.isLoading,
                isGetPromotionByMerchant: false
            }
        case 'GET_PROMOTION_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                promotions: action.payload,
                refreshingPromotion: false,
                isGetPromotionByMerchant: true
            }
        case 'GET_PROMOTION_BY_MERCHANT_FAIL':
            return {
                ...state,
                refreshingPromotion: false,
                isGetPromotionByMerchant: false
            }
        case 'RESET_STATE_GET_PROMOTION':
            return {
                ...state,
                refreshingPromotion: false,
                isGetPromotionByMerchant: false
            }
        case 'GET_PROMOTION_BY_APPOINTMENT_SUCCESS':
            return {
                ...state,
                discount: action.payload,
                visibleModalDiscount: true,
                appointmentIdUpdatePromotion: action.appointmentId
            }
        case 'GET_PROMOTION_BY_BLOCK_APPOINTMENT_SUCCESS':
            return {
                ...state,
                discount: action.payload,
                visibleModalBlockDiscount: true,
                appointmentIdUpdatePromotion: action.appointmentId
            }

        case 'CLOSE_MODAL_DISCOUNT':
            return {
                ...state,
                visibleModalDiscount: false,
                visibleModalBlockDiscount: false,
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
        case 'TOGGLE_MAKETING_TAB_PERMISSION':
            return {
                ...state,
                marketingTabPermission: action.payload,
                isGoToTabMarketing: action.isGoToTabMarketing
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
