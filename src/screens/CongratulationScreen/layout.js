import React from 'react';
import {
    View,
    Image,
    ImageBackground,
} from 'react-native';

import { Text,  ButtonCustom,  } from '@components';
import { ScaleSzie ,localize} from '@utils';
import styles from './style';
import IMAGE from '@resources';

export default class Layout extends React.Component {

    render() {
        const {language} = this.props;

        return (
            <ImageBackground
                style={styles.container}
                source={IMAGE.backgroundLogin}
            >
                <Image source={IMAGE.logo} style={styles.logo} />
                <View style={{ height: ScaleSzie(60) }} />
                <Text style={{
                    color: '#00FFD6', fontSize: ScaleSzie(40), fontWeight: 'bold',
                    marginBottom: ScaleSzie(10)
                }} >
                    {`${localize('CONGRATULATION',language)}!`}
                </Text>
                <View style={{ height: ScaleSzie(20) }} />
                <Text style={{
                    color: '#fff', fontSize: ScaleSzie(30), fontWeight: 'bold',
                    marginBottom: ScaleSzie(10)
                }} >
                    
                    {localize('Your account is ready to operate',language)}
                </Text>
                <View style={{ height: ScaleSzie(60) }} />
                <ButtonCustom
                    width={ScaleSzie(400)}
                    backgroundColor="#4CD964"
                    title={localize('FINISH',language)}
                    textColor="#fff"
                    onPress={this.gotoDrawerStack}
                />
            </ImageBackground>

        );
    }
}
