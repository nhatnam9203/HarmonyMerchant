import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    NativeEventEmitter,
    NativeModules,
    Platform,
    PermissionsAndroid,
    Dimensions,
} from 'react-native';
import BleManager from 'react-native-ble-manager';

const window = Dimensions.get('window');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scanning: false,
            peripherals: new Map(),
        }

        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
    }

    componentDidMount() {
        BleManager.start({ showAlert: false });
        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }

    }

    handleStopScan() {
        const list = Array.from(this.state.peripherals.values());
        console.log("------ handleStopScan ------- : ",list);
        this.setState({ scanning: false });
    }

    startScan() {
        console.log("------ startScan -------");
        if (!this.state.scanning) {
            BleManager.scan([], 3, true).then((results) => {
                console.log('Scanning...');
                this.setState({ scanning: true });
            });
        }
    }



    async handleDiscoverPeripheral(peripheral) {
        console.log("------ handleDiscoverPeripheral -------");
        var peripherals = this.state.peripherals;
        if (peripheral?.name && peripheral?.id) {
            // console.log('Got ble peripheral: ', JSON.stringify(peripheral)); 
            peripherals.set(peripheral.id, peripheral);
            await this.setState({ peripherals });
        }
    }


    render() {
        return null;
    }

    componentWillUnmount() {
        this.handlerDiscover.remove();
        this.handlerStop.remove();
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        width: window.width,
        height: window.height
    },
    scroll: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        margin: 10,
    },
    row: {
        margin: 10
    },
});