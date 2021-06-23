import React from 'react';
import {
    View,
    Image,
    Text,
    ActivityIndicator
} from 'react-native';
import CodePush from "react-native-code-push";
import env from 'react-native-config';

import ButtonCustom from './ButtonCustom';
import connectRedux from '@redux/ConnectRedux';
import { ScaleSzie } from '../utils';
import ModalCustom from './ModalCustom';
import ICON from "@resources";
import configs from "@configs";

class PopupInfomationCodePush extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }

    updateAppByCodePush = () => {
        this.setState({
            isLoading: true
        })

        const tempEnv = env.IS_PRODUCTION;
        const deploymentKey = tempEnv == "Production" ? configs.codePushKeyIOS.production : configs.codePushKeyIOS.staging;

        let codePushOptions = {
            installMode: CodePush.InstallMode.IMMEDIATE,
            mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
            deploymentKey: deploymentKey
        };
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
        const { title, visiblePopupCodePush, descriptionCodePush,versionApp } = this.props;
        const { isLoading } = this.state;
        const descriptions = descriptionCodePush.split(",");

        return (
            <ModalCustom
                title={title}
                visible={visiblePopupCodePush}
                // visible={true}
                onRequestClose={() => { }}
                transparent={true}
            >
                <View style={{
                    height: ScaleSzie(450),
                    width: ScaleSzie(380)
                }} >
                    <View style={{ height: ScaleSzie(80) }} />

                    {/* --------- White Box ------- */}
                    <View style={[{
                        flex: 1, backgroundColor: '#fff',
                        borderRadius: ScaleSzie(10)
                    }, configs.SHADOW]} >
                        {/* --------- Content Update ------- */}
                        <View style={{ flex: 1, paddingTop: ScaleSzie(100), paddingHorizontal: ScaleSzie(30) }} >
                            {
                                descriptions.map((desc, key) => <View key={`${desc}_${key}`} style={{ flexDirection: "row", alignItems: "center", marginBottom: ScaleSzie(10) }} >
                                    <View style={{ height: ScaleSzie(8), width: ScaleSzie(8), backgroundColor: "#4CD964", borderRadius: ScaleSzie(4) }} />
                                    <Text style={{ color: "#404040", fontSize: ScaleSzie(16), fontWeight: "600", marginLeft: ScaleSzie(10) }} >
                                        {`${desc}`}
                                    </Text>
                                </View>)
                            }

                        </View>

                        {/* --------- Line ------- */}
                        <View style={{ height: 1, backgroundColor: "rgba(112,112,112,0.4)" }} />
                        {/* --------- Footer ------- */}
                        <View style={{ height: ScaleSzie(73), justifyContent: "center", alignItems: "center" }} >
                            {
                                isLoading ? <View style={{
                                    width: ScaleSzie(150), height: ScaleSzie(46), backgroundColor: "#0764B0",
                                    borderRadius: ScaleSzie(2), justifyContent: "center", alignItems: "center"
                                }} >
                                    <ActivityIndicator
                                        color="#fff"
                                        size="large"
                                    />
                                </View>
                                    : <ButtonCustom
                                        width={ScaleSzie(150)}
                                        height={46}
                                        backgroundColor="#0764B0"
                                        title={'UPDATE'}
                                        textColor="#fff"
                                        onPress={this.updateAppByCodePush}
                                        style={[{ borderRadius: ScaleSzie(2) },]}
                                        styleText={{
                                            fontSize: ScaleSzie(16)
                                        }}
                                    />
                            }

                        </View>

                    </View>


                    {/* --------- Blue Box ------- */}
                    <View style={[{
                        width: ScaleSzie(380), height: ScaleSzie(150),
                        position: "absolute", top: 0, right: 0, left: 0, alignItems: "center"
                    }, configs.SHADOW]} >
                        <View style={{
                            flex: 1, width: ScaleSzie(200), backgroundColor: "#0764B0",
                            borderRadius: ScaleSzie(10), alignItems: "center", paddingVertical: ScaleSzie(17)
                        }} >
                            <Image
                                source={ICON.update_code_push}
                                style={{ height: ScaleSzie(55), width: ScaleSzie(55) }}
                            />
                            <Text style={{ color: "#fff", fontSize: ScaleSzie(14), fontWeight: "bold", marginTop: ScaleSzie(18) }} >
                                {`What's new?`}
                            </Text>
                            <View style={{ flex: 1, justifyContent: "flex-end" }} >
                                <Text style={{ color: "#fff", fontSize: ScaleSzie(12), fontWeight: "300" }} >
                                    {`Version: ${versionApp}`}
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
    descriptionCodePush: state.app.descriptionCodePush,
    versionApp: state.dataLocal.versionApp
});

export default connectRedux(mapStateToProps, PopupInfomationCodePush);

