import Configs from "@configs";

export function getListInvoicesByMerchant(
  key = "",
  method = "",
  status = "",
  timeStart = "",
  timeEnd = "",
  quickFilter = "",
  page = 1,
  isShowLoading = true,
  isLoadMore = false
) {
  return {
    type: "GET_LIST_INVOICE_BY_MERCHANT",
    method: "GET",
    api: `checkout?page=${page}&method=${method}&status=${status}&timeStart=${timeStart}&timeEnd=${timeEnd}&key=${key}&quickFilter=${quickFilter}&row=10&api-version=1.1`,
    token: true,
    isShowLoading,
    currentPage: page,
    isLoadMore,
  };
}

export function searchInvoice(urlSearch) {
  return {
    type: "SEARCH_INVOICE",
    method: "GET",
    api: `checkout/search?${urlSearch}`,
    token: true,
  };
}

export function clearSearInvoice() {
  return {
    type: "CLEAR_SEARCH_SERVICE",
  };
}

// ----------- Settle ------------

export function getSettlementWating(
  terminalID = null,
  paymentTerminal = "pax",
  timeoutIncrease = true
) {
  return {
    type: "GET_SETTLEMENT_WAITING",
    method: "GET",
    api: `settlement/waiting?sn=${terminalID}&paymentTerminal=${paymentTerminal}`,
    token: true,
    isShowLoading: true,
    timeoutIncrease,
  };
}

export function resetSettle() {
  return {
    type: "RESET_SETTLE",
  };
}

export function invoicesOfStaff(staffId) {
  return {
    type: "INVOICE_OFF_STAFF",
    method: "GET",
    api: `settlement/checkoutbystaff/${staffId}`,
    token: true,
  };
}

export function getTransactionSettlement(
  status = "",
  timeStart = "",
  timeEnd = "",
  key = "",
  quickFilter = "",
  page = 1,
  isShowLoading = true,
  isLoadMore = false,
  timeoutIncrease = true
) {
  return {
    type: "GET_TRANSACTION_SETTLEMENT",
    method: "GET",
    api: `settlement/transaction?status=${status}&timeStart=${timeStart}&timeEnd=${timeEnd}&key=${key}&quickFilter=${quickFilter}&page=${page}`,
    token: true,
    isShowLoading,
    currentPage: page,
    isLoadMore,
    timeoutIncrease,
  };
}

export function searchTransactionSettlement(urlSearch) {
  return {
    type: "SEARCH_TRANSACTION_SETTLEMENT",
    method: "GET",
    api: `settlement/transaction?${urlSearch}`,
    token: true,
  };
}

export function clearSearTransaction() {
  return {
    type: "CLEAR_SEARCH_TRANSACTION",
  };
}

export function getBatchHistory(
  key = "",
  timeStart = "",
  timeEnd = "",
  quickFilter = "",
  page = 1,
  isShowLoading = true,
  isShowLoadMore = false
) {
  return {
    type: "GET_BATCH_HISTORY",
    method: "GET",
    api: `settlement/search?key=${key}&timeStart=${timeStart}&timeEnd=${timeEnd}&quickFilter=${quickFilter}&page=${page}&row=10&api-version=1.1`,
    token: true,
    isShowLoading,
    currentPage: page,
    isShowLoadMore,
  };
}

export function clearSearchBatchHistory() {
  return {
    type: "CLEAR_SEARCH_BATCH_HISTORRY",
  };
}

export function changeStatustransaction(
  checkoutId,
  params,
  responseData = {},
  paymentTerminal,
  sn
) {
  return {
    type: "CHANGE_STATUS_TRANSACTION",
    method: "PUT",
    body: {
      responseData: responseData,
      paymentTerminal,
      sn,
    },
    api: `checkout/paymentvoidrefundtransaction/${checkoutId}`,
    token: true,
    params,
    checkoutId,
  };
}

export function voidRefundPaymentTransaction(
  paymentTransactionId,
  status,
  responseData = "",
  paymentTerminal
) {
  return {
    type: "VOID_REFUND_MULTI_PAYMENT_TRANSACTION",
    method: "PUT",
    body: {
      responseData,
      isSuccess: status,
      paymentTerminal,
    },
    api: `checkout/voidrefundpayment/${paymentTransactionId}`,
    token: true,
  };
}

export function settleBatch(body, timeoutIncrease = true) {
  return {
    type: "SETTLE_BATCH",
    method: "POST",
    body,
    api: `settlement`,
    token: true,
    timeoutIncrease,
  };
}

export function autoCloseBatch() {
  return {
    type: "AUTO_CLOSE_BATCH",
  };
}

export function autoCloseBatchResponse() {
  return {
    type: "AUTO_CLOSE_BATCH_RESPONSE",
  };
}

export function saveSettleWaiting(settleWaiting) {
  return {
    type: "SAVE_SETTLE_WAITING",
    settleWaiting,
  };
}

export function resetStateIsGettingSettlement() {
  return {
    type: "RESET_STATE_IS_GETTING_SETTLEMENT",
  };
}

export function togglPopupConfirmPrintInvoice(visible = false) {
  return {
    type: "VISIBLE_POPUP_CONFIRM_PRINT_INVOICE",
    payload: visible,
  };
}

export function updateSearchKeyword(keyword = "") {
  return {
    type: "UPDATE_SEARCH_KEYWORD",
    payload: keyword,
  };
}

export function updateBatchHistorySearchKeyword(keyword = "") {
  return {
    type: "UPDATE_BATCH_HISTORY_SEARCH_KEYWORD",
    payload: keyword,
  };
}

export function toggleInvoiceTabPermission(visible = true) {
  return {
    type: "TOGGLE_INVOICE_TAB_PERMISSION",
    payload: visible,
  };
}

export function toggleSettlementTabPermission(visible = true) {
  return {
    type: "TOGGLE_SETTLEMENT_TAB_PERMISSION",
    payload: visible,
  };
}

export function resetInternalFirstSettlementState(visible = false) {
  return {
    type: "RESET_INTERNAL_FIRST_SETTLEMENT_STATE",
    payload: visible,
  };
}

export function getSettlementWarning() {
  return {
    type: "GET_SETTLEMENT_WARNING",
    method: "GET",
    api: `settlement/warning`,
    token: true,
  };
}

export function getListStaffsSales(terminalID = null) {
  return {
    type: "GET_LIST_STAFFS_SALES",
    method: "GET",
    token: true,
    api: `appointment/staffSales?sn=${terminalID}`,
  };
}

export function getListGiftCardSales(terminalID) {
  return {
    type: "GET_LIST_GIFT_CARD_SALES",
    method: "GET",
    token: true,
    api: `settlement/waiting/giftCardSales?sn=${terminalID}`,
  };
}

export function resetStateSettleBatch(keyword = "") {
  return {
    type: "RESET_STATE_SETTLE_BATCH",
  };
}

export function toggleDisplayBackSettleIcon(visible = true) {
  return {
    type: "TOOGLE_DISPLAY_BACK_SETTLE_ICON",
    payload: visible,
  };
}

export function getStaffSalesBySettlementId(settlementId = 0) {
  return {
    type: "GET_STAFF_SALES_BY_SETTLEMENT_ID",
    method: "GET",
    token: true,
    api: `appointment/staffSales/getBySettlement/${settlementId}`,
  };
}

export function getGiftCardSalesBySettlementId(settlementId = 0) {
  return {
    type: "GET_GIFT_CARD_SALES_BY_SETTLEMENT_ID",
    method: "GET",
    token: true,
    api: `settlement/giftCardSales/${settlementId}`,
  };
}

export function toggleDisplayBackBatchHistoryIcon(visible = true) {
  return {
    type: "TOOGLE_DISPLAY_BACK_BATCH_HISTORY_ICON",
    payload: visible,
  };
}

export function resetProfileInvoiceLogin() {
  return {
    type: "RESET_PROFILE_INVOICE_LOGIN",
  };
}

export function getInvoiceDetail(checkoutId = 0) {
  return {
    type: "GET_INVOICE_DETAIL",
    method: "GET",
    token: true,
    api: `checkout/${checkoutId}`,
  };
}

export function resetInvoiceDetailState() {
  return {
    type: "RESET_INVOICE_DETAIL_STATE",
  };
}

export function getCreditBatchDetailById(batchId) {
  return {
    type: "GET_CREDIT_BATCH_DETAIL_BY_ID",
    method: "GET",
    api: `settlement/${batchId}`,
    token: true,
  };
}

export function resetStateCreditBatchDetailById() {
  return {
    type: "RESET_STATE_CREDIT_BATCH_DETAIL_BY_ID",
  };
}

export function editPaidAppointment(params, id) {
  return {
    type: "EDIT_PAID_APPOINTMENT",
    method: "PUT",
    body: params,
    api: `appointment/updateStaffAppointmentPaid/${id}`,
  };
}

export function saveSettleRefId(settleRefId) {
  return {
    type: "SAVE_SETTLE_REF_ID",
    settleRefId,
  };
}