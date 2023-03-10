import AsyncStorage from "@react-native-community/async-storage";
import { persistReducer } from "redux-persist";

const initialState = {
  listInvoicesByMerchant: [],
  totalPages: 0,
  currentPage: 0,
  refreshListInvoice: false,
  isLoadMoreInvoiceList: false,
  isLoadMoreBatchHistoryList: false,
  searchKeyword: "",
  searchBatchHistoryKeyword: "",
  listInvoicesSearch: [],
  isShowSearchInvoice: false,
  settleWaiting: {},
  invoicesOfStaff: [],
  transactionsSettlement: [],
  listTransactionSearch: [],
  isShowSearchTransaction: false,
  listBatchHistory: [],
  listBatchHistorySearch: [],
  batchHistoryPagesTotal: 0,
  batchHistoryPagesCurrent: 0,
  isShowSearchBatchHistory: false,
  refreshingSettle: false,
  refreshingTransaction: false,
  refreshingBatchHistory: false,
  isGettingSettlement: "",
  visibleConfirmPrintInvoice: false,
  invoiceTabPermission: false,
  settlementTabPermission: false,
  staffSales: [],
  gitfCardSales: [],
  isSettleBatch: null,
  isShowBackSettlement: false,
  staffSalesBySettlementId: [],
  isShowBackBatchHistory: false,
  gitfCardSalesBySettlementId: [],

  isHandleInternalFirstSettlemetTab: false,
  settlementCurrentPage: 0,
  settlementTotalPages: 0,
  isLoadMoreTransSettlement: false,

  invoiceDetail: {},
  creditBatchDetailById: {},
  isGetCreditBatchDetailById: false,
  isProcessAutoCloseBatch: false,

  depositedAmount: 0,
  depositTotalBySettlementId: 0,
  settleRefId: null, //use for get settle status dejavoo
};

function invoiceReducer(state = initialState, action) {
  switch (action.type) {
    case "AUTO_CLOSE_BATCH":
      return {
        ...state,
        isProcessAutoCloseBatch: true,
      };
    case "AUTO_CLOSE_BATCH_RESPONSE":
      return {
        ...state,
        isProcessAutoCloseBatch: false,
      };
    case "SAVE_SETTLE_WAITING":
      return {
        ...state,
        settleWaiting: action.settleWaiting,
      };
    case "SAVE_SETTLE_REF_ID":
      return {
        ...state,
        settleRefId: action.settleRefId,
      };
    case "GET_LIST_INVOICE_BY_MERCHANT":
      return {
        ...state,
        refreshListInvoice: !action.isShowLoading,
        isLoadMoreInvoiceList: action.isLoadMore,
      };
    case "GET_LIST_INVOICE_BY_MERCHANT_SUCCESS":
      return {
        ...state,
        listInvoicesByMerchant:
          action.currentPage === 1
            ? action.payload
            : state.listInvoicesByMerchant.concat(action.payload),
        totalPages: action.totalPages,
        currentPage: action.currentPage,
        refreshListInvoice: false,
        isLoadMoreInvoiceList: false,
      };
    case "GET_LIST_INVOICE_BY_MERCHANT_FAIL":
      return {
        ...state,
        refreshListInvoice: false,
        isLoadMoreInvoiceList: false,
      };
    case "SEARCH_INVOICE_SUCCESS":
      return {
        ...state,
        listInvoicesSearch: action.payload,
        isShowSearchInvoice: true,
      };
    case "CLEAR_SEARCH_SERVICE":
      return {
        ...state,
        listInvoicesSearch: [],
        isShowSearchInvoice: false,
      };
    case "GET_SETTLEMENT_WAITING":
      return {
        ...state,
        refreshingSettle: !action.isShowLoading,
        isGettingSettlement: "loading",
      };
    case "GET_SETTLEMENT_WAITING_SUCCESS":
      return {
        ...state,
        settleWaiting: action.payload,
        refreshingSettle: false,
        isGettingSettlement: "success",
      };
    case "GET_SETTLEMENT_WAITING_FAIL":
      return {
        ...state,
        refreshingSettle: false,
        isGettingSettlement: "fail",
      };
    case "RESET_STATE_IS_GETTING_SETTLEMENT":
      return {
        ...state,
        isGettingSettlement: "",
      };

    case "RESET_SETTLE":
      return {
        ...state,
        refreshingSettle: false,
        settleWaiting: {},
      };
    case "INVOICE_OFF_STAFF_SUCCESS":
      return {
        ...state,
        invoicesOfStaff: action.payload,
      };
    case "GET_TRANSACTION_SETTLEMENT":
      return {
        ...state,
        isLoadMoreTransSettlement: action.isLoadMore,
        refreshingTransaction: !action.isShowLoading,
      };
    case "GET_TRANSACTION_SETTLEMENT_SUCCESS":
      return {
        ...state,
        transactionsSettlement:
          action.currentPage === 1
            ? action.payload
            : state.transactionsSettlement.concat(action.payload),
        refreshingTransaction: false,
        settlementCurrentPage: action.currentPage,
        settlementTotalPages: action.totalPages,
        isLoadMoreTransSettlement: false,
      };
    case "GET_TRANSACTION_SETTLEMENT_FAIL":
      return {
        ...state,
        refreshingTransaction: false,
        isLoadMoreTransSettlement: false,
      };
    case "SEARCH_TRANSACTION_SETTLEMENT_SUCCESS":
      return {
        ...state,
        listTransactionSearch: action.payload,
        isShowSearchTransaction: true,
      };
    case "CLEAR_SEARCH_TRANSACTION":
      return {
        ...state,
        listTransactionSearch: [],
        isShowSearchTransaction: false,
      };
    case "GET_BATCH_HISTORY":
      return {
        ...state,
        refreshingBatchHistory: !action.isShowLoading,
        isLoadMoreBatchHistoryList: action.isShowLoadMore,
      };
    case "GET_BATCH_HISTORY_SUCCESS":
      return {
        ...state,
        listBatchHistory:
          action.currentPage === 1
            ? action.payload
            : state.listBatchHistory.concat(action.payload),
        batchHistoryPagesTotal: action.totalPages,
        batchHistoryPagesCurrent: action.currentPage,
        refreshingBatchHistory: false,
        isLoadMoreBatchHistoryList: false,
      };
    case "GET_BATCH_HISTORY_FAIL":
      return {
        ...state,
        refreshingBatchHistory: false,
        isLoadMoreBatchHistoryList: false,
      };
    case "SEARCH_BATCH_HISTORY_SUCCESS":
      return {
        ...state,
        listBatchHistorySearch: action.payload,
        isShowSearchBatchHistory: true,
      };
    case "CLEAR_SEARCH_BATCH_HISTORRY":
      return {
        ...state,
        listBatchHistorySearch: [],
        isShowSearchBatchHistory: false,
      };
    case "VISIBLE_POPUP_CONFIRM_PRINT_INVOICE":
      return {
        ...state,
        visibleConfirmPrintInvoice: action.payload,
      };
    case "UPDATE_SEARCH_KEYWORD":
      return {
        ...state,
        searchKeyword: action.payload,
      };
    case "UPDATE_BATCH_HISTORY_SEARCH_KEYWORD":
      return {
        ...state,
        searchBatchHistoryKeyword: action.payload,
      };
    case "TOGGLE_INVOICE_TAB_PERMISSION":
      return {
        ...state,
        invoiceTabPermission: action.payload,
      };
    case "TOGGLE_SETTLEMENT_TAB_PERMISSION":
      return {
        ...state,
        settlementTabPermission: action.payload,
      };

    case "HANDLE_INTERNAL_FIRST_SETTLEMENT_STATE":
      return {
        ...state,
        isHandleInternalFirstSettlemetTab: true,
      };
    case "RESET_INTERNAL_FIRST_SETTLEMENT_STATE":
      return {
        ...state,
        isHandleInternalFirstSettlemetTab: false,
      };
    case "GET_LIST_STAFFS_SALES_SUCCESS":
      return {
        ...state,
        staffSales: action.payload,
      };
    case "GET_LIST_GIFT_CARD_SALES_SUCCESS":
      return {
        ...state,
        gitfCardSales: action?.payload?.result,
        depositedAmount: action?.payload?.depositAmount ?? 0,
      };

    case "SETTLE_BATCH_SUCCESS":
      return {
        ...state,
        isSettleBatch: "success",
      };
    case "SETTLE_BATCH_FAIL":
      return {
        ...state,
        isSettleBatch: "fail",
      };
    case "RESET_STATE_SETTLE_BATCH":
      return {
        ...state,
        isSettleBatch: null,
      };
    case "TOOGLE_DISPLAY_BACK_SETTLE_ICON":
      return {
        ...state,
        isShowBackSettlement: action.payload,
      };

    case "CLOSE_ALL_POPUP_PIN_CODE":
      return {
        ...state,
        invoiceTabPermission: false,
        settlementTabPermission: false,
      };
    case "GET_STAFF_SALES_BY_SETTLEMENT_ID_SUCCESS":
      return {
        ...state,
        staffSalesBySettlementId: action.payload,
      };
    case "TOOGLE_DISPLAY_BACK_BATCH_HISTORY_ICON":
      return {
        ...state,
        isShowBackBatchHistory: action.payload,
      };
    case "GET_GIFT_CARD_SALES_BY_SETTLEMENT_ID_SUCCESS":
      return {
        ...state,
        gitfCardSalesBySettlementId: action?.payload?.result,
        depositTotalBySettlementId: action?.payload?.depositedAmount ?? 0,
      };

    case "GET_INVOICE_DETAIL_SUCCESS":
      return {
        ...state,
        invoiceDetail: action.payload,
      };
    case "RESET_INVOICE_DETAIL_STATE":
      return {
        ...state,
        invoiceDetail: {},
      };
    case "GET_CREDIT_BATCH_DETAIL_BY_ID_SUCCESS":
      return {
        ...state,
        creditBatchDetailById: action.payload,
        isGetCreditBatchDetailById: true,
      };
    case "RESET_STATE_CREDIT_BATCH_DETAIL_BY_ID":
      return {
        ...state,
        isGetCreditBatchDetailById: false,
      };
    case "LOGOUT_APP":
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

module.exports = persistReducer(
  {
    key: "invoice",
    storage: AsyncStorage,
    whitelist: ["listInvoicesByMerchant"],
  },
  invoiceReducer
);

// export default invoiceReducer;
