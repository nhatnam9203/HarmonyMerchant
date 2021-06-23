import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform
} from 'react-native';

import { Button, Text } from '@components';
import { ScaleSzie, localize, checkStatusPrint } from '@utils';
import IMAGE from '@resources';
import connectRedux from '@redux/ConnectRedux';

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
        const { paxMachineInfo, language ,printerSelect} = this.props;
        const temptTitle = !paxMachineInfo.isSetup ? 'No Device' : paxMachineInfo.name;
        return (
            <View style={{ flex: 1 }} >
                <View style={{
                    width: '100%', flexDirection: 'row', marginTop: ScaleSzie(20),
                    // justifyContent: 'space-around',
                    paddingHorizontal: ScaleSzie(10)
                }} >
                    {/* ------------- Box 1 ----------- */}
                    {/* <Button onPress={() => this.onPressBox('Barcode')} style={styles.box} >
                        <View style={styles.containerIconBox} >
                            <Image source={IMAGE.Barcode} style={{
                                width: ScaleSzie(33),
                                height: ScaleSzie(35)
                            }} />
                        </View>
                        <View style={styles.containerTextBox} >
                            <Text style={styles.textBox} >
                                Barcode scanner
                        </Text>
                            <Text style={[styles.textBox, { fontWeight: 'normal', fontSize: ScaleSzie(11), marginTop: ScaleSzie(10) }]} >
                                No device
                        </Text>
                        </View>
                    </Button> */}
                    {/* ------------- Box 2 ----------- */}
                    <Button onPress={() => this.onPressBox('Pax')} style={styles.box} >
                        <View style={styles.containerIconBox} >
                            <Image source={IMAGE.Pax} style={{
                                width: ScaleSzie(25),
                                height: ScaleSzie(35)
                            }} />
                        </View>
                        <View style={styles.containerTextBox} >
                            <Text style={styles.textBox} >

                                {localize('Payment terminal', language)}
                            </Text>
                            <Text style={[styles.textBox, { fontWeight: 'normal', fontSize: ScaleSzie(11), marginTop: ScaleSzie(10) }]} >
                                {temptTitle}
                            </Text>
                        </View>

                        {
                            paxMachineInfo.isSetup ? <Button onPress={this.deleteHardware} style={{
                                width: ScaleSzie(20), height: ScaleSzie(20),
                                position: "absolute", top: 5, right: 5,
                                borderRadius: ScaleSzie(10), justifyContent: "center", alignItems: "center"
                            }} >
                                <Image source={IMAGE.deleteIconBanner}
                                    style={{ width: ScaleSzie(10), height: ScaleSzie(10) }}
                                />
                            </Button> : null
                        }

                    </Button>
                    {/* ------------- Box 3 ----------- */}
                    <Button onPress={() => this.onPressBox('Print')} style={[styles.box, { marginLeft: ScaleSzie(20) }]} >
                        <View style={styles.containerIconBox} >
                            <Image source={IMAGE.Print} style={{
                                width: ScaleSzie(28),
                                height: ScaleSzie(35)
                            }} />
                        </View>
                        <View style={styles.containerTextBox} >
                            <Text style={styles.textBox} >
                                {'Receipt printer'}
                            </Text>
                            <Text style={[styles.textBox, { fontWeight: 'normal', fontSize: ScaleSzie(11), marginTop: ScaleSzie(10) }]} >
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
        height: ScaleSzie(70),
        backgroundColor: '#fff',
        borderRadius: ScaleSzie(4),
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
        paddingLeft: ScaleSzie(14),
        paddingRight: ScaleSzie(16),
        justifyContent: 'center'
    },
    containerTextBox: {
        paddingTop: ScaleSzie(16),
    },
    textBox: {
        fontSize: ScaleSzie(12),
        fontWeight: '600',
        color: '#0764B0'
    }
})

const mapStateToProps = state => ({
    paxMachineInfo: state.hardware.paxMachineInfo,
    language: state.dataLocal.language,
    printerSelect: state.dataLocal.printerSelect
})

export default connectRedux(mapStateToProps, HomeHardware);

