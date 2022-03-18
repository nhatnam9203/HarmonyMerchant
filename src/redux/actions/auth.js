import Configs from "@configs";
import { menuTabs } from '@utils';

export function login(email, password, terminalId, isRememberMID = false) {
  return {
    type: "LOGIN_APP",
    body: {
      email,
      password,
      terminalId
    },
    method: "POST",
    api: `merchant/login`,
    isRememberMID,
  };
}

export function logout() {
  return {
    type: "LOGOUT_APP",
  };
}

export function forgotPassword(email) {
  return {
    type: "FORGOT_PASSWORD",
    method: "GET",
    api: `merchant/forgotpassword/?email=${email}`,
    email,
  };
}

export function checkStaffPermission(merchantCode, 
  staffPin, tabName = menuTabs.MENU_INVOICE, appointmentId = "", 
  isBlock = false, isChangeServerReport = false) {
  return {
    type: "CHECK_STAFF_PERMISSION",
    body: {
      merchantCode,
      staffPin,
      tab: tabName,
    },
    method: "POST",
    api: `staff/login/checkpermission`,
    tabName,
    appointmentId,
    isBlock,
    isChangeServerReport,
  };
}

export function toggleVisiblePopupCheckStaffPermission(visible = true) {
  return {
    type: "TOGGLE_VISIBLE_POPUP_CHECK_STAFF_PERMISSION",
    payload: visible,
  };
}

export function requestLogout() {
  return {
    type: "REQUEST_LOGOUT_APP",
    method: "PUT",
    api: `merchant/logout`,
    token: true
  };
}

export function activeFirebase(firebaseToken) {
  return {
    type: "ACTIVE_FIREBASE",
    method: "PUT",
    token: true,
    api: `merchant/setupFireBase`,
    firebaseToken,
  };
}

/**
 * loginReportServer : 
 * report api is separately, login to get token for call report apis
 * @param {*} email 
 * @param {*} password 
 * @param {*} terminalId 
 * @param {*} isRememberMID 
 * @returns 
 */
 export function loginReportServer(email, password, terminalId, isRememberMID = false) {
  return {
    type: "LOGIN_REPORT_SERVER",
    body: {
      email,
      password,
      terminalId
    },
    method: "POST",
    api: `merchant/login`,
    isRememberMID,
  };
}
