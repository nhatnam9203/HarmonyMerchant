import apiConfigs from '../../configs/api';

export function addCategory(body) {
    return {
        type: 'ADD_CATEGORY',
        body,
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}category/add`
    }
}

export function getListCategories() {
    return {
        type: 'GET_LIST_CATEGORY',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}category`
    }
}


