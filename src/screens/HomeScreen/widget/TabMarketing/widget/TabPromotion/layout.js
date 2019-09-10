import React from 'react';
import {
    View,
    Image,
    ScrollView,
    Dimensions,
    ActivityIndicator
} from 'react-native';

import { scaleSzie, localize, updateStateChildren } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { ButtonCustom, Text, InputForm, DatePicker } from '@components';
import {
    ItemCalendar, ItemPromo, ItemDropdown, ItemCheckBoxInput, PromotionFirst,
    PromotionSecond, PromotionThird
} from './widget';

const { width } = Dimensions.get('window');

class Layout extends React.Component {


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

    renderDiscountForReferrals() {
        const { language } = this.props;
        return (
            <ItemPromo
                title={localize('Discount for referrals', language)}
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

    renderLoadingPromotion() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{ scale: 4 }]
            }} >
                <ActivityIndicator
                    size={'large'}
                    color="rgb(83,157,209)"
                />
            </View>

        );
    }

    render() {
        const { language, promotions } = this.props;
        const { show, dateCalendar } = this.state;
        if (promotions.length == 0) {
            return this.renderLoadingPromotion();
        }
        return (
            <View style={styles.container} >
                <View style={{ flex: 1 }} >
                    <ScrollView>
                        <PromotionFirst
                            ref={this.promotionFirstRef}
                            language={language}
                            data={this.getDataItemPromotion(1, promotions)}
                            showCalendar={this.showCalendar}
                        />
                        <View style={{ height: scaleSzie(16) }} />
                        <PromotionSecond
                            ref={this.promotionSecondRef}
                            language={language}
                            data={this.getDataItemPromotion(2, promotions)}
                            showCalendar={this.showCalendar}
                            dataDropdown={this.getDataDropdownService()}
                        />
                        <PromotionThird
                            ref={this.promotionSecondRef}
                            language={language}
                            data={this.getDataItemPromotion(3, promotions)}
                        />
                        {/* {this.renderDiscountOnBirthday()} */}
                        {this.renderDiscountLoyalCustomer()}
                        {this.renderDiscountForReferrals()}
                        <View style={{ height: scaleSzie(300) }} />
                    </ScrollView>
                </View>

                {/* ------- Date -------- */}
                <DatePicker
                    visible={show}
                    onRequestClose={() => this.setState({ show: false })}
                    title="Select From Date"
                    dateCalendar={dateCalendar}
                    setDateSelected={this.setDateSelected}
                />

                {/* -------- Button ------------ */}
                <View style={{
                    position: 'absolute', bottom: 0,
                    width: width, height: scaleSzie(70), flexDirection: 'row', justifyContent: 'center'
                }} >
                    <View style={{ width: scaleSzie(20) }} />
                    <ButtonCustom
                        width={scaleSzie(290)}
                        height={60}
                        backgroundColor="#0764B0"
                        title={localize('APPLY', language)}
                        textColor="#fff"
                        onPress={this.applyPromotion}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    />
                </View>

            </View>
        );
    }
}




export default Layout;

