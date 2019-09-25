import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform,
    TextInput,
    ScrollView
} from 'react-native';

import { ButtonCustom, Text } from '@components';
import { scaleSzie, localize } from '@utils';
import IMAGE from '@resources';
import connectRedux from '@redux/ConnectRedux';

class SetupHardware extends React.Component {

    constructor(props) {
        super(props);
        const { paxMachineInfo } = this.props;
        const { name, ip, port, timeout } = paxMachineInfo;
        this.state = {
            name,
            ip,
            port,
            timeout
        }
    }

    setupPax = () => {
        const { name, ip, port, timeout } = this.state;
        if (name == '' || ip == '' || port == '' || timeout == '') {
            alert('Please enter full infomation !');
        } else {
            this.props.actions.dataLocal.setupPaxMachine({ name, ip, port, timeout ,isSetup: true});
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

    // -------- Render ------

    render() {
        const { name, ip, port, timeout } = this.state;
        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(14), paddingTop: scaleSzie(20) }} >
                <Text style={{
                    fontSize: scaleSzie(16),
                    fontWeight: '600',
                    color: '#0764B0'
                }} >
                    Payment Terminal
                        </Text>
                <Text style={{
                    fontSize: scaleSzie(16),
                    fontWeight: '600',
                    color: 'rgb(81,81,81)',
                    marginTop: scaleSzie(26),
                    marginBottom: scaleSzie(10)
                }} >
                    Terminal configuration
                        </Text>

                {/* ----------- Line ------------ */}
                <View style={{ height: scaleSzie(1), backgroundColor: 'rgb(227,227,227)', }} />
                <ScrollView  >
                    <ItemSetup
                        title={"Name"}
                        placeholder={"Device name"}
                        value={name}
                        onChangeText={name => this.setState({ name })}
                    />

                    <ItemSetup
                        title={"IP Address"}
                        placeholder={"192.168.1.1"}
                        value={ip}
                        onChangeText={ip => this.setState({ ip })}
                    />

                    <ItemSetup
                        title={"Port"}
                        placeholder={"10009"}
                        value={port}
                        onChangeText={port => this.setState({ port })}
                    />

                    <ItemSetup
                        title={"Timeout"}
                        placeholder={"20000 ms"}
                        value={timeout}
                        onChangeText={timeout => this.setState({ timeout })}
                    />
                    <View style={{ height: scaleSzie(300) }} />
                </ScrollView>
                {/* ------- Footer -------- */}
                <View style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'flex-end', paddingBottom: scaleSzie(30) }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                        <ButtonCustom
                            width={scaleSzie(130)}
                            height={50}
                            backgroundColor="#F1F1F1"
                            title="CANCEL"
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
                            title="SAVE"
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

}


const ItemSetup = ({ title, value, placeholder, onChangeText }) => {
    return (
        <View style={{ flexDirection: 'row', marginTop: scaleSzie(20), }} >
            <View style={{ width: scaleSzie(140), justifyContent: 'center', }} >
                <Text style={{ fontSize: scaleSzie(14), color: 'rgb(42,42,42)' }} >
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

