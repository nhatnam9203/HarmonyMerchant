const initialState = {
    listBanners: [],
    isUploadBanner: false,
    promotions: [],
    discount: [
        {
            "appointmentPromotionId": 64,
            "appointmentId": 3357,
            "serviceId": 77,
            "promotionId": 1,
            "discountPercent": 15,
            "discount": 2.55,
            "createdDate": "2019-09-20T07:11:30.138981",
            "merchantPromotion": {
                "merchantPromotionId": 8,
                "promotionId": 1,
                "merchantId": 136,
                "campaignName": "Hotdeal",
                "fromDate": "2019-08-26T08:00:00",
                "toDate": "2020-08-26T17:30:00",
                "discount": 15,
                "discountType": "discount_percent",
                "serviceUsing": 0,
                "serviceApply": 0,
                "productUsing": 0,
                "productApply": 0,
                "promotionApplyOn": 0,
                "createdDate": "2019-08-30T07:19:24.798323",
                "isDisabled": 1,
                "defaultName": null,
                "fromTime": null,
                "toTime": null
            }
        }
    ]
}

function appReducer(state = initialState, action) {
    switch (action.type) {
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
            }
        default:
            return state
    }
}

module.exports = appReducer;
