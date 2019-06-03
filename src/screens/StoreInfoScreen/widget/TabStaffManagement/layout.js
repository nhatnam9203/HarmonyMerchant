import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { InputAuth, ButtonCustom, Button, DefaultTabBar } from '../../../../components';
import { scaleSzie } from '../../../../utils';
import styles from './style';
import EmptyStaff from './widget/EmptyStaff';
import StaffInfo from '../StaffInfo';

class TabStaffManagement extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                {/* <EmptyStaff 
                addStaff={() =>alert('dd')}
                /> */}
                <StaffInfo />
            </View>

        );
    }
}

export default TabStaffManagement;
