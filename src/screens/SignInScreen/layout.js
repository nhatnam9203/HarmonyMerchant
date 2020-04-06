import React from 'react';
import {
    View,
    Image,
    ImageBackground,
} from 'react-native';

import { Text, InputAuth, ButtonCustom, Button } from '@components';
import { scaleSzie,localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';

export default class Layout extends React.Component {

    render() {
        const { errorLogin ,language,MIDStorage} = this.props;
        const {isSecureTextEntry} = this.state;
        const iconShowPass = isSecureTextEntry ? IMAGE.showPass  :  IMAGE.notShowPass ;
        return (
            <ImageBackground
                style={styles.container}
                source={IMAGE.backgroundLogin}
            >
                <Image source={IMAGE.logo} style={styles.logo} />
                <View style={{ height: scaleSzie(60),justifyContent:'center',alignItems:'center' }} >
                    <Text style={{ color: 'red', fontSize: scaleSzie(16), fontWeight: '600' }} >
                        {errorLogin}
                    </Text>
                </View>
                <InputAuth
                    ref={this.idInputRef}
                    value={MIDStorage}
                    placeholder="merchant ID"
                    onSubmitEditing={() => this.passwordInputRef.current.onFocusTexInput()}
                />
                <View style={{ height: scaleSzie(20) }} />
                <InputAuth
                    ref={this.passwordInputRef}
                    placeholder={localize('password',language)}
                    secureTextEntry={isSecureTextEntry}
                    onSubmitEditing={this.signIn}
                    isShowPass={true}
                    changeShowPass={this.changeShowPass}
                    iconShowPass={iconShowPass}
                />
                <View style={{
                    width: scaleSzie(400), height: scaleSzie(60),
                    justifyContent: 'center', alignItems: 'flex-end'
                }} >
                    <Button onPress={this.forgotPassword} >
                        <Text style={{ color: '#fff', fontSize: scaleSzie(16), fontWeight: 'bold' }} >
                            {localize('Forgot password',language)}
                        </Text>
                    </Button>
                </View>
                <ButtonCustom
                    width={scaleSzie(400)}
                    backgroundColor="#4CD964"
                    title={localize('SIGN IN',language)}
                    textColor="#fff"
                    onPress={this.signIn}
                />
                <Button  onPress={this.signUp} style={{marginTop: scaleSzie(18)}} >
                <Text style={{
                    color: '#fff', fontSize: scaleSzie(16), fontWeight: 'bold',
                }} >
                    {`${localize('Don’t have an account',language)}? `}<Text style={{
                        color: '#5AC8FA', fontSize: scaleSzie(16), fontWeight: 'bold',
                    }} > {localize('Sign up')}</Text>
                </Text>
                </Button>
            </ImageBackground>

        );
    }
}
