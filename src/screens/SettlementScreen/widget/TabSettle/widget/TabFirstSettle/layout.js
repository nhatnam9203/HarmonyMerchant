import React from 'react';
import {
    View,
    TextInput,
    FlatList,
    ScrollView,
    Image
} from 'react-native';
import _ from 'ramda';

import { ScaleSzie, localize, formatNumberFromCurrency, formatMoney, roundFloatNumber, formatWithMoment } from '@utils';
import {
    Text, ButtonCustom, Button
} from '@components';
import styles from "./style";
import ItemPaymentsReport, { StaffsHeaderTable, StaffsItem, GiftCardItem, TotalItem, HeaderPaymentsReport } from "./widget/ItemsSettlement";
import PopupProcessingReportPax from "./widget/PopupProcessingReportPax";
import ICON from "@resources";

class Layout extends React.Component {

    renderLastSettlement() {
        const { settleWaiting, language } = this.props;
        const { settlementDate } = settleWaiting;
        return (
            <View style={{
                height: ScaleSzie(40), flexDirection: 'row', alignItems: 'center',
            }} >
                <Text style={[styles.txt_top_title, { marginLeft: ScaleSzie(10), marginRight: ScaleSzie(20), }]} >
                    {`${localize('Last Settlement', language)}:`}
                </Text>
                <Text style={[styles.txt_top_title, { fontWeight: '500', marginRight: ScaleSzie(20) }]}  >
                    {formatWithMoment(settlementDate, 'MM/DD/YYYY')}
                </Text>
                <Text style={[styles.txt_top_title, { fontWeight: '500', marginRight: ScaleSzie(20) }]}  >
                    {formatWithMoment(settlementDate, 'hh:mm A')}
                </Text>

                <Button onPress={this.refreshSettlement} style={{
                    position: "absolute", top: ScaleSzie(10), right: ScaleSzie(10),
                    justifyContent: "center"
                }} >
                    <Image source={ICON.refresh_settlement}
                        style={{ width: ScaleSzie(30), height: ScaleSzie(30) }}
                    />
                </Button>
            </View>
        );
    }

    renderHeaderStaffList() {
        const { language } = this.props;
        return (
            <View style={{ height: ScaleSzie(30), flexDirection: 'row', paddingHorizontal: ScaleSzie(10) }} >
                <View style={{ flex: 1.3, justifyContent: 'center' }} >
                    <Text style={styles.txt_table} >
                        {localize('Sales By Staffs', language)}
                    </Text>
                </View>
                <View style={{ width: ScaleSzie(15) }} />
                <View style={{ flex: 1, justifyContent: 'center' }} >
                    <Text style={styles.txt_table} >
                        {localize('Income By Payment Methods', language)}
                    </Text>
                </View>
            </View>
        );
    }

    renderButtonConfirm() {
        const { language } = this.props;
        const { discountSettlement, editPaymentByHarmony, editPaymentByCreditCard, editPaymentByCash, editOtherPayment,
            creditCount
        } = this.state;

        const temtpTotal = roundFloatNumber(
            formatNumberFromCurrency(editPaymentByHarmony) +
            formatNumberFromCurrency(editPaymentByCreditCard) +
            formatNumberFromCurrency(editPaymentByCash) +
            formatNumberFromCurrency(editOtherPayment) +
            formatNumberFromCurrency(discountSettlement)
        );

        if (temtpTotal != 0 || creditCount > 0) {
            return (
                <View style={{
                    flex: 1, justifyContent: "flex-end", alignItems: 'center',
                    paddingBottom: ScaleSzie(15)
                }} >
                    <ButtonCustom
                        width={ScaleSzie(330)}
                        height={50}
                        backgroundColor="#0764B0"
                        title={localize('CONFIRM ', language)}
                        textColor="#fff"
                        onPress={this.gotoTabSecondSettle}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 6 }}
                        styleText={{ fontSize: ScaleSzie(21), fontWeight: '500' }}
                    />
                </View>
            );
        }

        return null;

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
            <View style={{ flex: 1.3, }} >
                {/* ---------- Header --------- */}
                <View style={[styles.box_scale_by_staffs]} >
                    <StaffsHeaderTable />
                    <FlatList
                        data={staffSales}
                        renderItem={({ item, index }) => <StaffsItem
                            staff={item}
                            onPress={this.onPressStaff}
                            sendTotalViaSMS={this.sendTotalViaSMS}
                        />}
                        keyExtractor={(item, index) => `${item.staffId}_${index}`}
                        ListFooterComponent={() => <GiftCardItem
                            total={formatMoney(giftCardTotal)}
                            onPress={this.onPressGiftCardTotal}
                        />}
                    />
                </View>
                <View style={{ height: ScaleSzie(10) }} />
                <TotalItem total={formatMoney(totalAmount + giftCardTotal)} />
            </View>
        );
    }

    renderPaymentMethodsReport() {
        const { settleWaiting } = this.props;
        const { discountSettlement, editPaymentByHarmony, editPaymentByCreditCard, editPaymentByCash, editOtherPayment,
            isEditOtherAmount, isEditCashAmount, creditCount, paymentByGiftcard
        } = this.state;

        const temtpTotal = roundFloatNumber(
            formatNumberFromCurrency(editPaymentByHarmony) +
            formatNumberFromCurrency(editPaymentByCreditCard) +
            formatNumberFromCurrency(editPaymentByCash) +
            formatNumberFromCurrency(editOtherPayment) +
            formatNumberFromCurrency(discountSettlement) +
            formatNumberFromCurrency(paymentByGiftcard)
        );

        return (
            <View style={{ flex: 1, }} >
                <ScrollView
                    ref={this.scrollRef}
                    keyboardShouldPersistTaps="always"
                >
                    <View style={{ borderColor: "#DDDDDD", borderWidth: 1 }} >
                        <HeaderPaymentsReport />
                        <ItemPaymentsReport
                            title="HarmonyPay"
                            backgroundColor="#054071"
                            value={editPaymentByHarmony}
                        />
                        <View style={{ height: 1 }} />
                        <ItemPaymentsReport
                            title={`Credit Card (${(creditCount)})`}
                            backgroundColor="#075BA0"
                            value={editPaymentByCreditCard}
                        />
                        <View style={{ height: 1 }} />
                        <ItemPaymentsReport
                            ref={this.cashAmountRef}
                            title="Cash"
                            backgroundColor="#3480BE"
                            value={editPaymentByCash}
                            isShowEditIcon={true}
                            editAmount={this.editCashAmount}
                            isEdit={isEditCashAmount}
                            onFocus={this.scrollTo}
                            cancelEditAmount={this.cancelEditCashAmount}
                            saveEditAmount={this.saveEditCashAmount}
                            initValue={settleWaiting.paymentByCash ? settleWaiting.paymentByCash : 0.00}
                            isChange={true}
                        />
                        <View style={{ height: 1 }} />
                        <ItemPaymentsReport
                            title="Gift Card"
                            backgroundColor="#3C92D9"
                            value={paymentByGiftcard}
                        />
                        <View style={{ height: 1 }} />
                        <ItemPaymentsReport
                            ref={this.otherAmountRef}
                            title="Other"
                            backgroundColor="#BBD4E9"
                            value={editOtherPayment}
                            isShowEditIcon={true}
                            editAmount={this.editOtherAmount}
                            isEdit={isEditOtherAmount}
                            onFocus={this.scrollTo}
                            cancelEditAmount={this.cancelEditOtherAmount}
                            saveEditAmount={this.saveEditOtherAmount}
                            initValue={settleWaiting.otherPayment ? settleWaiting.otherPayment : 0.00}
                            isChange={true}
                        />
                        <ItemPaymentsReport
                            title="Discount"
                            backgroundColor="#F1F1F1"
                            txtStyle={{
                                color: "#404040"
                            }}
                            value={discountSettlement}
                        />
                    </View>
                    {this.renderNote()}
                    <View style={{ height: ScaleSzie(180) }} />
                </ScrollView>

                <View style={{ height: ScaleSzie(10) }} />
                <TotalItem total={formatMoney(temtpTotal)} />
            </View>
        );
    }

    renderNote() {
        const { note } = this.state;

        return (
            <View style={{}} >
                <Text style={[{
                    color: "#404040", fontSize: ScaleSzie(10), fontWeight: "600",
                    marginBottom: ScaleSzie(5), marginTop: ScaleSzie(12)
                }]} >
                    {`Note`}
                </Text>
                <View style={{
                    height: ScaleSzie(54), borderColor: "#DDDDDD", borderWidth: 1, borderRadius: 4, paddingVertical: 5,
                    paddingHorizontal: ScaleSzie(10)
                }} >
                    <TextInput
                        style={{ flex: 1, fontSize: ScaleSzie(12), padding: 0, color: "#000", textAlignVertical: "top" }}
                        multiline={true}
                        value={note}
                        onChangeText={(note) => this.setState({ note })}
                        onFocus={() => this.scrollRef.current.scrollToEnd()}
                        onBlur={() => this.scrollTo(0)}
                    />
                </View>
            </View>
        );
    }

    render() {
        const { language } = this.props;

        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }} >
                <View style={{ flex: 1 }} >
                    {this.renderLastSettlement()}
                    {this.renderHeaderStaffList()}
                    {/* ------------- Two tables ----------  */}
                    <View style={{ height: ScaleSzie(310 + 30), flexDirection: "row", paddingHorizontal: ScaleSzie(10) }} >
                        {this.renderStaffsTable()}
                        <View style={{ width: ScaleSzie(10), }} />
                        {this.renderPaymentMethodsReport()}
                    </View>
                    {this.renderButtonConfirm()}
                </View>
                <PopupProcessingReportPax
                    visible={this.state.visible}
                    onRequestClose={this.cancelTransaction}
                    language={language}
                />
            </View>
        );
    }

}

export default Layout;

