import { persistReducer, persistStore } from "redux-persist";

const authMiddleware = (store) => (next) => (action) => {
  const appState = store.getState();
  const { type, payload } = action;
  const key = action.key ? action.key : "";
  const merchantToken = appState.dataLocal.token
    ? appState.dataLocal.token
    : false;

  if (type === "persist/REHYDRATE" && key === "category" && payload) {
    return next({
      type: "REHYDRATE_CATEGORIES",
      payload: merchantToken ? action.payload.categoriesByMerchant : [],
    });
  }
  if (type === "persist/REHYDRATE" && key === "product" && payload) {
    return next({
      type: "REHYDRATE_PRODUCTS",
      payload: merchantToken ? action.payload.productsByMerchantId : [],
    });
  }

  if (type === "persist/REHYDRATE" && key === "staff" && payload) {
    return next({
      type: "REHYDRATE_STAFFS",
      payload: merchantToken ? action.payload.listStaffByMerchant : [],
    });
  }

  if (type === "persist/REHYDRATE" && key === "service" && payload) {
    return next({
      type: "REHYDRATE_SERVICES",
      payload: merchantToken ? action.payload.servicesByMerchant : [],
    });
  }

  if (type === "persist/REHYDRATE" && key === "extra" && payload) {
    return next({
      type: "REHYDRATE_EXTRAS",
      payload: merchantToken ? action.payload.extrasByMerchant : [],
    });
  }

  if (type === "persist/REHYDRATE" && key === "appointment" && payload) {
    return next({
      type: "REHYDRATE_APPOINTMENT",
      payload: merchantToken ? action.payload.listAppointmentsOfflineMode : [],
    });
  }

  if (type === "persist/REHYDRATE" && key === "customer" && payload) {
    return next({
      type: "REHYDRATE_CUSTOMERS",
      payload: merchantToken ? action.payload.listCustomersByMerchant : [],
    });
  }

  if (type === "persist/REHYDRATE" && key === "invoice" && payload) {
    return next({
      type: "REHYDRATE_INVOICES",
      payload: merchantToken ? action.payload.listInvoicesByMerchant : [],
    });
  }

  if (type === "persist/REHYDRATE" && key === "marketing" && payload) {
    return next({
      type: "REHYDRATE_MARKETINGS",
      listBanners: merchantToken ? action.payload.listBanners : [],
      promotions: merchantToken ? action.payload.promotions : [],
    });
  }

  const versionApp = appState.dataLocal.versionApp;
  const action_tempt = { ...action, versionApp };
  // console.log(action);
  if (action.token) {
    return next({
      ...action_tempt,
      token: appState.dataLocal.profileStaffLogin.token,
    });
  }

  if (action.type && action.type.includes("_SUCCESS")) {
    return next({ ...action_tempt, typeNetwork: "IS_CONNECTED_INTERNET" });
  }

  if (action.type && action.type.includes("NET_WORK_REQUEST_FAIL")) {
    return next({ ...action_tempt, typeNetwork: "NET_WORK_REQUEST_FAIL" });
  }

  return next(action_tempt);
};

export default authMiddleware;
