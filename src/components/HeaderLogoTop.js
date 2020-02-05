import React from 'react';
import {
    View,
    Image,
    Dimensions,
    Platform,
} from 'react-native';

import { scaleSzie } from '../utils';
import IMAGE from '../resources';

const { width } = Dimensions.get('window');

export default class HeaderLogoTop extends React.PureComponent {


    render() {
        return (
                <View style={{
                    width,
                    height: scaleSzie(100),
                    ...Platform.select({
                        ios: {
                            shadowRadius: 2,
                            shadowColor: 'rgba(0, 0, 0, 1.0)',
                            shadowOpacity: 0.54,
                            shadowOffset: { width: 0, height: 2 },
                        },

                        android: {
                            elevation: 2,
                        },
                    })
                }} >

                    <Image
                        source={IMAGE.logoTop}
                        style={{ width: null, height: null, flex: 1 }}
                    />
                </View>

        );
    }


}