import configs from '@configs';
import { getDeviceId, getDeviceName } from '@shared/services/Device';
import { getAuthToken } from '@shared/storages/authToken';

const log = (obj, message = '') => {
  Logger.log(`[authMiddleware] ${message}`, obj);
};
const authMiddleware = (store) => (next) => async (action) => {
  const token = await getAuthToken();
  const appState = store.getState();
  const versionApp = configs.APP_VERSION;
  const deviceId = appState?.appMerchant?.deviceId;
  const deviceName = appState?.appMerchant?.deviceName;
  const action_tempt = { ...action, versionApp, deviceId, deviceName };

  if (token) {
    return next({
      ...action_tempt,
      token: token,
    });
  }

  if (action.type && action.type.includes('_SUCCESS')) {
    return next({ ...action_tempt, typeNetwork: 'IS_CONNECTED_INTERNET' });
  }

  if (action.type && action.type.includes('NET_WORK_REQUEST_FAIL')) {
    return next({ ...action_tempt, typeNetwork: 'NET_WORK_REQUEST_FAIL' });
  }

  return next(action_tempt);
};

export default authMiddleware;
