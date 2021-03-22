import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform,
    TextInput,
    ScrollView,
    Keyboard
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

import { ButtonCustom, Text, Button } from '@components';
import { scaleSzie, localize } from '@utils';
import ICON from '@resources';
import connectRedux from '@redux/ConnectRedux';
import BluetoothScanner from "@lib/BluetoothScanner";

class SetupHardware extends React.Component {

    constructor(props) {
        super(props);
        const { paxMachineInfo } = this.props;
        const { name, ip, port, timeout, commType, bluetoothAddr } = paxMachineInfo;
        this.state = {
            commType: commType || "TCP",
            name,
            ip,
            port,
            timeout: 90000,
            bluetoothAddr,
            peripherals: []
        };

        this.scrollRef = React.createRef();
        this.bluetoothScannerRef = React.createRef();

        this.setCommType = this.setCommType.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
        this.scanDevices = this.scanDevices.bind(this);
        this.handleSelectPeripheral = this.handleSelectPeripheral.bind(this);

        this.manager = new BleManager();
    }

    componentDidMount() {
        this.keyboardWillHide = Keyboard.addListener('keyboardWillHide', this.handleKeyboardWillHide);
    }

    handleKeyboardWillHide = async () => {
        if (this.scrollRef.current) {
            this.scrollRef.current.scrollTo({ x: 0, y: 0, animated: true })
        }
    }

    setupPax = () => {
        const { name, ip, port, timeout, commType, bluetoothAddr } = this.state;
        // ------- Handle Bluetooth Comunication Type ------------

        if (commType === "BLUETOOTH") {
            if (name === "" || bluetoothAddr === "") {
                alert('Please enter full infomation!');
            } else {
                this.props.actions.hardware.setupPaxMachine({ commType, name, ip, port, timeout, bluetoothAddr, isSetup: true });
                this.props.backListDevices();
            }
        } else {
            if (name == '' || ip == '' || port == '' || timeout == '') {
                alert('Please enter full infomation!');
            } else {
                this.props.actions.hardware.setupPaxMachine({ commType, name, ip, port, timeout, bluetoothAddr, isSetup: true });
                this.props.backListDevices();
            };
        }
    }

    cancelSetupPax = async () => {
        const { paxMachineInfo } = this.props;
        const { name, ip, port, timeout, commType, bluetoothAddr } = paxMachineInfo;
        await this.setState({
            name,
            ip,
            port,
            timeout,
            commType,
            bluetoothAddr
        });

        this.props.backListDevices();
    }

    scrollTo = (number) => {
        this.scrollRef.current.scrollTo({ x: 0, y: scaleSzie(number), animated: true });
    }

    setCommType = (commType) => () => {
        this.setState({
            commType
        });

        if (commType === "BLUETOOTH") {
            this.scanDevices();
        }
    }

    async scanDevices() {
        this.props.actions.app.loadingApp();
        await this.setState({
            peripherals: []
        });
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                return
            }

            if (device?.localName && device?.localName.includes("80")) {
                const tempPeripherals = [...this.state.peripherals];
                tempPeripherals.push({
                    id: device?.id || "",
                    name: device?.name || "",
                    localName: device?.localName || ""
                });
                this.setState({
                    peripherals: tempPeripherals
                });
                this.manager.stopDeviceScan();
                this.props.actions.app.stopLoadingApp();
            }
        });


        // this.props.actions.app.loadingApp();
        // this.bluetoothScannerRef.current.startScan();

        setTimeout(() => {
            this.props.actions.app.stopLoadingApp();
        }, 10000);
    }

    handleStopScan = (list) => {
        this.props.actions.app.stopLoadingApp();
        this.setState({
            peripherals: list
        });
    }

    handleSelectPeripheral = (peripheral) => () => {
        this.props.actions.dataLocal.saveBluetoothPaxInfo(peripheral);
        this.setState({
            name: peripheral?.name || "",
            bluetoothAddr: peripheral?.id || ""
        })
    }

    // -------- Render ------

    render() {
        const { language, bluetoothPaxInfo } = this.props;
        const { name, ip, port, timeout, commType } = this.state;

        const tempCheckEthernetIcon = commType === "TCP" ? ICON.radioExportSe : ICON.radioExport;
        const tempCheckBluetoothIcon = commType === "BLUETOOTH" ? ICON.radioExportSe : ICON.radioExport;

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
                    marginTop: scaleSzie(26),
                    marginBottom: scaleSzie(10)
                }} >

                    {localize('Terminal Configuration', language)}
                </Text>

                {/* ----------- Line ------------ */}
                <View style={{ height: scaleSzie(1), backgroundColor: 'rgb(227,227,227)', }} />
                <ScrollView
                    ref={this.scrollRef}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                >
                    {/* --------------- Communication Type ----------------- */}
                    <View style={{ flexDirection: 'row', marginTop: scaleSzie(20), }} >
                        <View style={{ width: scaleSzie(140), justifyContent: 'center', }} >
                            <Text style={{ fontSize: scaleSzie(13), color: 'rgb(42,42,42)' }} >
                                {`Communication Type`}
                            </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", paddingHorizontal: scaleSzie(20) }} >
                            <View style={{ flex: 1, }} >
                                <Button onPress={this.setCommType("TCP")} style={{ flexDirection: "row" }} >
                                    <Image
                                        source={tempCheckEthernetIcon}
                                        style={{ marginRight: scaleSzie(10) }}
                                    />
                                    <Text style={{ fontSize: scaleSzie(15), color: 'rgb(42,42,42)', fontWeight: "600" }} >
                                        {`Ethernet`}
                                    </Text>
                                </Button>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row" }} >
                                <Button onPress={this.setCommType("BLUETOOTH")} style={{ flexDirection: "row" }} >
                                    <Image
                                        source={tempCheckBluetoothIcon}
                                        style={{ marginRight: scaleSzie(10) }}
                                    />
                                    <Text style={{ fontSize: scaleSzie(15), color: 'rgb(42,42,42)', fontWeight: "600" }} >
                                        {`Bluetooth`}
                                    </Text>
                                </Button>
                            </View>

                        </View>
                    </View>

                    <ItemSetup
                        title={localize('Name', language)}
                        placeholder={localize('Device name', language)}
                        value={name}
                        onChangeText={name => this.setState({ name })}
                    />

                    {
                        commType === "TCP" ? <>
                            <ItemSetup
                                title={localize('IP Address', language)}
                                placeholder={"192.168.1.1"}
                                value={ip}
                                onChangeText={ip => this.setState({ ip })}
                                keyboardType="numeric"
                                onFocus={() => this.scrollTo(70)}
                            />

                            <ItemSetup
                                title={localize('Port', language)}
                                placeholder={"10009"}
                                value={port}
                                onChangeText={port => this.setState({ port })}
                                keyboardType="numeric"
                                onFocus={() => this.scrollTo(120)}
                            />
                        </> : null
                    }

                    {
                        commType === "BLUETOOTH" ? <ItemSetup
                            title={localize('Bluetooth ID', language)}
                            placeholder={"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"}
                            value={bluetoothPaxInfo?.id || ""}
                            onChangeText={ip => this.setState({ ip })}
                            keyboardType="numeric"
                            onFocus={() => this.scrollTo(70)}
                            editable={false}
                            style={{ backgroundColor: "rgb(250,250,250)" }}
                        /> : null
                    }

                    {
                        commType === "BLUETOOTH" ?
                            <>
                                <Button onPress={this.scanDevices} style={{
                                    flexDirection: 'row', alignItems: 'center', width: scaleSzie(120),
                                    marginTop: scaleSzie(20), marginLeft: scaleSzie(15)
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
                                        fontSize: scaleSzie(14),
                                        color: '#0764B0',
                                        marginLeft: scaleSzie(8), fontWeight: "600"
                                    }} >

                                        {localize('Scan devices', language)}
                                    </Text>
                                </Button>

                                {/* ------------- Bluetooth devices list ----------- */}
                                <View style={{ marginTop: scaleSzie(15) }} >
                                    <ScrollView>
                                        {
                                            this.state.peripherals.map((peripheral, index) => <ItemBluetooth
                                                key={`${peripheral?.id}_${index}`}
                                                peripheral={peripheral}
                                                onPress={this.handleSelectPeripheral(peripheral)}
                                                bluetoothPaxInfo={bluetoothPaxInfo}
                                            />)
                                        }
                                    </ScrollView>
                                </View>

                            </>
                            : null
                    }



                    <View style={{ height: scaleSzie(400) }} />
                </ScrollView>
                {/* ------- Footer -------- */}
                <View style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'flex-end', paddingBottom: scaleSzie(30) }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                        <ButtonCustom
                            width={scaleSzie(130)}
                            height={50}
                            backgroundColor="#F1F1F1"
                            title={localize('CANCEL', language)}
                            textColor="#6A6A6A"
                            onPress={this.cancelSetupPax}
                            style={{ borderWidth: 2, borderColor: 'rgb(227,227,227)', borderRadius: 2, }}
                            styleText={{ fontSize: scaleSzie(20), fontWeight: '500' }}
                        />
                        <View style={{ width: scaleSzie(100) }} />
                        <ButtonCustom
                            width={scaleSzie(130)}
                            height={50}
                            backgroundColor="#0764B0"
                            title={localize('SAVE', language)}
                            textColor="#fff"
                            onPress={this.setupPax}
                            style={{ borderWidth: 2, borderColor: 'rgb(227,227,227)', borderRadius: 2, }}
                            styleText={{ fontSize: scaleSzie(20), fontWeight: '500' }}
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
        this.keyboardWillHide?.remove();
        this.manager = null
    }

}


const ItemSetup = ({ title, value, placeholder, onChangeText, keyboardType, onFocus, editable, style }) => {
    return (
        <View style={[{ flexDirection: 'row', marginTop: scaleSzie(20), }]} >
            <View style={{ width: scaleSzie(140), justifyContent: 'center', }} >
                <Text style={{ fontSize: scaleSzie(13), color: 'rgb(42,42,42)' }} >
                    {title}
                </Text>
            </View>
            <View style={[{ flex: 1, },]} >
                <View style={[{
                    height: scaleSzie(35), width: '85%', borderColor: 'rgb(227,227,227)',
                    borderWidth: scaleSzie(1), paddingHorizontal: scaleSzie(10)
                }, style]} >
                    <TextInput
                        style={{ flex: 1, fontSize: scaleSzie(14) }}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={(value) => onChangeText(value)}
                        keyboardType={keyboardType}
                        onFocus={() => onFocus && onFocus()}
                        editable={editable}
                    />
                </View>
            </View>
        </View>
    );

}

const ItemBluetooth = ({ peripheral, bluetoothPaxInfo, onPress }) => {

    const isConnected = peripheral?.id && peripheral?.id === bluetoothPaxInfo?.id ? true : false;

    return (
        <Button onPress={() => onPress(peripheral)} style={{
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
                    {peripheral?.name || "No Name"}
                </Text>
                <Text style={{
                    fontSize: scaleSzie(8),
                    fontWeight: '300',
                }} >
                    {peripheral?.id || ""}
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
    paxMachineInfo: state.hardware.paxMachineInfo,
    language: state.dataLocal.language,
    bluetoothPaxInfo: state.dataLocal.bluetoothPaxInfo
})

export default connectRedux(mapStateToProps, SetupHardware);

