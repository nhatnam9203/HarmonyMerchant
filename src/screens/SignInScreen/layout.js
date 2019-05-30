import React from 'react';
import {
    View,
    Image,
    ImageBackground,
} from 'react-native';

import { Text, InputAuth, ButtonCustom, Button } from '../../components';
import { scaleSzie } from '../../utils';
import styles from './style';
import Configs from '../../configs';
import IMAGE from '../../resources';

export default class Layout extends React.Component {

    render() {
        const { errorLogin } = this.props;
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
                    placeholder="merchant ID"
                    onSubmitEditing={() => this.passwordInputRef.current.onFocusTexInput()}
                />
                <View style={{ height: scaleSzie(20) }} />
                <InputAuth
                    ref={this.passwordInputRef}
                    placeholder="password"
                    secureTextEntry={true}
                    onSubmitEditing={this.signIn}

                />
                <View style={{
                    width: scaleSzie(400), height: scaleSzie(60),
                    justifyContent: 'center', alignItems: 'flex-end'
                }} >
                    <Button onPress={this.forgotPassword} >
                        <Text style={{ color: '#fff', fontSize: scaleSzie(16), fontWeight: 'bold' }} >
                            Forgot password
                        </Text>
                    </Button>
                </View>
                <ButtonCustom
                    width={scaleSzie(400)}
                    backgroundColor="#4CD964"
                    title="SIGN IN"
                    textColor="#fff"
                    onPress={this.signIn}
                />
                <Text style={{
                    color: '#fff', fontSize: scaleSzie(16), fontWeight: 'bold',
                    marginTop: scaleSzie(18)
                }} >
                    Don’t have an account?<Text style={{
                        color: '#5AC8FA', fontSize: scaleSzie(16), fontWeight: 'bold',
                    }} > Sign up</Text>
                </Text>
            </ImageBackground>

        );
    }
}
