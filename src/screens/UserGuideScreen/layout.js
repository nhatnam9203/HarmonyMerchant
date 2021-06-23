import React from 'react';
import {
    View,
    Image,
    ImageBackground,
} from 'react-native';

import { Text, ButtonCustom } from '@components';
import { ScaleSzie, localize } from '@utils';
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
                <View style={{ height: ScaleSzie(90) }} />
                <Text style={{
                    color: '#fff', fontSize: ScaleSzie(45), fontWeight: 'bold',
                    marginBottom: ScaleSzie(10)
                }} >
                    
                    {localize('USER GUIDE', language)}
                </Text>
                <Text style={{
                    color: '#fff', fontSize: ScaleSzie(45), fontWeight: 'bold',
                    marginBottom: ScaleSzie(10)
                }} >
                    {localize('ANIMATION', language)}
                    
                </Text>
                <View style={{ flex: 1,justifyContent:'flex-end',
            paddingBottom:ScaleSzie(7)
            }} >
                    <ButtonCustom
                        width={ScaleSzie(350)}
                        backgroundColor="#4CD964"
                        title="NEXT"
                        textColor="#fff"
                        onPress={this.signIn}
                    />
                </View>
            </ImageBackground>

        );
    }
}
