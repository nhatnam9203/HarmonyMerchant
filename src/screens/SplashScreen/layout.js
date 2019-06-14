import React from 'react';
import {
    View,
    Image
} from 'react-native';

import styles from './style';
import IMAGE from '../../resources';

export default class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <Image source={IMAGE.splashScreen}
                    style={{ width: null, height: null, flex: 1 }}
                />
            </View>

        );
    }
}
