import apiConfigs from "../../configs/api";

export function login(email, password, isRememberMID = false) {
  return {
    type: "LOGIN_APP",
    body: {
      email: email,
      password: password,
    },
    method: "POST",
    api: `${apiConfigs.BASE_API}merchant/login`,
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
    api: `${apiConfigs.BASE_API}merchant/forgotpassword/?email=${email}`,
    email,
  };
}

export function checkStaffPermission(merchantCode,staffPin,tabName = "Invoice",appointmentId = "",isBlock = false) {
  return {
    type: "CHECK_STAFF_PERMISSION",
    body: {
      merchantCode,
      staffPin,
      tab: tabName,
    },
    method: "POST",
    api: `${apiConfigs.BASE_API}staff/login/checkpermission`,
    tabName,
    appointmentId,
    isBlock
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
    api: `${apiConfigs.BASE_API}merchant/logout`,
    token: true
  };
}

// export function activeFirebase() {
//   return {
//     type: "ACTIVE_FIREBASE",
//     method: "POST",
//     api: `${apiConfigs.BASE_API}merchant/activeFirebase`,
//   };
// }

export function activeFirebase(firebaseToken) {
  return {
    type: "ACTIVE_FIREBASE",
    method: "PUT",
    token: true,
    api: `${apiConfigs.BASE_API}merchant/setupFireBase`,
    firebaseToken,
  };
}
