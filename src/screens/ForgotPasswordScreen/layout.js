import React from 'react';
import {
    View,
    Image,
    ImageBackground,
} from 'react-native';

import { Text, InputAuth, ButtonCustom } from '@components';
import { scaleSzie } from '@utils';
import styles from './style';
import IMAGE from '@resources';

export default class Layout extends React.Component {

    render() {
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
                    Forgot Password
                </Text>
                <Text style={styles.desc} >
                    Please enter your email address and we'll send you
                </Text>
                <Text style={[styles.desc, { marginBottom: scaleSzie(10) }]} >
                    instructions on how to reset your password
                </Text>

                <InputAuth
                    ref={this.idInputRef}
                    placeholder="Email"
                />
                <View style={{ height: scaleSzie(40) }} />
                <ButtonCustom
                    width={scaleSzie(400)}
                    backgroundColor="#4CD964"
                    title="SUBMIT"
                    textColor="#fff"
                    onPress={this.forgotPass}
                />
            </ImageBackground>

        );
    }
}
