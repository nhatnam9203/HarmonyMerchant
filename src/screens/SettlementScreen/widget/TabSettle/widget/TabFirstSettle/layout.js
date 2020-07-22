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
import ItemStaff from './widget/ItemStaff';
import TotalCustom from './widget/TotalCustom';

const { width, height } = Dimensions.get('window');

class Layout extends React.Component {

    renderLastSettlement() {
        const { settleWaiting, language } = this.props;
        const { settlementDate } = settleWaiting;
        return (
            <View style={{ height: scaleSzie(50), backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }} >
                <Text style={{ color: '#0764B0', fontSize: scaleSzie(14), marginLeft: scaleSzie(10), marginRight: scaleSzie(20) }} >
                    {`${localize('Last Settlement', language)}:`}
                </Text>
                <Text style={{ color: '#0764B0', fontSize: scaleSzie(16), fontWeight: 'bold', marginRight: scaleSzie(20) }} >
                    {formatWithMoment(settlementDate, 'MM/DD/YYYY')}
                </Text>
                <Text style={{ color: '#0764B0', fontSize: scaleSzie(16), fontWeight: 'bold', marginRight: scaleSzie(20) }} >
                    {formatWithMoment(settlementDate, 'hh:mm A')}
                </Text>
            </View>
        );
    }

    renderHeaderStaffList() {
        const { language } = this.props;
        return (
            <View style={{ height: scaleSzie(45), backgroundColor: '#FAFAFA', flexDirection: 'row' }} >
                <View style={{ flex: 1, paddingLeft: scaleSzie(10), justifyContent: 'center' }} >
                    <Text style={{ color: '#0764B0', fontSize: scaleSzie(18) }} >
                        {localize('Staff List', language)}
                    </Text>
                </View>
                <View style={{ width: scaleSzie(2) }} />
                <View style={{ flex: 1.2, paddingLeft: scaleSzie(10), justifyContent: 'center' }} >
                    <Text style={{ color: '#0764B0', fontSize: scaleSzie(18) }} >

                        {localize('Staff Statistic', language)}
                    </Text>
                </View>
            </View>
        );
    }

    renderHeaderTableStaffList() {
        const { language } = this.props;
        return (
            <View style={{ height: scaleSzie(35), flexDirection: 'row' }} >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0764B0' }} >
                    <Text style={{ color: '#fff', fontSize: scaleSzie(14), marginLeft: scaleSzie(24) }} >
                        {localize('Name', language)}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <Text style={{ color: '#fff', fontSize: scaleSzie(14), marginRight: scaleSzie(5) }} >

                            {localize('Total Amount', language)}
                        </Text>
                        {/* <Image source={IMAGE.arrowDownAmount} style={{ marginRight: scaleSzie(14) }} /> */}
                    </View>
                </View>
                <View style={{ width: scaleSzie(2) }} />
                <View style={{
                    flex: 1.2, backgroundColor: '#0764B0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                }} >
                    <Text style={{ color: '#fff', fontSize: scaleSzie(14), marginLeft: scaleSzie(14) }} >

                        {localize('Invoice List', language)}
                    </Text>
                    <Text style={{ color: '#fff', fontSize: scaleSzie(14), marginRight: scaleSzie(14) }} >

                        {localize('Time/Amount', language)}
                    </Text>
                </View>
            </View>
        );
    }

    renderItemInvoice(item) {
        return (
            <View style={{
                height: scaleSzie(62), paddingHorizontal: scaleSzie(10),
                borderColor: '#C5C5C5', borderWidth: 1,
                backgroundColor: '#FAFAFA', flexDirection: "row",
            }} >
                {/* ----------- Col 1 --------- */}
                <View style={{ flex: 1.7 }} >
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#404040' }} >
                            {item.customerName}
                        </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A', marginRight: scaleSzie(20) }} >
                            {`#${item.checkoutId}`}
                        </Text>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#0764B0' }} />
                        <Text style={{ fontSize: scaleSzie(14), color: '#0764B0', marginLeft: scaleSzie(5) }} >
                            {item.status}
                        </Text>

                    </View>

                </View>
                {/* ----------- Col 2 --------- */}
                <View style={{ flex: 1 }} >
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A' }} >
                            {item.date}
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A', fontWeight: "bold" }} >
                            {item.time}
                        </Text>
                    </View>
                </View>

                {/* ----------- Col 3 --------- */}
                <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'flex-end' }} >
                    <Text style={{ fontSize: scaleSzie(18), color: '#404040' }} >
                        {`$ ${item.amount}`}
                    </Text>
                </View>
            </View>
        );
    }

    renderTableStaff() {
        const { settleWaiting, invoicesOfStaff, language } = this.props;
        const { settlementStaff, total } = settleWaiting;
        let tipAmount = 0;
        let totalAmount = 0;
        if (invoicesOfStaff.length > 0) {
            invoicesOfStaff.forEach(invoice => {
                tipAmount = parseFloat(tipAmount) + parseFloat(formatNumberFromCurrency(invoice.tipAmount ? invoice.tipAmount : 0.00));
                totalAmount = parseFloat(totalAmount) + parseFloat(formatNumberFromCurrency(invoice.amount ? invoice.amount : 0.00));
            });
        }
        return (
            <View style={{ flexDirection: 'row', height: scaleSzie(300) }} >
                <View style={{ flex: 1 }} >
                    <View style={{ flex: 1, padding: scaleSzie(10) }} >
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1 }} >
                            <FlatList
                                data={settlementStaff}
                                renderItem={({ item, index }) => <ItemStaff
                                    ref={this.pushStaffIntoArrayStaff}
                                    item={item}
                                    index={index}
                                    getInvoicesOfStaff={this.getInvoicesOfStaff}
                                    staffId={item.staffId}
                                />}
                                keyExtractor={(item, index) => `${item.staffId}`}
                            />
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
                                {`$ ${total ? `${total}` : 0}`}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ width: scaleSzie(2) }} />
                <View style={{ flex: 1.2 }} >
                    {/* -------- Item ------- */}
                    <FlatList
                        data={invoicesOfStaff}
                        renderItem={({ item, index }) => this.renderItemInvoice(item)}
                        keyExtractor={(item, index) => `${index}`}
                    />
                    {/* -------- Total ------- */}
                    <View style={{ alignItems: 'flex-end', paddingRight: scaleSzie(10), paddingTop: scaleSzie(10) }} >
                        <Text style={{ fontSize: scaleSzie(12), color: '#404040', marginBottom: scaleSzie(10) }} >
                            {`${localize('Tip Amount', language)}:`} <Text style={{ fontSize: scaleSzie(16), color: '#404040', marginLeft: scaleSzie(5) }} >
                                {`$ ${_.compose(formatMoney, roundFloatNumber)(tipAmount)}`}
                            </Text>
                        </Text>
                        <Text style={{ fontSize: scaleSzie(12), color: '#404040', }} >
                            {`${localize('Total Amount', language)}:`} <Text style={{ fontSize: scaleSzie(16), color: '#404040', marginLeft: scaleSzie(5) }} >
                                {`  $  ${formatMoney(Number(totalAmount).toFixed(2))}`}
                            </Text>
                        </Text>
                    </View>
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
        const { creditAmount, creditCount } = this.state;

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
        const { settleWaiting, language } = this.props
        return (
            <View style={{ flex: 1 }} >
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
                        <ScrollView
                            ref={this.scrollSRef}
                            keyboardShouldPersistTaps="always"
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.props.refreshingSettle}
                                    onRefresh={this.onRefreshSettle}
                                />
                            }
                        >
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
                }

            </View>
        );
    }

}

export default Layout;

