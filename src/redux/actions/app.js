import Configs from "@configs";

export function loadingApp() {
  return {
    type: "LOADING_ROOT",
  };
}

export function stopLoadingApp() {
  return {
    type: "STOP_LOADING_ROOT",
  };
}

export function getMerchantByID(merchantId, isRefresh = false) {
  return {
    type: "GET_MERCHANT_BY_ID",
    method: "GET",
    token: true,
    api: `merchant/${merchantId}`,
    isRefresh,
  };
}

export function getAdvanceSetting(isRefresh = false) {
  return {
    type: "GET_ADVANCE_SETTING",
    method: "GET",
    token: true,
    api: `merchant/setting/advance`,
    isRefresh,
  };
}

export function registerUser(body) {
  return {
    type: "REGISTER_USER",
    method: "POST",
    body,
    api: `merchant?api-version=1.1`,
  };
}

export function setGeneralInfo(payload) {
  return {
    type: "SET_GENERAL_INFO",
    payload,
  };
}

export function setBusinessInfo(payload) {
  return {
    type: "SET_BUSINESS_INFO",
    payload,
  };
}

export function setBankInfo(payload) {
  return {
    type: "SET_BANK_INFO",
    payload,
  };
}

export function setPrincipalInfo(payload) {
  return {
    type: "SET_PRINCIPAL_INFO",
    payload,
  };
}

export function setPackagePricing(payload) {
  return {
    type: "SET_PACKAGE_PRICING",
    payload,
  };
}

export function handleLockScreen(visible) {
  return {
    type: "HANDLE_LOCK_SCREEN",
    payload: visible,
  };
}

export function getStateCity() {
  return {
    type: "GET_STATE_CITY",
    method: "GET",
    api: `state`,
  };
}

export function getQuestion() {
  return {
    type: "GET_QUESTION",
    method: "GET",
    api: `question`,
  };
}

export function merchantSetting(body, isShowAlert = false, isLoading = true) {
  return {
    type: "MERCHANT_SETTING",
    method: "PUT",
    body,
    token: true,
    api: `merchant/setting`,
    isLoading,
    isShowAlert,
  };
}

export function resetIsFlashScreen(isFocus = false) {
  return {
    type: "RESET_IS_FLASH_SCREEN",
    payload: isFocus,
  };
}

export function changeFlagVisibleEnteerPinCode(visible = true) {
  return {
    type: "CHANGE_FLAG_VISIBLE_ENTER_PIN_CODE",
    payload: visible,
  };
}

export function sendLinkInstallApp(phone) {
  return {
    type: "SEND_LINK_INSTALL_APP",
    method: "GET",
    token: true,
    api: `user/sendlink?phone=${phone}`,
  };
}

export function setupMerchantTAX(body) {
  return {
    type: "SETUP_MERCHANT_TAX",
    method: "PUT",
    body,
    token: true,
    api: `merchant/setting`,
  };
}

export function changeFlagSubmitTAX(visible = true) {
  return {
    type: "CHANGE_FLAG_SUBMIT_TAX",
    payload: visible,
  };
}

export function checkEmailSignup(email) {
  return {
    type: "CHECK_EMAIL_SIGN_UP",
    method: "GET",
    // token: true,
    api: `merchant/checkEmail?email=${email}`,
  };
}

export function showMessageError(message) {
  return {
    type: "SHOW_ERROR_MESSAGE",
    message: message,
  };
}

export function catchError(type) {
  return {
    type: type,
  };
}

export function setVisibleEnterPincodeInvoice(visible = true) {
  return {
    type: "SET_VISIBLE_ENTER_CODE_INVOICE",
    payload: visible,
  };
}

export function toogleOfflineMode(visible = true) {
  return {
    type: "TURN_ON_OFFLINE_MODE",
    typeNetwork: "TURN_ON_OFFLINE_MODE",
    payload: visible,
  };
}

export function closePopupEnterPin() {
  return {
    type: "CLOSE_POPUP_ENTER_PIN",
  };
}

export function agreeTerm(visible = true) {
  return {
    type: "AGREE_TERM",
    payload: visible,
  };
}

export function showPopupDisconneted(visible = true) {
  return {
    type: "SHOW_POP_UP_DISCONNECTED",
    payload: visible,
  };
}

export function showPopupConneted(visible = true) {
  return {
    type: "SHOW_POP_UP_CONNECTED",
    payload: visible,
  };
}

export function resetStateReloadWebView(visible = true) {
  return {
    type: "RESET_STATE_RELOAD_WEBVIEW",
    payload: visible,
  };
}

export function getPackageAndPricing() {
  return {
    type: "GET_PACKAGE_AND_PRICING",
    method: "GET",
    api: `package`,
  };
}

export function connectPaxMachineError(error = "") {
  return {
    type: "CONNECT_PAX_MACHINE_ERROR",
    payload: error,
  };
}

export function ConnectPaxMachineSuccess() {
  return {
    type: "CONNECT_PAX_MACHINE_SUCCESS",
  };
}

export function resetStateUpdateMerchantSetting(status = false) {
  return {
    type: "RESET_STATE_UPDATE_MERCHANT_SETTING",
    payload: status,
  };
}

export function resetStateRegisterMerchantError(status = false) {
  return {
    type: "RESET_STATE_REGISTER_MERCHANT_ERROR",
    payload: status,
  };
}

export function toggleSettingTabPermission(visible = true) {
  return {
    type: "TOGGLE_SETTING_TAB_PERMISSION",
    payload: visible,
  };
}

export function toggleStaffLogtimeTabPermission(visible = true) {
  return {
    type: "TOGGLE_STAFF_LOGTIME_TAB_PERMISSION",
    payload: visible,
  };
}

export function closeAllPopupPincode() {
  return {
    type: "CLOSE_ALL_POPUP_PIN_CODE",
  };
}

export function tooglePopupCodePush(visible = true, description = "") {
  return {
    type: "OPEN_POPUP_CODE_PUSH",
    payload: visible,
    description,
  };
}

export function resetIsInitApp() {
  return {
    type: "RESET_IS_INIT_APP",
    payload: false,
  };
}

export function updatePaxTerminalID(terminalID) {
  return {
    type: "UPDATE_PAX_TERMINAL_ID",
    payload: terminalID,
  };
}

export function changeIsGiftForNew(visible = true) {
  return {
    type: "CHANGE_IS_GIFT_FOR_NEW",
    method: "PUT",
    body: {
      GiftForNewEnabled: visible,
    },
    token: true,
    api: `merchant/setting/giftForNew`,
    visible,
  };
}

export function resetStateNotiWhenHaveAAppointment() {
  return {
    type: "RESET_STATE_HANDLE_NOTIFICATION_WHEN_HAVE_A_APPOINTMENT",
  };
}

export function handleNotifiIntervalId(intervalId) {
  return {
    type: "HANDLE_NOTIFI_INTERVAL_ID",
    payload: intervalId,
  };
}

export function resetNotiIntervalId() {
  return {
    type: "RESET_NOTIFI_INTERVAL_ID",
  };
}

export function reduceUnreadNotification() {
  return {
    type: "REDUCE_UNREAD_NOTIFICATION",
  };
}

export function increaseUnreadNotification() {
  return {
    type: "INCREASE_UNREAD_NOTIFICATION",
  };
}

export function resetUnreadNotification() {
  return {
    type: "RESET_UNREAD_NOTIFICATION",
  };
}

export function getNotificationList(page = 1) {
  return {
    type: "GET_NOTIFICATION_LIST",
    method: "GET",
    token: true,
    api: `notification?page=${page}&row=20`,
    currentPage: page,
  };
}

export function getCountUnReadOfNotification() {
  return {
    type: "GET_COUNT_UNREAD_OF_NOTIFICATION",
    method: "GET",
    token: true,
    api: `notification/countUnRead?api-version=2.0`,
  };
}

export function maskNotiAsReadById(notiId) {
  return {
    type: "MASK_NOTI_AS_READ_BY_ID",
    method: "PUT",
    body: {},
    token: true,
    api: `notification/view/${notiId}`,
  };
}

export function readAllNotification() {
  return {
    type: "READ_ALL_NOTIFICATION",
    method: "PUT",
    body: {},
    token: true,
    api: `notification/view/all`,
  };
}


export function setMerchantType(payload) {
  return {
    type: "SET_MERCHANT_TYPE",
    payload,
  };
}