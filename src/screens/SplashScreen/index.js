import _ from 'ramda';
import CodePush from "react-native-code-push";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import configs from '@configs';
import { checkEnvironment } from '@utils';

class SplashScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.checkForUpdateCodepush();
    }

    checkForUpdateCodepush() {
        const deploymentKey = checkEnvironment() === 'DEV' ? configs.codePushKeyIOS.staging : configs.codePushKeyIOS.production;
        // console.log('deploymentKey : ', deploymentKey);
        CodePush.checkForUpdate(deploymentKey)
            .then(update => {
                if (update) {
                    console.log('update : ',update);
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
                } else {
                    this.controlFlowInitApp();
                }
            })
            .catch(error => console.log('error : ', error))
    }

    codePushStatusDidChange(syncStatus) {
        // console.log('progress : ' ,syncStatus);
    }

    codePushDownloadDidProgress(progress) {
        // console.log('progress : ' ,progress);
    }

    controlFlowInitApp() {
        const { token, profile } = this.props;
        this.props.actions.app.resetIsFlashScreen(true);
        if (!token) {
            this.props.actions.app.getStateCity();
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



    componentWillUnmount() {
        this.props.actions.app.resetIsFlashScreen();
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    token: state.dataLocal.token,
    profileStaffLogin: state.dataLocal.profileStaffLogin,
    visibleModalLock: state.app.visibleModalLock,
    isLoginStaff: state.dataLocal.isLoginStaff,
    loading: state.app.loading,
    isFlashScreen: state.app.isFlashScreen
});

let codePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL };

SplashScreen = CodePush(codePushOptions)(SplashScreen);


export default connectRedux(mapStateToProps, SplashScreen);