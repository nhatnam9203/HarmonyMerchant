import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

const initialState = {
  productsByMerchantId: [],
  listProductsSearch: [],
  isShowSearchProduct: false,
  refreshListProducts: false,
  isDownloadInventory: false,
  pathFileInventory: '',
  inventoryTabPermission: false,
};

function productReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_PRODUCTS_BY_MERCHANR_ID':
      return {
        ...state,
        refreshListProducts: !action.isShowLoading,
      };
    case 'GET_PRODUCTS_BY_MERCHANR_ID_SUCCESS':
      return {
        ...state,
        productsByMerchantId: action.payload,
        refreshListProducts: false,
      };
    case 'GET_PRODUCTS_BY_MERCHANR_ID_FAIL':
      return {
        ...state,
        refreshListProducts: false,
      };
    case 'SEARCH_PRODUCT_SUCCESS':
      return {
        ...state,
        listProductsSearch: action.payload,
        isShowSearchProduct: true,
      };
    case 'CLEAR_SEARCH_PRODUCT':
      return {
        ...state,
        listProductsSearch: [],
        isShowSearchProduct: false,
      };
    case 'NET_WORK_REQUEST_FAIL':
      return {
        ...state,
        refreshListProducts: false,
      };
    case 'TIME_OUT':
      return {
        ...state,
        refreshListProducts: false,
      };
    case 'DOWNLOAD_INVENTORY_SUCCESS':
      return {
        ...state,
        pathFileInventory: action.payload,
        isDownloadInventory: true,
      };
    case 'RESET_DOWNLOAD_FILE_INVENTORY':
      return {
        ...state,
        isDownloadInventory: false,
      };
    case 'UPDATE_PRODUCTS_POSITION_LOCAL':
      return {
        ...state,
        productsByMerchantId: action.payload,
      };
    case 'TOGGLE_PRODUCT_TAB_PERMISSION':
      return {
        ...state,
        inventoryTabPermission: action.payload,
      };
    case 'CLOSE_ALL_POPUP_PIN_CODE':
      return {
        ...state,
        inventoryTabPermission: false,
      };
    case 'LOGOUT_APP':
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

module.exports = persistReducer({
    key: 'product',
    storage: AsyncStorage,
    whitelist: ['productsByMerchantId']
}, productReducer);

export default productReducer;
