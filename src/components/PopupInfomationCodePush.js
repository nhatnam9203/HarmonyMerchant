import React from 'react';
import {
    View,
    Image,
    Text
} from 'react-native';
import CodePush from "react-native-code-push";
import env from 'react-native-config';

import ButtonCustom from './ButtonCustom';
import connectRedux from '@redux/ConnectRedux';
import { scaleSzie } from '../utils';
import ModalCustom from './ModalCustom';
import ICON from "@resources";
import configs from "@configs";

class PopupInfomationCodePush extends React.Component {

    updateAppByCodePush = () => {
        const tempEnv = env.IS_PRODUCTION;
        const deploymentKey = tempEnv == "Production" ? configs.codePushKeyIOS.production : configs.codePushKeyIOS.staging;

        let codePushOptions = {
            installMode: CodePush.InstallMode.IMMEDIATE,
            mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
            deploymentKey: deploymentKey
        };

        this.props.actions.app.tooglePopupCodePush(false);
        CodePush.sync(
            codePushOptions,
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this)
        );
    }

    codePushStatusDidChange(syncStatus) {

    }

    codePushDownloadDidProgress(progress) {

    }

    render() {
        const { title, visiblePopupCodePush } = this.props;
        return (
            <ModalCustom
                title={title}
                visible={visiblePopupCodePush}
                onRequestClose={() => { }}
                transparent={true}
                style={{
                    // justifyContent: 'flex-start',
                    // paddingTop: scaleSzie(40)
                }}
            >
                <View style={{
                    height: scaleSzie(450),
                    width: scaleSzie(380)
                }} >
                    <View style={{ height: scaleSzie(80) }} />

                    {/* --------- White Box ------- */}
                    <View style={[{
                        flex: 1, backgroundColor: '#fff',
                        borderRadius: scaleSzie(10)
                    }, configs.SHADOW]} >
                        {/* --------- Content Update ------- */}
                        <View style={{ flex: 1 }} >

                        </View>

                        {/* --------- Line ------- */}
                        <View style={{ height: 1, backgroundColor: "rgba(112,112,112,0.4)" }} />
                        {/* --------- Footer ------- */}
                        <View style={{ height: scaleSzie(73), justifyContent: "center", alignItems: "center" }} >
                            <ButtonCustom
                                width={scaleSzie(150)}
                                height={46}
                                backgroundColor="#0764B0"
                                title={'UPDATE'}
                                textColor="#fff"
                                onPress={this.updateAppByCodePush}
                                style={[{ borderRadius: scaleSzie(2) },]}
                                styleText={{
                                    fontSize: scaleSzie(16)
                                }}
                            />
                        </View>

                    </View>


                    {/* --------- Blue Box ------- */}
                    <View style={[{
                        width: scaleSzie(380), height: scaleSzie(150),
                        position: "absolute", top: 0, right: 0, left: 0, alignItems: "center"
                    }, configs.SHADOW]} >
                        <View style={{
                            flex: 1, width: scaleSzie(200), backgroundColor: "#0764B0",
                            borderRadius: scaleSzie(10), alignItems: "center", paddingVertical: scaleSzie(17)
                        }} >
                            <Image
                                source={ICON.update_code_push}
                                style={{ height: scaleSzie(55), width: scaleSzie(55) }}
                            />
                            <Text style={{ color: "#fff", fontSize: scaleSzie(14), fontWeight: "bold", marginTop: scaleSzie(18) }} >
                                {`What's new ?`}
                            </Text>
                            <View style={{ flex: 1, justifyContent: "flex-end" }} >
                                <Text style={{ color: "#fff", fontSize: scaleSzie(12), fontWeight: "300" }} >
                                    {`Version: 1.1.1`}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ModalCustom>
        );
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    visiblePopupCodePush: state.app.visiblePopupCodePush,
});

export default connectRedux(mapStateToProps, PopupInfomationCodePush);

