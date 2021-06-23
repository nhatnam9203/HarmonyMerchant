import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform
} from 'react-native';
// import { BleManager } from 'react-native-ble-plx';

import { Button, Text, ButtonCustom } from '@components';
import { ScaleSzie, localize } from '@utils';
import IMAGE from '@resources';
import connectRedux from '@redux/ConnectRedux';
// import BluetoothScanner from "@lib/BluetoothScanner";
// import { ScrollView } from 'react-native-gesture-handler';

class AddDeviceHardware extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            peripherals: []
        }
        this.bluetoothScannerRef = React.createRef();

    }

    componentDidMount() {
    }

    addDevice = () => {
        this.props.gotoSetupDevice();
    }

    scanAndConnect() {
    }

    backHomeHardware = () => {
        this.props.backHomeHardware();
    }

    handleStopScan = (list) => {
        this.props.actions.app.stopLoadingApp();
        this.setState({
            peripherals: list
        });
    }

    handleSelectPeripheral = (peripheral) => {
        this.props.actions.dataLocal.saveBluetoothPaxInfo(peripheral);
    }

    // -------- Render ------

    renderNoConnected() {
        const { language } = this.props;

        return (
            <View style={{ marginBottom: ScaleSzie(10) }} >
                <Text style={{
                    fontSize: ScaleSzie(12),
                    color: 'rgb(131,131,131)',
                    marginTop: ScaleSzie(10),
                    marginBottom: ScaleSzie(7)
                }} >
                    {localize('No connected device', language)}

                </Text>

                <Button onPress={this.addDevice} style={{
                    flexDirection: 'row', alignItems: 'center', width: ScaleSzie(120)
                }} >
                    <View style={{
                        width: ScaleSzie(20), height: ScaleSzie(20),
                        borderRadius: ScaleSzie(4), borderColor: '#0764B0', borderWidth: 3,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} >
                        <Text style={{
                            fontSize: ScaleSzie(14),
                            color: '#0764B0',
                            fontWeight: 'bold'
                        }} >
                            +
                    </Text>
                    </View>

                    <Text style={{
                        fontSize: ScaleSzie(12),
                        color: '#0764B0',
                        marginLeft: ScaleSzie(8)
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
                flexDirection: 'row', alignItems: 'center', width: ScaleSzie(120),
                marginTop: ScaleSzie(12)

            }} >
                <Text style={{
                    fontSize: ScaleSzie(14),
                    fontWeight: 'bold',
                    color: '#0764B0',
                    marginLeft: ScaleSzie(8),
                    textDecorationLine: 'underline'
                }} >
                    {paxMachineInfo.name}
                </Text>
            </Button>
        );
    }

    render() {
        const { paxMachineInfo, language } = this.props;
        return (
            <View style={{ flex: 1, paddingHorizontal: ScaleSzie(14), paddingTop: ScaleSzie(20) }} >
                <Text style={{
                    fontSize: ScaleSzie(16),
                    fontWeight: '600',
                    color: '#0764B0'
                }} >

                    {localize('Payment Terminal', language)}
                </Text>

                <Text style={{
                    fontSize: ScaleSzie(16),
                    fontWeight: '600',
                    color: 'rgb(81,81,81)',
                    marginTop: ScaleSzie(26)
                }} >

                    {localize('Connected Device', language)}
                </Text>
                {!paxMachineInfo.isSetup ? this.renderNoConnected() : this.renderConnected()}

                {/* ------- Footer -------- */}
                <View style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'flex-end', paddingBottom: ScaleSzie(30) }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                        <ButtonCustom
                            width={ScaleSzie(130)}
                            height={50}
                            backgroundColor="#F1F1F1"
                            title={localize('BACK', language)}
                            textColor="#6A6A6A"
                            onPress={this.backHomeHardware}
                            style={{ borderWidth: 2, borderColor: 'rgb(227,227,227)', borderRadius: 2, }}
                            styleText={{ fontSize: ScaleSzie(20), fontWeight: '500' }}
                        />
                    </View>
                </View>

                {/* <BluetoothScanner
                    ref={this.bluetoothScannerRef}
                    handleStopScan={this.handleStopScan}
                /> */}
            </View>
        );
    }

    componentWillUnmount() {
        // subscription.remove();
    }
}

const ItemBluetoothConnect = ({ title, isSelect, onPress }) => {
    const tempIconSelect = isSelect ? ICON.radioExportSe : ICON.radioExport;

    return (
        <Button onPress={() => onPress(title)} style={{ flexDirection: "row", alignItems: "center", marginTop: ScaleSzie(10) }} >
            <Image source={tempIconSelect} />
            <Text style={{ fontSize: ScaleSzie(14), color: "rgb(131,131,131)", marginLeft: ScaleSzie(10) }} >
                {title}
            </Text>
        </Button>
    );
}

const ItemBluetooth = ({ peripheral, isConnected, onPress }) => {

    return (
        <Button onPress={() => onPress(peripheral)} style={{
            height: ScaleSzie(45), backgroundColor: "rgb(250,250,250)", borderRadius: 6,
            flexDirection: "row", alignItems: "center", paddingLeft: ScaleSzie(15),
            paddingRight: ScaleSzie(40), justifyContent: "space-between",
            marginBottom: ScaleSzie(13)
        }} >
            <View>
                <Text style={{
                    fontSize: ScaleSzie(14),
                    fontWeight: '600',
                }} >
                    {peripheral?.name || "No Name"}
                </Text>
                <Text style={{
                    fontSize: ScaleSzie(8),
                    fontWeight: '300',
                }} >
                    {peripheral?.id || ""}
                </Text>
            </View>

            <Text style={{
                fontSize: ScaleSzie(12),
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
})

export default connectRedux(mapStateToProps, AddDeviceHardware);

