import React from 'react';
import {
    View,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';

import { scaleSzie } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { ButtonCustom, Text, InputForm } from '@components';
import { ItemCalendar, ItemPromo, ItemDropdown, ItemCheckBoxInput } from './widget';

const {width} = Dimensions.get('window');

class Layout extends React.Component {

    renderDiscountAccording() {
        return (
            <ItemPromo
                title="Discount according to the time frame"
            >
                <View style={{ paddingHorizontal: scaleSzie(10), paddingVertical: scaleSzie(10) }} >
                    <InputForm
                        title="Campaign Name:"
                        subTitle=""
                        placeholder=""
                        // value={bankName}
                        onChangeText={(value) => { }}
                        style={{ marginBottom: scaleSzie(10) }}
                    />
                    <Text style={styles.textNormal} >
                        Campaign Time:
                            </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCalendar
                            title="Start Date"
                            placeholder="01/01/19"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCalendar
                            title="End Date"
                            placeholder="01/01/19"

                        />
                    </View>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row', marginTop: scaleSzie(2), marginBottom: scaleSzie(20) }} >
                        <ItemDropdown
                            title="From"
                            width={100}
                            placeholder="08:00 AM"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemDropdown
                            title="To"
                            width={100}
                            placeholder="08:00 AM"
                        />
                    </View>
                    {/* ---- Row ---- */}
                    <Text style={styles.textNormal} >
                        Promotion form:
                            </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCheckBoxInput
                            title="Discount by percent (%)"
                            placeholder="15"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCheckBoxInput
                            title="Discount fixtom amount ($)"
                            placeholder="100"
                        />
                    </View>
                </View>
            </ItemPromo>
        );
    }

    renderDiscountServices() {
        return (
            <ItemPromo
                title="Discount when using the following services"
                style={{ marginTop: scaleSzie(15) }}
            >
                <View style={{ paddingHorizontal: scaleSzie(10), paddingVertical: scaleSzie(10) }} >
                    <InputForm
                        title="Campaign Name:"
                        subTitle=""
                        placeholder=""
                        // value={bankName}
                        onChangeText={(value) => { }}
                        style={{ marginBottom: scaleSzie(10) }}
                    />
                    <Text style={styles.textNormal} >
                        Campaign Time:
                            </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCalendar
                            title="Start Date"
                            placeholder="01/01/19"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCalendar
                            title="End Date"
                            placeholder="01/01/19"

                        />
                    </View>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row', marginTop: scaleSzie(2), marginBottom: scaleSzie(20) }} >
                        <ItemDropdown
                            title="From"
                            width={100}
                            placeholder="08:00 AM"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemDropdown
                            title="To"
                            width={100}
                            placeholder="08:00 AM"
                        />
                    </View>
                    {/* ---- Row ---- */}
                    <Text style={styles.textNormal} >
                        Promotion form:
                            </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCheckBoxInput
                            title="Discount by percent (%)"
                            placeholder="15"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCheckBoxInput
                            title="Discount fixtom amount ($)"
                            placeholder="100"
                        />
                    </View>
                </View>
            </ItemPromo>
        );
    }

    renderDiscountOnBirthday() {
        return (
            <ItemPromo
                title="Discount on birthday"
                style={{ marginTop: scaleSzie(15) }}
            >
                <View style={{ paddingHorizontal: scaleSzie(10), paddingVertical: scaleSzie(10) }} >
                    <InputForm
                        title="Campaign Name:"
                        subTitle=""
                        placeholder=""
                        // value={bankName}
                        onChangeText={(value) => { }}
                        style={{ marginBottom: scaleSzie(10) }}
                    />
                    {/* ---- Row ---- */}
                    <Text style={styles.textNormal} >
                        Promotion form:
                            </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCheckBoxInput
                            title="Discount by percent (%)"
                            placeholder="15"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCheckBoxInput
                            title="Discount fixtom amount ($)"
                            placeholder="100"
                        />
                    </View>
                </View>
            </ItemPromo>
        );
    }

    renderDiscountLoyalCustomer() {
        return (
            <ItemPromo
                title="Discount for loyal customers"
                style={{ marginTop: scaleSzie(15) }}
            >
                <View style={{ paddingHorizontal: scaleSzie(10), paddingVertical: scaleSzie(10) }} >
                    <InputForm
                        title="Campaign Name:"
                        subTitle=""
                        placeholder=""
                        // value={bankName}
                        onChangeText={(value) => { }}
                        style={{ marginBottom: scaleSzie(10) }}
                    />
                    {/* ---- Row ---- */}
                    <View style={{ width: scaleSzie(200) }}  >
                        <InputForm
                            title="Promotion applied on (times)"
                            subTitle=""
                            placeholder="6"
                            // value={bankName}
                            onChangeText={(value) => { }}
                            style={{ marginBottom: scaleSzie(10) }}
                        />
                    </View>
                    {/* ---- Row ---- */}
                    <Text style={styles.textNormal} >
                        Promotion form:
                            </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCheckBoxInput
                            title="Discount by percent (%)"
                            placeholder="15"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCheckBoxInput
                            title="Discount fixtom amount ($)"
                            placeholder="100"
                        />
                    </View>
                </View>
            </ItemPromo>
        );
    }

    renderDiscountForReferrals() {
        return (
            <ItemPromo
                title="Discount for referrals"
                style={{ marginTop: scaleSzie(15) }}
            >
                <View style={{ paddingHorizontal: scaleSzie(10), paddingVertical: scaleSzie(10) }} >
                    <InputForm
                        title="Campaign Name:"
                        subTitle=""
                        placeholder=""
                        // value={bankName}
                        onChangeText={(value) => { }}
                        style={{ marginBottom: scaleSzie(10) }}
                    />
                    {/* ---- Row ---- */}
                    <Text style={styles.textNormal} >
                        Promotion form:
                            </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCheckBoxInput
                            title="Discount by percent (%)"
                            placeholder="15"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCheckBoxInput
                            title="Discount fixtom amount ($)"
                            placeholder="100"
                        />
                    </View>
                </View>
            </ItemPromo>
        );
    }


    render() {
        return (
            <View style={styles.container} >
                <View style={{ flex: 1 }} >
                    <ScrollView>
                        {this.renderDiscountAccording()}
                        {this.renderDiscountServices()}
                        {this.renderDiscountOnBirthday()}
                        {this.renderDiscountLoyalCustomer()}
                        {this.renderDiscountForReferrals()}
                        <View style={{ height: scaleSzie(300) }} />
                    </ScrollView>
                </View>
                <View style={{position:'absolute',bottom:0,
                width:width,height: scaleSzie(70), alignItems: 'center' }} >
                    <ButtonCustom
                          width={scaleSzie(290)}
                          height={60}
                        backgroundColor="#0764B0"
                        title="APPLY"
                        textColor="#fff"
                        onPress={() => { }}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    />
                </View>

            </View>
        );
    }
}


export default Layout;

