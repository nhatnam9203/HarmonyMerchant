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
    isGoToTabMarketing: false,

    isApplyFirstPromotion: false,
    isApplySecondPromotion: false,
    isApplyThirdPromotion: false,
    isApplyFourthPromotion: false,
    isApplyFivethPromotion: false,
    isGetPromotionOfAppointment: "",
    promotionNotes: {},
    isDiscountByOwner: true,
    visiblePopupCheckDiscountPermission: false,
    visiblePopupCheckDiscountPermissionInHome: false,

    promotionDetailById: {},
    isUpdatePromotionById: false,
    smsInfoMarketing: {}
}

function marketingReducer(state = initialState, action) {
    switch (action.type) {
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
        case 'GET_PROMOTION_BY_APPOINTMENT':
            return {
                ...state,
                isGetPromotionOfAppointment: ""
            }
        case 'GET_PROMOTION_BY_APPOINTMENT_SUCCESS':
            return {
                ...state,
                discount: action.payload,
                visibleModalDiscount: true,
                appointmentIdUpdatePromotion: action.appointmentId,
                isGetPromotionOfAppointment: "success",
                promotionNotes: action.promotionNotes,
                isDiscountByOwner: action.isDiscountByOwner
            }
        case 'GET_PROMOTION_BY_APPOINTMENT_FAIL':
            return {
                ...state,
                isGetPromotionOfAppointment: ""
            }
        case 'RESET_STATE_GET_PROMOTION_OF_APPOINTMENT':
            return {
                ...state,
                isGetPromotionOfAppointment: ""
            }
        case 'GET_PROMOTION_BY_BLOCK_APPOINTMENT_SUCCESS':
            return {
                ...state,
                discount: action.payload,
                visibleModalBlockDiscount: true,
                appointmentIdUpdatePromotion: action.appointmentId,
                promotionNotes: action.promotionNotes,
                isGetPromotionOfAppointment: "success",
                isDiscountByOwner: action.isDiscountByOwner
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
        case 'RESET_STATE_GET_PROMOTION':
            return {
                ...state,
                refreshingPromotion: false,
                isGetPromotionByMerchant: false,
                isApplyPromotion: false,
                isApplyFirstPromotion: false,
                isApplySecondPromotion: false,
                isApplyThirdPromotion: false,
                isApplyFourthPromotion: false,
                isApplyFivethPromotion: false
            }
        case 'SET_STATUS_APPLY_BUTTON':
            return {
                ...state,
                isApplyPromotion: action.payload,
                isApplyFirstPromotion: action.promotionId === 1 ? action.payload : state.isApplyFirstPromotion,
                isApplySecondPromotion: action.promotionId === 2 ? action.payload : state.isApplySecondPromotion,
                isApplyThirdPromotion: action.promotionId === 3 ? action.payload : state.isApplyThirdPromotion,
                isApplyFourthPromotion: action.promotionId === 4 ? action.payload : state.isApplyFourthPromotion,
                isApplyFivethPromotion: action.promotionId === 5 ? action.payload : state.isApplyFivethPromotion,
            }
        case 'TOGGLE_MAKETING_TAB_PERMISSION':
            return {
                ...state,
                marketingTabPermission: action.payload,
                isGoToTabMarketing: action.isGoToTabMarketing
            }
        case 'SWITCH_POPUP_CHECK_DISCOUNT_PERMISSION':
            return {
                ...state,
                visiblePopupCheckDiscountPermission: action?.payload
            }
        case 'SWITCH_POPUP_CHECK_DISCOUNT_PERMISSION_IN_HOME':
            return {
                ...state,
                visiblePopupCheckDiscountPermissionInHome: action?.payload
            }
        case "GET_PROMOTION_DETAIL_BY_ID_SUCCESS":
            return {
                ...state,
                promotionDetailById: action.payload
            }
        case "UPDATE_PROMOTION_BY_ID":
            return {
                ...state,
                isUpdatePromotionById: false
            }
        case "UPDATE_PROMOTION_BY_ID_SUCCESS":
            return {
                ...state,
                isUpdatePromotionById: true
            }
        case "RESET_STATE_IS_UPDATE_PROMOTION_BY_ID":
            return {
                ...state,
                isUpdatePromotionById: false
            }
        case "GET_SMS_INFORMATION_SUCCESS":
            return {
                ...state,
                smsInfoMarketing: action.payload
            }
        case "RESET_STATE_PROMOTION_DETAIL_BY_ID":
            return {
                ...state,
                promotionDetailById: {}
            }
        case 'LOGOUT_APP':
            return {
                ...initialState,
            }

        default:
            return state
    }
}

// module.exports = persistReducer({
//     key: 'marketing',
//     storage: AsyncStorage,
//     whitelist: ['listBanners', 'promotions']
// }, marketingReducer);


export default marketingReducer;
