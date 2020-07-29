import React from 'react';
import {
    View,
    TextInput,
    FlatList,
    ScrollView,
    Dimensions,
    RefreshControl,
} from 'react-native';
import _ from 'ramda';

import { scaleSzie, localize, formatNumberFromCurrency, formatMoney, roundFloatNumber, formatWithMoment } from '@utils';
import {
    Text, ButtonCustom,
} from '@components';
import TextInputAmount from './widget/TextInputAmount';
import TotalCustom from './widget/TotalCustom';
import styles from "./style";
import { StaffsHeaderTable, StaffsItem, GiftCardItem, TotalItem, HeaderPaymentsReport, ItemPaymentsReport } from "./widget/ItemsSettlement";

const { height } = Dimensions.get('window');

class Layout extends React.Component {

    renderLastSettlement() {
        const { settleWaiting, language } = this.props;
        const { settlementDate } = settleWaiting;
        return (
            <View style={{ height: scaleSzie(40), flexDirection: 'row', alignItems: 'center' }} >
                <Text style={[styles.txt_top_title, { marginLeft: scaleSzie(10), marginRight: scaleSzie(20), }]} >
                    {`${localize('Last Settlement', language)}:`}
                </Text>
                <Text style={[styles.txt_top_title, { fontWeight: '500', marginRight: scaleSzie(20) }]}  >
                    {formatWithMoment(settlementDate, 'MM/DD/YYYY')}
                </Text>
                <Text style={[styles.txt_top_title, { fontWeight: '500', marginRight: scaleSzie(20) }]}  >
                    {formatWithMoment(settlementDate, 'hh:mm A')}
                </Text>
            </View>
        );
    }

    renderHeaderStaffList() {
        const { language } = this.props;
        return (
            <View style={{ height: scaleSzie(35), flexDirection: 'row', paddingHorizontal: scaleSzie(10) }} >
                <View style={{ flex: 1.1, justifyContent: 'center' }} >
                    <Text style={styles.txt_table} >
                        {localize('Sales by staffs', language)}
                    </Text>
                </View>
                <View style={{ width: scaleSzie(15) }} />
                <View style={{ flex: 1, justifyContent: 'center' }} >
                    <Text style={styles.txt_table} >
                        {localize('Income by payment methods', language)}
                    </Text>
                </View>
            </View>
        );
    }



    renderEditReportAmount() {
        const { language } = this.props;
        const { creditCount, editPaymentByHarmony, editPaymentByCreditCard, editPaymentByCash, editOtherPayment } = this.state;

        const temtpTotal = roundFloatNumber(
            formatNumberFromCurrency(editPaymentByHarmony) +
            formatNumberFromCurrency(editPaymentByCreditCard) +
            formatNumberFromCurrency(editPaymentByCash) +
            formatNumberFromCurrency(editOtherPayment)
        );

        return (
            <View style={{ flex: 1.1 }} >
                <Text style={{ fontSize: scaleSzie(18), color: '#404040' }} >
                    {localize('Editable Actual Amount', language)}
                </Text>
                {/* ------------ Row 1 ------------ */}
                <View style={{
                    height: scaleSzie(35), marginTop: scaleSzie(8), marginBottom: scaleSzie(2),
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                }} >
                    <Text style={{ fontSize: scaleSzie(12), color: '#404040', fontWeight: '600' }} >

                        {localize('Payment by HarmonyPay', language)}
                    </Text>
                    <View style={{
                        height: '100%', width: scaleSzie(140), borderColor: '#707070', borderWidth: 1,
                        paddingHorizontal: scaleSzie(6),
                    }} >
                        {/* ------------ Text Input ---- */}
                        <TextInputAmount
                            value={editPaymentByHarmony}
                            onChangeText={(value) => this.updateTotalCustom("editPaymentByHarmony", value)}
                            onFocus={() => this.scrollTo(450)}
                            editable={false}
                        />
                    </View>
                </View>
                {/* ------------ Row 2 ------------ */}
                <View style={{
                    height: scaleSzie(35), marginBottom: scaleSzie(2),
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                }} >
                    <View>
                        <Text style={{ fontSize: scaleSzie(12), color: '#404040', fontWeight: '600' }} >

                            {`${localize('Payment by Credit Card', language)}`}
                        </Text>
                        <Text style={{ fontSize: scaleSzie(10), color: '#404040' }} >
                            {`(Credit Count: ${creditCount})`}
                        </Text>

                    </View>

                    <View style={{
                        height: '100%', width: scaleSzie(140), borderColor: '#707070', borderWidth: 1,
                        paddingHorizontal: scaleSzie(6),
                    }} >

                        <TextInputAmount
                            ref={this.inputCreditPaymentRef}
                            value={editPaymentByCreditCard}
                            onChangeText={(value) => this.updateTotalCustom("editPaymentByCreditCard", value)}
                            onFocus={() => this.scrollTo(450)}
                            editable={false}
                        />
                    </View>
                </View>
                {/* ------------ Row 3 ------------ */}
                <View style={{
                    height: scaleSzie(35), marginBottom: scaleSzie(2),
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                }} >
                    <Text style={{ fontSize: scaleSzie(12), color: '#404040', fontWeight: '600' }} >

                        {localize('Payment by Cash', language)}
                    </Text>
                    <View style={{
                        height: '100%', width: scaleSzie(140), borderColor: '#707070', borderWidth: 1,
                        paddingHorizontal: scaleSzie(6)
                    }} >
                        <TextInputAmount
                            value={editPaymentByCash}
                            onChangeText={(value) => this.updateTotalCustom("editPaymentByCash", value)}
                            onFocus={() => this.scrollTo(450)}
                        />
                    </View>
                </View>
                {/* ------------ Row 4 ------------ */}
                <View style={{
                    height: scaleSzie(35), marginBottom: scaleSzie(2),
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                }} >
                    <Text style={{ fontSize: scaleSzie(12), color: '#404040', fontWeight: '600' }} >

                        {localize('Other Payment', language)}
                    </Text>
                    <View style={{
                        height: '100%', width: scaleSzie(140), borderColor: '#707070', borderWidth: 1,
                        paddingHorizontal: scaleSzie(6),
                    }} >
                        <TextInputAmount
                            value={editOtherPayment}
                            onChangeText={(value) => this.updateTotalCustom("editOtherPayment", value)}
                            onFocus={() => this.scrollTo(450)}
                        />
                    </View>
                </View>
                {/* -------- Total Custom ------- */}
                <TotalCustom
                    total={formatMoney(temtpTotal)}
                />
            </View>
        );
    }

    renderReportAmount() {
        const { settleWaiting, language } = this.props;
        const { creditAmount } = this.state;

        const temptCreditAmount = creditAmount === 0 || creditAmount === "" ? 0 : creditAmount / 100;
        const temtpTotal = formatMoney((formatNumberFromCurrency(settleWaiting.total) - formatNumberFromCurrency(settleWaiting.paymentByCreditCard) + formatNumberFromCurrency(temptCreditAmount)));

        return (
            <View style={{ paddingHorizontal: scaleSzie(10), flexDirection: 'row' }} >
                {/* --------- Left --------- */}
                <View style={{ flex: 1.2, paddingRight: scaleSzie(30) }} >
                    <Text style={{ fontSize: scaleSzie(18), color: '#404040' }} >

                        {localize('Report Amount', language)}
                    </Text>
                    {/* ------------ Row 1 ------------ */}
                    <View style={{
                        height: scaleSzie(35), backgroundColor: '#80C6FF', marginTop: scaleSzie(8), marginBottom: scaleSzie(2),
                        paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }} >
                        <Text style={{ fontSize: scaleSzie(13), color: '#fff' }} >
                            {localize('Payment by HarmonyPay', language)}
                        </Text>
                        <Text style={{ fontSize: scaleSzie(20), color: '#fff' }} >
                            {`$ ${settleWaiting.paymentByHarmony}`}
                        </Text>
                    </View>
                    {/* ------------ Row 2 ------------ */}
                    <View style={{
                        height: scaleSzie(35), backgroundColor: '#307FBF', marginBottom: scaleSzie(2),
                        paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }} >
                        <Text style={{ fontSize: scaleSzie(13), color: '#fff' }} >

                            {localize('Payment by Credit Card', language)}
                        </Text>
                        <Text style={{ fontSize: scaleSzie(20), color: '#fff' }} >
                            {`$ ${settleWaiting.paymentByCreditCard}`}
                        </Text>
                    </View>
                    {/* ------------ Row 3 ------------ */}
                    <View style={{
                        height: scaleSzie(35), backgroundColor: '#205580', marginBottom: scaleSzie(2),
                        paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }} >
                        <Text style={{ fontSize: scaleSzie(13), color: '#fff' }} >

                            {localize('Payment by Cash', language)}
                        </Text>
                        <Text style={{ fontSize: scaleSzie(20), color: '#fff' }} >
                            {`$ ${settleWaiting.paymentByCash}`}
                        </Text>
                    </View>
                    {/* ------------ Row 4 ------------ */}
                    <View style={{
                        height: scaleSzie(35), backgroundColor: '#BBEBFA', marginBottom: scaleSzie(2),
                        paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }} >
                        <Text style={{ fontSize: scaleSzie(13), color: '#6A6A6A' }} >

                            {localize('Other Payment', language)}
                        </Text>
                        <Text style={{ fontSize: scaleSzie(20), color: '#6A6A6A' }} >
                            {`$ ${settleWaiting.otherPayment}`}
                        </Text>
                    </View>
                    {/* -------- Total ------- */}
                    <View style={{
                        height: scaleSzie(35), backgroundColor: '#FAFAFA', marginTop: scaleSzie(10),
                        borderColor: '#4CD964', borderWidth: 1, flexDirection: 'row', paddingHorizontal: scaleSzie(10), alignItems: 'center',
                        justifyContent: 'space-between'
                    }} >
                        <Text style={{ fontSize: scaleSzie(20), color: '#0764B0' }} >
                            {`${localize('Total', language)}:`}
                        </Text>
                        <Text style={{ fontSize: scaleSzie(20), color: '#4CD964', fontWeight: 'bold' }} >
                            {`$ ${settleWaiting.total}`}
                        </Text>
                    </View>
                </View>
                {/* --------- Right --------- */}
                {this.renderEditReportAmount()}
            </View>
        );
    }

    renderNote() {
        return (
            <View style={{ height: scaleSzie(60), paddingHorizontal: scaleSzie(10) }} >
                <View style={{
                    flex: 1, backgroundColor: '#F1F1F1', borderColor: '#C5C5C5', borderWidth: 1, paddingHorizontal: scaleSzie(16),
                    paddingTop: scaleSzie(20)
                }} >
                    <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: scaleSzie(10) }} >
                        <View style={{ height: scaleSzie(40), flexDirection: 'row' }} >
                            <View style={{
                                flex: 1, backgroundColor: '#fff', borderBottomLeftRadius: 4, borderTopLeftRadius: 4,
                                paddingHorizontal: scaleSzie(10)
                            }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                    value={this.state.note}
                                    onChangeText={(note) => this.setState({ note })}
                                    onFocus={() => this.scrollTo(700)}
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
            <View style={{
                flex: 1, justifyContent: "flex-end", alignItems: 'center',
                paddingBottom: scaleSzie(15)
            }} >
                <ButtonCustom
                    width={scaleSzie(330)}
                    height={50}
                    backgroundColor="#0764B0"
                    title={localize('CONFIRM ', language)}
                    textColor="#fff"
                    onPress={this.gotoTabSecondSettle}
                    style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 6 }}
                    styleText={{ fontSize: scaleSzie(21), fontWeight: '500' }}
                />
            </View>
        );
    }

    renderStaffsTable() {
        const { staffSales, gitfCardSales } = this.props;
        let totalAmount = 0;
        let giftCardTotal = 0
        if (staffSales.length > 0) {
            staffSales.forEach(staff => {
                totalAmount = parseFloat(totalAmount) + parseFloat(formatNumberFromCurrency(staff.total ? staff.total : 0.00));
            });
        }

        if (gitfCardSales.length > 0) {
            gitfCardSales.forEach(giftCard => {
                giftCardTotal = parseFloat(giftCardTotal) + parseFloat(formatNumberFromCurrency(giftCard.total ? giftCard.total : 0.00));
            });
        }

        return (
            <View style={{ flex: 1.1, }} >
                {/* ---------- Header --------- */}
                <View style={[styles.box_scale_by_staffs]} >
                    <StaffsHeaderTable />
                    <FlatList
                        data={staffSales}
                        renderItem={({ item, index }) => <StaffsItem
                            staff={item}
                            onPress={this.onPressStaff}
                        />}
                        keyExtractor={(item, index) => `${item.staffId}_${index}`}
                        ListFooterComponent={() => <GiftCardItem 
                            total={formatMoney(giftCardTotal)}
                            onPress={this.onPressGiftCardTotal}
                             />}
                    />
                </View>
                <View style={{ height: scaleSzie(10) }} />
                <TotalItem total={formatMoney(totalAmount + giftCardTotal)} />
            </View>
        );
    }

    renderPaymentMethodsReport() {
        return (
            <View style={{ flex: 1, }} >
                <View style={{ borderColor: "#DDDDDD", borderWidth: 1 }} >
                    <HeaderPaymentsReport />
                    <ItemPaymentsReport
                        title="Harmony account"
                        backgroundColor="#054071"
                    />
                    <View style={{ height: 1 }} />
                    <ItemPaymentsReport
                        title="Credit card"
                        backgroundColor="#075BA0"
                    />
                    <View style={{ height: 1 }} />
                    <ItemPaymentsReport
                        title="Cash"
                        backgroundColor="#3480BE"
                    />
                    <View style={{ height: 1 }} />
                    <ItemPaymentsReport
                        title="Other"
                        backgroundColor="#BBD4E9"
                    />
                    <ItemPaymentsReport
                        title="Discount"
                        backgroundColor="#F1F1F1"
                        txtStyle={{
                            color: "#404040"
                        }}
                    />
                </View>

                {/* ---------- Note --------- */}
                <View style={{ flex: 1 }} >
                    <Text style={{
                        color: "#404040", fontSize: scaleSzie(10), fontWeight: "600", marginTop: scaleSzie(12),
                        marginBottom: scaleSzie(5)
                    }} >
                        {`Note`}
                    </Text>
                    <View style={{
                        flex: 1, borderColor: "#DDDDDD", borderWidth: 1, borderRadius: 6, paddingVertical: 5,
                        paddingHorizontal: scaleSzie(10)
                    }} >
                        <TextInput
                            style={{ flex: 1, fontSize: scaleSzie(12) }}
                            multiline={true}
                        />
                    </View>
                </View>
                <View style={{ height: scaleSzie(10) }} />
                <TotalItem total={formatMoney(90)} />
            </View>
        );
    }

    render() {
        const { settleWaiting, language } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }} >
                {
                    _.isEmpty(settleWaiting) || settleWaiting.checkout.length === 0 ?
                        <ScrollView
                            keyboardShouldPersistTaps="always"
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.props.refreshingSettle}
                                    onRefresh={this.onRefreshSettle}
                                />
                            }
                        >
                            <View style={{
                                flex: 1,
                                alignItems: 'center'
                            }} >
                                <Text style={{
                                    color: '#6A6A6A', fontSize: scaleSzie(40),
                                    marginTop: height / 2.8
                                }} >

                                    {localize('Empty Batch', language)}
                                </Text>
                                <Text style={{
                                    color: '#6A6A6A', fontSize: scaleSzie(18),
                                    marginTop: 10
                                }} >
                                    {`(${localize('Pull to refresh', language)} )`}

                                </Text>
                            </View>
                        </ScrollView>
                        :

                        <View style={{ flex: 1 }} >
                            {this.renderLastSettlement()}
                            {this.renderHeaderStaffList()}
                            {/* ------------- Two tables ----------  */}
                            <View style={{ height: scaleSzie(310), flexDirection: "row", paddingHorizontal: scaleSzie(10) }} >
                                {this.renderStaffsTable()}
                                <View style={{ width: scaleSzie(10), }} />
                                {this.renderPaymentMethodsReport()}
                            </View>
                            {this.renderButtonConfirm()}
                        </View>
                }

            </View>
        );
    }

}

export default Layout;

