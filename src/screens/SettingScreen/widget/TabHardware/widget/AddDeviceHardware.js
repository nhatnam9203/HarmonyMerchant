import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform
} from 'react-native';

import { Button, Text, ButtonCustom } from '@components';
import { scaleSzie, localize } from '@utils';
import IMAGE from '@resources';
import connectRedux from '@redux/ConnectRedux';
import BluetoothScanner from "@lib/BluetoothScanner";
import { ScrollView } from 'react-native-gesture-handler';

class AddDeviceHardware extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            bluetoothDevices: []
        }
        this.bluetoothScannerRef = React.createRef();
    }

    addDevice = () => {
        this.props.actions.app.loadingApp();
        this.bluetoothScannerRef.current.startScan();

        setTimeout(() => {
            this.props.actions.app.stopLoadingApp();
        }, 10000);

        // this.props.gotoSetupDevice();
    }

    backHomeHardware = () => {
        this.props.backHomeHardware();
    }

    handleStopScan = (list) => {
        console.log("------ list ------: ", list.length);
        this.props.actions.app.stopLoadingApp();
        this.setState({
            bluetoothDevices: list
        });
    }

    // -------- Render ------

    renderNoConnected() {
        const { language } = this.props;

        return (
            <View style={{ marginBottom: scaleSzie(10) }} >
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
        const { paxMachineInfo, language } = this.props;
        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(14), paddingTop: scaleSzie(20) }} >
                <Text style={{
                    fontSize: scaleSzie(16),
                    fontWeight: '600',
                    color: '#0764B0'
                }} >

                    {localize('Payment Terminal', language)}
                </Text>

                <Text style={{
                    fontSize: scaleSzie(16),
                    fontWeight: '600',
                    color: 'rgb(81,81,81)',
                    marginTop: scaleSzie(26)
                }} >

                    {localize('Connected Device', language)}
                </Text>
                {!paxMachineInfo.isSetup ? this.renderNoConnected() : this.renderConnected()}

                {/* ------------- Bluetooth devices list ----------- */}
                <View style={{ flex: 1, }} >
                    <ScrollView>
                        {
                            this.state.bluetoothDevices.map((device, index) => <ItemBluetooth
                                key={`${device?.id}_${index}`}
                                bluetooth={device}
                            />)
                        }
                    </ScrollView>
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

                <BluetoothScanner
                    ref={this.bluetoothScannerRef}
                    handleStopScan={this.handleStopScan}
                />
            </View>
        );
    }
}

const ItemBluetoothConnect = ({ title, isSelect, onPress }) => {
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

const ItemBluetooth = ({ bluetooth, isConnected, onPress }) => {

    return (
        <Button onPress={() => onPress(modelName)} style={{
            height: scaleSzie(45), backgroundColor: "rgb(250,250,250)", borderRadius: 6,
            flexDirection: "row", alignItems: "center", paddingLeft: scaleSzie(15),
            paddingRight: scaleSzie(40), justifyContent: "space-between",
            marginBottom: scaleSzie(13)
        }} >
            <View>
                <Text style={{
                    fontSize: scaleSzie(14),
                    fontWeight: '600',
                }} >
                    {bluetooth?.name || "No Name"}
                </Text>
                <Text style={{
                    fontSize: scaleSzie(8),
                    fontWeight: '300',
                }} >
                    {bluetooth?.id || ""}
                </Text>
            </View>

            <Text style={{
                fontSize: scaleSzie(12),
                fontWeight: '600',
                color: '#0764B0',
            }} >
                {`${isConnected ? "Connected" : ""}`}
            </Text>
        </Button>
    );
}

const mapStateToProps = state => ({
    paxMachineInfo: state.dataLocal.paxMachineInfo,
    language: state.dataLocal.language,
})

export default connectRedux(mapStateToProps, AddDeviceHardware);

