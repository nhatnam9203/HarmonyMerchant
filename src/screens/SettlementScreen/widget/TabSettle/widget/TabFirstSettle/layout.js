import React from "react";
import { View, TextInput, FlatList, ScrollView, Image } from "react-native";
import _ from "ramda";
import {
  scaleSize,
  localize,
  formatNumberFromCurrency,
  formatMoney,
  roundFloatNumber,
  formatWithMoment,
} from "@utils";
import { Text, ButtonCustom, Button } from "@components";
import styles from "./style";
import ItemPaymentsReport, {
  StaffsHeaderTable,
  StaffsItem,
  GiftCardItem,
  TotalItem,
  HeaderPaymentsReport,
  DepositItem,
} from "./widget/ItemsSettlement";
import PopupProcessingReportPax from "./widget/PopupProcessingReportPax";
import ICON from "@resources";
import { PopupSettlementReceipt } from "@shared/components";

class Layout extends React.Component {
  renderLastSettlement() {
    const { settleWaiting, language } = this.props;
    const { settlementDate } = settleWaiting;
    return (
      <View
        style={{
          height: scaleSize(40),
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={[
            styles.txt_top_title,
            { marginLeft: scaleSize(10), marginRight: scaleSize(20) },
          ]}
        >
          {`${localize("Last Settlement", language)}:`}
        </Text>
        <Text
          style={[
            styles.txt_top_title,
            { fontWeight: "500", marginRight: scaleSize(20) },
          ]}
        >
          {formatWithMoment(settlementDate, "MM/DD/YYYY")}
        </Text>
        <Text
          style={[
            styles.txt_top_title,
            { fontWeight: "500", marginRight: scaleSize(20) },
          ]}
        >
          {formatWithMoment(settlementDate, "hh:mm A")}
        </Text>

        <Button
          onPress={this.printSettlement}
          style={{
            position: "absolute",
            top: scaleSize(10),
            right: scaleSize(90),
            justifyContent: "center",
          }}
        >
          <Image
            source={ICON.print_batch_history}
            style={{ width: scaleSize(30), height: scaleSize(30) }}
          />
        </Button>

        <Button
          onPress={this.shareSettlement}
          style={{
            position: "absolute",
            top: scaleSize(10),
            right: scaleSize(50),
            justifyContent: "center",
          }}
        >
          <Image
            source={ICON.share_batch_history}
            style={{ width: scaleSize(30), height: scaleSize(30) }}
          />
        </Button>

        <Button
          onPress={this.refreshSettlement}
          style={{
            position: "absolute",
            top: scaleSize(10),
            right: scaleSize(10),
            justifyContent: "center",
          }}
        >
          <Image
            source={ICON.refresh_settlement}
            style={{ width: scaleSize(30), height: scaleSize(30) }}
          />
        </Button>
      </View>
    );
  }

  renderHeaderStaffList() {
    const { language } = this.props;
    return (
      <View
        style={{
          height: scaleSize(30),
          flexDirection: "row",
          paddingHorizontal: scaleSize(10),
        }}
      >
        <View style={{ flex: 1.3, justifyContent: "center" }}>
          <Text style={styles.txt_table}>
            {localize("Sales By Staffs", language)}
          </Text>
        </View>
        <View style={{ width: scaleSize(15) }} />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={styles.txt_table}>
            {localize("Income By Payment Methods", language)}
          </Text>
        </View>
      </View>
    );
  }

  renderButtonConfirm() {
    const { language } = this.props;
    const {
      discountSettlement,
      editPaymentByHarmony,
      editPaymentByCreditCard,
      editPaymentByCash,
      editOtherPayment,
      creditCount,
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
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: scaleSize(15),
          }}
        >
          <ButtonCustom
            width={scaleSize(330)}
            height={50}
            backgroundColor="#0764B0"
            title={localize("CONFIRM ", language)}
            textColor="#fff"
            onPress={this.gotoTabSecondSettle}
            style={{ borderWidth: 1, borderColor: "#C5C5C5", borderRadius: 6 }}
            styleText={{ fontSize: scaleSize(21), fontWeight: "500" }}
          />
        </View>
      );
    }

    return null;
  }

  renderStaffsTable() {
    const { staffSales, gitfCardSales, depositedAmount = 0 } = this.props;
    let totalAmount = 0;
    let giftCardTotal = 0;
    if (staffSales.length > 0) {
      staffSales.forEach((staff) => {
        totalAmount =
          parseFloat(totalAmount) +
          parseFloat(formatNumberFromCurrency(staff.total ? staff.total : 0.0));
      });
    }

    if (gitfCardSales.length > 0) {
      gitfCardSales.forEach((giftCard) => {
        giftCardTotal =
          parseFloat(giftCardTotal) +
          parseFloat(
            formatNumberFromCurrency(giftCard.total ? giftCard.total : 0.0)
          );
      });
    }

    return (
      <View style={{ flex: 1.3 }}>
        {/* ---------- Header --------- */}
        <View style={[styles.box_scale_by_staffs]}>
          <StaffsHeaderTable />
          <FlatList
            data={staffSales}
            renderItem={({ item, index }) => (
              <StaffsItem
                staff={item}
                onPress={this.onPressStaff}
                sendTotalViaSMS={this.sendTotalViaSMS}
              />
            )}
            keyExtractor={(item, index) => `${item.staffId}_${index}`}
            ListFooterComponent={() => (
              <>
                <DepositItem
                  total={formatMoney(depositedAmount)}
                  onPress={() => {}}
                />
                <GiftCardItem
                  total={formatMoney(giftCardTotal)}
                  onPress={this.onPressGiftCardTotal}
                />
              </>
            )}
          />
        </View>
        <View style={{ height: scaleSize(10) }} />
        <TotalItem
          total={formatMoney(
            totalAmount +
              giftCardTotal +
              formatNumberFromCurrency(depositedAmount)
          )}
        />
      </View>
    );
  }

  renderPaymentMethodsReport() {
    const { settleWaiting } = this.props;
    const {
      discountSettlement,
      editPaymentByHarmony,
      editPaymentByCreditCard,
      editPaymentByCash,
      editOtherPayment,
      isEditOtherAmount,
      isEditCashAmount,
      creditCount,
      paymentByGiftcard,
      depositedAmount,
    } = this.state;

    const temtpTotal = roundFloatNumber(
      formatNumberFromCurrency(editPaymentByHarmony) +
        formatNumberFromCurrency(editPaymentByCreditCard) +
        formatNumberFromCurrency(editPaymentByCash) +
        formatNumberFromCurrency(editOtherPayment) +
        formatNumberFromCurrency(discountSettlement) +
        formatNumberFromCurrency(paymentByGiftcard) +
        formatNumberFromCurrency(depositedAmount)
    );

    return (
      <View style={{ flex: 1 }}>
        <ScrollView ref={this.scrollRef} keyboardShouldPersistTaps="always">
          <View style={{ borderColor: "#DDDDDD", borderWidth: 1 }}>
            <HeaderPaymentsReport />
            <ItemPaymentsReport
              title="HarmonyPay"
              backgroundColor="#054071"
              value={editPaymentByHarmony}
            />
            <View style={{ height: 1 }} />
            <ItemPaymentsReport
              title={`Credit Card (${creditCount})`}
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
              initValue={
                settleWaiting.paymentByCash ? settleWaiting.paymentByCash : 0.0
              }
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
              title="Deposited amount"
              backgroundColor="#3C92D9"
              value={depositedAmount}
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
              initValue={
                settleWaiting.otherPayment ? settleWaiting.otherPayment : 0.0
              }
              isChange={true}
            />
            <ItemPaymentsReport
              title="Discount"
              backgroundColor="#F1F1F1"
              txtStyle={{
                color: "#404040",
              }}
              value={discountSettlement}
            />
          </View>
          {this.renderNote()}
          <View style={{ height: scaleSize(180) }} />
        </ScrollView>

        <View style={{ height: scaleSize(10) }} />
        <TotalItem total={formatMoney(temtpTotal)} />
      </View>
    );
  }

  renderNote() {
    const { note } = this.state;

    return (
      <View style={{}}>
        <Text
          style={[
            {
              color: "#404040",
              fontSize: scaleSize(10),
              fontWeight: "600",
              marginBottom: scaleSize(5),
              marginTop: scaleSize(12),
            },
          ]}
        >
          {`Note`}
        </Text>
        <View
          style={{
            height: scaleSize(54),
            borderColor: "#DDDDDD",
            borderWidth: 1,
            borderRadius: 4,
            paddingVertical: 5,
            paddingHorizontal: scaleSize(10),
          }}
        >
          <TextInput
            style={{
              flex: 1,
              fontSize: scaleSize(12),
              padding: 0,
              color: "#000",
              textAlignVertical: "top",
            }}
            multiline={true}
            value={note}
            onChangeText={(note) => this.setState({ note })}
            onFocus={() => this.scrollRef.current?.scrollToEnd()}
            onBlur={() => this.scrollTo(0)}
          />
        </View>
      </View>
    );
  }

  render() {
    const { settleWaiting, language, staffSales, gitfCardSales, depositedAmount } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 1 }}>
          {this.renderLastSettlement()}
          {this.renderHeaderStaffList()}
          {/* ------------- Two tables ----------  */}
          <View
            style={{
              height: scaleSize(310 + 30),
              flexDirection: "row",
              paddingHorizontal: scaleSize(10),
            }}
          >
            {this.renderStaffsTable()}
            <View style={{ width: scaleSize(10) }} />
            {this.renderPaymentMethodsReport()}
          </View>
          {this.renderButtonConfirm()}
        </View>
        <PopupProcessingReportPax
          visible={this.state.visible}
          onRequestClose={this.cancelTransaction}
          language={language}
        />

        <PopupSettlementReceipt
          ref={this.receiptRef}
          settlement={settleWaiting}
          staffSales={staffSales}
          gitfCardSales={gitfCardSales}
          depositedAmount={depositedAmount}
        />
      </View>
    );
  }
}

export default Layout;
