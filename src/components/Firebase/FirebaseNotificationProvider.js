import actions from "@actions";
import React from "react";
import { AppState } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import useFirebaseNotification from "./useFirebaseNotification";
import NotifService from "@utils/NotifService";
import NavigationServices from "../../navigators/NavigatorServices";
import _ from 'lodash';
import {
  handleAutoClose,
} from "@utils";
const FirebaseNotificationProvider = () => {
  const dispatch = useDispatch();
  const [currentAppState, setCurrentAppState] = React.useState(
    AppState.currentState
  );
  let notifyService;
  const token = useSelector((state) => state.dataLocal.token);
  const paxMachineInfo = useSelector((state) => state.hardware.paxMachineInfo);
  const visibleEnterPin = useSelector((state) => state?.app?.visibleEnterPin);

  React.useEffect(() => {
    notifyService = new NotifService(onClickedNotifyMessage);
  }, [token]);

  const onForegroundMessage = (data) => {
    // TODO: process message on foreground state
    //hard code for test
    //if(_.get(data, 'data.key') === 'AUTO_CLOSE'){
      handleAutoClose()
    //  return
    //}
//     dispatch({
//       type: "HANDLE_NOTIFICATION_WHEN_HAVE_A_APPOINTMENT",
//       payload: data,
//     });
//     notifyService?.firebaseNotify(data);
  };

  const onBackgroundMessage = ({ data }) => {
    // TODO: process message on background state
    //hard code for test 
    //if(_.get(data, 'data.key') === 'AUTO_CLOSE'){
      handleAutoClose()
    //}
  };

  const onOpenedApp = ({ data }) => {
    // TODO: process message on onOpenedApp
  };

  const onMessageError = () => {
    // TODO: process message error
  };

  const onClickedNotifyMessage = () => {
    if (token) {
      if (!visibleEnterPin) {
        dispatch(actions.app.closeAllPopupPincode());
      }
      NavigationServices.navigate("Home");

      notifyService?.resetBadgeNumber();
    } else {
      NavigationServices.navigate("SignIn");
    }
  };

  const firebaseToken = useFirebaseNotification({
    onForegroundMessage,
    onBackgroundMessage,
    onOpenedApp,
    onMessageError,
  });

  // TODO : save redux app local

  const _handleAppStateChange = (nextAppState) => {
    setCurrentAppState(nextAppState);
  };

  React.useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    notifyService = new NotifService(onClickedNotifyMessage);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  // call server update token when firebase token change
  React.useEffect(() => {
    if (firebaseToken && token) {
      dispatch(actions.auth.activeFirebase(firebaseToken));
    }
  }, [firebaseToken, token]);

  return null;
};

export default FirebaseNotificationProvider;
