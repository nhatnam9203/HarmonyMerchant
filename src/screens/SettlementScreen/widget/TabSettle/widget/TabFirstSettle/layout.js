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
    Text, ButtonCustom
} from '@components';
import styles from "./style";
import ItemPaymentsReport, { StaffsHeaderTable, StaffsItem, GiftCardItem, TotalItem, HeaderPaymentsReport } from "./widget/ItemsSettlement";

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
                        {localize('Sales By Staffs', language)}
                    </Text>
                </View>
                <View style={{ width: scaleSzie(15) }} />
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
        const { settleWaiting } = this.props;
        const { discountSettlement, editPaymentByHarmony, editPaymentByCreditCard, editPaymentByCash, editOtherPayment,
            isEditOtherAmount, isEditCashAmount
        } = this.state;

        const temtpTotal = roundFloatNumber(
            formatNumberFromCurrency(editPaymentByHarmony) +
            formatNumberFromCurrency(editPaymentByCreditCard) +
            formatNumberFromCurrency(editPaymentByCash) +
            formatNumberFromCurrency(editOtherPayment) +
            formatNumberFromCurrency(discountSettlement)
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
                            title="Harmony Account"
                            backgroundColor="#054071"
                            value={editPaymentByHarmony}
                        />
                        <View style={{ height: 1 }} />
                        <ItemPaymentsReport
                            title="Credit Card"
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
                    <View style={{ height: scaleSzie(150) }} />
                </ScrollView>

                <View style={{ height: scaleSzie(10) }} />
                <TotalItem total={formatMoney(temtpTotal)} />
            </View>
        );
    }

    renderNote() {
        const { note } = this.state;

        return (
            <View style={{}} >
                <Text style={[{
                    color: "#404040", fontSize: scaleSzie(10), fontWeight: "600",
                    marginBottom: scaleSzie(5), marginTop: scaleSzie(12)
                }]} >
                    {`Note`}
                </Text>
                <View onPress={() => this.setState({ isShowKeyboard: true })} style={{
                    height: scaleSzie(55), borderColor: "#DDDDDD", borderWidth: 1, borderRadius: 4, paddingVertical: 5,
                    paddingHorizontal: scaleSzie(10)
                }} >
                    <TextInput
                        style={{ flex: 1, fontSize: scaleSzie(12) }}
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

