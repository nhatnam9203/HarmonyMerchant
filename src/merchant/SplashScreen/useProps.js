import { appMerchant } from '@redux/slices';
import { CodePushContext } from '@shared/providers/CodePushProvider';
import { sleep } from '@shared/utils/app';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useGetAddressStates } from '@shared/services/api/app';

const log = (obj, message = '') => {
  Logger.log(`[SplashScreen] ${message}`, obj);
};

export const useProps = (_params) => {
  const {
    progress,
    addPushCodeCompleteCallback,
    removePushCodeCompleteCallback,
  } = React.useContext(CodePushContext);
  const dispatch = useDispatch();
  const [finishedLoadCodePush, setLoadCodePush] = React.useState(false);
  const [finishedLoadApp, setLoadApp] = React.useState(false);

  const [, getAddressStates] = useGetAddressStates();

  const init = async () => {
    await sleep(1500);
    // …do multiple async tasks
  };

  // React useEffect
  React.useEffect(() => {
    getAddressStates(); // get list state
    addPushCodeCompleteCallback('splashscreen', onPushCodeComplete);
    init().finally(() => {
      return setLoadApp(true);
    }); // do navigation chưa ready, mà codepush xong thì start app

    return () => {
      removePushCodeCompleteCallback('splashscreen');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (finishedLoadCodePush && finishedLoadApp) {
      dispatch(appMerchant.startApp());
    }
  }, [dispatch, finishedLoadCodePush, finishedLoadApp]);

  const onPushCodeComplete = () => {
    setLoadCodePush(true);
  };

  return { progress };
};
