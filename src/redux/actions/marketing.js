import apiConfigs from '../../configs/api';

export function getBannerMerchant(merchantId) {
    return {
        type: 'GET_BANNER_MERCHANT',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}merchantbanner/getbymerchant/${merchantId}`
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

export function getPromotionByMerchant() {
    return {
        type: 'GET_PROMOTION_BY_MERCHANT',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}merchantpromotion`
    }
}

export function updatePromotionByMerchant(body) {
    return {
        type: 'UPDATE_PROMOTION_BY_MERCHANT',
        method: 'POST',
        token: true,
        body,
        api: `${apiConfigs.BASE_API}merchantPromotion`
    }
}

export function getPromotionByAppointment(appointmentId) {
    return {
        type: 'GET_PROMOTION_BY_APPOINTMENT',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/promotion/3357`
        // https://api2.levincidemo.com/api/appointment/promotion/3357
    }
}

export function closeModalDiscount() {
    return {
        type: 'CLOSE_MODAL_DISCOUNT',
    }
}


export function changeStylist(staffId, bookingServiceId, tipAmount, appointmentId) {
    return {
        type: 'CHANGE_STYLIST',
        method: 'PUT',
        token: true,
        body: {
            staffId,
            bookingServiceId,
            tipAmount,
        },
        api: `${apiConfigs.BASE_API}appointment/tip/${appointmentId}`,
        appointmentId
    }
}