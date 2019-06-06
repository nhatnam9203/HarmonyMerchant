import React from 'react';
import {
    View,
    Image,
    ScrollView
} from 'react-native';

import { Text, HeaderLogoTop, ButtonCustom, Button } from '../../components';
import { scaleSzie } from '../../utils';
import styles from './style';
import Configs from '../../configs';
import IMAGE from '../../resources';

export default class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <HeaderLogoTop />
                <View style={{ flex: 1 }} >
                    <View style={{}} >

                    </View>
                </View>
            </View>

        );
    }
}
