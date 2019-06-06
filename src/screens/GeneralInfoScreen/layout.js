import React from 'react';
import {
    View,
    Image,
    ScrollView
} from 'react-native';

import { Text, HeaderLogoTop, ButtonCustom, FormInfoParent } from '../../components';
import { scaleSzie } from '../../utils';
import styles from './style';
import Configs from '../../configs';
import IMAGE from '../../resources';

export default class Layout extends React.Component {

    render() {
        return (
            <FormInfoParent
                back={() => alert('back')}
                next={() => alert('next')}
            >
                <View style={{ flex: 1 }} >
                    <ScrollView>

                    </ScrollView>
                </View>
            </FormInfoParent>

        );
    }
}
