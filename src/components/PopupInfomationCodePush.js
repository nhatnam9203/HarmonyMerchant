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
import { scaleSize } from '../utils';
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
                    height: scaleSize(450),
                    width: scaleSize(380)
                }} >
                    <View style={{ height: scaleSize(80) }} />

                    {/* --------- White Box ------- */}
                    <View style={[{
                        flex: 1, backgroundColor: '#fff',
                        borderRadius: scaleSize(10)
                    }, configs.SHADOW]} >
                        {/* --------- Content Update ------- */}
                        <View style={{ flex: 1, paddingTop: scaleSize(100), paddingHorizontal: scaleSize(30) }} >
                            {
                                descriptions.map((desc, key) => <View key={`${desc}_${key}`} style={{ flexDirection: "row", alignItems: "center", marginBottom: scaleSize(10) }} >
                                    <View style={{ height: scaleSize(8), width: scaleSize(8), backgroundColor: "#4CD964", borderRadius: scaleSize(4) }} />
                                    <Text style={{ color: "#404040", fontSize: scaleSize(16), fontWeight: "600", marginLeft: scaleSize(10) }} >
                                        {`${desc}`}
                                    </Text>
                                </View>)
                            }

                        </View>

                        {/* --------- Line ------- */}
                        <View style={{ height: 1, backgroundColor: "rgba(112,112,112,0.4)" }} />
                        {/* --------- Footer ------- */}
                        <View style={{ height: scaleSize(73), justifyContent: "center", alignItems: "center" }} >
                            {
                                isLoading ? <View style={{
                                    width: scaleSize(150), height: scaleSize(46), backgroundColor: "#0764B0",
                                    borderRadius: scaleSize(2), justifyContent: "center", alignItems: "center"
                                }} >
                                    <ActivityIndicator
                                        color="#fff"
                                        size="large"
                                    />
                                </View>
                                    : <ButtonCustom
                                        width={scaleSize(150)}
                                        height={46}
                                        backgroundColor="#0764B0"
                                        title={'UPDATE'}
                                        textColor="#fff"
                                        onPress={this.updateAppByCodePush}
                                        style={[{ borderRadius: scaleSize(2) },]}
                                        styleText={{
                                            fontSize: scaleSize(16)
                                        }}
                                    />
                            }

                        </View>

                    </View>


                    {/* --------- Blue Box ------- */}
                    <View style={[{
                        width: scaleSize(380), height: scaleSize(150),
                        position: "absolute", top: 0, right: 0, left: 0, alignItems: "center"
                    }, configs.SHADOW]} >
                        <View style={{
                            flex: 1, width: scaleSize(200), backgroundColor: "#0764B0",
                            borderRadius: scaleSize(10), alignItems: "center", paddingVertical: scaleSize(17)
                        }} >
                            <Image
                                source={ICON.update_code_push}
                                style={{ height: scaleSize(55), width: scaleSize(55) }}
                            />
                            <Text style={{ color: "#fff", fontSize: scaleSize(14), fontWeight: "bold", marginTop: scaleSize(18) }} >
                                {`What's new?`}
                            </Text>
                            <View style={{ flex: 1, justifyContent: "flex-end" }} >
                                <Text style={{ color: "#fff", fontSize: scaleSize(12), fontWeight: "300" }} >
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

