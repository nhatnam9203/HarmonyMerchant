import React from 'react';
import {
    View,
    Image,
    ImageBackground,
    ActivityIndicator
} from 'react-native';
import AnimatedEllipsis from 'react-native-animated-ellipsis';

import styles from './style';
import IMAGE from '../../resources';
import { Text } from '@components';
import { scaleSzie } from '@utils';

export default class Layout extends React.Component {

    render() {
        return (
            <View style={{ flex: 1 }} >
                <Text style={{
                    color: "#404040", fontSize: scaleSzie(30), fontWeight: "600",
                    alignSelf: "center", marginTop: scaleSzie(25)
                }} >
                    {`Package & Pricing`}
                </Text>
                <Text style={{
                    color: "#6A6A6A", fontSize: scaleSzie(20), alignSelf: "center",  marginTop: scaleSzie(6)
                }} >
                    {`Try HarmonyPay Merchants free for 3 months, no credit card required`}
                </Text>

                {/* ------------------ Table ---------------- */}
                <View style={{flex:1,padding:scaleSzie(18)}} >
                    <View style={{flex:1,backgroundColor:"red"}} >

                    </View>
                </View>
            </View>
        );
    }
}


