import { persistReducer, persistStore } from "redux-persist";
import configs from "@configs";

const authMiddleware = (store) => (next) => (action) => {
  const appState = store.getState();
  const versionApp = appState?.dataLocal?.versionApp || configs.APPSTORE_VERSION;
  const deviceId = appState?.dataLocal?.deviceId || '';
  const action_tempt = { ...action, versionApp , deviceId};
  if (action.token) {
    return next({
      ...action_tempt,
      token: appState?.dataLocal?.profileStaffLogin?.token || "",
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
