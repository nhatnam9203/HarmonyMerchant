import React from 'react';
import {
    View,
    Image,
    Dimensions,
    Platform,
} from 'react-native';

import { ScaleSzie } from '../utils';
import IMAGE from '../resources';

const { width } = Dimensions.get('window');

export default class HeaderLogoTop extends React.PureComponent {


    render() {
        return (
            <View style={{
                width,
                height: ScaleSzie(85),
                backgroundColor: "#fff",
                ...Platform.select({
                    ios: {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                    },

                    android: {
                        elevation: 2,
                    },
                })
            }} >

                <Image
                    source={IMAGE.logoTop}
                    style={{
                        width,
                        height: ScaleSzie(85),
                    }}
                    resizeMode="stretch"
                />
            </View>

        );
    }


}