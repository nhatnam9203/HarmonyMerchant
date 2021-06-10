import Configs from '@configs';

export function getOrdersFromStore(api, page = 1) {
  //timeStart: 2021-03-23
  return {
    type: 'GET_ORDERS_FROM_STORE',
    method: 'GET',
    token: true,
    // api: `retailerOrder/?timeStart=${timeStart}&timeEnd=${timeEnd}&sortValue=${sortValue}&sortType=${sortType}&page=${page}&row=20`,
    api: `retailer/appointment?${api}&row=20`,
    currentPage: page,
  };
}

export function getOrderRetailDetail(orderId) {
  return {
    type: 'GET_ORDER_RETAIL_DETAIL',
    method: 'GET',
    token: true,
    api: `retailer/appointment/${orderId}`,
  };
}

export function resetStateIsGetOrderRetailDetail() {
  return {
    type: 'RESET_STATE_IS_GET_ORDER_RETAIL_DETAIL',
  };
}

export function createTempAppointmentRetail(body) {
  return {
    type: 'CREATE_RETAIL_APPOINTMENT_TEMP',
    method: 'POST',
    token: true,
    body,
    api: `retailer/appointment/temp`,
  };
}

export function getTempAppointmentDetailOfRetail(tempId) {
  return {
    type: 'GET_TEMP_APPOINTMENT_DETAIL_OF_RETAIL',
    method: 'GET',
    token: true,
    api: `retailer/appointment/temp/${tempId}`,
  };
}

export function switchProductDetailPopupRetail(visible = true) {
  return {
    type: 'SWITCH_PRODUCT_DETAIL_POPUP_RETAIL',
    payload: visible,
  };
}

export function addItemIntoTempAppointmentRetail(body, tempAppointmentId = 0) {
  return {
    type: 'ADD_ITEM_INTO_RETAIL_APPOINTMENT_TEMP',
    method: 'POST',
    token: true,
    body,
    api: `retailer/appointment/temp/${tempAppointmentId}/additem`,
    tempAppointmentId,
  };
}
