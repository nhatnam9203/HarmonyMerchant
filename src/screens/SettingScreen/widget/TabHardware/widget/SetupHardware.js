import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform,
    TextInput,
    ScrollView,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

import { ButtonCustom, Text, Button } from '@components';
import { scaleSize, 
        localize,
        PaymentTerminalType,
        stringIsEmptyOrWhiteSpaces,
       } from '@utils';
import ICON from '@resources';
import connectRedux from '@redux/ConnectRedux';
import BluetoothScanner from "@lib/BluetoothScanner";
import _ from "lodash";

class SetupHardware extends React.Component {

    constructor(props) {
        super(props);
        const { paxMachineInfo, 
                cloverMachineInfo, 
                dejavooMachineInfo,
                paymentMachineType 
              } = this.props;
        const { commType, bluetoothAddr } = paxMachineInfo;
        let name = ""
        let ip = ""
        let port = ""
        let registerId = ""
        let authKey = ""
        if(paymentMachineType == PaymentTerminalType.Clover){

           name = _.get(cloverMachineInfo, 'name')
           ip = _.get(cloverMachineInfo, 'ip')
           port = _.get(cloverMachineInfo, 'port')

        } else if(paymentMachineType == PaymentTerminalType.Dejavoo){
           
            name = _.get(dejavooMachineInfo, 'name')
            registerId = _.get(dejavooMachineInfo, 'registerId')
            authKey = _.get(dejavooMachineInfo, 'authKey')

        } else{
            //Pax
            name = _.get(paxMachineInfo, 'name')
            ip = _.get(paxMachineInfo, 'ip')
            port = _.get(paxMachineInfo, 'port')
        }
        this.state = {
            commType: commType || "TCP",
            name,
            ip,
            port,
            timeout: 90000,
            bluetoothAddr,
            peripherals: [],
            scanLoading: false,
            terminalName: paymentMachineType,
            serialNumber: _.get(cloverMachineInfo, 'serialNumber', ''),
            registerId,
            authKey,
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
            this.scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true })
        }
    }

    setupPax = () => {
        const { name, ip, port, timeout, commType, 
            bluetoothAddr, terminalName, serialNumber, registerId, authKey } = this.state;
        // ------- Handle Bluetooth Comunication Type ------------

        if(terminalName == PaymentTerminalType.Pax){
            if (commType === "BLUETOOTH") {
                if (stringIsEmptyOrWhiteSpaces(name) 
                    || stringIsEmptyOrWhiteSpaces(bluetoothAddr)) {
                    alert('Please enter full infomation!');
                } else {
                    this.props.actions.hardware.setupPaxMachine({
                        paymentMachineInfo:{ commType, name, ip, port, timeout, bluetoothAddr, isSetup: true },
                        paymentMachineType: 'Pax'
                    });
                    this.props.backListDevices();
                }
            } else {
                if (stringIsEmptyOrWhiteSpaces(name) 
                    || stringIsEmptyOrWhiteSpaces(ip) 
                    || stringIsEmptyOrWhiteSpaces(port)) {
                    alert('Please enter full infomation!');
                } else {
                    this.props.actions.hardware.setupPaxMachine({
                        paymentMachineInfo: { commType, name, ip, port, timeout, bluetoothAddr, isSetup: true },
                        paymentMachineType: 'Pax'
                    });
                    this.props.backListDevices();
                };
            }
        } else if (terminalName == PaymentTerminalType.Dejavoo){
            if (stringIsEmptyOrWhiteSpaces(registerId) 
                ||stringIsEmptyOrWhiteSpaces(authKey) 
                || stringIsEmptyOrWhiteSpaces(name)) {
                alert('Please enter full infomation!');
            } else {
                this.props.actions.hardware.setupDejavooMachine({
                    paymentMachineInfo: { registerId, authKey, isSetup: true, name },
                    paymentMachineType: PaymentTerminalType.Dejavoo,
                });
                this.props.backListDevices();
            };
        } else{
            //Pax
            if (ip == '' || port == '' || serialNumber == '') {
                alert('Please enter full infomation!');
            } else {
                this.props.actions.hardware.setupCloverMachine({
                    paymentMachineInfo: { ip, port, isSetup: true, serialNumber },
                    paymentMachineType: PaymentTerminalType.Clover,
                });
                this.props.backListDevices();
            };
        }
        
    }

    cancelSetupPax = async () => {
        const { paxMachineInfo, 
            cloverMachineInfo, 
            dejavooMachineInfo,
            paymentMachineType 
          } = this.props;
        const { commType, bluetoothAddr } = paxMachineInfo;
        let name = ""
        let ip = ""
        let port = ""
        let registerId = ""
        let authKey = ""
        if(paymentMachineType == PaymentTerminalType.Clover){

            name = _.get(cloverMachineInfo, 'name')
            ip = _.get(cloverMachineInfo, 'ip')
            port = _.get(cloverMachineInfo, 'port')

        } else if(paymentMachineType == PaymentTerminalType.Dejavoo){
        
            name = _.get(dejavooMachineInfo, 'name')
            registerId = _.get(dejavooMachineInfo, 'registerId')
            authKey = _.get(dejavooMachineInfo, 'authKey')
        } else{
            //Pax
            name = _.get(paxMachineInfo, 'name')
            ip = _.get(paxMachineInfo, 'ip')
            port = _.get(paxMachineInfo, 'port')
        }

        this.setState({...this.state,
            commType: commType || "TCP",
            name,
            ip,
            port,
            timeout: _.get(paxMachineInfo, 'timeout'),
            bluetoothAddr,
            terminalName: paymentMachineType,
            serialNumber: _.get(cloverMachineInfo, 'serialNumber', ''),
            registerId,
            authKey,
        })

        this.props.backListDevices();
    }

    scrollTo = (number) => {
        this.scrollRef.current?.scrollTo({ x: 0, y: scaleSize(number), animated: true });
    }

    setCommType = (commType) => () => {
        this.setState({
            commType
        });

        if (commType === "BLUETOOTH") {
            this.scanDevices();
        }
    }

    setTerminal = (terminalName) => () => {
        if(terminalName != this.state.terminalName) {
            const { name, ip, port, registerId, authKey } = this.state;
            const { paxMachineInfo, cloverMachineInfo, dejavooMachineInfo } = this.props;
            let tempName = name 
            let tempIp = ip
            let tempPort = port
            let tempRegisterId = registerId
            let tempAuthKey = authKey
            if (terminalName == PaymentTerminalType.Pax) {
                tempName = _.get(paxMachineInfo, 'name')
                tempIp = _.get(paxMachineInfo, 'ip')
                tempPort = _.get(paxMachineInfo, 'port')
            } else if (terminalName == PaymentTerminalType.Dejavoo) {
                tempName = _.get(dejavooMachineInfo, 'name')
                tempRegisterId = _.get(dejavooMachineInfo, 'registerId')
                tempAuthKey = _.get(dejavooMachineInfo, 'authKey')
            } else {
                //Clover
                tempName = _.get(cloverMachineInfo, 'name')
                tempIp = _.get(cloverMachineInfo, 'ip')
                tempPort = _.get(cloverMachineInfo, 'port')
            }
            this.setState({
                terminalName,
                name: tempName,
                ip: tempIp,
                port: tempPort,
                serialNumber: _.get(cloverMachineInfo, 'serialNumber', ''),
                registerId: tempRegisterId,
                authKey: tempAuthKey,
            });
        }
    }

    async scanDevices() {
        // this.props.actions.app.loadingApp();
        await this.setState({
            peripherals: [],
            scanLoading: true
        });
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                return
            }

            if (device?.localName) {
                const tempPeripherals = [...this.state.peripherals];
                tempPeripherals.push({
                    id: device?.id || "",
                    name: device?.name || "",
                    localName: device?.localName || ""
                });
                this.setState({
                    peripherals: tempPeripherals
                });

            }
        });

        // this.props.actions.app.loadingApp();
        // this.bluetoothScannerRef.current?.startScan();

        setTimeout(() => {
            // this.props.actions.app.stopLoadingApp();
            // this.manager.stopDeviceScan();
            // this.props.actions.app.stopLoadingApp();
            this.setState({
                scanLoading: false
            });
        }, 20000);
    }

    stopDeviceScan = () => {
        this.manager?.stopDeviceScan();
        this.setState({
            scanLoading: false
        });
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
        const { language, bluetoothPaxInfo, dataLocal } = this.props;
        const { name, ip, port, timeout, commType, 
                terminalName, serialNumber, registerId, authKey } = this.state;

        const tempCheckEthernetIcon = commType === "TCP" ? ICON.radioExportSe : ICON.radioExport;
        const tempCheckBluetoothIcon = commType === "BLUETOOTH" ? ICON.radioExportSe : ICON.radioExport;
        const tempCheckPax = terminalName === PaymentTerminalType.Pax ? ICON.radioExportSe : ICON.radioExport;
        const tempCheckClover = terminalName === PaymentTerminalType.Clover ? ICON.radioExportSe : ICON.radioExport;
        const tempCheckDejavoo = terminalName === PaymentTerminalType.Dejavoo ? ICON.radioExportSe : ICON.radioExport;
        
        let placeHolderPort = "10009"
        if(terminalName === PaymentTerminalType.Clover){
            placeHolderPort = "12345"
        }else if(terminalName === PaymentTerminalType.Dejavoo){
            placeHolderPort = "8443"
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
                    marginTop: scaleSize(26),
                    marginBottom: scaleSize(10)
                }} >
                    {localize('Device', language)}
                </Text>
                <View style={{flexDirection:'row'}}>
                    <Button onPress={this.setTerminal("Pax")} style={{ flexDirection: "row", marginRight: scaleSize(40) }} >
                        <Image
                            source={tempCheckPax}
                            style={{ marginRight: scaleSize(10) }}
                        />
                        <Text style={{ fontSize: scaleSize(15), color: 'rgb(42,42,42)', fontWeight: "600" }} >
                            {localize('Pax', language)}
                        </Text>
                    </Button>

                    <Button onPress={this.setTerminal("Clover")} style={{ flexDirection: "row", marginRight: scaleSize(40) }} >
                        <Image
                            source={tempCheckClover}
                            style={{ marginRight: scaleSize(10) }}
                        />
                        <Text style={{ fontSize: scaleSize(15), color: 'rgb(42,42,42)', fontWeight: "600" }} >
                            {localize('Clover', language)}
                        </Text>
                    </Button>

                    {_.get(dataLocal, "profile.type") == Constants.APP_TYPE.POS &&
                        <Button onPress={this.setTerminal(PaymentTerminalType.Dejavoo)} style={{ flexDirection: "row" }} >
                            <Image
                                source={tempCheckDejavoo}
                                style={{ marginRight: scaleSize(10) }}
                            />
                            <Text style={{ fontSize: scaleSize(15), color: 'rgb(42,42,42)', fontWeight: "600" }} >
                                {localize('Dejavoo', language)}
                            </Text>
                        </Button>
                    }

                </View>

                <Text style={{
                    fontSize: scaleSize(16),
                    fontWeight: '600',
                    color: 'rgb(81,81,81)',
                    marginTop: scaleSize(26),
                    marginBottom: scaleSize(10)
                }} >

                    {localize('Terminal Configuration', language)}
                </Text>

                {/* ----------- Line ------------ */}
                <View style={{ height: scaleSize(1), backgroundColor: 'rgb(227,227,227)', }} />
                <ScrollView
                    ref={this.scrollRef}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                >
                    {/* --------------- Communication Type ----------------- */}
                    {
                        terminalName === "Pax" &&
                        <View style={{ flexDirection: 'row', marginTop: scaleSize(20), }} >
                            <View style={{ width: scaleSize(140), justifyContent: 'center', }} >
                                <Text style={{ fontSize: scaleSize(13), color: 'rgb(42,42,42)' }} >
                                    {`Communication Type`}
                                </Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", paddingHorizontal: scaleSize(20) }} >
                                <View style={{ flex: 1, }} >
                                    <Button onPress={this.setCommType("TCP")} style={{ flexDirection: "row" }} >
                                        <Image
                                            source={tempCheckEthernetIcon}
                                            style={{ marginRight: scaleSize(10) }}
                                        />
                                        <Text style={{ fontSize: scaleSize(15), color: 'rgb(42,42,42)', fontWeight: "600" }} >
                                            {`Ethernet`}
                                        </Text>
                                    </Button>
                                </View>
                                <View style={{ flex: 1, flexDirection: "row" }} >
                                    <Button onPress={this.setCommType("BLUETOOTH")} style={{ flexDirection: "row" }} >
                                        <Image
                                            source={tempCheckBluetoothIcon}
                                            style={{ marginRight: scaleSize(10) }}
                                        />
                                        <Text style={{ fontSize: scaleSize(15), color: 'rgb(42,42,42)', fontWeight: "600" }} >
                                            {`Bluetooth`}
                                        </Text>
                                    </Button>
                                </View>

                            </View>
                        </View>
                    }

                    {
                        (terminalName === PaymentTerminalType.Pax 
                        || terminalName === PaymentTerminalType.Dejavoo)
                        &&
                        <ItemSetup
                            title={localize('Name', language)}
                            placeholder={localize('Device name', language)}
                            value={name}
                            onChangeText={name => this.setState({ name })}
                        />
                    }

                    {
                        terminalName === PaymentTerminalType.Clover &&
                        <ItemSetup
                            title={localize('Serial Number', language)}
                            placeholder={localize('Serial Number', language)}
                            value={serialNumber}
                            onChangeText={serialNumber => this.setState({ serialNumber })}
                        />
                    }

                    {
                        terminalName === PaymentTerminalType.Dejavoo && <>
                            <ItemSetup
                                title={localize('Register ID', language)}
                                placeholder={localize('Register ID', language)}
                                value={registerId}
                                onChangeText={registerId => this.setState({ registerId })}
                            />
                            <ItemSetup
                                title={localize('Auth Key', language)}
                                placeholder={localize('Auth Key', language)}
                                value={authKey}
                                onChangeText={authKey => this.setState({ authKey })}
                          />
                        </>
                    }

                    {
                        (commType === "TCP" && terminalName === PaymentTerminalType.Pax) 
                        || terminalName === PaymentTerminalType.Clover ? <>
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
                                placeholder={placeHolderPort}
                                value={port}
                                onChangeText={port => this.setState({ port })}
                                keyboardType="numeric"
                                onFocus={() => this.scrollTo(120)}
                            />
                        </> : null
                    }

                    {
                        commType === "BLUETOOTH" && terminalName === "Pax" ? <ItemSetup
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
                        commType === "BLUETOOTH" && terminalName === "Pax" ?
                            <>
                                <Button onPress={this.scanDevices} style={{
                                    flexDirection: 'row', alignItems: 'center', width: scaleSize(120),
                                    marginTop: scaleSize(20), marginLeft: scaleSize(15)
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
                                        fontSize: scaleSize(14),
                                        color: '#0764B0',
                                        marginLeft: scaleSize(8), fontWeight: "600"
                                    }} >

                                        {localize('Scan devices', language)}
                                    </Text>
                                    <View style={{width: scaleSize(15)}} />
                                    {
                                        this.state.scanLoading && <ActivityIndicator size="small" color="#0000ff" />
                                    }

                                </Button>

                                {/* ------------- Bluetooth devices list ----------- */}
                                <View style={{ marginTop: scaleSize(15) }} >
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



                    <View style={{ height: scaleSize(400) }} />
                </ScrollView>
                {/* ------- Footer -------- */}
                <View style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'flex-end', paddingBottom: scaleSize(30) }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                        <ButtonCustom
                            width={scaleSize(130)}
                            height={50}
                            backgroundColor="#F1F1F1"
                            title={localize('CANCEL', language)}
                            textColor="#6A6A6A"
                            onPress={this.cancelSetupPax}
                            style={{ borderWidth: 2, borderColor: 'rgb(227,227,227)', borderRadius: 2, }}
                            styleText={{ fontSize: scaleSize(20), fontWeight: '500' }}
                        />
                        <View style={{ width: scaleSize(100) }} />
                        <ButtonCustom
                            width={scaleSize(130)}
                            height={50}
                            backgroundColor="#0764B0"
                            title={localize('SAVE', language)}
                            textColor="#fff"
                            onPress={this.setupPax}
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
        this.keyboardWillHide?.remove();
        this.manager = null
    }

}


const ItemSetup = ({ title, value, placeholder, onChangeText, keyboardType, onFocus, editable, style }) => {
    return (
        <View style={[{ flexDirection: 'row', marginTop: scaleSize(20), }]} >
            <View style={{ width: scaleSize(140), justifyContent: 'center', }} >
                <Text style={{ fontSize: scaleSize(13), color: 'rgb(42,42,42)' }} >
                    {title}
                </Text>
            </View>
            <View style={[{ flex: 1, },]} >
                <View style={[{
                    height: scaleSize(35), width: '85%', borderColor: 'rgb(227,227,227)',
                    borderWidth: scaleSize(1), paddingHorizontal: scaleSize(10)
                }, style]} >
                    <TextInput
                        style={{ flex: 1, fontSize: scaleSize(14) }}
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
    cloverMachineInfo: state.hardware.cloverMachineInfo,
    dejavooMachineInfo: state.hardware.dejavooMachineInfo,
    paymentMachineType: state.hardware.paymentMachineType,
    language: state.dataLocal.language,
    bluetoothPaxInfo: state.dataLocal.bluetoothPaxInfo,
    dataLocal: state.dataLocal,
})

export default connectRedux(mapStateToProps, SetupHardware);


