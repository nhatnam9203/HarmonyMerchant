import _ from 'ramda';
import CodePush from "react-native-code-push";
import { Alert, Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import env from 'react-native-config';
import VersionCheck from 'react-native-version-check';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import configs from '@configs';
import { checkEnvironment } from '@utils';

class SplashScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            progress: 0
        }
    }

    async componentDidMount() {
        try {
            const res = await VersionCheck.needUpdate();
            // console.log("res : ",res);
            if (res && res.isNeeded) {
                Linking.openURL(res.storeUrl);
            } else {
                const { deviceId, versionApp } = this.props;
                if (!deviceId) {
                    const uniqueId = await DeviceInfo.getUniqueId();
                    this.props.actions.dataLocal.updateDeviceId(uniqueId);
                }


                let version = await DeviceInfo.getVersion();
                if ( version !== versionApp ) {
                    this.props.actions.dataLocal.updateVersionApp(version ? version : "1.0.7");
                }

                const tempEnv = env.IS_PRODUCTION;
                // console.log("IS_PRODUCTION : ",tempEnv);
                if (tempEnv == "true") {
                    // console.log("---- checkForUpdateCodepush -----");
                    this.checkForUpdateCodepush();
                } else {
                    // console.log("---- controlFlowInitApp -----");
                    this.controlFlowInitApp();
                }
            }

        } catch (error) {
            // console.log("error  : ",error);
        }

    }

    checkForUpdateCodepush() {
        // console.log('checkForUpdateCodepush : ');
        const deploymentKey = configs.codePushKeyIOS.production;
        CodePush.checkForUpdate(deploymentKey)
            .then(update => {
                // console.log('update : ', update);
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

    async  codePushDownloadDidProgress(progress) {
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