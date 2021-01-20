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

import { ButtonCustom, Text, Button } from '@components';
import { scaleSzie, localize } from '@utils';
import ICON from '@resources';
import connectRedux from '@redux/ConnectRedux';

class SetupHardware extends React.Component {

    constructor(props) {
        super(props);
        const { paxMachineInfo } = this.props;
        const { name, ip, port, timeout } = paxMachineInfo;
        this.state = {
            commType: "TCP",
            name,
            ip,
            port,
            timeout: 60000
        };
        this.scrollRef = React.createRef();
        this.setCommType = this.setCommType.bind(this);
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
        const { name, ip, port, timeout } = this.state;
        if (name == '' || ip == '' || port == '' || timeout == '') {
            alert('Please enter full infomation!');
        } else {
            this.props.actions.dataLocal.setupPaxMachine({ name, ip, port, timeout, isSetup: true });
            this.props.backListDevices();
        };
    }

    cancelSetupPax = async () => {
        const { paxMachineInfo } = this.props;
        const { name, ip, port, timeout } = paxMachineInfo;
        await this.setState({
            name,
            ip,
            port,
            timeout,
        });

        this.props.backListDevices();
    }

    scrollTo = (number) => {
        this.scrollRef.current.scrollTo({ x: 0, y: scaleSzie(number), animated: true });
    }

    setCommType = (commType) => () => {
        this.setState({
            commType
        })
    }

    // -------- Render ------

    render() {
        const { language } = this.props;
        const { name, ip, port, timeout, commType } = this.state;

        const tempCheckEthernetIcon = commType === "TCP" ? ICON.radioExportSe : ICON.radioExport;
        const tempCheckBluetoothIcon = commType === "Bluetooth" ? ICON.radioExportSe : ICON.radioExport;

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
                                <Button onPress={this.setCommType("Bluetooth")} style={{ flexDirection: "row" }} >
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
            </View>
        );

    }

    componentWillUnmount() {
        this.keyboardWillHide.remove();
    }

}


const ItemSetup = ({ title, value, placeholder, onChangeText, keyboardType, onFocus }) => {
    return (
        <View style={{ flexDirection: 'row', marginTop: scaleSzie(20), }} >
            <View style={{ width: scaleSzie(140), justifyContent: 'center', }} >
                <Text style={{ fontSize: scaleSzie(13), color: 'rgb(42,42,42)' }} >
                    {title}
                </Text>
            </View>
            <View style={{ flex: 1, }} >
                <View style={{
                    height: scaleSzie(35), width: '85%', borderColor: 'rgb(227,227,227)',
                    borderWidth: scaleSzie(1), paddingHorizontal: scaleSzie(10)
                }} >
                    <TextInput
                        style={{ flex: 1, fontSize: scaleSzie(14) }}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={(value) => onChangeText(value)}
                        keyboardType={keyboardType}
                        onFocus={() => onFocus && onFocus()}
                    />
                </View>
            </View>
        </View>
    );

}


const mapStateToProps = state => ({
    paxMachineInfo: state.dataLocal.paxMachineInfo,
    language: state.dataLocal.language,
})

export default connectRedux(mapStateToProps, SetupHardware);

