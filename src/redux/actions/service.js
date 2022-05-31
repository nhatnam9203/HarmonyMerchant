import Configs from "@configs";

export function addServiceByMerchant(body, searchFilter = false) {
  return {
    type: "ADD_SERVICE_BY_MERCHANT",
    body,
    method: "POST",
    token: true,
    api: `service`,
    searchFilter,
  };
}

export function getServicesByMerchant(
  name = "",
  category = "",
  status = "",
  searchFilter = false,
  isShowLoading = true
) {
  return {
    type: "GET_SERVICE_BY_MERCHANT",
    method: "GET",
    token: true,
    api: `service/search?name=${name}&category=${category}&status=${status}`,
    isShowLoading,
    searchFilter,
    timeOut: 120000,
  };
}

export function getCustomServiceByMerchantId(merchantId, isShowLoading = true) {
  return {
    type: "GET_CUSTOM_SERVICE_BY_MERCHANT_ID",
    method: "GET",
    token: true,
    api: `service/getcustomservice/${merchantId}`,
    isShowLoading,
  };
}

export function searchService(name = "", category = "", status = "") {
  return {
    type: "SEARCH_SERVICE",
    method: "GET",
    token: true,
    api: `service/search?name=${name}&category=${category}&status=${status}`,
  };
}

export function archiveService(id, searchFilter = false) {
  return {
    type: "ARCHIVE_SERVICE",
    body: {},
    method: "PUT",
    token: true,
    api: `service/archive/${id}`,
    searchFilter,
  };
}

export function restoreService(id, searchFilter = false) {
  return {
    type: "RESTORE_SERVICE",
    body: {},
    method: "PUT",
    token: true,
    api: `service/restore/${id}`,
    searchFilter,
  };
}

export function editService(body, id, searchFilter = false) {
  return {
    type: "EDIT_SERVICE",
    body,
    method: "PUT",
    token: true,
    api: `service/${id}`,
    searchFilter,
  };
}

export function clearSearchService() {
  return {
    type: "CLEAR_SEARCH_SERVICE",
    payload: true,
  };
}

export function updateSerivePosition(body) {
  return {
    type: "UPDATE_SERVICE_POSITION",
    body,
    method: "PUT",
    token: true,
    api: `service/update/position`,
  };
}

export function updateServicePositionLocal(services) {
  return {
    type: "UPDATE_SERVICE_POSITION_LOCAL",
    payload: services,
  };
}

export function getServiceByStaff(categoryId, staffId, callBack) {
  return {
    type: "GET_SERVICE_BY_STAFF",
    method: "GET",
    token: true,
    api: `service/getbycategory/${categoryId}?staffId=${staffId}`,
    callBack,
  };
}
