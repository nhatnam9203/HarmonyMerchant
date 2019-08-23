import apiConfigs from '../../configs/api';

export function getBannerMerchant(merchantId) {
    return {
        type: 'GET_BANNER_MERCHANT',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}merchantbanner/getbymerchant/${merchantId}`
    }
}

export function deleteBannerMerchant(merchantBannerId,merchantId) {
    return {
        type: 'DELETE_BANNER_MERCHANT',
        method: 'DELETE',
        body:{},
        token: true,
        api: `${apiConfigs.BASE_API}merchantbanner/${merchantBannerId}`,
        merchantId
    }
}

export function resetStateUploadBanner(){
    return{
        type:'RESET_STATE_UPLOAD_BANNER'
    }
}