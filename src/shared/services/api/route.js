/**
|--------------------------------------------------
| APP
|--------------------------------------------------
*/
export const GET_ADDRESS_STATE = {
  method: "GET",
  url: "state",
  api: "state",
};

export const UPLOAD_FILE = {
  method: "POST",
  url: "file",
  api: "file",
};

/**
|--------------------------------------------------
| MERCHANT
|--------------------------------------------------
*/
export const MERCHANT_LOGIN = {
  method: "POST",
  url: "merchant/login",
  api: "merchant/login",
};

export const MERCHANT_LOGOUT = {
  method: "PUT",
  url: "merchant/logout",
  api: "merchant/logout",
};

export const MERCHANT_FORGOT_PASSWORD = {
  method: "GET",
  url: "merchant/forgotpassword",
  api: "merchant/forgotpassword",
};

/**
|--------------------------------------------------
| RETAILER
|--------------------------------------------------
*/

export const RETAILER_CREATE_PRODUCT = {
  method: "POST",
  url: "product",
  api: "product",
};

export const RETAILER_PRODUCT = {
  method: "GET",
  url: "product/",
  api: "product/",
};

// new
export const RETAILER_ATTRIBUTES = {
  url: "attribute",
};

export const RETAILER_CATEGORIES = {
  url: "category",
};

export const RETAILER_CUSTOMER = {
  url: "customer",
};

export const RETAILER_PRODUCTS = {
  url: "product",
};

export const RETAILER_ORDER = {
  url: "retailer/appointment",
};

export const RETAILER_APPOINTMENT = {
  url: "appointment",
};

export const STAFF_LOGIN = {
  url: "staff/login",
};

export const RETAILER_REPORT_SALES = {
  url: "retailer/Appointment/report/sale",
};

export const RETAILER_REPORT_PRODUCT = {
  url: "product/report",
};
