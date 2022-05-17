import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform
} from 'react-native';

import { Button, Text } from '@components';
import { scaleSize, localize, checkStatusPrint,
        PaymentTerminalType } from '@utils';
import IMAGE from '@resources';
import connectRedux from '@redux/ConnectRedux';
import _ from "lodash";

class HomeHardware extends React.Component {

    onPressBox = async (type) => {
        if (type === 'Pax') {
            this.props.gotoListDevices(type);
        } else {
            this.props.goToPrinterList();
        }

    }

    deleteHardware = () => {
        this.props.actions.dataLocal.deleteHardware();
    }

    // -------- Render ------

    render() {
        const { paxMachineInfo, 
            cloverMachineInfo, 
            dejavooMachineInfo,
            paymentMachineType, 
            language,
            printerSelect} = this.props;
        let temptTitle = 'No Device'
        let isSetup =  false
        if (paymentMachineType == PaymentTerminalType.Pax){
            temptTitle = !_.get(paxMachineInfo, 'isSetup') ? 'No Device' : paxMachineInfo.name;
            isSetup = _.get(paxMachineInfo, 'isSetup')
        }else if (paymentMachineType == PaymentTerminalType.Clover){
            temptTitle = !_.get(cloverMachineInfo, 'isSetup') ? 'No Device' : cloverMachineInfo.name;
            isSetup = _.get(cloverMachineInfo, 'isSetup')
        } else{
            temptTitle = !_.get(dejavooMachineInfo, 'isSetup') ? 'No Device' : dejavooMachineInfo.name;
            isSetup = _.get(dejavooMachineInfo, 'isSetup')
        }
        
        return (
            <View style={{ flex: 1 }} >
                <View style={{
                    width: '100%', flexDirection: 'row', marginTop: scaleSize(20),
                    // justifyContent: 'space-around',
                    paddingHorizontal: scaleSize(10)
                }} >
                    {/* ------------- Box 2 ----------- */}
                    <Button onPress={() => this.onPressBox('Pax')} style={styles.box} >
                        <View style={styles.containerIconBox} >
                            <Image source={IMAGE.Pax} style={{
                                width: scaleSize(25),
                                height: scaleSize(35)
                            }} />
                        </View>
                        <View style={styles.containerTextBox} >
                            <Text style={styles.textBox} >

                                {localize('Payment terminal', language)}
                            </Text>
                            <Text style={[styles.textBox, { fontWeight: 'normal', fontSize: scaleSize(11), marginTop: scaleSize(10) }]} >
                                {temptTitle}
                            </Text>
                        </View>

                        {
                            isSetup ? <Button onPress={this.deleteHardware} style={{
                                width: scaleSize(20), height: scaleSize(20),
                                position: "absolute", top: 5, right: 5,
                                borderRadius: scaleSize(10), justifyContent: "center", alignItems: "center"
                            }} >
                                <Image source={IMAGE.deleteIconBanner}
                                    style={{ width: scaleSize(10), height: scaleSize(10) }}
                                />
                            </Button> : null
                        }

                    </Button>
                    {/* ------------- Box 3 ----------- */}
                    <Button onPress={() => this.onPressBox('Print')} style={[styles.box, { marginLeft: scaleSize(20) }]} >
                        <View style={styles.containerIconBox} >
                            <Image source={IMAGE.Print} style={{
                                width: scaleSize(28),
                                height: scaleSize(35)
                            }} />
                        </View>
                        <View style={styles.containerTextBox} >
                            <Text style={styles.textBox} >
                                {'Receipt printer'}
                            </Text>
                            <Text style={[styles.textBox, { fontWeight: 'normal', fontSize: scaleSize(11), marginTop: scaleSize(10) }]} >
                                {`${printerSelect === "" ? "No device" : printerSelect}`}
                            </Text>
                        </View>
                    </Button>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
        width: '31%',
        height: scaleSize(70),
        backgroundColor: '#fff',
        borderRadius: scaleSize(4),
        ...Platform.select({
            ios: {
                shadowRadius: 2,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOpacity: 0.54,
                shadowOffset: { width: 0, height: 0 },
            },

            android: {
                elevation: 2,
            },
        }),

    },
    containerIconBox: {
        paddingLeft: scaleSize(14),
        paddingRight: scaleSize(16),
        justifyContent: 'center'
    },
    containerTextBox: {
        paddingTop: scaleSize(16),
    },
    textBox: {
        fontSize: scaleSize(12),
        fontWeight: '600',
        color: '#0764B0'
    }
})

const mapStateToProps = state => ({
    paxMachineInfo: state.hardware.paxMachineInfo,
    language: state.dataLocal.language,
    printerSelect: state.dataLocal.printerSelect,
    cloverMachineInfo: state.hardware.cloverMachineInfo, 
    paymentMachineType: state.hardware.paymentMachineType,
    dejavooMachineInfo: state.hardware.dejavooMachineInfo, 
})

export default connectRedux(mapStateToProps, HomeHardware);

