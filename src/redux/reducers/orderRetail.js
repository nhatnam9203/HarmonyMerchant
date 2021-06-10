import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
  orderListOfRetailer: [],
  orderRetailDetail: {},

  isGetOrderRetailDetail: false,
  visibleProductDetailModalRetail: false,
  productDetailRetail: {},
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    // ------------- RETAIL -------------
    case 'GET_ORDERS_FROM_STORE_SUCCESS':
      return {
        ...state,
        orderListOfRetailer:
          action.currentPage === 1
            ? action.payload
            : state.orderListOfRetailer.concat(action.payload),
        orderListOfRetailerTotalPages: action.totalPages,
        orderListOfRetailerCurrentPage: action.currentPage,
      };
    case 'GET_ORDER_RETAIL_DETAIL_SUCCESS':
      return {
        ...state,
        orderRetailDetail: action.payload,
        isGetOrderRetailDetail: true,
      };
    case 'RESET_STATE_IS_GET_ORDER_RETAIL_DETAIL':
      return {
        ...state,
        isGetOrderRetailDetail: false,
      };
    case 'SWITCH_PRODUCT_DETAIL_POPUP_RETAIL':
      return {
        ...state,
        visibleProductDetailModalRetail: action.payload,
      };
    case 'GET_TEMP_APPOINTMENT_DETAIL_OF_RETAIL_SUCCESS':
      return {
        ...state,
        productDetailRetail: action.payload,
      };

    case 'LOGOUT_APP':
      return {
        ...initialState,
        isInitialApp: false,
      };

    default:
      return state;
  }
}

// module.exports = persistReducer({
//   key: "orderRetail",
//   storage: AsyncStorage,
//   whitelist: [""]
// }, appReducer);

export default appReducer;
