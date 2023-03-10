import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

const initialState = {
    categoriesByMerchant: [],
    refreshListCategories: false,
    listCategoriesSearch: [],
    isShowSearchCategories: false,
    isGetListSearchCategories: false,
}

function categoriesReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_CATEGORIES_BY_MERCHANR_ID':
            return {
                ...state,
                refreshListCategories: !action.isShowLoading
            }
        case 'GET_CATEGORIES_BY_MERCHANR_ID_SUCCESS':
            return {
                ...state,
                categoriesByMerchant: !action.searchFilter ? action.payload : state.categoriesByMerchant,
                listCategoriesSearch: action.searchFilter ? action.payload : state.listCategoriesSearch,
                isShowSearchCategories: action.searchFilter,
                refreshListCategories: false
            }
        case 'GET_CATEGORIES_BY_MERCHANR_ID_FAIL':
            return {
                ...state,
                refreshListCategories: false
            }
        case 'UPDATE_POSITION_CATEGORIES_LOCAL':
            return {
                ...state,
                categoriesByMerchant: action.payload,
            }

        case 'SEARCH_CATEGORIES_SUCCESS':
            return {
                ...state,
                listCategoriesSearch: action.payload,
                isShowSearchCategories: true,
                isGetListSearchCategories: false
            }
        case 'CLEAR_SEARCH_CATEGORIES':
            return {
                ...state,
                listCategoriesSearch: [],
                isShowSearchCategories: false
            }
        case 'NET_WORK_REQUEST_FAIL':
            return {
                ...state,
                refreshListCategories: false
            }
        case 'TIME_OUT':
            return {
                ...state,
                refreshListCategories: false
            }
        case 'IS_GET_LIST_SEARCH_CATEGORIES':
            return {
                ...state,
                isGetListSearchCategories: true
            }
        case 'UPDATE_LIST_CATEGORY_LOCAL':
            return {
                ...state,
                categoriesByMerchant: action?.payload || state.categoriesByMerchant
            }
        case 'LOGOUT_APP':
            return {
                ...initialState,
            }

        default:
            return state
    }
}

module.exports = persistReducer({
    key: "category",
    storage: AsyncStorage,
    whitelist: ["categoriesByMerchant"]
}, categoriesReducer);

// export default categoriesReducer;
