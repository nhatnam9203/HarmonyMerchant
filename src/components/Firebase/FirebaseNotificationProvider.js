import React from "react";
import useFirebaseNotification from "./useFirebaseNotification";

const FirebaseNotificationProvider = () => {
  const onForegroundMessage = (data) => {
    console.log("==> notification onForegroundMessage", JSON.stringify(data));
    // TODO: process message on foreground state
    // PushNotification.localNotification({
    //   smallIcon: "icon",
    //   largeIcon: "icon",
    //   title: data.notification.title,
    //   message: data.notification.body,
    // });
  };

  const onBackgroundMessage = ({ data }) => {
    console.log("===> notification onBackgroundMessage", JSON.stringify(data));
    // TODO: process message on background state
  };

  const onOpenedApp = ({ data }) => {
    console.log("=====> notification onOpenedApp", JSON.stringify(data));
    // TODO: process message on onOpenedApp
  };

  const onMessageError = () => {
    // TODO: process message error
  };

  const firebaseToken = useFirebaseNotification({
    onForegroundMessage,
    onBackgroundMessage,
    onOpenedApp,
    onMessageError,
  });

  // TODO : save redux app local
  console.log(firebaseToken);

  return null;
};

export default FirebaseNotificationProvider;
