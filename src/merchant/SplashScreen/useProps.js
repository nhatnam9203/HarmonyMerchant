import { loginStaff } from "@actions/staff";
import NavigationServices from "@navigators/NavigatorServices";
import { CodePushContext } from "@shared/providers/CodePushProvider";
import { useGetAddressStates } from "@shared/services/api/app";
import { sleep } from "@shared/utils/app";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export const useProps = (_params) => {
  const {
    progress,
    addPushCodeCompleteCallback,
    removePushCodeCompleteCallback,
  } = React.useContext(CodePushContext);

  const dispatch = useDispatch();

  const merchant = useSelector((state) => state.dataLocal.profile);

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
    addPushCodeCompleteCallback("splashscreen", onPushCodeComplete);

    init().finally(() => {
      return setLoadApp(true);
    }); // do navigation chưa ready, mà codepush xong thì start app

    return () => {
      removePushCodeCompleteCallback("splashscreen");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (finishedLoadCodePush && finishedLoadApp) {
      const { type } = merchant || {};



      if (merchant?.needSetting) {
        dispatch(loginStaff(merchant.merchantCode, "0000"));
        NavigationServices.replace("SetupStore");
      } else {
        switch (type) {
          case Constants.APP_TYPE.POS:
            NavigationServices.replace("SalonNavigator");
            break;
          case Constants.APP_TYPE.RETAILER:
            NavigationServices.replace("RetailerNavigator");
            break;
          default:
            NavigationServices.replace("AuthNavigator");

            break;
        }
      }
    }
  }, [dispatch, finishedLoadCodePush, finishedLoadApp]);

  const onPushCodeComplete = () => {
    setLoadCodePush(true);
  };

  return { progress };
};
