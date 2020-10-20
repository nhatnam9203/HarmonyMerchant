import actions from "@actions";
import React from "react";
import { AppState } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import useFirebaseNotification from "./useFirebaseNotification";
import NotifService from "@utils/NotifService";
import NavigationServices from "../../navigators/NavigatorServices";
// import firebase from "@react-native-firebase/app";

const FirebaseNotificationProvider = () => {
  const dispatch = useDispatch();
  const [currentAppState, setCurrentAppState] = React.useState(
    AppState.currentState
  );
  let notifyService;
  const token = useSelector(state => state.dataLocal.token);

  // const [checkToken, setCheckToken] = React.useState(true);


  React.useEffect(() => {
    notifyService = new NotifService(onClickedNotifyMessage);
  }, [token]);

  const onForegroundMessage = (data) => {
    // console.log("==> notification onForegroundMessage", JSON.stringify(data));
    // TODO: process message on foreground state
    notifyService?.firebaseNotify(data);
    // firebase
    //   .notifications()
    //   .displayNotification(data)
    //   .catch((err) => console.error(err));
  };

  const onBackgroundMessage = ({ data }) => {
    // console.log("===> notification onBackgroundMessage", JSON.stringify(data));
    // TODO: process message on background state
  };

  const onOpenedApp = ({ data }) => {
    // console.log("=====> notification onOpenedApp", JSON.stringify(data));
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
  // console.log(firebaseToken);

  const _handleAppStateChange = (nextAppState) => {
    // if (
    //   currentAppState.match(/inactive|background/) &&
    //   nextAppState === "active"
    // ) {
    //   // call server active firebase
    //   dispatch(actions.auth.activeFirebase());
    // }

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
    dispatch(actions.auth.activeFirebase(firebaseToken));
  }, [firebaseToken]);

  return null;
};

export default FirebaseNotificationProvider;
