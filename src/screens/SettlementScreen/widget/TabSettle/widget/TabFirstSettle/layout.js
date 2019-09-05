import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    ScrollView,
    Dimensions
} from 'react-native';
import { NavigationEvents } from 'react-navigation';

import { scaleSzie, localize } from '@utils';
import {
    Text, Button, ButtonCustom,
} from '@components';
import styles from './style';
import IMAGE from '@resources';

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
                            height: scaleSzie(35), backgroundColor: '#FAFAFA', marginTop: scaleSzie(10),
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
        const {creditAmount} = this.state;
        return (
            <View style={{ paddingHorizontal: scaleSzie(10), flexDirection: 'row' }} >
                {/* --------- Left --------- */}
                <View style={{ flex: 1.2, paddingRight: scaleSzie(30) }} >
                    <Text style={{ fontSize: scaleSzie(18), color: '#404040' }} >
                        Report Amount
                    </Text>
                    {/* ------------ Row 1 ------------ */}
                    <View style={{
                        height: scaleSzie(35), backgroundColor: '#80C6FF', marginTop: scaleSzie(8), marginBottom: scaleSzie(2),
                        paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }} >
                        <Text style={{ fontSize: scaleSzie(13), color: '#fff' }} >
                            Payment by Harmony account
                        </Text>
                        <Text style={{ fontSize: scaleSzie(20), color: '#fff' }} >
                            $ 1000
                        </Text>
                    </View>
                    {/* ------------ Row 2 ------------ */}
                    <View style={{
                        height: scaleSzie(35), backgroundColor: '#307FBF', marginBottom: scaleSzie(2),
                        paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }} >
                        <Text style={{ fontSize: scaleSzie(13), color: '#fff' }} >
                            Payment by Credit card
                        </Text>
                        <Text style={{ fontSize: scaleSzie(20), color: '#fff' }} >
                            {`$ ${creditAmount}`}
                        </Text>
                    </View>
                    {/* ------------ Row 3 ------------ */}
                    <View style={{
                        height: scaleSzie(35), backgroundColor: '#205580', marginBottom: scaleSzie(2),
                        paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }} >
                        <Text style={{ fontSize: scaleSzie(13), color: '#fff' }} >
                            Payment by Cash
                        </Text>
                        <Text style={{ fontSize: scaleSzie(20), color: '#fff' }} >
                            $ 1000
                        </Text>
                    </View>
                    {/* ------------ Row 4 ------------ */}
                    <View style={{
                        height: scaleSzie(35), backgroundColor: '#BBEBFA', marginBottom: scaleSzie(2),
                        paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }} >
                        <Text style={{ fontSize: scaleSzie(13), color: '#6A6A6A' }} >
                            Other payment
                        </Text>
                        <Text style={{ fontSize: scaleSzie(20), color: '#6A6A6A' }} >
                            $ 1000
                        </Text>
                    </View>
                    {/* -------- Total ------- */}
                    <View style={{
                        height: scaleSzie(35), backgroundColor: '#FAFAFA', marginTop: scaleSzie(10),
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
                {/* --------- Right --------- */}
                <View style={{ flex: 1.1 }} >
                    <Text style={{ fontSize: scaleSzie(18), color: '#404040' }} >
                        Editable Actual Amount
                    </Text>
                    {/* ------------ Row 1 ------------ */}
                    <View style={{
                        height: scaleSzie(35), marginTop: scaleSzie(8), marginBottom: scaleSzie(2),
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }} >
                        <Text style={{ fontSize: scaleSzie(12), color: '#404040', fontWeight: '600' }} >
                            Payment by Harmony account
                        </Text>
                        <View style={{
                            height: '100%', width: scaleSzie(140), borderColor: '#707070', borderWidth: 1,
                            paddingHorizontal: scaleSzie(10), justifyContent: 'center', alignItems: 'flex-end'
                        }} >
                            <Text style={{ fontSize: scaleSzie(20), color: '#404040', }} >
                                $ 1000
                            </Text>
                        </View>
                    </View>
                    {/* ------------ Row 2 ------------ */}
                    <View style={{
                        height: scaleSzie(35), marginBottom: scaleSzie(2),
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }} >
                        <Text style={{ fontSize: scaleSzie(12), color: '#404040', fontWeight: '600' }} >
                            Payment by Credit card
                        </Text>
                        <View style={{
                            height: '100%', width: scaleSzie(140), borderColor: '#707070', borderWidth: 1,
                            paddingHorizontal: scaleSzie(10), justifyContent: 'center', alignItems: 'flex-end'
                        }} >
                            <Text style={{ fontSize: scaleSzie(20), color: '#404040', }} >
                                $ 1000
                            </Text>
                        </View>
                    </View>
                    {/* ------------ Row 3 ------------ */}
                    <View style={{
                        height: scaleSzie(35), marginBottom: scaleSzie(2),
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }} >
                        <Text style={{ fontSize: scaleSzie(12), color: '#404040', fontWeight: '600' }} >
                        Payment by Cash
                        </Text>
                        <View style={{
                            height: '100%', width: scaleSzie(140), borderColor: '#707070', borderWidth: 1,
                            paddingHorizontal: scaleSzie(10), justifyContent: 'center', alignItems: 'flex-end'
                        }} >
                            <Text style={{ fontSize: scaleSzie(20), color: '#404040', }} >
                                $ 1000
                            </Text>
                        </View>
                    </View>
                    {/* ------------ Row 4 ------------ */}
                    <View style={{
                        height: scaleSzie(35), marginBottom: scaleSzie(2),
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }} >
                        <Text style={{ fontSize: scaleSzie(12), color: '#404040', fontWeight: '600' }} >
                            Other payment
                        </Text>
                        <View style={{
                            height: '100%', width: scaleSzie(140), borderColor: '#707070', borderWidth: 1,
                            paddingHorizontal: scaleSzie(10), justifyContent: 'center', alignItems: 'flex-end'
                        }} >
                            <Text style={{ fontSize: scaleSzie(20), color: '#404040', }} >
                                $ 1000
                            </Text>
                        </View>
                    </View>
                    {/* -------- Total ------- */}
                    <View style={{
                        height: scaleSzie(45), marginTop: scaleSzie(10),
                        flexDirection: 'row', paddingHorizontal: scaleSzie(10), alignItems: 'center',
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
        );
    }

    renderNote() {
        return (
            <View style={{ height: scaleSzie(130), paddingHorizontal: scaleSzie(10) }} >
                <View style={{
                    flex: 1, backgroundColor: '#F1F1F1', borderColor: '#C5C5C5', borderWidth: 1, paddingHorizontal: scaleSzie(16),
                    paddingTop: scaleSzie(20)
                }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                        Lorem Ipsum is simply dummy text of
                        the printing and typesetting industry.
                         Lorem Ipsum has been the industry's standard dummy
                         text ever since
                   </Text>
                    <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: scaleSzie(10) }} >
                        <View style={{ height: scaleSzie(40), flexDirection: 'row' }} >
                            <View style={{
                                flex: 1, backgroundColor: '#fff', borderBottomLeftRadius: 4, borderTopLeftRadius: 4,
                                paddingHorizontal: scaleSzie(10)
                            }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                />
                            </View>
                            <View style={{
                                width: scaleSzie(45), backgroundColor: '#0764B0', borderBottomRightRadius: 4, borderTopRightRadius: 4,
                                justifyContent: 'center', alignItems: 'center'
                            }} >
                                <Image source={IMAGE.arrowNote}
                                    style={{ width: 30, height: 30 }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderButtonConfirm() {
        const { language } = this.props;
        return (
            <View style={{ width: '100%', alignItems: 'center' }} >
                <ButtonCustom
                    width={scaleSzie(300)}
                    height={55}
                    backgroundColor="#0764B0"
                    title={localize('CONFIRM ', language)}
                    textColor="#fff"
                    onPress={this.gotoTabSecondSettle}
                    style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    styleText={{ fontSize: scaleSzie(20), fontWeight: 'bold' }}
                />
            </View>
        );
    }


    render() {
        return (
            <View style={{ flex: 1 }} >
                <NavigationEvents
                    onDidFocus={this.onDidFocus}
                />
                <ScrollView>
                    {this.renderLastSettlement()}
                    {this.renderHeaderStaffList()}
                    {this.renderHeaderTableStaffList()}
                    {this.renderTableStaff()}
                    <View style={{ height: scaleSzie(30) }} />
                    {this.renderReportAmount()}
                    <View style={{ height: scaleSzie(20) }} />
                    {this.renderNote()}
                    <View style={{ height: scaleSzie(30) }} />
                    {this.renderButtonConfirm()}
                    <View style={{ height: scaleSzie(300) }} />
                </ScrollView>
            </View>
        );
    }

}

export default Layout;
