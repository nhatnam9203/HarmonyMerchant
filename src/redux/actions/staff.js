import apiConfigs from "../../configs/api";

export function addStaffByMerchant(body,searchFilter = false) {
  return {
    type: "ADD_STAFF_BY_MERCHANT",
    body,
    method: "POST",
    token: true,
    api: `${apiConfigs.BASE_API}staff`,
    // merchantId: id,
    searchFilter
  };
}

export function createAdmin(body) {
  return {
    type: "CREATE_ADMIN",
    body,
    method: "POST",
    token: true,
    api: `${apiConfigs.BASE_API}staff`,
  };
}

export function getStaffByMerchantId(name = "", role = "", status = "",searchFilter = false,isShowLoading = true) {
  return {
    type: "GET_STAFF_BY_MERCHANR_ID",
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}staff/search?name=${name}&role=${role}&status=${status}`,
    isShowLoading,
    searchFilter
  };
}

export function searchStaffByName(name = "", role = "", status = "") {
  return {
    type: "SEARCH_STAFF_BY_NAME",
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}staff/search?name=${name}&role=${role}&status=${status}`,
  };
}

export function switchAddStaff(isAddStaff) {
  return {
    type: "SWICH_ADD_STAFF",
    payload: isAddStaff,
  };
}

export function clearSearch() {
  return {
    type: "CLEAR_SEARCH",
    payload: true,
  };
}

export function archiveStaff(id,searchFilter = false) {
  return {
    type: "ARCHICVE_STAFF",
    method: "PUT",
    token: true,
    api: `${apiConfigs.BASE_API}staff/archive/${id}`,
    searchFilter
  };
}

export function restoreStaff(id,searchFilter =false) {
  return {
    type: "RESTORE_STAFF",
    method: "PUT",
    token: true,
    api: `${apiConfigs.BASE_API}staff/restore/${id}`,
    searchFilter
  };
}

export function editStaff(body, id = "",searchFilter =false) {
  return {
    type: "EDIT_STAFF_BY_MERCHANT",
    body,
    method: "PUT",
    token: true,
    api: `${apiConfigs.BASE_API}staff/${id}`,
    searchFilter
  };
}

export function resetFlagCreateAdmin() {
  return {
    type: "SET_FLAG_RESET_INFO_ADMIN",
  };
}

export function loginStaff(merchantCode, staffPin, isPincodeInvoice = false) {
  return {
    type: "LOGIN_STAFF",
    body: {
      merchantCode: merchantCode,
      staffPin: staffPin,
    },
    method: "POST",
    api: `${apiConfigs.BASE_API}staff/login`,
    isPincodeInvoice,
  };
}

export function forgotPin(merchantCode, email) {
  return {
    type: "FORGOT_PIN",
    body: {
      merchantcode: merchantCode,
      email: email,
    },
    method: "POST",
    api: `${apiConfigs.BASE_API}staff/forgotpin`,
  };
}

export function setVisibleForgotPin(flag) {
  return {
    type: "RESET_VISIBLE_FORGOT_PIN",
    payload: flag,
  };
}

export function updateStaffsPositionLocal(data) {
  return {
    type: "UPDATE_STAFFS_POSITION_LOCAL",
    payload: data,
  };
}

export function updateStaffsPosition(body) {
  return {
    type: "UPDATE_STAFFS_POSITION",
    body,
    method: "PUT",
    token: true,
    api: `${apiConfigs.BASE_API}staff/update/position`,
  };
}

export function reloadButtonEnterPincode() {
  return {
    type: "RELOAD_BUTTON_ENTER_PIN_CODE",

  };
}

export function getListStaffsSalaryTop(
  params = "quickFilter=thisWeek",
  isShowLoading = true
) {
  return {
    type: "GET_LIST_STAFFS_SALARY_TOP",
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}staff/salary?${params}`,
    isShowLoading,
  };
}

export function setPositionHeader(dx) {
  return {
    type: "ON_SCROLL",
    payload: dx,
  };
}

export function toggleReportTabPermission(visible = true) {
  return {
    type: "TOGGLE_REPORT_TAB_PERMISSION",
    payload: visible,
  };
}

export function getExportStaffSalary(
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "csv",
  fileName
) {
  return {
    type: "EXPORT_STAFFS_SALARY",
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}staff/salary/export?${params}`,
    isShowLoading,
    fileName,
    extention: type ?? "pdf",
  };
}

export function getExportStaffStatistics(
  staffId,
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "csv",
  fileName
) {
  return {
    type: "EXPORT_STAFFS_STATISTICS",
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}staff/salary/export/${staffId}?${params}`,
    isShowLoading,
    fileName,
    extention: type ?? "pdf",
  };
}


export function resetDownloadExportFiles() {
  return {
    type: "RESET_DOWNLOAD_FILE_REPORT_STAFF"
  }
}