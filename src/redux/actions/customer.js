import apiConfigs from '../../configs/api';

export function getListCustomersByMerchant() {
    return {
        type: 'GET_LIST_CUSTOMER_BY_MERCHANT',
        method: 'GET',
        api: `${apiConfigs.BASE_API}customer/bymerchant`,
        token: true
    }
}



