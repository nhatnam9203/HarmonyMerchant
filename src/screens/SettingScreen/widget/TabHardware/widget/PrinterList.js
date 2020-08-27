import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform
} from 'react-native';

import { Button, Text, ButtonCustom } from '@components';
import { scaleSzie, localize } from '@utils';
import ICON from '@resources';
import connectRedux from '@redux/ConnectRedux';

class PrinterList extends React.Component {

    addDevice = () => {
        this.props.gotoSetupDevice();
    }

    backHomeHardware = () => {
        this.props.backHomeHardware();
    }

    selectPortType = (type) => {
        this.props.actions.dataLocal.updatePrinterPortType(type);
    }

    // -------- Render ------

    renderNoConnected() {
        const { language } = this.props;

        return (
            <View>
                <Text style={{
                    fontSize: scaleSzie(12),
                    color: 'rgb(131,131,131)',
                    marginTop: scaleSzie(10),
                    marginBottom: scaleSzie(7)
                }} >
                    {localize('No connected device', language)}

                </Text>

                <Button onPress={this.addDevice} style={{
                    flexDirection: 'row', alignItems: 'center', width: scaleSzie(120)
                }} >
                    <View style={{
                        width: scaleSzie(20), height: scaleSzie(20),
                        borderRadius: scaleSzie(4), borderColor: '#0764B0', borderWidth: 3,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} >
                        <Text style={{
                            fontSize: scaleSzie(14),
                            color: '#0764B0',
                            fontWeight: 'bold'
                        }} >
                            +
                    </Text>
                    </View>

                    <Text style={{
                        fontSize: scaleSzie(12),
                        color: '#0764B0',
                        marginLeft: scaleSzie(8)
                    }} >

                        {localize('Add device', language)}
                    </Text>
                </Button>
            </View>
        );
    }

    renderConnected() {
        const { paxMachineInfo } = this.props;
        return (
            <Button onPress={this.addDevice} style={{
                flexDirection: 'row', alignItems: 'center', width: scaleSzie(120),
                marginTop: scaleSzie(12)

            }} >
                <Text style={{
                    fontSize: scaleSzie(14),
                    fontWeight: 'bold',
                    color: '#0764B0',
                    marginLeft: scaleSzie(8),
                    textDecorationLine: 'underline'
                }} >
                    {paxMachineInfo.name}
                </Text>
            </Button>
        );
    }

    render() {
        const { printerPortType, language } = this.props;
        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(14), paddingTop: scaleSzie(20) }} >
                <Text style={{
                    fontSize: scaleSzie(16),
                    fontWeight: '600',
                    color: '#0764B0'
                }} >
                    {localize('Connect Printer By', language)}
                </Text>
                <View style={{ paddingLeft: scaleSzie(15) }} >
                    <ItemConnect
                        title="Bluetooth"
                        isSelect={printerPortType === "Bluetooth" ? true : false}
                        onPress={this.selectPortType}
                    />
                    <ItemConnect
                        title="LAN"
                        isSelect={printerPortType === "LAN" ? true : false}
                        onPress={this.selectPortType}
                    />
                    <ItemConnect
                        title="USB"
                        isSelect={printerPortType === "USB" ? true : false}
                        onPress={this.selectPortType}
                    />
                </View>

                <Text style={{
                    fontSize: scaleSzie(16),
                    fontWeight: '600',
                    color: '#0764B0', marginTop: scaleSzie(20), marginBottom: scaleSzie(10)
                }} >
                    {localize('My Printer Device', language)}
                </Text>

                <View style={{
                    height: scaleSzie(40), backgroundColor: "rgb(250,250,250)", borderRadius: 6,
                    flexDirection: "row", alignItems: "center", paddingLeft: scaleSzie(15),
                    paddingRight: scaleSzie(40), justifyContent: "space-between"
                }} >
                    <Text style={{
                        fontSize: scaleSzie(14),
                        fontWeight: '500',
                    }} >
                        {"BT:mPOP"}
                    </Text>
                    <Text style={{
                        fontSize: scaleSzie(14),
                        fontWeight: '500',
                        color: '#0764B0',
                    }} >
                        {"Connected"}
                    </Text>
                </View>

                {/* ------- List Device ----- */}
                <Text style={{
                    fontSize: scaleSzie(16),
                    fontWeight: '600',
                    color: '#0764B0', marginTop: scaleSzie(30), marginBottom: scaleSzie(10)
                }} >
                    {localize('Other Devices', language)}
                </Text>

                <View style={{
                    height: scaleSzie(40), backgroundColor: "rgb(250,250,250)", borderRadius: 6,
                    flexDirection: "row", alignItems: "center", paddingLeft: scaleSzie(15),
                    paddingRight: scaleSzie(40),
                }} >
                    <Text style={{
                        fontSize: scaleSzie(14),
                        fontWeight: '500',
                    }} >
                        {"BT:mPOP"}
                    </Text>
                </View>


                {/* ------- Footer -------- */}
                <View style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'flex-end', paddingBottom: scaleSzie(30) }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                        <ButtonCustom
                            width={scaleSzie(130)}
                            height={50}
                            backgroundColor="#F1F1F1"
                            title={localize('BACK', language)}
                            textColor="#6A6A6A"
                            onPress={this.backHomeHardware}
                            style={{ borderWidth: 2, borderColor: 'rgb(227,227,227)', borderRadius: 2, }}
                            styleText={{ fontSize: scaleSzie(20), fontWeight: '500' }}
                        />
                    </View>
                </View>

            </View>
        );
    }
}

const ItemConnect = ({ title, isSelect, onPress }) => {
    const tempIconSelect = isSelect ? ICON.radioExportSe : ICON.radioExport;

    return (
        <Button onPress={() => onPress(title)} style={{ flexDirection: "row", alignItems: "center", marginTop: scaleSzie(10) }} >
            <Image source={tempIconSelect} />
            <Text style={{ fontSize: scaleSzie(14), color: "rgb(131,131,131)", marginLeft: scaleSzie(10) }} >
                {title}
            </Text>
        </Button>
    );
}

const mapStateToProps = state => ({
    paxMachineInfo: state.dataLocal.paxMachineInfo,
    language: state.dataLocal.language,
    printerPortType: state.dataLocal.printerPortType
})

export default connectRedux(mapStateToProps, PrinterList);

