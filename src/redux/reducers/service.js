import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

const initialState = {
    servicesByMerchant: [],
    listServicesSearch: [],
    isShowSearchService: false,
    refreshListServices: false,
    isGetListSearchService: false,

}

function serviceReducer(state = initialState, action) {
    switch (action.type) {
        // case 'REHYDRATE_SERVICES':
        //     return {
        //         ...initialState,
        //         servicesByMerchant: action.payload
        //     }
        case 'GET_SERVICE_BY_MERCHANT':
            return {
                ...state,
                refreshListServices: !action.isShowLoading
            }
        case 'GET_SERVICE_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                servicesByMerchant: !action.searchFilter ? action.payload : state.servicesByMerchant,
                listServicesSearch: action.searchFilter ? action.payload : state.listServicesSearch,
                isShowSearchService: action.searchFilter,
                refreshListServices: false
            }
        case 'GET_SERVICE_BY_MERCHANT_FAIL':
            return {
                ...state,
                refreshListServices: false
            }
        case 'SEARCH_SERVICE_SUCCESS':
            return {
                ...state,
                listServicesSearch: action.payload,
                isShowSearchService: true,
                isGetListSearchService: false
            }
        case 'CLEAR_SEARCH_SERVICE':
            return {
                ...state,
                listServicesSearch: [],
                isShowSearchService: false
            }
        case 'NET_WORK_REQUEST_FAIL':
            return {
                ...state,
                refreshListServices: false
            }
        case 'TIME_OUT':
            return {
                ...state,
                refreshListServices: false
            }
        case 'IS_GET_LIST_SEARCH_SERVICE':
            return {
                ...state,
                isGetListSearchService: true
            }
        case 'UPDATE_SERVICE_POSITION_LOCAL':
            return {
                ...state,
                servicesByMerchant: action.payload
            }


        default:
            return state
    }
}



// const persistConfig = {
//     key: 'service',
//     storage: AsyncStorage,
//     whitelist: ['servicesByMerchant']
// };

// module.exports = persistReducer(persistConfig, appReducer);

module.exports = persistReducer({
    key: 'service',
    storage: AsyncStorage,
    whitelist: ['servicesByMerchant']
  }, serviceReducer);


