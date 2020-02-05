import React from 'react';
import {
    View,
    Image,
    ImageBackground,
} from 'react-native';

import { Text, InputAuth, ButtonCustom, Button } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';

export default class Layout extends React.Component {

    render() {
        const { language, isForgotPin } = this.props;
        return (
            <ImageBackground
                style={styles.container}
                source={IMAGE.backgroundLogin}
            >
                <Image source={IMAGE.logo} style={styles.logo} />
                <View style={{ height: scaleSzie(30) }} />
                <Text style={{
                    color: '#fff', fontSize: scaleSzie(30), fontWeight: 'bold',
                    marginBottom: scaleSzie(10)
                }} >
                    {localize('Forgot Password', language)}
                </Text>
                <Text style={styles.desc} >
                    {localize(`Please enter your email address and we will send you`, language)}
                </Text>
                <Text style={[styles.desc, { marginBottom: scaleSzie(10) }]} >
                    {localize('instructions on how to reset your password', language)}

                </Text>

                <InputAuth
                    ref={this.idInputRef}
                    placeholder="Email"
                    onSubmitEditing={this.forgotPass}
                />
                <View style={{ height: scaleSzie(40) }} />
                <ButtonCustom
                    width={scaleSzie(400)}
                    backgroundColor="#4CD964"
                    title={localize('SUBMIT', language)}
                    textColor="#fff"
                    onPress={this.forgotPass}
                />

                <Button onPress={() => this.props.navigation.goBack()} style={{
                    width: scaleSzie(50), height: scaleSzie(50),
                    justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', top: scaleSzie(30),
                    left: scaleSzie(20)

                }} >
                    <Text style={{
                        color: 'rgb(128,150,180)', fontSize: scaleSzie(18), fontWeight: 'bold',
                        textDecorationLine: 'underline'
                    }} >
                        {localize('Back', language)}
                        </Text>
                </Button>
            </ImageBackground>

        );
    }
}
