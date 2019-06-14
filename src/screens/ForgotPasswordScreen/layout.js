import React from 'react';
import {
    View,
    Image,
    ImageBackground,
} from 'react-native';

import { Text, InputAuth, ButtonCustom } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';

export default class Layout extends React.Component {

    render() {
        const { language } = this.props;
        return (
            <ImageBackground
                style={styles.container}
                source={IMAGE.backgroundLogin}
            >
                <Image source={IMAGE.logo} style={styles.logo} />
                <View style={{ height: scaleSzie(40) }} />
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
                />
                <View style={{ height: scaleSzie(40) }} />
                <ButtonCustom
                    width={scaleSzie(400)}
                    backgroundColor="#4CD964"
                    title={localize('SUBMIT', language)}
                    textColor="#fff"
                    onPress={this.forgotPass}
                />
            </ImageBackground>

        );
    }
}
