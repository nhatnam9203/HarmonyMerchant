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
        return (
            <ImageBackground
                style={styles.container}
                source={IMAGE.backgroundLogin}
            >
                <Image source={IMAGE.logo} style={styles.logo} />
                <View style={{ height: scaleSzie(60) }} />
                <Text style={{
                    color: '#00FFD6', fontSize: scaleSzie(40), fontWeight: 'bold',
                    marginBottom: scaleSzie(10)
                }} >
                    CONGRATULATION !
                </Text>
                <View style={{ height: scaleSzie(20) }} />
                <Text style={{
                    color: '#fff', fontSize: scaleSzie(30), fontWeight: 'bold',
                    marginBottom: scaleSzie(10)
                }} >
                    Your account is ready to operate
                </Text>
                <View style={{ height: scaleSzie(60) }} />
                <ButtonCustom
                    width={scaleSzie(400)}
                    backgroundColor="#4CD964"
                    title="FINISH"
                    textColor="#fff"
                    onPress={this.signIn}
                />
            </ImageBackground>

        );
    }
}
