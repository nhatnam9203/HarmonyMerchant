import actions from "@actions";
import React from "react";
import { AppState } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import useFirebaseNotification from "./useFirebaseNotification";
import NotifService from "@utils/NotifService";
import NavigationServices from "../../navigators/NavigatorServices";

const FirebaseNotificationProvider = () => {
  const dispatch = useDispatch();
  const [currentAppState, setCurrentAppState] = React.useState(
    AppState.currentState
  );
  let notifyService;
  const token = useSelector(state => state.dataLocal.token);

  React.useEffect(() => {
    notifyService = new NotifService(onClickedNotifyMessage);
  }, [token]);

  const onForegroundMessage = (data) => {
    // TODO: process message on foreground state
    console.log("--------- onForegroundMessage -------");
    dispatch({
      type:"HANDLE_NOTIFICATION_WHEN_HAVE_A_APPOINTMENT",
      payload: data
    });
    notifyService?.firebaseNotify(data);
  };

  const onBackgroundMessage = ({ data }) => {
    console.log("--------- onBackgroundMessage -------");
    // TODO: process message on background state
  };

  const onOpenedApp = ({ data }) => {
    // TODO: process message on onOpenedApp
  };

  const onMessageError = () => {
    // TODO: process message error
  };

  const onClickedNotifyMessage = () => {
    if (token) {
      dispatch(actions.app.closeAllPopupPincode());
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
    if(firebaseToken && token){
      dispatch(actions.auth.activeFirebase(firebaseToken));
    }
  }, [firebaseToken,token]);

  return null;
};

export default FirebaseNotificationProvider;
