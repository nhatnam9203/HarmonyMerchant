import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform
} from 'react-native';
// import { BleManager } from 'react-native-ble-plx';

import { Button, Text, ButtonCustom } from '@components';
import { scaleSize, localize } from '@utils';
import IMAGE from '@resources';
import connectRedux from '@redux/ConnectRedux';
import _ from "lodash";

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
            <View style={{ marginBottom: scaleSize(10) }} >
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
        const { paxMachineInfo, cloverMachineInfo, paymentMachineType } = this.props;
        let name = ''
        if (paymentMachineType == 'Pax') {
            name = _.get(paxMachineInfo, 'name')
        } else {
            name = _.get(cloverMachineInfo, 'name')
        }
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
                    {name}
                </Text>
            </Button>
        );
    }

    render() {
        const { paxMachineInfo, 
                cloverMachineInfo,
                language, 
                paymentMachineType } = this.props;
        let isSetup = false
        if (paymentMachineType == 'Pax') {
            isSetup = _.get(paxMachineInfo, 'isSetup', false)
        } else {
            isSetup = _.get(cloverMachineInfo, 'isSetup', false)
        }
        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSize(14), paddingTop: scaleSize(20) }} >
                <Text style={{
                    fontSize: scaleSize(16),
                    fontWeight: '600',
                    color: '#0764B0'
                }} >

                    {localize('Payment Terminal', language)}
                </Text>

                <Text style={{
                    fontSize: scaleSize(16),
                    fontWeight: '600',
                    color: 'rgb(81,81,81)',
                    marginTop: scaleSize(26)
                }} >

                    {localize('Connected Device', language)}
                </Text>
                {!isSetup ? this.renderNoConnected() : this.renderConnected()}

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
        <Button onPress={() => onPress(title)} style={{ flexDirection: "row", alignItems: "center", marginTop: scaleSize(10) }} >
            <Image source={tempIconSelect} />
            <Text style={{ fontSize: scaleSize(14), color: "rgb(131,131,131)", marginLeft: scaleSize(10) }} >
                {title}
            </Text>
        </Button>
    );
}

const ItemBluetooth = ({ peripheral, isConnected, onPress }) => {

    return (
        <Button onPress={() => onPress(peripheral)} style={{
            height: scaleSize(45), backgroundColor: "rgb(250,250,250)", borderRadius: 6,
            flexDirection: "row", alignItems: "center", paddingLeft: scaleSize(15),
            paddingRight: scaleSize(40), justifyContent: "space-between",
            marginBottom: scaleSize(13)
        }} >
            <View>
                <Text style={{
                    fontSize: scaleSize(14),
                    fontWeight: '600',
                }} >
                    {peripheral?.name || "No Name"}
                </Text>
                <Text style={{
                    fontSize: scaleSize(8),
                    fontWeight: '300',
                }} >
                    {peripheral?.id || ""}
                </Text>
            </View>

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
    cloverMachineInfo: state.hardware.cloverMachineInfo, 
    paymentMachineType: state.hardware.paymentMachineType,
})

export default connectRedux(mapStateToProps, AddDeviceHardware);

