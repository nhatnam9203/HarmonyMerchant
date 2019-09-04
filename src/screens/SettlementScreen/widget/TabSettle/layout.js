import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    ScrollView
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
                <View style={{ width: scaleSzie(2) }} />
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
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <Text style={{ color: '#fff', fontSize: scaleSzie(14), marginRight: scaleSzie(5) }} >
                            Total Amount
                        </Text>
                        <Image source={IMAGE.arrowDownAmount} style={{ marginRight: scaleSzie(14) }} />
                    </View>
                </View>
                <View style={{ width: scaleSzie(2) }} />
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

    renderItemStaff() {
        return (
            <View style={{
                height: scaleSzie(40), borderBottomColor: '#C5C5C5', borderBottomWidth: 1,
                paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
            }} >
                <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14) }} >
                    1. Grant Marshall
                </Text>
                <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14) }} >
                    $ 200
                </Text>
            </View>
        );
    }

    renderItemInvoice() {
        return (
            <View style={{
                height: scaleSzie(62), paddingHorizontal: scaleSzie(10),
                borderColor: '#C5C5C5', borderWidth: 1,
                backgroundColor: '#FAFAFA'
            }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#404040' }} >
                            {`Deandre Wallace`}
                        </Text>
                    </View>
                    <View style={{ width: scaleSzie(120), justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A' }} >
                            {'Today'}
                        </Text>
                    </View>
                    <View style={{ width: scaleSzie(80), justifyContent: 'center', alignItems: 'flex-end' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A' }} >
                            {`4:39 pm`}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A', marginRight: scaleSzie(20) }} >
                            {`#1412`}
                        </Text>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#0764B0' }} />
                        <Text style={{ fontSize: scaleSzie(14), color: '#0764B0', marginLeft: scaleSzie(5) }} >
                            {'Pending'}
                        </Text>

                    </View>
                    <View style={{}} >
                        <Text style={{ fontSize: scaleSzie(18), color: '#404040' }} >
                            {`$ 50`}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    renderTableStaff() {
        return (
            <View style={{ flexDirection: 'row' }} >
                <View style={{ flex: 1 }} >
                    <View style={{ flex: 1, padding: scaleSzie(10) }} >
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1 }} >
                            <FlatList
                                data={[0, 1, 2, 3, 4]}
                                renderItem={({ item, index }) => this.renderItemStaff(item, index)}
                                keyExtractor={(item, index) => `${item}`}
                            />
                        </View>
                        {/* -------- Total ------- */}
                        <View style={{
                            height: scaleSzie(38), backgroundColor: '#FAFAFA', marginTop: scaleSzie(10),
                            borderColor: '#4CD964', borderWidth: 1, flexDirection: 'row', paddingHorizontal: scaleSzie(10), alignItems: 'center',
                            justifyContent: 'space-between'
                        }} >
                            <Text style={{ fontSize: scaleSzie(20), color: '#0764B0' }} >
                                Total:
                            </Text>
                            <Text style={{ fontSize: scaleSzie(20), color: '#4CD964', fontWeight: 'bold' }} >
                                $ 3900
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ width: scaleSzie(2) }} />
                <View style={{ flex: 1.2 }} >
                    {/* -------- Item ------- */}
                    {this.renderItemInvoice()}
                    {this.renderItemInvoice()}
                    {/* -------- Total ------- */}
                    <View style={{ alignItems: 'flex-end', paddingRight: scaleSzie(10), paddingTop: scaleSzie(10) }} >
                        <Text style={{ fontSize: scaleSzie(12), color: '#404040', marginBottom: scaleSzie(10) }} >
                            Tip Amount: <Text style={{ fontSize: scaleSzie(16), color: '#404040', marginLeft: scaleSzie(5) }} >
                                {`  $  25`}
                            </Text>
                        </Text>
                        <Text style={{ fontSize: scaleSzie(12), color: '#404040', }} >
                            Total Amount: <Text style={{ fontSize: scaleSzie(16), color: '#404040', marginLeft: scaleSzie(5) }} >
                                {`  $  200`}
                            </Text>
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    renderReportAmount() {
        return (
            <View style={{ paddingHorizontal: scaleSzie(10), flexDirection: 'row' }} >
                {/* --------- Left --------- */}
                <View style={{ flex: 1.2, paddingRight: scaleSzie(20) }} >
                    <Text style={{ fontSize: scaleSzie(18), color: '#404040' }} >
                        Report Amount
                    </Text>
                    {/* ------------ Row 1 ------------ */}
                    <View style={{ height: scaleSzie }} >

                    </View>
                </View>
                {/* --------- Right --------- */}
                <View style={{ flex: 1 }} >
                    <Text style={{ fontSize: scaleSzie(18), color: '#404040' }} >
                        Editable Actual Amount
                    </Text>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container} >
                <View style={{ flex: 1 }} >
                    <ScrollView>
                        {this.renderLastSettlement()}
                        {this.renderHeaderStaffList()}
                        {this.renderHeaderTableStaffList()}
                        {this.renderTableStaff()}
                        <View style={{ height: scaleSzie(30) }} />
                        {this.renderReportAmount()}
                        <View style={{ height: scaleSzie(250) }} />
                    </ScrollView>
                </View>

            </View>
        );
    }

}

export default Layout;

