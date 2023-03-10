import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform
} from 'react-native';

import { Button, Text, ButtonCustom } from '@components';
import { scaleSize, localize, checkStatusPrint } from '@utils';
import ICON from '@resources';
import connectRedux from '@redux/ConnectRedux';

class PrinterList extends React.Component {

    addDevice = () => {
        this.props.gotoSetupDevice();
    }

    backHomeHardware = () => {
        this.props.backHomeHardware();
    }

    selectPortType = async (type) => {
        try {
            this.props.actions.dataLocal.updatePrinterPortType(type);
            this.props.actions.app.loadingApp()
            const printMachine = await checkStatusPrint(type);
            this.props.actions.dataLocal.updatePrinterList(printMachine);
            this.props.actions.app.stopLoadingApp();
        } catch (error) {
            this.props.actions.app.stopLoadingApp();
            setTimeout(() => {
                alert(error)
            }, 500)
        }

    }

    selectPrinter = (printer) => {
        this.props.actions.dataLocal.selectPrinter(printer);
    }

    // -------- Render ------

    renderNoConnected() {
        const { language } = this.props;

        return (
            <View>
                <Text style={{
                    fontSize: scaleSize(12),
                    color: 'rgb(131,131,131)',
                    marginTop: scaleSize(10),
                    marginBottom: scaleSize(7)
                }} >
                    {localize('No connected device', language)}

                </Text>

                <Button onPress={this.addDevice} style={{
                    flexDirection: 'row', alignItems: 'center', width: scaleSize(120)
                }} >
                    <View style={{
                        width: scaleSize(20), height: scaleSize(20),
                        borderRadius: scaleSize(4), borderColor: '#0764B0', borderWidth: 3,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} >
                        <Text style={{
                            fontSize: scaleSize(14),
                            color: '#0764B0',
                            fontWeight: 'bold'
                        }} >
                            +
                    </Text>
                    </View>

                    <Text style={{
                        fontSize: scaleSize(12),
                        color: '#0764B0',
                        marginLeft: scaleSize(8)
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
                flexDirection: 'row', alignItems: 'center', width: scaleSize(120),
                marginTop: scaleSize(12)

            }} >
                <Text style={{
                    fontSize: scaleSize(14),
                    fontWeight: 'bold',
                    color: '#0764B0',
                    marginLeft: scaleSize(8),
                    textDecorationLine: 'underline'
                }} >
                    {paxMachineInfo.name}
                </Text>
            </Button>
        );
    }

    render() {
        const { printerPortType, language, printerList, printerSelect } = this.props;
        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSize(14), paddingTop: scaleSize(20) }} >
                <Text style={{
                    fontSize: scaleSize(16),
                    fontWeight: '600',
                    color: '#0764B0'
                }} >
                    {localize('Connect Printer By', language)}
                </Text>
                <View style={{ paddingLeft: scaleSize(15) }} >
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
                    fontSize: scaleSize(16),
                    fontWeight: '600',
                    color: '#0764B0', marginTop: scaleSize(20), marginBottom: scaleSize(10)
                }} >
                    {localize('My Printer Devices', language)}
                </Text>
                {
                    printerList && printerList.map((printer) => <ItemPrinter
                        key={printer.portName}
                        modelName={printer.modelName}
                        isConnected={printer.modelName == printerSelect ? true : false}
                        onPress={this.selectPrinter}
                    />)
                }


                {/* ------- Footer -------- */}
                <View style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'flex-end', paddingBottom: scaleSize(30) }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                        <ButtonCustom
                            width={scaleSize(130)}
                            height={50}
                            backgroundColor="#F1F1F1"
                            title={localize('BACK', language)}
                            textColor="#6A6A6A"
                            onPress={this.backHomeHardware}
                            style={{ borderWidth: 2, borderColor: 'rgb(227,227,227)', borderRadius: 2, }}
                            styleText={{ fontSize: scaleSize(20), fontWeight: '500' }}
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
        <Button onPress={() => onPress(title)} style={{ flexDirection: "row", alignItems: "center", marginTop: scaleSize(10) }} >
            <Image source={tempIconSelect} />
            <Text style={{ fontSize: scaleSize(14), color: "rgb(131,131,131)", marginLeft: scaleSize(10) }} >
                {title}
            </Text>
        </Button>
    );
}

const ItemPrinter = ({ modelName, isConnected, onPress }) => {

    return (
        <Button onPress={() => onPress(modelName)} style={{
            height: scaleSize(40), backgroundColor: "rgb(250,250,250)", borderRadius: 6,
            flexDirection: "row", alignItems: "center", paddingLeft: scaleSize(15),
            paddingRight: scaleSize(40), justifyContent: "space-between",
            marginBottom: scaleSize(13)
        }} >
            <Text style={{
                fontSize: scaleSize(14),
                fontWeight: '600',
            }} >
                {modelName}
            </Text>

            <Text style={{
                fontSize: scaleSize(12),
                fontWeight: '600',
                color: '#0764B0',
            }} >
                {`${isConnected ? "Connected" : ""}`}
            </Text>
        </Button>
    );
}

const mapStateToProps = state => ({
    paxMachineInfo: state.hardware.paxMachineInfo,
    language: state.dataLocal.language,
    printerPortType: state.dataLocal.printerPortType,
    printerList: state.dataLocal.printerList,
    printerSelect: state.dataLocal.printerSelect
})

export default connectRedux(mapStateToProps, PrinterList);

