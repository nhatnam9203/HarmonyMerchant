import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    Image
} from 'react-native';

import { ButtonCustom, Text, Dropdown } from '@components';
import { scaleSzie, localize, WorkingTime, getNameLanguage } from '@utils';
import IMAGE from '@resources';
import styles from './style';
import { SetupHardware } from './widget';

class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                    <SetupHardware 
                    backListDevices={this.backListDevices}
                    />
            </View>

        );
    }
}



export default Layout;

