import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    ScrollView,
    Dimensions,
    RefreshControl,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import _ from 'ramda';

import { scaleSzie, localize, formatNumberFromCurrency, formatMoney, roundFloatNumber } from '@utils';
import {
    Text, Button, ButtonCustom,
} from '@components';
import styles from './style';
import IMAGE from '@resources';
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
                    {moment.parseZone(settlementDate).local().format('MM/DD/YYYY')}
                </Text>
                <Text style={{ color: '#0764B0', fontSize: scaleSzie(16), fontWeight: 'bold', marginRight: scaleSzie(20) }} >
                    {moment.parseZone(settlementDate).local().format('h:mm A')}
                </Text>
            </View>
        );
    }

    renderHeaderStaffList() {
        const { language } = this.props;
        return (
            <View style={{ height: scaleSzie(45), backgroundColor: '#FAFAFA', flexDirection: 'row' }} >
                <View style={{ flex: 1, paddingLeft: scaleSzie(10), justifyContent: 'center' }} >
                    <Text style={styles.txt_title_report_amount} >
                        {localize('Staff List', language)}
                    </Text>
                </View>
                <View style={{ width: scaleSzie(2) }} />
                <View style={{ flex: 1.2, paddingLeft: scaleSzie(10), justifyContent: 'center' }} >
                    <Text style={styles.txt_title_report_amount} >
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
                        <Image source={IMAGE.arrowDownAmount} style={{ marginRight: scaleSzie(14) }} />
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
                backgroundColor: '#FAFAFA'
            }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#404040' }} >
                            {item.customerName}
                        </Text>
                    </View>
                    <View style={{ width: scaleSzie(120), justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A' }} >
                            {item.date}
                        </Text>
                    </View>
                    <View style={{ width: scaleSzie(80), justifyContent: 'center', alignItems: 'flex-end' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A' }} >
                            {item.time}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A', marginRight: scaleSzie(20) }} >
                            {`#${item.checkoutId}`}
                        </Text>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#0764B0' }} />
                        <Text style={{ fontSize: scaleSzie(14), color: '#0764B0', marginLeft: scaleSzie(5) }} >
                            {item.status}
                        </Text>

                    </View>
                    <View style={{}} >
                        <Text style={{ fontSize: scaleSzie(18), color: '#404040' }} >
                            {`$ ${item.amount}`}
                        </Text>
                    </View>
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
                if (invoice.status === 'paid' || invoice.status === 'pending') {
                    tipAmount = parseFloat(tipAmount) + parseFloat(formatNumberFromCurrency(invoice.tipAmount));
                    totalAmount = parseFloat(totalAmount) + parseFloat(formatNumberFromCurrency(invoice.amount));
                }
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
                            justifyContent: 'space-between', backgroundColor: "#0764B0"
                        }} >
                            <Text style={{ fontSize: scaleSzie(18), color: '#fff', fontWeight: "bold" }} >
                                {`${localize('Total', language)}:`}
                            </Text>
                            <Text style={{ fontSize: scaleSzie(18), color: '#4CD964', fontWeight: 'bold' }} >
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
                                {/* {`  $  ${formatMoney(Number(tipAmount).toFixed(2))}`} */}
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

    renderReportAmount() {
        const { settleWaiting, language } = this.props;
        const { creditAmount, creditCount } = this.state;

        const temptCreditAmount = creditAmount === 0 || creditAmount === "" ? 0 : creditAmount / 100;
        const temtpTotal = formatMoney((formatNumberFromCurrency(settleWaiting.total) - formatNumberFromCurrency(settleWaiting.paymentByCreditCard) + formatNumberFromCurrency(temptCreditAmount)));

        return (
            <View style={{ paddingHorizontal: scaleSzie(10), flexDirection: 'row' }} >
                {/* --------- Left --------- */}
                <View style={{ flex: 1.2, paddingRight: scaleSzie(30) }} >
                    <Text style={styles.txt_title_report_amount} >
                        {localize('Report Amount', language)}
                    </Text>
                    {/* ------------ Payment by Harmony account ------------ */}
                    <View style={{
                        height: scaleSzie(45), marginBottom: scaleSzie(2),
                        paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                        backgroundColor: '#054071'
                    }} >
                        <Text style={styles.txt_report_amount} >
                            {localize('Payment by Harmony account', language)}
                        </Text>
                        <Text style={styles.txt_value_report_amount} >
                            {`$ ${settleWaiting.paymentByHarmony}`}
                        </Text>
                    </View>
                    {/* ------------ Payment by Credit card ------------ */}
                    <View style={{
                        height: scaleSzie(45), marginBottom: scaleSzie(2),
                        paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                        backgroundColor: '#075BA0'
                    }} >
                        <Text style={styles.txt_report_amount} >
                            {localize('Payment by Credit card', language)}
                        </Text>
                        <Text style={styles.txt_value_report_amount} >
                            {`$ ${settleWaiting.paymentByCreditCard}`}
                        </Text>
                    </View>
                    {/* ------------ Payment by Cash ------------ */}
                    <View style={{
                        height: scaleSzie(45), marginBottom: scaleSzie(2),
                        paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                        backgroundColor: '#3480BE'
                    }} >
                        <Text style={styles.txt_report_amount} >
                            {localize('Payment by Cash', language)}
                        </Text>
                        <Text style={styles.txt_value_report_amount} >
                            {`$ ${settleWaiting.paymentByCash}`}
                        </Text>
                    </View>

                    {/* ------------  Gift Card  ------------ */}
                    <View style={{
                        height: scaleSzie(45), marginBottom: scaleSzie(2),
                        paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                        backgroundColor: '#77AAD3'
                    }} >
                        <Text style={styles.txt_report_amount} >
                            {localize('Gift card', language)}
                        </Text>
                        <Text style={styles.txt_value_report_amount} >
                            {`$ ${settleWaiting.paymentByCash}`}
                        </Text>
                    </View>

                    {/* ------------ Other payment ------------ */}
                    <View style={{
                        height: scaleSzie(45), marginBottom: scaleSzie(2),
                        paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                        backgroundColor: '#BBD4E9',
                    }} >
                        <Text style={styles.txt_report_amount} >
                            {localize('Other payment', language)}
                        </Text>
                        <Text style={styles.txt_value_report_amount} >
                            {`$ ${settleWaiting.otherPayment}`}
                        </Text>
                    </View>
                    {/* -------- Total ------- */}
                    <View style={{
                        height: scaleSzie(45), backgroundColor: '#FAFAFA', marginTop: 2,
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
                <View style={{ flex: 1.1 }} >
                    <Text style={styles.txt_title_report_amount} >
                        {localize('Editable Actual Amount', language)}
                    </Text>
                    {/* ------------ Payment by Harmony account Right ------------ */}
                    <View style={styles.box_actual_amount} >
                        <Text style={styles.txt_actual_amount} >
                            {localize('Payment by Harmony account', language)}
                        </Text>
                        <View style={styles.box_actual_value_amount} >
                            {/* ------------ Text Input ---- */}
                            <TextInputAmount
                                ref={this.inputHarmonyPaymentRef}
                                value={settleWaiting.paymentByHarmony}
                                onChangeText={this.updateTotalCustom}
                                onFocus={() => this.scrollTo(450)}
                            />
                        </View>
                    </View>
                    {/* ------------ Payment by Credit card Right ------------ */}
                    <View style={styles.box_actual_amount} >
                        <View>
                            <Text style={styles.txt_actual_amount} >
                                {`${localize('Payment by Credit card', language)}`}
                            </Text>
                            <Text style={{ fontSize: scaleSzie(10), color: '#404040' }} >
                                {`(Credit Count: ${creditCount})`}
                            </Text>

                        </View>
                        <View style={styles.box_actual_value_amount} >
                            <TextInputAmount
                                ref={this.inputCreditPaymentRef}
                                value={temptCreditAmount}
                                onChangeText={this.updateTotalCustom}
                                onFocus={() => this.scrollTo(450)}
                            />
                        </View>
                    </View>
                    {/* ------------ Payment by Cash Right ------------ */}
                    <View style={styles.box_actual_amount} >
                        <Text style={styles.txt_actual_amount} >
                            {localize('Payment by Cash', language)}
                        </Text>
                        <View style={styles.box_actual_value_amount} >
                            <TextInputAmount
                                ref={this.inputCashPaymentRef}
                                value={settleWaiting.paymentByCash}
                                onChangeText={this.updateTotalCustom}
                                onFocus={() => this.scrollTo(450)}
                            />
                        </View>
                    </View>
                     {/* ------------ Other payment Right ------------ */}
                     <View style={styles.box_actual_amount} >
                        <Text style={styles.txt_actual_amount} >
                            {localize('Gift card', language)}
                        </Text>
                        <View style={styles.box_actual_value_amount} >
                            <TextInputAmount
                                ref={this.inputOtherPaymentRef}
                                value={settleWaiting.otherPayment}
                                onChangeText={this.updateTotalCustom}
                                onFocus={() => this.scrollTo(450)}
                            />
                        </View>
                    </View>
                    {/* ------------ Other payment Right ------------ */}
                    <View style={styles.box_actual_amount} >
                        <Text style={styles.txt_actual_amount} >
                            {localize('Other payment', language)}
                        </Text>
                        <View style={styles.box_actual_value_amount} >
                            <TextInputAmount
                                ref={this.inputOtherPaymentRef}
                                value={settleWaiting.otherPayment}
                                onChangeText={this.updateTotalCustom}
                                onFocus={() => this.scrollTo(450)}
                            />
                        </View>
                    </View>
                    {/* -------- Total Custom ------- */}
                    <TotalCustom
                        ref={this.totalCustomRef}
                        total={temtpTotal}
                    />
                </View>
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
                {/* <NavigationEvents
                    onDidFocus={this.onDidFocus}
                /> */}
                {
                    _.isEmpty(settleWaiting) || settleWaiting.checkout.length === 0 ?
                        <ScrollView
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

