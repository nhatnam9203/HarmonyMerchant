import apiConfigs from '../../configs/api';

export function getBannerMerchant(merchantId, isLoading = true, isRefresh = false) {
    return {
        type: 'GET_BANNER_MERCHANT',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}merchantbanner/getbymerchant/${merchantId}`,
        isLoading,
        isRefresh
    }
}

export function deleteBannerMerchant(body, merchantId) {
    return {
        type: 'DELETE_BANNER_MERCHANT',
        method: 'DELETE',
        body: body,
        token: true,
        api: `${apiConfigs.BASE_API}merchantbanner/multiple`,
        merchantId
    }
}

export function resetStateUploadBanner() {
    return {
        type: 'RESET_STATE_UPLOAD_BANNER'
    }
}

// ------------ promotion -------------



export function updatePromotionByMerchant(body, promotionId = 1, isSendNoti = true) {
    console.log("-------body: ",body);
    return {
        type: 'UPDATE_PROMOTION_BY_MERCHANT',
        method: 'POST',
        token: true,
        body,
        api: `${apiConfigs.BASE_API}merchantPromotion`,
        promotionId,
        isSendNoti
    }
}

export function getPromotionByAppointment(appointmentId, isBlock = false) {
    return {
        type: 'GET_PROMOTION_BY_APPOINTMENT',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/promotion/${appointmentId}`,
        appointmentId,
        isBlock
    }
}

export function closeModalDiscount() {
    return {
        type: 'CLOSE_MODAL_DISCOUNT',
    }
}


export function changeStylist(staffId, bookingServiceId, tipAmount, appointmentId, price, tipPercent = 0, note = "", isGroup = false) {
    return {
        type: 'CHANGE_STYLIST',
        method: 'PUT',
        token: true,
        body: {
            staffId: staffId ? staffId : 0,
            bookingServiceId,
            tipAmount,
            price,
            tipPercent,
            note
        },
        api: `${apiConfigs.BASE_API}appointment/tip/${appointmentId}`,
        appointmentId,
        isGroup
    }
}

export function customPromotion(discountPercent, discountFixtom, isDiscountByOwner, appointmentid, isGroup = false, isBlock = false) {
    return {
        type: 'CUSTOM_PROMOTION',
        method: 'PUT',
        token: true,
        body: {
            discountPercent,
            discountFixtom,
            isDiscountByOwner
        },
        api: `${apiConfigs.BASE_API}appointment/custompromotion/${appointmentid}`,
        appointmentid,
        isGroup,
        isBlock
    }
}

export function setStatusApplyButton(isApply, promotionId = 1) {
    return {
        type: 'SET_STATUS_APPLY_BUTTON',
        payload: isApply,
        promotionId
    }
}

export function sendNotificationByPromotionId(promotionId) {
    return {
        type: 'SEND_NOTI_BY_PROMOTION_ID',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}merchantpromotion/promotion/${promotionId}`
    }
}

export function openPopupDiscount() {
    return {
        type: 'OPEN_MODAL_DISCOUNT',
    }
}

export function resetStateGetPromotion() {
    return {
        type: 'RESET_STATE_GET_PROMOTION',
    }
}

export function toggleMarketingTabPermission(visible = true) {
    return {
        type: 'TOGGLE_MAKETING_TAB_PERMISSION',
        payload: visible
    }
}

export function resetStateGetPromotionOfAppointment() {
    return {
        type: 'RESET_STATE_GET_PROMOTION_OF_APPOINTMENT',
    }
}

export function addPromotionNote(appointemntId, notes) {
    return {
        type: 'ADD_PROMOTION_NOTE',
        method: 'POST',
        body: {
            notes
        },
        token: true,
        api: `${apiConfigs.BASE_API}appointment/promotion/note/${appointemntId}`
    }
}

export function updatePromotionNote(promotionNoteId, notes) {
    return {
        type: 'UPDATE_PROMOTION_NOTE',
        method: 'PUT',
        body: {
            notes
        },
        token: true,
        api: `${apiConfigs.BASE_API}appointment/promotion/note/${promotionNoteId}`
    }
}

export function switchPopupCheckDiscountPermission(visible = true) {
    return {
        type: "SWITCH_POPUP_CHECK_DISCOUNT_PERMISSION",
        payload: visible
    }
}

export function switchPopupCheckDiscountPermissionInHome(visible = true) {
    return {
        type: "SWITCH_POPUP_CHECK_DISCOUNT_PERMISSION_IN_HOME",
        payload: visible
    }
}

// -------------- New Promotion API ------------

export function getPromotionByMerchant(isLoading = true) {
    return {
        type: 'GET_PROMOTION_BY_MERCHANT',
        method: 'GET',
        token: true,
        // api: `${apiConfigs.BASE_API}merchantpromotion`,
        api: `${apiConfigs.BASE_API}MerchantPromotion?api-version=1.2`,
        isLoading
    }
}

export function getPromotionDetailById(promotionId) {
    return {
        type: 'GET_PROMOTION_DETAIL_BY_ID',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}MerchantPromotion/${promotionId}?api-version=1.2`,
    }
}

export function disablePromotionById(promotionId) {
    return {
        type: 'DISABLE_PROMOTION_BY_ID',
        method: 'PUT',
        body: {},
        token: true,
        api: `${apiConfigs.BASE_API}MerchantPromotion/disable/${promotionId}?api-version=1.2`
    }
}

export function enablePromotionById(promotionId) {
    return {
        type: 'ENABLE_PROMOTION_BY_ID',
        method: 'PUT',
        body: {},
        token: true,
        api: `${apiConfigs.BASE_API}MerchantPromotion/enable/${promotionId}?api-version=1.2`
    }
}

export function updatePromotionById(promotionId, body) {
    return {
        type: 'UPDATE_PROMOTION_BY_ID',
        method: 'PUT',
        body,
        token: true,
        api: `${apiConfigs.BASE_API}MerchantPromotion/${promotionId}?api-version=1.2`
    }
}

export function resetStateIsUpdatePromotionById(visible = true) {
    return {
        type: "RESET_STATE_IS_UPDATE_PROMOTION_BY_ID",
        payload: visible
    }
}

export function createNewCampaign(body) {
    return {
        type: 'CREATE_NEW_CAMPAIGN',
        method: 'POST',
        body,
        token: true,
        api: `${apiConfigs.BASE_API}MerchantPromotion?api-version=1.2`
    }
}