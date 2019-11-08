import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

const initialState = {
    extrasByMerchant: [],
    refreshListExtras: false,
    listExtrasSearch: [],
    isShowSearchExtra: false,
    isGetListSearchExtra: false
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'REHYDRATE_EXTRAS':
            return {
                ...initialState,
                extrasByMerchant: action.payload
            }
        case 'GET_EXTRA_BY_MERCHANT':
            return {
                ...state,
                refreshListExtras: !action.isShowLoading
            }
        case 'GET_EXTRA_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                extrasByMerchant: action.payload,
                refreshListExtras: false
            }
        case 'GET_EXTRA_BY_MERCHANT_FAIL':
            return {
                ...state,
                refreshListExtras: false
            }
        case 'SEARCH_EXTRA_SUCCESS':
            return {
                ...state,
                listExtrasSearch: action.payload,
                isShowSearchExtra: true,
                isGetListSearchExtra: false
            }
        case 'CLEAR_SEARCH_EXTRA':
            return {
                ...state,
                listExtrasSearch: [],
                isShowSearchExtra: false
            }
        case 'NET_WORK_REQUEST_FAIL':
            return {
                ...state,
                refreshListExtras: false
            }
        case 'TIME_OUT':
            return {
                ...state,
                refreshListExtras: false
            }
        case 'IS_GET_LIST_SEARCH_EXTRA':
            return {
                ...state,
                isGetListSearchExtra: true
            }
        case 'UPDATE_POSITION_EXTRAS_LOCAL':
            return {
                ...state,
                extrasByMerchant: action.payload,
            }

        default:
            return state
    }
}

const persistConfig = {
    key: 'extra',
    storage: AsyncStorage,
    whitelist: ['extrasByMerchant']
};

module.exports = persistReducer(persistConfig, appReducer);
