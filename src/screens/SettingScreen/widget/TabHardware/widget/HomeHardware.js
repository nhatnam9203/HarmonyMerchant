import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform
} from 'react-native';

import { Button, Text } from '@components';
import { scaleSzie, localize, checkStatusPrint } from '@utils';
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
                    width: '100%', flexDirection: 'row', marginTop: scaleSzie(20),
                    // justifyContent: 'space-around',
                    paddingHorizontal: scaleSzie(10)
                }} >
                    {/* ------------- Box 1 ----------- */}
                    {/* <Button onPress={() => this.onPressBox('Barcode')} style={styles.box} >
                        <View style={styles.containerIconBox} >
                            <Image source={IMAGE.Barcode} style={{
                                width: scaleSzie(33),
                                height: scaleSzie(35)
                            }} />
                        </View>
                        <View style={styles.containerTextBox} >
                            <Text style={styles.textBox} >
                                Barcode scanner
                        </Text>
                            <Text style={[styles.textBox, { fontWeight: 'normal', fontSize: scaleSzie(11), marginTop: scaleSzie(10) }]} >
                                No device
                        </Text>
                        </View>
                    </Button> */}
                    {/* ------------- Box 2 ----------- */}
                    <Button onPress={() => this.onPressBox('Pax')} style={styles.box} >
                        <View style={styles.containerIconBox} >
                            <Image source={IMAGE.Pax} style={{
                                width: scaleSzie(25),
                                height: scaleSzie(35)
                            }} />
                        </View>
                        <View style={styles.containerTextBox} >
                            <Text style={styles.textBox} >

                                {localize('Payment terminal', language)}
                            </Text>
                            <Text style={[styles.textBox, { fontWeight: 'normal', fontSize: scaleSzie(11), marginTop: scaleSzie(10) }]} >
                                {temptTitle}
                            </Text>
                        </View>

                        {
                            paxMachineInfo.isSetup ? <Button onPress={this.deleteHardware} style={{
                                width: scaleSzie(20), height: scaleSzie(20),
                                position: "absolute", top: 5, right: 5,
                                borderRadius: scaleSzie(10), justifyContent: "center", alignItems: "center"
                            }} >
                                <Image source={IMAGE.deleteIconBanner}
                                    style={{ width: scaleSzie(10), height: scaleSzie(10) }}
                                />
                            </Button> : null
                        }

                    </Button>
                    {/* ------------- Box 3 ----------- */}
                    <Button onPress={() => this.onPressBox('Print')} style={[styles.box, { marginLeft: scaleSzie(20) }]} >
                        <View style={styles.containerIconBox} >
                            <Image source={IMAGE.Print} style={{
                                width: scaleSzie(28),
                                height: scaleSzie(35)
                            }} />
                        </View>
                        <View style={styles.containerTextBox} >
                            <Text style={styles.textBox} >
                                {'Receipt printer'}
                            </Text>
                            <Text style={[styles.textBox, { fontWeight: 'normal', fontSize: scaleSzie(11), marginTop: scaleSzie(10) }]} >
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
        height: scaleSzie(70),
        backgroundColor: '#fff',
        borderRadius: scaleSzie(4),
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
        paddingLeft: scaleSzie(14),
        paddingRight: scaleSzie(16),
        justifyContent: 'center'
    },
    containerTextBox: {
        paddingTop: scaleSzie(16),
    },
    textBox: {
        fontSize: scaleSzie(12),
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

