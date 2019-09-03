import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
} from 'react-native';

import { scaleSzie, localize, getCategoryName, getArrayNameCategories } from '@utils';
import { Text, Button, ButtonCustom, Dropdown, PopupConfirm, PopupAddEditService } from '@components';
import styles from './style';
import IMAGE from '@resources';
import { } from './widget';

class Layout extends React.Component {

    renderLastSettlement() {
        return (
            <View style={{ height: scaleSzie(50), backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }} >
                <Text style={{ color: '#0764B0', fontSize: scaleSzie(14), marginLeft: scaleSzie(10), marginRight: scaleSzie(20) }} >
                    Last Settlemetn:
                </Text>
                <Text style={{ color: '#0764B0', fontSize: scaleSzie(16), fontWeight: 'bold', marginRight: scaleSzie(20) }} >
                    02/15/2019
                </Text>
                <Text style={{ color: '#0764B0', fontSize: scaleSzie(16), fontWeight: 'bold', marginRight: scaleSzie(20) }} >
                    10:00 PM
                </Text>
            </View>
        );
    }

    renderHeaderStaffList() {
        return (
            <View style={{ height: scaleSzie(45), backgroundColor: '#FAFAFA', flexDirection: 'row' }} >
                <View style={{ flex: 1, paddingLeft: scaleSzie(10), justifyContent: 'center' }} >
                    <Text style={{ color: '#0764B0', fontSize: scaleSzie(18) }} >
                        Staff List
                </Text>
                </View>
                <View style={{ flex: 1.2, paddingLeft: scaleSzie(10), justifyContent: 'center' }} >
                    <Text style={{ color: '#0764B0', fontSize: scaleSzie(18) }} >
                        Staff Statistic
                </Text>
                </View>
            </View>
        );
    }

    renderHeaderTableStaffList() {
        return (
            <View style={{ height: scaleSzie(35), flexDirection: 'row' }} >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0764B0' }} >
                    <Text style={{ color: '#fff', fontSize: scaleSzie(14), marginLeft: scaleSzie(24) }} >
                        Name
                    </Text>
                    <View style={{ flexDirection: 'row' ,alignItems:'center'}} >
                        <Text style={{ color: '#fff', fontSize: scaleSzie(14), marginRight: scaleSzie(5) }} >
                            Total Amount
                        </Text>
                        <Image source={IMAGE.arrowDownAmount} style={{ marginRight: scaleSzie(14)}} />
                    </View>
                </View>
                <View style={{ width: 2 }} />
                <View style={{
                    flex: 1.2, backgroundColor: '#0764B0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                }} >
                    <Text style={{ color: '#fff', fontSize: scaleSzie(14), marginLeft: scaleSzie(14) }} >
                        Invoice List
                    </Text>
                    <Text style={{ color: '#fff', fontSize: scaleSzie(14), marginRight: scaleSzie(14) }} >
                        Time/Amount
                    </Text>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container} >
                {this.renderLastSettlement()}
                {this.renderHeaderStaffList()}
                {this.renderHeaderTableStaffList()}
            </View>
        );
    }

}

export default Layout;

