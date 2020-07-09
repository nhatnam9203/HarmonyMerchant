import _ from 'ramda';
import CodePush from "react-native-code-push";
import { Alert, Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import env from 'react-native-config';
import VersionCheck from 'react-native-version-check';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class SplashScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            progress: 0
        }
    }

    async componentDidMount() {
        let version = await DeviceInfo.getVersion();
        try {
            const res = await VersionCheck.needUpdate({
                currentVersion: version,
                latestVersion: "1.0.8",
                forceUpdate: true
            });
            if (res && res.isNeeded) {
                Alert.alert(
                    'Notification!',
                    `The HarmonyPay Salon POS had new version on Apple Store. Press OK to update!`,
                    [
                        {
                            text: 'OK', onPress: () => { 
                                Linking.openURL(res.storeUrl);
                                setTimeout(() =>{
                                    CodePush.restartApp();
                                },3000)
                                
                            }
                        },
                    ],
                    { cancelable: false },
                );

            } else {
                const { deviceId, versionApp } = this.props;
                if (!deviceId) {
                    const uniqueId = await DeviceInfo.getUniqueId();
                    this.props.actions.dataLocal.updateDeviceId(uniqueId);
                }

                if (version !== versionApp) {
                    this.props.actions.dataLocal.updateVersionApp(version ? version : "1.0.7");
                }

                const tempEnv = env.IS_PRODUCTION;
                if (tempEnv == "true") {
                    this.checkForUpdateCodepush();
                } else {
                    this.controlFlowInitApp();
                }
            }

        } catch (error) {
            alert("error :", error)
        }

    }

    checkForUpdateCodepush(deploymentKey) {
        CodePush.checkForUpdate(deploymentKey)
            .then(update => {
                if (update) {
                    if (update.failedInstall) {
                        this.controlFlowInitApp();
                    } else {
                        let codePushOptions = {
                            installMode: CodePush.InstallMode.ON_NEXT_RESTART,
                            mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
                            deploymentKey: deploymentKey
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
            })
            .catch(error => {
                if (`${error}`.includes('Network request failed')) {
                    Alert.alert(
                        'Please check your internet!',
                        'Restart application!',
                        [

                            {
                                text: 'OK', onPress: () => {
                                    CodePush.restartApp();
                                }
                            },
                        ],
                        { cancelable: false },
                    );

                }
            })
    }

    codePushStatusDidChange(syncStatus) {
        //console.log('progress : ' ,syncStatus);
    }

    async codePushDownloadDidProgress(progress) {
        let temp = parseInt(progress.receivedBytes / progress.totalBytes);
        await this.setState({
            progress: temp * 100
        })
    }

    controlFlowInitApp() {
        const { token, profile, stateCity } = this.props;
        if (!stateCity || stateCity.length === 0) {
            this.props.actions.app.getStateCity();
        }

        if (!token) {
            this.props.navigation.navigate('Auth');
        } else {
            if (profile.needSetting) {
                this.props.actions.staff.loginStaff(profile.merchantCode, '0000');
                this.props.navigation.navigate('SetupStore');
            } else {
                this.props.navigation.navigate('Drawer');
            }
        }
    }
}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    token: state.dataLocal.token,
    deviceId: state.dataLocal.deviceId,
    stateCity: state.dataLocal.stateCity,
    versionApp: state.dataLocal.versionApp
});

let codePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL };

SplashScreen = CodePush(codePushOptions)(SplashScreen);


export default connectRedux(mapStateToProps, SplashScreen);