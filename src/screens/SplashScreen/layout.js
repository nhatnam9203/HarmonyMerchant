import React from 'react';
import {
    View,
    ImageBackground,
} from 'react-native';
import AnimatedEllipsis from 'react-native-animated-ellipsis';

import styles from './style';
import IMAGE from '../../resources';
import { Text, PopupInfomationCodePush } from '@components';
import { scaleSzie } from '@utils';

export default class Layout extends React.Component {

    render() {
        return (
            <ImageBackground
                style={styles.container}
                source={IMAGE.splashScreen}
            >

                <View style={{ flex: 1, alignItems: 'center', justifyContent: "center", }} >
                    <View style={{ paddingTop: scaleSzie(200) }} >
                        <Text style={{
                            color: '#fff', fontSize: scaleSzie(20), fontWeight: '500', marginBottom: scaleSzie(6),
                            textAlign: "center"
                        }} >
                            {`Checking Version`}
                        </Text>
                        <AnimatedEllipsis
                            numberOfDots={6}
                            animationDelay={150}
                            style={{
                                color: '#fff',
                                fontSize: 100,
                                backgroundColor: '#fff',
                                height: scaleSzie(5)
                            }}
                        />
                        <Text style={{
                            color: '#fff', fontSize: scaleSzie(14), marginBottom: scaleSzie(6), marginTop: scaleSzie(10),
                            textAlign: "center", fontWeight: "600"
                        }} >
                            {`${this.state.progress}%`}
                        </Text>
                    </View>
                </View>
                {/* <PopupInfomationCodePush /> */}
            </ImageBackground>

        );
    }
}


