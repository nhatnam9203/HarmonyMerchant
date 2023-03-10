
import React from 'react';
import {
    View,
    Image,
    ImageBackground,
} from 'react-native';

import { Text, ButtonCustom } from '@components';
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
                <View style={{ height: scaleSize(80) }} />
                <Text style={{
                    color: '#fff', fontSize: scaleSize(20), fontWeight: 'bold',
                    marginBottom: scaleSize(10)
                }} >
                    {`${localize('Thank for submitting your application! One of our agents will ', language)}`}
                </Text>
                <Text style={{
                    color: '#fff', fontSize: scaleSize(20), fontWeight: 'bold',
                    marginBottom: scaleSize(10)
                }} >
                    {`${localize('contact you within the next business day', language)}.`}
                </Text>
                <View style={{ height: scaleSize(60) }} />
                <ButtonCustom
                    width={scaleSize(400)}
                    backgroundColor="#4CD964"
                    title={`${localize('FINISH', language)}`}
                    textColor="#fff"
                    onPress={this.submit}
                />
            </ImageBackground>

        );
    }
}
