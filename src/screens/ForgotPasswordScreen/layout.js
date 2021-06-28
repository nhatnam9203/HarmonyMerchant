import React from 'react';
import {
    View,
    Image,
    ImageBackground,
} from 'react-native';

import { Text, InputAuth, ButtonCustom, Button } from '@components';
import { scaleSize, localize } from '@utils';
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
                <View style={{ height: scaleSize(30) }} />
                <Text style={{
                    color: '#fff', fontSize: scaleSize(30), fontWeight: 'bold',
                    marginBottom: scaleSize(10)
                }} >
                    {localize('Forgot Password', language)}
                </Text>
                <Text style={styles.desc} >
                    {localize(`Please enter your merchant ID and we will send you`, language)}
                </Text>
                <Text style={[styles.desc, { marginBottom: scaleSize(10) }]} >
                    {localize('instructions on how to reset your password', language)}

                </Text>

                <InputAuth
                    ref={this.idInputRef}
                    placeholder="merchant ID"
                    onSubmitEditing={this.forgotPass}
                />
                <View style={{ height: scaleSize(40) }} />
                <ButtonCustom
                    width={scaleSize(400)}
                    backgroundColor="#4CD964"
                    title={localize('SUBMIT', language)}
                    textColor="#fff"
                    onPress={this.forgotPass}
                />

                <Button onPress={() => this.props.navigation.goBack()} style={{
                    width: scaleSize(50), height: scaleSize(50),
                    justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', top: scaleSize(30),
                    left: scaleSize(20)

                }} >
                    <Text style={{
                        color: 'rgb(128,150,180)', fontSize: scaleSize(18), fontWeight: 'bold',
                        textDecorationLine: 'underline'
                    }} >
                        {localize('Back', language)}
                        </Text>
                </Button>
            </ImageBackground>

        );
    }
}
