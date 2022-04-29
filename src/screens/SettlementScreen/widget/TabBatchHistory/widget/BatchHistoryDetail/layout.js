import React from "react";
import { View, FlatList, ScrollView, Image } from "react-native";
import _ from "ramda";

import {
  scaleSize,
  localize,
  formatNumberFromCurrency,
  formatMoney,
  formatWithMoment,
} from "@utils";
import { Text, Button } from "@components";
import styles from "./style";
import ItemPaymentsReport, {
  StaffsHeaderTable,
  StaffsItem,
  GiftCardItem,
  TotalItem,
  HeaderPaymentsReport,
  DepositItem,
} from "./widget/ItemsSettlement";
import ICON from "@resources";

class Layout extends React.Component {
  renderLastSettlement() {
    const { language } = this.props;
    const { settlementDetail } = this.state;
    const batchId = settlementDetail?.settlementId || "";
    const settlementDate = settlementDetail?.settlementDate || new Date();
    const total = settlementDetail?.total || "0.00";

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
            {
              marginLeft: scaleSize(10),
              marginRight: scaleSize(20),
              fontWeight: "400",
            },
          ]}
        >
          {`${localize("Batch ID", language)}: `}
          <Text
            style={[
              styles.txt_top_title,
              { marginLeft: scaleSize(10), marginRight: scaleSize(20) },
            ]}
          >
            {`${localize(`#${batchId}`, language)}`}
          </Text>
        </Text>
        <Text
          style={[
            styles.txt_top_title,
            { fontWeight: "400", marginRight: scaleSize(20) },
          ]}
        >
          {`${formatWithMoment(settlementDate, "MM/DD/YYYY hh:mm A")}`}
        </Text>
        <Text
          style={[
            styles.txt_top_title,
            { fontWeight: "bold", marginRight: scaleSize(20) },
          ]}
        >
          {`$ ${total}`}
        </Text>

        <Button
          onPress={this.shareBatchHistoryDetail}
          style={{
            position: "absolute",
            top: scaleSize(10),
            right: scaleSize(10),
            justifyContent: "center",
          }}
        >
          <Image
            source={ICON.share_batch_history}
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
          height: scaleSize(35),
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

  renderStaffsTable() {
    const {
      gitfCardSalesBySettlementId,
      staffSalesBySettlementId,
      depositTotalBySettlementId,
    } = this.props;
    let totalAmount = 0;
    let giftCardTotal = 0;
    if (staffSalesBySettlementId.length > 0) {
      staffSalesBySettlementId.forEach((staff) => {
        totalAmount =
          parseFloat(totalAmount) +
          parseFloat(formatNumberFromCurrency(staff?.total || 0.0));
      });
    }

    if (gitfCardSalesBySettlementId.length > 0) {
      gitfCardSalesBySettlementId.forEach((giftCard) => {
        giftCardTotal =
          parseFloat(giftCardTotal) +
          parseFloat(formatNumberFromCurrency(giftCard?.total || 0.0));
      });
    }

    return (
      <View style={{ flex: 4, height: "100%" }}>
        {/* ---------- Header --------- */}
        <View style={[styles.box_scale_by_staffs]}>
          <StaffsHeaderTable />
          <FlatList
            data={staffSalesBySettlementId}
            renderItem={({ item, index }) => (
              <StaffsItem staff={item} onPress={this.onPressStaff} />
            )}
            keyExtractor={(item, index) => `${item.staffId}_${index}`}
            ListFooterComponent={() => (
              <>
                <DepositItem
                  total={formatMoney(depositTotalBySettlementId)}
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
              formatNumberFromCurrency(depositTotalBySettlementId)
          )}
        />
      </View>
    );
  }

  renderPaymentMethodsReport() {
    const { settlementDetail } = this.state;

    const paymentByHarmony = settlementDetail?.paymentByHarmony || 0.0;
    const paymentByCreditCard = settlementDetail?.paymentByCreditCard || 0.0;
    const paymentByCash = settlementDetail?.paymentByCash || 0.0;
    const otherPayment = settlementDetail?.otherPayment || 0.0;
    const discount = settlementDetail?.discount || 0.0;
    const total = settlementDetail?.total || 0.0;
    const paymentByCashStatistic =
      settlementDetail?.paymentByCashStatistic || 0.0;
    const otherPaymentStatistic =
      settlementDetail?.otherPaymentStatistic || 0.0;
    const paymentByGiftcard = settlementDetail?.paymentByGiftcard || 0.0;
    const depositedAmount = settlementDetail?.depositedAmount || 0.0;

    return (
      <View style={{ flex: 3, height: "100%" }}>
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={{ borderColor: "#DDDDDD", borderWidth: 1 }}>
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
              titStyle={{
                textDecorationLine: "underline",
              }}
              activeOpacity={true}
              onPress={this.gotoCreditPaymentDetail}
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
                color: "#404040",
              }}
              value={discount}
            />
          </View>
          {this.renderNote()}
        </ScrollView>

        <View style={{ height: scaleSize(10) }} />
        <TotalItem total={formatMoney(formatNumberFromCurrency(total))} />
      </View>
    );
  }

  renderNote() {
    const { settlementDetail } = this.state;
    const note = settlementDetail.note ? settlementDetail.note : "";

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
          <ScrollView>
            <Text style={{ fontSize: scaleSize(12) }}>{note}</Text>
          </ScrollView>
        </View>
      </View>
    );
  }

  render() {
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
        </View>
      </View>
    );
  }
}

export default Layout;
