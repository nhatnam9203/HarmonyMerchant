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

export function deleteBannerMerchant(merchantBannerId, merchantId) {
    return {
        type: 'DELETE_BANNER_MERCHANT',
        method: 'DELETE',
        body: {},
        token: true,
        api: `${apiConfigs.BASE_API}merchantbanner/${merchantBannerId}`,
        merchantId
    }
}

export function resetStateUploadBanner() {
    return {
        type: 'RESET_STATE_UPLOAD_BANNER'
    }
}

// ------------ promotion -------------

export function getPromotionByMerchant(isLoading = true) {
    return {
        type: 'GET_PROMOTION_BY_MERCHANT',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}merchantpromotion`,
        isLoading
    }
}

export function updatePromotionByMerchant(body,promotionId = 1,isSendNoti = true) {
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


export function changeStylist(staffId, bookingServiceId, tipAmount, appointmentId, price,tipPercent = 0,note = "" ,isGroup = false) {
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

export function customPromotion(discountPercent, discountFixtom, isDiscountByOwner,appointmentid, isGroup = false,isBlock = false) {
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

export function setStatusApplyButton(isApply,promotionId = 1) {
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

export function addPromotionNote(appointemntId,notes) {
    return {
        type: 'ADD_PROMOTION_NOTE',
        method: 'POST',
        body:{
            notes
        },
        token: true,
        api: `${apiConfigs.BASE_API}appointment/promotion/note/${appointemntId}`
    }
}

export function updatePromotionNote(promotionNoteId,notes) {
    return {
        type: 'UPDATE_PROMOTION_NOTE',
        method: 'PUT',
        body:{
            notes
        },
        token: true,
        api: `${apiConfigs.BASE_API}appointment/promotion/note/${promotionNoteId}`
    }
}

