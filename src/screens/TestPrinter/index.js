import React from "react";
import _ from 'ramda';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    ScrollView,
    DeviceEventEmitter,
    NativeEventEmitter,
    Switch,
    TouchableOpacity,
    Dimensions,
    ToastAndroid
} from 'react-native';
import { BluetoothEscposPrinter, BluetoothManager, BluetoothTscPrinter } from "react-native-bluetooth-escpos-printer";
import { BleManager } from 'react-native-ble-plx';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import PrintManager from '@lib/PrintManager';

class TestPrinter extends Layout {

    _listeners = [];

    constructor(props) {
        super(props);
        this.state = {
            devices: null,
            pairedDs: [],
            foundDs: [],
            bleOpend: false,
            loading: true,
            boundAddress: '',
            debugMsg: ''
        };

        this.manager = new BleManager();

    }

    componentDidMount1() {
        const subscription = this.manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                this.scanAndConnect();
                subscription.remove();
            }
        }, true);
    }

    scanAndConnect() {

        this.manager.startDeviceScan(null, null, (error, device) => {

            if (error) {
                // Handle error (scanning will be stopped automatically)
                return
            }

            if (device.isConnectable) {
                device.connect()
                    .then((device) => {
                        return device.discoverAllServicesAndCharacteristics()
                    })
                    .then((device) => {
                        // Do work on device with services and characteristics
                        console.log("device : ", device);
                    })
                    .catch((error) => {
                        // Handle errors
                        console.log("error : ", error);
                    });
            }



            if (device.name === 'TI BLE Sensor Tag' || device.name === 'SensorTag') {
                this.manager.stopDeviceScan();
            }
        });
    }

    componentDidMount() {
        BluetoothManager.isBluetoothEnabled().then((enabled) => {
            this.setState({
                bleOpend: Boolean(enabled),
                loading: false
            })
        }, (err) => {
            err
        });

        if (Platform.OS === 'ios') {
            let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
            this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
                (rsp) => {
                    this._deviceAlreadPaired(rsp)
                }));
            this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, (rsp) => {
                this._deviceFoundEvent(rsp)
            }));
            this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
                this.setState({
                    name: '',
                    boundAddress: ''
                });
            }));
        } else if (Platform.OS === 'android') {
            // ----------- Android -----------
        }
    }
    _deviceAlreadPaired(rsp) {
        // console.log("_deviceAlreadPaired : ", JSON.stringify(rsp));
    }

    _deviceFoundEvent(rsp) {//alert(JSON.stringify(rsp))
        // console.log("_deviceFoundEvent : ", JSON.stringify(rsp));
    }


    _scan() {
        const address = "4D7F71B4-DB55-C3FA-CE3C-BFE5A3FFB494"
        // const address = "2C717017-9A84-A209-9911-7F47C382C1C1"
        // const address = "EABAAEFE-2CA6-9148-9821-9416F59DA00C"
        // const address = "ED5240B4-D338-F3D8-148B-5F646D2646FC"
        // const address = "5D9C575E-6BD8-C1BF-1937-DE2687F71E70"




        //  const address = "EABAAEFE-2CA6-9148-9821-9416F59DA00C"
        //  const address = "4AF0E2FF-671F-0524-711C-5FF52C8BF18"
        //  const address = "32C8B654-3375-C5FB-24C5-8B961BF9C9CC"
        //  const address = "74A8AC75-A765-94E0-A72A-6C6F8568BBC9"
        // const address = "BF3B8AF7-5D9B-E934-30FB-4892A960E97B"
        // const address = "AB53F0DA-E98C-25BD-45E8-CA5276F17A63"
        // const address = "5B1EE9A4-5ED4-C853-AF2C-EE765DE7415A"
        // const address = "E0D4BAE3-E3A2-1846-3BD0-D475E8C5D899"
        // const address = "A28797E7-BAEA-CACF-286D-68D73616C9C0"
        // const address = "31B0F1E5-C663-3C9F-CB5E-B023AA8ACE2B"
        BluetoothManager.connect(address)
            .then((s) => {
                   console.log("---- printing : ",s);
                   BluetoothEscposPrinter.printText("折扣后应收：64000.00\n\r",{});
            }, (e) => {
                console.log("error : ", e);
            })
    }

}

const mapStateToProps = state => ({
    packageAndPricingData: state.app.packageAndPricingData
});

export default connectRedux(mapStateToProps, TestPrinter);