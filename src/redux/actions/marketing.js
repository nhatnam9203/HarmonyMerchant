import apiConfigs from '../../configs/api';

export function getBannerMerchant(merchantId) {
    return {
        type: 'GET_BANNER_MERCHANT',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}merchantbanner/getbymerchant/${merchantId}`
    }
}
