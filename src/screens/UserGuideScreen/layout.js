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
        const {language} = this.props;
        
        return (
            <ImageBackground
                style={styles.container}
                source={IMAGE.backgroundLogin}
            >
                <Image source={IMAGE.logo} style={styles.logo} />
                <View style={{ height: scaleSzie(90) }} />
                <Text style={{
                    color: '#fff', fontSize: scaleSzie(45), fontWeight: 'bold',
                    marginBottom: scaleSzie(10)
                }} >
                    
                    {localize('USER GUIDE', language)}
                </Text>
                <Text style={{
                    color: '#fff', fontSize: scaleSzie(45), fontWeight: 'bold',
                    marginBottom: scaleSzie(10)
                }} >
                    {localize('ANIMATION', language)}
                    
                </Text>
                <View style={{ flex: 1,justifyContent:'flex-end',
            paddingBottom:scaleSzie(7)
            }} >
                    <ButtonCustom
                        width={scaleSzie(350)}
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
