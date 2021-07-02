import React, { createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { appMerchant } from '@redux/slices';
import { AppLoading } from '@shared/components/AppLoading';
import { ExportLoading } from '@shared/components/ExportLoading';
import { getDeviceId, getDeviceName } from '@shared/services/Device';

const log = (obj, message = '') => {
  Logger.log(`[CodePushProvider] ${message}`, obj);
};

export const AppStateContext = createContext({});

export const AppStateProvider = ({ children }) => {
  const dispatch = useDispatch();
  const appLoading = useSelector((state) => state.appMerchant.appLoading);
  const exportLoading = useSelector((state) => state.appMerchant.exportLoading);
  const onCancelLoading = () => {
    dispatch(appMerchant.hideLoading());
  };

  const onCancelExportLoading = () => {
    dispatch(appMerchant.hideExportLoading());
  };

  const loadDeviceInfo = async () => {
    const deviceId = await getDeviceId();
    const deviceName = await getDeviceName();
    await dispatch(appMerchant.setDeviceInfo({ deviceId, deviceName }));
  };

  // React useEffect
  React.useEffect(() => {
    loadDeviceInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React render
  return (
    <AppStateContext.Provider value={{}}>
      {children}
      <AppLoading loading={appLoading} onCancelLoading={onCancelLoading} />
      <ExportLoading
        loading={exportLoading}
        onCancelLoading={onCancelExportLoading}
      />
    </AppStateContext.Provider>
  );
};