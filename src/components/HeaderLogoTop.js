import React from 'react';
import {
    View,
    Image,
    Dimensions,
    Platform,
} from 'react-native';

import { scaleSzie, checkIsTablet } from '../utils';
import IMAGE from '../resources';

const { width } = Dimensions.get('window');

export default class HeaderLogoTop extends React.PureComponent {


    render() {
        const temptHeight = checkIsTablet() ? scaleSzie(85) : scaleSzie(85);

        return (
            <View style={{
                width,
                height: scaleSzie(85),
                backgroundColor: "#fff",
                ...Platform.select({
                    ios: {
                        shadowRadius: 2,
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
                        height: temptHeight,
                    }}
                    resizeMode="stretch"
                />
            </View>

        );
    }


}