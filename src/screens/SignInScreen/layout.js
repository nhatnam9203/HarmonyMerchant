import React from 'react';
import {
    View,
    Image,
    ImageBackground,
} from 'react-native';

import { Text, InputAuth, ButtonCustom, Button, Dropdown } from '@components';
import { scaleSzie, localize, checkIsTablet } from '@utils';
import styles from './style';
import IMAGE from '@resources';

const TERMINAL_ID_LIST = [
    {value: 'Terminal 1 (MAIN)'},{value: 'Terminal 2'},{value: 'Terminal 3'},{value: 'Terminal 4'},
    {value: 'Terminal 5'},{value: 'Terminal 6'},{value: 'Terminal 7'},{value: 'Terminal 8'},
    {value: 'Terminal 9'},{value: 'Terminal 10'},{value: 'Terminal 11'},{value: 'Terminal 12'},{value: 'Terminal 13'},
    {value: 'Terminal 14'},{value: 'Terminal 15'},{value:'SUPPORT ONLY'}
];

export default class Layout extends React.Component {

    render() {
        const { errorLogin, language, MIDStorage, isRememberMID } = this.props;
        const { isSecureTextEntry, isShowKeyboard, terminalId } = this.state;
        const iconShowPass = isSecureTextEntry ? IMAGE.showPass : IMAGE.notShowPass;
        const temptIconCheck = isRememberMID ? IMAGE.checkBox : IMAGE.checkBoxEmpty;
        const isTablet = checkIsTablet();

        return (
            <ImageBackground
                style={styles.container}
                source={IMAGE.backgroundLogin}
            >
                <Image source={IMAGE.logo} style={styles.logo} />
                {
                    isTablet && !isShowKeyboard ? <View style={{ height: scaleSzie(60), justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: 'red', fontSize: scaleSzie(16), fontWeight: '600' }} >
                            {errorLogin}
                        </Text>
                    </View> : <View style={{ height: scaleSzie(15) }} />
                }

                {
                    !isTablet ? <View style={{ height: scaleSzie(40), justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: 'red', fontSize: scaleSzie(16), fontWeight: '600' }} >
                            {errorLogin}
                        </Text>
                    </View> : <View />
                }

                <InputAuth
                    ref={this.idInputRef}
                    value={MIDStorage}
                    placeholder="merchant ID"
                    onSubmitEditing={() => this.passwordInputRef.current.onFocusTexInput()}
                />
                <View style={{ height: scaleSzie(20) }} />
                <InputAuth
                    ref={this.passwordInputRef}
                    placeholder={localize('password', language)}
                    secureTextEntry={isSecureTextEntry}
                    onSubmitEditing={this.signIn}
                    isShowPass={true}
                    changeShowPass={this.changeShowPass}
                    iconShowPass={iconShowPass}
                />

                <View style={{ height: scaleSzie(20) }} />
                {/* ---------------- Terminal ID Dropdown -------------- */}
                <View style={{ flexDirection: 'row', height: scaleSzie(45), width: scaleSzie(400), }} >
                    <View style={{ flex: 1,}} >
                        <Dropdown
                            label={'Select Terminal ID'}
                            data={TERMINAL_ID_LIST}
                            value={terminalId}
                            onChangeText={(terminalId) => this.setState({terminalId})}
                            containerStyle={{
                                backgroundColor: '#fff',
                                borderWidth: 1,
                                borderColor: '#C5C5C5',
                                flex: 1
                            }}
                        />
                    </View>
                </View>

                <View style={{
                    width: scaleSzie(400), height: scaleSzie(60),
                    flexDirection: "row", paddingLeft: scaleSzie(10)
                }} >
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }} >
                        <Button onPress={this.toggleRememberMID} style={{
                            width: scaleSzie(30), height: scaleSzie(30),
                            justifyContent: "center", alignItems: "center"
                        }} >
                            <Image source={temptIconCheck} style={{ width: scaleSzie(22), height: scaleSzie(22) }} />
                        </Button>

                        <Text style={{
                            color: '#fff', fontSize: scaleSzie(16), fontWeight: 'bold',
                            marginLeft: scaleSzie(10)
                        }} >
                            {localize('Remember MID', language)}
                        </Text>
                    </View>

                    <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }} >
                        <Button onPress={this.forgotPassword} >
                            <Text style={{ color: '#fff', fontSize: scaleSzie(16), fontWeight: 'bold' }} >
                                {localize('Forgot password', language)}
                            </Text>
                        </Button>
                    </View>


                </View>
                <ButtonCustom
                    width={scaleSzie(400)}
                    backgroundColor="#4CD964"
                    title={localize('SIGN IN', language)}
                    textColor="#fff"
                    onPress={this.signIn}
                />
                <Button onPress={this.signUp} style={{ marginTop: scaleSzie(18) }} >
                    <Text style={{
                        color: '#fff', fontSize: scaleSzie(16), fontWeight: 'bold',
                    }} >
                        {`${localize('Don’t have an account', language)}? `}<Text style={{
                            color: '#5AC8FA', fontSize: scaleSzie(16), fontWeight: 'bold',
                        }} > {localize('Sign up')}</Text>
                    </Text>
                </Button>
            </ImageBackground>

        );
    }
}
