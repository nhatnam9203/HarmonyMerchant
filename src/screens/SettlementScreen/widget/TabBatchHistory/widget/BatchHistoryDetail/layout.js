import React from 'react';
import {
    View,
    TextInput,
    FlatList,
    ScrollView,
    Image
} from 'react-native';
import _ from 'ramda';

import { scaleSzie, localize, formatNumberFromCurrency, formatMoney, roundFloatNumber, formatWithMoment } from '@utils';
import {
    Text, ButtonCustom, Button
} from '@components';
import styles from "./style";
import ItemPaymentsReport, { StaffsHeaderTable, StaffsItem, GiftCardItem, TotalItem, HeaderPaymentsReport } from "./widget/ItemsSettlement";
import ICON from "@resources";

class Layout extends React.Component {

    renderLastSettlement() {
        const { language } = this.props;
        const { settlementDetail } = this.state;
        const batchId = settlementDetail.settlementId ? settlementDetail.settlementId : "";
        const settlementDate = settlementDetail.settlementDate ? settlementDetail.settlementDate : new Date();
        const total = settlementDetail.total ? settlementDetail.total : "0.00";

        return (
            <View style={{
                height: scaleSzie(40), flexDirection: 'row', alignItems: 'center',
            }} >
                <Text style={[styles.txt_top_title, { marginLeft: scaleSzie(10), marginRight: scaleSzie(20), fontWeight: "400" }]} >
                    {`${localize('Batch ID', language)}: `}
                    <Text style={[styles.txt_top_title, { marginLeft: scaleSzie(10), marginRight: scaleSzie(20), }]} >
                        {`${localize(`#${batchId}`, language)}`}
                    </Text>
                </Text>
                <Text style={[styles.txt_top_title, { fontWeight: '400', marginRight: scaleSzie(20) }]}  >
                    {`${formatWithMoment(settlementDate, "MM/DD/YYYY hh:mm A")}`}
                </Text>
                <Text style={[styles.txt_top_title, { fontWeight: 'bold', marginRight: scaleSzie(20) }]}  >
                    {`$ ${total}`}
                </Text>

                {/* <Button onPress={this.shareBatchHistoryDetail} style={{
                    position: "absolute", top: scaleSzie(10), right: scaleSzie(10),
                    justifyContent: "center"
                }} >
                    <Image source={ICON.share_batch_history}
                        style={{ width: scaleSzie(30), height: scaleSzie(30) }}
                    />
                </Button> */}

                {/* <Button onPress={this.printBatchHistoryDetail} style={{
                    position: "absolute", top: scaleSzie(10), right: scaleSzie(50),
                    justifyContent: "center"
                }} >
                    <Image source={ICON.print_batch_history}
                        style={{ width: scaleSzie(30), height: scaleSzie(30) }}
                    />
                </Button> */}
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


    renderStaffsTable() {
        const { gitfCardSalesBySettlementId, staffSalesBySettlementId } = this.props;
        let totalAmount = 0;
        let giftCardTotal = 0
        if (staffSalesBySettlementId.length > 0) {
            staffSalesBySettlementId.forEach(staff => {
                totalAmount = parseFloat(totalAmount) + parseFloat(formatNumberFromCurrency(staff.total ? staff.total : 0.00));
            });
        }

        if (gitfCardSalesBySettlementId.length > 0) {
            gitfCardSalesBySettlementId.forEach(giftCard => {
                giftCardTotal = parseFloat(giftCardTotal) + parseFloat(formatNumberFromCurrency(giftCard.total ? giftCard.total : 0.00));
            });
        }

        return (
            <View style={{ flex: 1.1, }} >
                {/* ---------- Header --------- */}
                <View style={[styles.box_scale_by_staffs]} >
                    <StaffsHeaderTable />
                    <FlatList
                        data={staffSalesBySettlementId}
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
        const { settlementDetail } = this.state;

        const paymentByHarmony = settlementDetail.paymentByHarmony ? settlementDetail.paymentByHarmony : 0.00;
        const paymentByCreditCard = settlementDetail.paymentByCreditCard ? settlementDetail.paymentByCreditCard : 0.00;
        const paymentByCash = settlementDetail.paymentByCash ? settlementDetail.paymentByCash : 0.00;
        const otherPayment = settlementDetail.otherPayment ? settlementDetail.otherPayment : 0.00;
        const discount = settlementDetail.discount ? settlementDetail.discount : 0.00;
        const total = settlementDetail.total ? settlementDetail.total : 0.00;
        const paymentByCashStatistic = settlementDetail.paymentByCashStatistic ? settlementDetail.paymentByCashStatistic : 0.00;
        const otherPaymentStatistic = settlementDetail.otherPaymentStatistic ? settlementDetail.otherPaymentStatistic : 0.00;

        return (
            <View style={{ flex: 1, }} >
                <View style={{ borderColor: "#DDDDDD", borderWidth: 1 }} >
                    <HeaderPaymentsReport />
                    <ItemPaymentsReport
                        title="HarmonyPay"
                        backgroundColor="#054071"
                        value={paymentByHarmony}
                    />
                    <View style={{ height: 1 }} />
                    <ItemPaymentsReport
                        title={`Credit Card`}
                        backgroundColor="#075BA0"
                        value={paymentByCreditCard}
                    />
                    <View style={{ height: 1 }} />
                    <ItemPaymentsReport
                        ref={this.cashAmountRef}
                        title="Cash"
                        backgroundColor="#3480BE"
                        value={paymentByCash}
                        isChange={true}
                        amountStatistic={paymentByCashStatistic}
                    />
                    <View style={{ height: 1 }} />
                    <ItemPaymentsReport
                        title="Other"
                        backgroundColor="#BBD4E9"
                        value={otherPayment}
                        isChange={true}
                        amountStatistic={otherPaymentStatistic}

                    />
                    <ItemPaymentsReport
                        title="Discount"
                        backgroundColor="#F1F1F1"
                        txtStyle={{
                            color: "#404040"
                        }}
                        value={discount}
                    />
                </View>
                {this.renderNote()}

                <View style={{ height: scaleSzie(10) }} />
                <TotalItem total={formatMoney(total)} />
            </View>
        );
    }

    renderNote() {
        const { settlementDetail } = this.state;
        const note = settlementDetail.note ? settlementDetail.note : "";
        const settlementDate = settlementDetail.settlementDate ? settlementDetail.settlementDate : new Date();

        return (
            <View style={{}} >
                <Text style={[{
                    color: "#404040", fontSize: scaleSzie(10), fontWeight: "600",
                    marginBottom: scaleSzie(5), marginTop: scaleSzie(12)
                }]} >
                    {`Note`}
                </Text>
                <View style={{
                    height: scaleSzie(54), borderColor: "#DDDDDD", borderWidth: 1, borderRadius: 4, paddingVertical: 5,
                    paddingHorizontal: scaleSzie(10)
                }} >
                    <ScrollView>
                        <Text style={{ fontSize: scaleSzie(12) }} >
                            {note}
                        </Text>
                    </ScrollView>
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
                    <View style={{ height: scaleSzie(310), flexDirection: "row", paddingHorizontal: scaleSzie(10) }} >
                        {this.renderStaffsTable()}
                        <View style={{ width: scaleSzie(10), }} />
                        {this.renderPaymentMethodsReport()}
                    </View>
                </View>
            </View>
        );
    }

}

export default Layout;

