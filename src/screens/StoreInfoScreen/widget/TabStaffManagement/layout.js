import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

import { InputAuth, ButtonCustom, Button, DefaultTabBar } from '../../../../components';
import { scaleSzie } from '../../../../utils';
import styles from './style';
import EmptyStaff from './widget/EmptyStaff';
import StaffInfo from '../StaffInfo';
import TableHeader from './widget/TableHeader'

class TabStaffManagement extends React.Component {

    renderTable() {
        return (
            <View style={styles.container}>
                <TableHeader />
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container} >
                {/* <EmptyStaff 
                addStaff={() =>alert('dd')}
                /> */}
                {/* <StaffInfo /> */}
                {this.renderTable()}
            </View>

        );
    }
}

export default TabStaffManagement;
