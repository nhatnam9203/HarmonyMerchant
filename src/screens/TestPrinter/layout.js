import React, { useState } from 'react';
import {
    View,
    Image,
    ImageBackground,
    ActivityIndicator,
    Switch,
} from 'react-native';
import AnimatedEllipsis from 'react-native-animated-ellipsis';

import styles from './style';
import ICON from '@resources';
import { Text, ButtonCustom,Button } from '@components';
import { scaleSzie, formatMoney } from '@utils';

export default class Layout extends React.Component {

    

    render() {
        return (
            <View style={{ flex: 1,justifyContent:"center",alignItems:"center" }} >
                <Button onPress={() => this._scan()} style={{width: 100,hieght:60,backgroundColor:"red"}} >
                    <Text>
                        Scan
                    </Text>
                </Button>
            </View>
        );
    }
}



