import apiConfigs from '../../configs/api';

export function getMerchantByID(id) {
    return {
        type: 'GET_MERCHANT_BY_ID',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}merchant/${id}`
    }
}