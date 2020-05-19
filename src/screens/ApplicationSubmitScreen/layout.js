
import React from 'react';
import {
    View,
    Image,
    ImageBackground,
} from 'react-native';

import { Text, ButtonCustom } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';

export default class Layout extends React.Component {

    render() {
        const { language } = this.props;
        return (
            <ImageBackground
                style={styles.btn_first_name}
                source={IMAGE.backgroundLogin}
            >
                <Image source={IMAGE.logo} style={styles.logo} />
                <View style={{ height: scaleSzie(80) }} />
                <Text style={{
                    color: '#fff', fontSize: scaleSzie(20), fontWeight: 'bold',
                    marginBottom: scaleSzie(10)
                }} >
                    {`${localize('Thank you for submitting your application, one of our agent will', language)}`}
                </Text>
                <Text style={{
                    color: '#fff', fontSize: scaleSzie(20), fontWeight: 'bold',
                    marginBottom: scaleSzie(10)
                }} >
                    {`${localize('contact you within the next business day', language)}.`}
                </Text>
                <View style={{ height: scaleSzie(60) }} />
                <ButtonCustom
                    width={scaleSzie(400)}
                    backgroundColor="#4CD964"
                    title={`${localize('FINISH', language)}`}
                    textColor="#fff"
                    onPress={this.submit}
                />
            </ImageBackground>

        );
    }
}
