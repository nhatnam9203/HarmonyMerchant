import _ from "ramda";
import CodePush from "react-native-code-push";
import { Alert, Linking } from "react-native";
import DeviceInfo from "react-native-device-info";
import env from "react-native-config";
import VersionCheck from "react-native-version-check";

import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";
import configs from "@configs";

class SplashScreen extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
    };
  }

  async componentDidMount() {
    try {
      let version = await DeviceInfo.getVersion();
      const latestVersion = await VersionCheck.getLatestVersion({
        provider: "appStore",
      });
      // const tempLatestVersion = latestVersion ? latestVersion : configs.APPSTORE_VERSION;
      // const res = await VersionCheck.needUpdate({
      //     currentVersion: version,
      //     latestVersion: tempLatestVersion,
      //     forceUpdate: true
      // });
      // if (res && res.isNeeded) {
      //     Alert.alert(
      //         'Notification!',
      //         `The HarmonyPay Salon POS had a new version on Apple Store. Press OK to update!`,
      //         [
      //             {
      //                 text: 'OK', onPress: () => {
      //                     Linking.openURL(res.storeUrl);
      //                     setTimeout(() => {
      //                         CodePush.restartApp();
      //                     }, 3000)

      //                 }
      //             },
      //         ],
      //         { cancelable: false },
      //     );

      // } else {
      const { deviceId, versionApp, deviceName } = this.props;
      if (!deviceId) {
        const uniqueId = await DeviceInfo.getUniqueId();
        this.props.actions.dataLocal.updateDeviceId(uniqueId || "simulator");
      }

      const tempDeviceName = await DeviceInfo.getDeviceName();
      if (tempDeviceName !== deviceName) {
        this.props.actions.dataLocal.updateDeviceName(
          tempDeviceName || "simulator"
        );
      }

      if (version !== versionApp) {
        this.props.actions.dataLocal.updateVersionApp(
          version ? version : latestVersion
        );
      }

      const tempEnv = env.IS_PRODUCTION;
      if (tempEnv == "Production" || tempEnv == "Staging") {
        const deploymentKey =
          tempEnv == "Production"
            ? configs.codePushKeyIOS.production
            : configs.codePushKeyIOS.staging;
        this.checkForUpdateCodepush(deploymentKey);
      } else {
        this.controlFlowInitApp();
      }
      // }
    } catch (error) {
      alert("error :", error);
    }
  }

  async checkForUpdateCodepush(deploymentKey) {
    try {
      const result = await Promise.race([
        CodePush.checkForUpdate(deploymentKey),
        new Promise((resolve, reject) =>
          setTimeout(() => resolve("TIME_OUT"), 10000)
        ),
      ]);

      if (result === "TIME_OUT") {
        this.controlFlowInitApp();
      } else {
        if (result) {
          if (result.failedInstall) {
            this.controlFlowInitApp();
          } else {
            let codePushOptions = {
              // installMode: CodePush.InstallMode.ON_NEXT_RESTART,
              installMode: CodePush.InstallMode.IMMEDIATE,
              mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
              deploymentKey: deploymentKey,
            };
            CodePush.sync(
              codePushOptions,
              this.codePushStatusDidChange.bind(this),
              this.codePushDownloadDidProgress.bind(this)
            );
          }
        } else {
          this.controlFlowInitApp();
        }
      }
    } catch (error) {
      if (`${error}`.includes("Network request failed")) {
        Alert.alert(
          "Please check your internet!",
          "Restart application!",
          [
            {
              text: "OK",
              onPress: () => {
                CodePush.restartApp();
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  }

  codePushStatusDidChange(syncStatus) {}

  async codePushDownloadDidProgress(progress) {
    let temp = parseInt(progress.receivedBytes / progress.totalBytes);
    await this.setState({
      progress: temp * 100,
    });
  }

  controlFlowInitApp() {
    const { token, profile, stateCity } = this.props;
    if (!stateCity || stateCity.length === 0) {
      this.props.actions.app.getStateCity();
    }

    if (!token) {
      this.props.navigation.navigate("Auth");
    } else {
      if (profile.needSetting) {
        this.props.actions.staff.loginStaff(profile.merchantCode, "0000");
        this.props.navigation.navigate("SetupStore");
      } else {
        this.props.navigation.navigate("Drawer");
      }
    }
  }
}

const mapStateToProps = (state) => ({
  profile: state.dataLocal.profile,
  token: state.dataLocal.token,
  deviceId: state.dataLocal.deviceId,
  deviceName: state.dataLocal.deviceName,
  stateCity: state.dataLocal.stateCity,
  versionApp: state.dataLocal.versionApp,
  isInitialApp: state.app.isInitialApp,
});

let codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
};

SplashScreen = CodePush(codePushOptions)(SplashScreen);

export default connectRedux(mapStateToProps, SplashScreen);
