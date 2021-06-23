import React from 'react';
import {
    View,
    Image,
    ImageBackground,
} from 'react-native';

import { Text, InputAuth, ButtonCustom, Button } from '@components';
import { ScaleSzie, localize } from '@utils';
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
                <View style={{ height: ScaleSzie(30) }} />
                <Text style={{
                    color: '#fff', fontSize: ScaleSzie(30), fontWeight: 'bold',
                    marginBottom: ScaleSzie(10)
                }} >
                    {localize('Forgot Password', language)}
                </Text>
                <Text style={styles.desc} >
                    {localize(`Please enter your merchant ID and we will send you`, language)}
                </Text>
                <Text style={[styles.desc, { marginBottom: ScaleSzie(10) }]} >
                    {localize('instructions on how to reset your password', language)}

                </Text>

                <InputAuth
                    ref={this.idInputRef}
                    placeholder="merchant ID"
                    onSubmitEditing={this.forgotPass}
                />
                <View style={{ height: ScaleSzie(40) }} />
                <ButtonCustom
                    width={ScaleSzie(400)}
                    backgroundColor="#4CD964"
                    title={localize('SUBMIT', language)}
                    textColor="#fff"
                    onPress={this.forgotPass}
                />

                <Button onPress={() => this.props.navigation.goBack()} style={{
                    width: ScaleSzie(50), height: ScaleSzie(50),
                    justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', top: ScaleSzie(30),
                    left: ScaleSzie(20)

                }} >
                    <Text style={{
                        color: 'rgb(128,150,180)', fontSize: ScaleSzie(18), fontWeight: 'bold',
                        textDecorationLine: 'underline'
                    }} >
                        {localize('Back', language)}
                        </Text>
                </Button>
            </ImageBackground>

        );
    }
}
