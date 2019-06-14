import React from 'react';
import {
    View,
    Image,
    ImageBackground,
} from 'react-native';

import { Text, InputAuth, ButtonCustom, Button } from '@components';
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
                <View style={{ height: scaleSzie(80) }} />
                <Text style={{
                    color: '#fff', fontSize: scaleSzie(20), fontWeight: 'bold',
                    marginBottom: scaleSzie(10)
                }} >
                    Thank you for submitting application, one of our agent will
                </Text>
                <Text style={{
                    color: '#fff', fontSize: scaleSzie(20), fontWeight: 'bold',
                    marginBottom: scaleSzie(10)
                }} >
                    contact you within the next business day.
                </Text>
                <View style={{ height: scaleSzie(60) }} />
                <ButtonCustom
                    width={scaleSzie(400)}
                    backgroundColor="#4CD964"
                    title="FINISH"
                    textColor="#fff"
                    onPress={this.submit}
                />
            </ImageBackground>

        );
    }
}
