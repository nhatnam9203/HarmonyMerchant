import AsyncStorage from "@react-native-community/async-storage";
import messaging from "@react-native-firebase/messaging";
import React from "react";

const FIREBASE_TOKEN_STORE_KEY = "fcmToken";
const SAVE_STORE_TOKEN = true;

const saveStoreToken = async (token) => {
  if (token) {
    // user has a device token
    await AsyncStorage.setItem(FIREBASE_TOKEN_STORE_KEY, token);
  }
};

function useFirebaseNotification({
  onForegroundMessage,
  onBackgroundMessage,
  onOpenedApp,
  onInit,
  onMessageError,
}) {
  const [token, setFirebaseToken] = React.useState(undefined);

  const getToken = async () => {
    let fcmToken = null;
    console.log("===============> getToken ");

    if (SAVE_STORE_TOKEN) {
      fcmToken = await AsyncStorage.getItem(FIREBASE_TOKEN_STORE_KEY);

      if (!fcmToken) {
        fcmToken = await messaging().getToken();
        await saveStoreToken(fcmToken);
        console.log("===============> save Token to store");
      }
    } else {
      fcmToken = await messaging().getToken();
    }

    setFirebaseToken(fcmToken);
  };

  // request when first launch app
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
console.log("===============> requestUserPermission");
    switch (authStatus) {
      case messaging.AuthorizationStatus.NOT_DETERMINED:
        //Permission has not yet been requested for your application.
        if (typeof onMessageError === "function") {
          onMessageError();
        }
        break;
      case messaging.AuthorizationStatus.DENIED:
        //The user has denied notification permissions.
        // await requestUserPermission();
        if (typeof onMessageError === "function") {
          onMessageError();
        }
        break;
      case messaging.AuthorizationStatus.AUTHORIZED:
      case messaging.AuthorizationStatus.PROVISIONAL:
      default:
        await getToken();
        registryListeners();
        console.log("===============> requestUserPermission OK");

        break;
    }
  };

  // check permissions firebase
  const checkPermission = async () => {
    const authStatus = await messaging().hasPermission();

    switch (authStatus) {
      case messaging.AuthorizationStatus.NOT_DETERMINED:
        //Permission has not yet been requested for your application.
        await requestUserPermission();

        break;
      case messaging.AuthorizationStatus.DENIED:
        if (typeof onMessageError === "function") {
          onMessageError();
        }
        break;
      case messaging.AuthorizationStatus.AUTHORIZED:
      case messaging.AuthorizationStatus.PROVISIONAL:
      default:
        await getToken();
        registryListeners();
        break;
    }
  };

  const registryListeners = () => {
    // Register background handler & Quit state messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      if (typeof onBackgroundMessage === "function") {
        onBackgroundMessage(remoteMessage);
      }
    });

    // Register Foreground Listeners: received message but not display notification
    messaging().onMessage(async (remoteMessage) => {
      if (typeof onForegroundMessage === "function") {
        onForegroundMessage(remoteMessage);
      }
    });

    // Register App Opening
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (typeof onOpenedApp === "function") {
        onOpenedApp(remoteMessage);
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (typeof onInit === "function") {
          onInit(remoteMessage);
        }
      });
  };

  React.useEffect(() => {
    // check permissions
    checkPermission();

    // Called when a new registration token is generated for the device
    // messaging()
    //   .onTokenRefresh()
    //   .then(async (token) => {
    //     if (SAVE_STORE_TOKEN) {
    //       await saveStoreToken(token);
    //     }
    //     setFirebaseToken(token);
    //   });
  }, []);

  return token;
}

export default useFirebaseNotification;
