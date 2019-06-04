import React from 'react';
import {
    View,
    Image,
    ScrollView
} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

import { InputAuth, ButtonCustom, Button, DefaultTabBar } from '../../../../components';
import { scaleSzie } from '../../../../utils';
import styles from './style';
import EmptyStaff from './widget/EmptyStaff';
import StaffInfo from '../StaffInfo';
import TableHeader from './widget/TableHeader';
import RowTable from './widget/RowTable';


const FakeData = [{
    id: 'HP000002',
    name: 'Pena Valdez',
    role: 'Staff',
    status: 'Active'
}, {
    id: 'HP000003',
    name: 'Jessica Miles',
    role: 'Staff',
    status: 'Active'
}]

class TabStaffManagement extends React.Component {

    renderTable() {
        return (
            <View style={{ flex: 1 }}>
                <TableHeader />
                <View style={{ flex: 1 }} >
                    <ScrollView>
                        {
                            FakeData.map((staff, index) => <RowTable
                                key={index}
                                index={parseInt(index+1)}
                                staff={staff}
                            />)
                        }
                    </ScrollView>
                </View>

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
