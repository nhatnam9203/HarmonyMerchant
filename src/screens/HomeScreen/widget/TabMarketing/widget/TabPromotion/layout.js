import React from 'react';
import {
    View,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { ButtonCustom, Text, InputForm } from '@components';
import { ItemCalendar, ItemPromo, ItemDropdown, ItemCheckBoxInput } from './widget';

const { width } = Dimensions.get('window');

class Layout extends React.Component {

    renderDiscountAccording() {
        const { language } = this.props;
        return (
            <ItemPromo
                title={localize('Discount according to the time frame', language)}
            >
                <View style={{ paddingHorizontal: scaleSzie(10), paddingVertical: scaleSzie(10) }} >
                    <InputForm
                        title={localize('Campaign Name:', language)}
                        subTitle=""
                        placeholder=""
                        // value={bankName}
                        onChangeText={(value) => { }}
                        style={{ marginBottom: scaleSzie(10) }}
                    />
                    <Text style={styles.textNormal} >

                        {localize('Campaign Time:', language)}
                    </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCalendar
                            title={localize('Start Date', language)}
                            placeholder="01/01/19"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCalendar
                            title={localize('End Date', language)}
                            placeholder="01/01/19"

                        />
                    </View>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row', marginTop: scaleSzie(2), marginBottom: scaleSzie(20) }} >
                        <ItemDropdown
                            title={localize('From', language)}
                            width={100}
                            placeholder="08:00 AM"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemDropdown
                            title={localize('To', language)}
                            width={100}
                            placeholder="08:00 AM"
                        />
                    </View>
                    {/* ---- Row ---- */}
                    <Text style={styles.textNormal} >
                        {localize('Promotion form:', language)}
                    </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCheckBoxInput
                            title={localize('Discount by percent (%)', language)}
                            placeholder="15"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCheckBoxInput
                            title={localize('Discount fixtom amount ($)', language)}
                            placeholder="100"
                        />
                    </View>
                </View>
            </ItemPromo>
        );
    }

    renderDiscountServices() {
        const { language } = this.props;
        return (
            <ItemPromo
                title={localize('Discount when using the following services', language)}
                style={{ marginTop: scaleSzie(15) }}
            >
                <View style={{ paddingHorizontal: scaleSzie(10), paddingVertical: scaleSzie(10) }} >
                    <InputForm
                        title={localize('Campaign Name:', language)}
                        subTitle=""
                        placeholder=""
                        // value={bankName}
                        onChangeText={(value) => { }}
                        style={{ marginBottom: scaleSzie(10) }}
                    />
                    <Text style={styles.textNormal} >
                        {localize('Campaign Time:', language)}
                    </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCalendar
                            title={localize('Start Date', language)}
                            placeholder="01/01/19"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCalendar
                            title={localize('End Date', language)}
                            placeholder="01/01/19"

                        />
                    </View>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row', marginTop: scaleSzie(2), marginBottom: scaleSzie(20) }} >
                        <ItemDropdown
                            title={localize('From', language)}
                            width={100}
                            placeholder="08:00 AM"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemDropdown
                            title={localize('To', language)}
                            width={100}
                            placeholder="08:00 AM"
                        />
                    </View>
                    {/* ---- Row ---- */}
                    <Text style={styles.textNormal} >
                        {localize('Promotion form:', language)}
                    </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCheckBoxInput
                            title={localize('Discount by percent (%)', language)}
                            placeholder="15"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCheckBoxInput
                            title={localize('Discount fixtom amount ($)', language)}
                            placeholder="100"
                        />
                    </View>
                </View>
            </ItemPromo>
        );
    }

    renderDiscountOnBirthday() {
        const { language } = this.props;
        return (
            <ItemPromo
                title={localize('Discount on birthday', language)}
                style={{ marginTop: scaleSzie(15) }}
            >
                <View style={{ paddingHorizontal: scaleSzie(10), paddingVertical: scaleSzie(10) }} >
                    <InputForm
                        title={localize('Campaign Name:', language)}
                        subTitle=""
                        placeholder=""
                        // value={bankName}
                        onChangeText={(value) => { }}
                        style={{ marginBottom: scaleSzie(10) }}
                    />
                    {/* ---- Row ---- */}
                    <Text style={styles.textNormal} >
                        {localize('Promotion form:', language)}
                    </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCheckBoxInput
                            title={localize('Discount by percent (%)', language)}
                            placeholder="15"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCheckBoxInput
                            title={localize('Discount fixtom amount ($)', language)}
                            placeholder="100"
                        />
                    </View>
                </View>
            </ItemPromo>
        );
    }

    renderDiscountLoyalCustomer() {
        const { language } = this.props;
        return (
            <ItemPromo
                title={localize('Discount for loyal customers', language)}
                style={{ marginTop: scaleSzie(15) }}
            >
                <View style={{ paddingHorizontal: scaleSzie(10), paddingVertical: scaleSzie(10) }} >
                    <InputForm
                        title={localize('Campaign Name:', language)}
                        subTitle=""
                        placeholder=""
                        // value={bankName}
                        onChangeText={(value) => { }}
                        style={{ marginBottom: scaleSzie(10) }}
                    />
                    {/* ---- Row ---- */}
                    <View style={{ width: scaleSzie(200) }}  >
                        <InputForm
                            title={localize('Promotion applied on (times)', language)}
                            subTitle=""
                            placeholder="6"
                            // value={bankName}
                            onChangeText={(value) => { }}
                            style={{ marginBottom: scaleSzie(10) }}
                        />
                    </View>
                    {/* ---- Row ---- */}
                    <Text style={styles.textNormal} >
                        {localize('Promotion form:', language)}
                    </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCheckBoxInput
                            title={localize('Discount by percent (%)',language)}
                            placeholder="15"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCheckBoxInput
                            title={localize('Discount fixtom amount ($)',language)}
                            placeholder="100"
                        />
                    </View>
                </View>
            </ItemPromo>
        );
    }

    renderDiscountForReferrals() {
        const {language} = this.props;
        return (
            <ItemPromo
                title={localize('Discount for referrals',language)}
                style={{ marginTop: scaleSzie(15) }}
            >
                <View style={{ paddingHorizontal: scaleSzie(10), paddingVertical: scaleSzie(10) }} >
                    <InputForm
                        title={localize('Campaign Name:',language)}
                        subTitle=""
                        placeholder=""
                        // value={bankName}
                        onChangeText={(value) => { }}
                        style={{ marginBottom: scaleSzie(10) }}
                    />
                    {/* ---- Row ---- */}
                    <Text style={styles.textNormal} >
                        {localize('Promotion form:',language)}
                    </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCheckBoxInput
                            title={localize('Discount by percent (%)',language)}
                            placeholder="15"
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCheckBoxInput
                            title={localize('Discount fixtom amount ($)',language)}
                            placeholder="100"
                        />
                    </View>
                </View>
            </ItemPromo>
        );
    }


    render() {
        const { language } = this.props;
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
                <View style={{
                    position: 'absolute', bottom: 0,
                    width: width, height: scaleSzie(70), flexDirection:'row',justifyContent:'center'
                }} >
                    {/* <ButtonCustom
                        width={scaleSzie(290)}
                        height={60}
                        backgroundColor="#0764B0"
                        title={localize('SET', language)}
                        textColor="#fff"
                        onPress={this.applyPromorion}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    /> */}
                    <View style={{width:scaleSzie(20)}} />
                      <ButtonCustom
                        width={scaleSzie(290)}
                        height={60}
                        backgroundColor="#0764B0"
                        title={localize('APPLY', language)}
                        textColor="#fff"
                        // onPress={this.paymentCredit}
                        onPress={() =>{}}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    />
                </View>

            </View>
        );
    }
}


export default Layout;

