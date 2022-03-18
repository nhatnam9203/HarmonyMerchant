import {
  Button,
  ButtonCustom,
  ClearTextInputIcon,
  Dropdown,
  ParentContainer,
  PopupCalendar,
  PopupCheckStaffPermission,
  PopupConfirmInvoiceStatus,
  PopupConfirmPrintInvoice,
  PopupProcessingCredit,
  ScrollableTabView,
  StatusBarHeader,
  Text,
} from "@components";
import configs from "@configs";
import IMAGE from "@resources";
import { ButtonGradientWhite, ReceiptViewShot } from "@shared/components";
import { PopupInvoice } from "@shared/components/payment";
import { WithDialogScanQR } from "@shared/HOC/withDialogScanQR";
import { layouts } from "@shared/themes";
import {
  formatMoney,
  getReceiptItems,
  getReceiptSymbol,
  getTaxRateFromInvoice,
  localize,
  menuTabs,
  PAYMENT_METHODS,
  scaleSize,
} from "@utils";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TextInput,
  View,
  VirtualizedList,
} from "react-native";
import styles from "./style";
import { ItemButton, ItemHistory, ItemInvoice } from "./widget";

const ScanQRButton = WithDialogScanQR(ButtonGradientWhite);

export default class Layout extends React.Component {
  renderHeader() {
    const { language } = this.props;
    return (
      <View
        style={{
          height: scaleSize(35),
          borderBottomColor: "#0764B0",
          borderWidth: 3,
          paddingLeft: scaleSize(50),
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: scaleSize(16),
            color: "#0764B0",
            fontWeight: "600",
          }}
        >
          {localize("Invoice", language)}
        </Text>
      </View>
    );
  }

  renderSearch() {
    const { language } = this.props;
    const { searchFilter } = this.state;
    const { keySearch } = searchFilter;
    return (
      <View style={{ height: scaleSize(40), paddingHorizontal: scaleSize(12) }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                flex: 1,
                borderColor: "#C5C5C5",
                borderWidth: 1,
                borderRadius: scaleSize(4),
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 1, paddingHorizontal: scaleSize(12) }}>
                <TextInput
                  style={{ flex: 1, fontSize: scaleSize(16) }}
                  placeholder={`${localize(
                    "Invoice No /Phone Number/ Customer Name",
                    language
                  )}`}
                  value={keySearch}
                  onChangeText={(keySearch) =>
                    this.updateSearchFilterInfo("keySearch", keySearch)
                  }
                  onSubmitEditing={this.searchInvoiceWithKeyword}
                />
              </View>

              {keySearch.length > 0 ? (
                <Button
                  onPress={this.clearSearchText}
                  style={{
                    width: scaleSize(35),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ClearTextInputIcon />
                </Button>
              ) : null}
            </View>
          </View>
          <View
            style={{
              width: scaleSize(120),
              alignItems: "flex-end",
              marginRight: scaleWidth(10),
            }}
          >
            <ButtonCustom
              width={"90%"}
              height={40}
              backgroundColor="#F1F1F1"
              title={localize("Search", language)}
              textColor="#6A6A6A"
              onPress={this.searchInvoiceWithKeyword}
              style={{ borderWidth: 1, borderColor: "#C5C5C5" }}
              styleText={{ fontSize: scaleSize(15), fontWeight: "500" }}
            />
          </View>
          {/* <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#C5C5C5",
              height: scaleHeight(50),
              width: scaleWidth(100),
              alignItems: "center",
              justifyContent: "center",
              marginLeft: scaleWidth(10),
              borderRadius: scaleSize(6),
            }}
            onPress={this.scanSearchInvoice}
          >
            <Image
              source={IMAGE.scancode}
              style={{
                width: scaleWidth(30),
                height: scaleHeight(30),
                marginHorizontal: scaleWidth(12),
              }}
            />
          </TouchableOpacity> */}
          <ScanQRButton
            width={scaleWidth(110)}
            height={scaleHeight(50)}
            onResultScanCode={this.onResultScanCode}
            leftChildren={() => (
              <Image
                source={IMAGE.scancode}
                style={{
                  width: scaleWidth(24),
                  height: scaleHeight(24),
                  marginHorizontal: scaleWidth(12),
                }}
              />
            )}
          />
        </View>
      </View>
    );
  }

  renderFilter() {
    const { language } = this.props;
    const { searchFilter, titleRangeTime } = this.state;
    const { paymentMethod, status } = searchFilter;
    const temptColorTextTimeRange =
      titleRangeTime === "Time Range" ? "rgb(155,155,155)" : "rgb(38,38,38)";
    return (
      <View style={{ height: scaleSize(40), paddingHorizontal: scaleSize(12) }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ width: scaleSize(70), justifyContent: "center" }}>
            <Text style={{ fontSize: scaleSize(18), color: "#6A6A6A" }}>
              {localize("Filters", language)}
            </Text>
          </View>
          {/* ------------- */}
          <Button onPress={this.showCalendar} style={{ width: scaleSize(180) }}>
            <View
              style={[
                { height: scaleSize(40), width: "90%", flexDirection: "row" },
                styles.borderStyle,
              ]}
            >
              <View style={{ alignItems: "center", flexDirection: "row" }}>
                <Text
                  style={{
                    color: temptColorTextTimeRange,
                    fontSize: scaleSize(15),
                    marginLeft: scaleSize(10),
                  }}
                >
                  {localize(titleRangeTime, language)}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-end",
                  paddingRight: scaleSize(6),
                }}
              >
                <Image
                  source={IMAGE.dropdown}
                  style={{ width: scaleSize(6), height: scaleSize(3) }}
                />
              </View>
            </View>
          </Button>
          {/* ------------- */}
          <View style={{ width: scaleSize(170), marginLeft: scaleSize(16) }}>
            <Dropdown
              label={localize("Payment Method", language)}
              data={PAYMENT_METHODS}
              value={paymentMethod}
              onChangeText={(value) =>
                this.updateSearchFilterInfo("paymentMethod", value)
              }
              containerStyle={{
                backgroundColor: "rgb(246,246,246)",
                borderWidth: 1,
                borderColor: "#C5C5C5",
                flex: 1,
                borderRadius: scaleSize(4),
              }}
            />
          </View>
          {/* ------------- */}
          <View style={{ width: scaleSize(140), marginLeft: scaleSize(16) }}>
            <Dropdown
              label={localize("Status", language)}
              data={[
                { value: "" },
                { value: "Complete" },
                { value: "Incomplete" },
                { value: "Paid" },
                { value: "Void" },
                { value: "Refund" },
                { value: "Cancel" },
                { value: "Transaction Fail" },
              ]}
              value={status}
              onChangeText={(value) =>
                this.updateSearchFilterInfo("status", value)
              }
              containerStyle={{
                backgroundColor: "rgb(246,246,246)",
                borderWidth: 1,
                borderColor: "#C5C5C5",
                flex: 1,
                borderRadius: scaleSize(4),
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  renderButtonVoid() {
    const { language, invoiceDetail, profile } = this.props;
    const status = invoiceDetail?.status || "";
    let isDebitPayment = false;
    const paymentMethod = invoiceDetail?.paymentMethod || "";

    try {
      if (paymentMethod && paymentMethod === "credit_card") {
        const paymentInformation =
          invoiceDetail?.paymentInformation?.length > 0
            ? invoiceDetail.paymentInformation
            : null;
        isDebitPayment =
          paymentInformation &&
          paymentInformation[0]?.paymentData &&
          `${paymentInformation[0]?.paymentData.transaction_type}`.toUpper() ==
            "CREDIT"
            ? false
            : true;
      }
    } catch (error) {
      isDebitPayment = false;
    }
    if (status === "paid" && !isDebitPayment) {
      return (
        <ButtonCustom
          width={"100%"}
          height={50}
          backgroundColor="#0764B0"
          title={localize("Refund", language)}
          textColor="#fff"
          onPress={this.changeStatustransaction}
          style={{ borderWidth: 1, borderColor: "#C5C5C5" }}
          styleText={{ fontSize: scaleSize(20), fontWeight: "bold" }}
        />
      );
    } else if (status === "complete" && !isDebitPayment) {
      return (
        <ButtonCustom
          width={"100%"}
          height={50}
          backgroundColor="#0764B0"
          title={localize("VOID", language)}
          textColor="#fff"
          onPress={this.changeStatustransaction}
          style={{ borderWidth: 1, borderColor: "#C5C5C5" }}
          styleText={{ fontSize: scaleSize(20), fontWeight: "bold" }}
        />
      );
    } else {
      return <View />;
    }
  }

  renderDetailInvoice() {
    const { profile, profileStaffLogin, invoiceDetail } = this.props;

    let invoiceName = "";
    let isSalonApp = true;
    // if (profile && profile?.type === "SalonPos") {
    //   const { firstName = " ", lastName = " " } = invoiceDetail?.user || {};
    //   invoiceName = firstName + " " + lastName;
    //   isSalonApp = true;
    // } else {
    //   invoiceName = getStaffNameForInvoice(profileStaffLogin, basket);
    //   if (!invoiceName && invoiceDetail?.user?.userId) {
    //     invoiceName = getFullName(invoiceDetail?.user);
    //   }
    //   isSalonApp = false;
    // }

    const checkoutPayments =
      invoiceDetail?.checkoutPayments?.slice(0).reverse() || [];

    const getCustomer = () => {
      return invoiceDetail.user;
    };

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: scaleSize(20),
            paddingTop: scaleSize(8),
          }}
        >
          <ScrollView
            style={{ flex: 1 }}
            automaticallyAdjustContentInsets={true}
            keyboardShouldPersistTaps="always"
          >
            <ReceiptViewShot
              backgroundColor={"#fff"}
              items={getReceiptItems(invoiceDetail?.basket || [])}
              profile={profile}
              customer={getCustomer()}
              printTemp={false}
              fromAppointmentTab={false}
              invoiceDate={invoiceDetail?.createdDate}
              invoiceNO={invoiceDetail?.checkoutId}
              symbol={getReceiptSymbol(invoiceDetail?.status)}
              typeReceipt={"Merchant's Receipt"}
              invoiceCode={invoiceDetail?.code}
              subTotal={invoiceDetail.subTotal}
              discount={invoiceDetail.discount}
              tip={invoiceDetail.tipAmount}
              tax={invoiceDetail.tax}
              total={invoiceDetail.total}
              fee={invoiceDetail.checkoutPaymentFeeSum}
              cashDiscount={invoiceDetail.checkoutPaymentCashDiscountSum}
              // due={due}
              change={invoiceDetail.refundAmount}
              taxRate={getTaxRateFromInvoice(invoiceDetail)}
              promotionNotes={invoiceDetail.promotionNotes}
              checkoutPaymentMethods={checkoutPayments}
              isSignature={false}
            />
          </ScrollView>
        </View>

        {/* ------- button void  ------ */}
        <View
          style={{
            marginBottom: scaleSize(5),
            paddingHorizontal: scaleSize(10),
          }}
        >
          {invoiceDetail?.checkoutId ? (
            <ItemButton title={"History"} onPress={this.gotoHistory} />
          ) : null}
          {this.renderButtonVoid()}
        </View>
      </View>
    );
  }

  renderHistoryInvoice() {
    const { language, invoiceDetail } = this.props;
    const promotionNotes = invoiceDetail?.promotionNotes?.note || "";
    const history = invoiceDetail?.history || [];

    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: scaleSize(10),
          paddingTop: scaleSize(8),
        }}
      >
        {/* ---------------- Header ---------------- */}
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, paddingTop: scaleSize(2) }}>
            <Button
              onPress={this.backTab}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Image
                source={IMAGE.back}
                style={{
                  width: scaleSize(7),
                  height: scaleSize(13),
                  marginRight: scaleSize(6),
                }}
              />
              <Text style={{ color: "#0764B0", fontSize: scaleSize(14) }}>
                {localize("Back", language)}
              </Text>
            </Button>
          </View>
          <View style={{}}>
            <Text style={{ color: "#404040", fontSize: scaleSize(16) }}>
              {localize("History", language)}
            </Text>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
        {/* ----------- Body --------- */}
        <View style={{ flex: 1 }}>
          <View style={{ height: scaleSize(16) }} />
          <View style={{ flex: 1 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
            >
              {history.map((item, index) => (
                <ItemHistory key={index} data={item} />
              ))}
              <View style={{ height: scaleSize(16) }} />
              {promotionNotes ? (
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {`Discount note: `}
                  <Text style={{ fontWeight: "500" }}>
                    {`${promotionNotes}`}
                  </Text>
                </Text>
              ) : null}

              <View style={{ height: scaleSize(16) }} />
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }

  renderInvoice() {
    const {
      language,
      listInvoicesByMerchant,
      refreshListInvoice,
      isLoadMoreInvoiceList,
      invoiceDetail,
    } = this.props;

    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* ---------- Left ------ */}
        <View style={{ flex: 1.4 }}>
          <View
            style={{
              paddingLeft: scaleSize(12),
              borderBottomColor: "#C5C5C5",
              borderBottomWidth: 1,
              paddingBottom: scaleSize(6),
            }}
          >
            <Text style={{ color: "#404040", fontSize: scaleSize(18) }}>
              {localize("Invoice List", language)}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            {/* ----- Item Invoice ----- */}
            <VirtualizedList
              ref={this.virtualizedListRef}
              data={listInvoicesByMerchant}
              renderItem={({ item, index }) => (
                <ItemInvoice
                  invoice={item}
                  onPress={this.setInvoiceDetail(item)}
                  isSelectedInvoice={
                    item?.checkoutId === invoiceDetail?.checkoutId
                  }
                />
              )}
              keyExtractor={(item, index) => `${item.checkoutId}`}
              onRefresh={this.onRefreshInvoiceList}
              refreshing={refreshListInvoice}
              ListEmptyComponent={() => (
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    paddingTop: scaleSize(20),
                  }}
                >
                  <Text style={{ color: "#404040", fontSize: scaleSize(20) }}>
                    {localize("List Empty", language)}
                  </Text>
                </View>
              )}
              onEndReached={this.loadMoreInvoiceList}
              onEndReachedThreshold={0.1}
              onMomentumScrollBegin={() => {
                this.onEndReachedCalledDuringMomentum = false;
              }}
              removeClippedSubviews={true}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              ListFooterComponent={() => (
                <View
                  style={{
                    height: scaleSize(30),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isLoadMoreInvoiceList ? (
                    <ActivityIndicator size="large" color="#0764B0" />
                  ) : null}
                </View>
              )}
              getItemCount={this.getItemCount}
              getItem={this.getItem}
            />
          </View>
        </View>
        {/* ---------- Right ------ */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              paddingLeft: scaleSize(12),
              borderBottomColor: "#C5C5C5",
              borderBottomWidth: 1,
              paddingBottom: scaleSize(6),
            }}
          >
            <Text style={{ color: "#404040", fontSize: scaleSize(18) }}>
              {localize("Invoice Detail", language)}
            </Text>
          </View>
          {/* -------- ScrollableTabView ---- */}
          <View style={{ flex: 1 }}>
            <ScrollableTabView
              ref={this.scrollTabInvoiceRef}
              style={{}}
              initialPage={0}
              locked={true}
              renderTabBar={() => <View />}
              onChangeTab={(index) => {
                this.setState({ tabCurrent: index.i });
              }}
            >
              {this.renderDetailInvoice()}
              {this.renderHistoryInvoice()}
            </ScrollableTabView>
          </View>

          {invoiceDetail?.checkoutId ? (
            <Button
              onPress={this.shareCustomerInvoice}
              style={{
                position: "absolute",
                top: scaleSize(-12),
                right: scaleSize(50),
                width: scaleSize(35),
                height: scaleSize(35),
                backgroundColor: "#0764B0",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: scaleSize(4),
              }}
            >
              <Image
                source={IMAGE.share_icon}
                style={{ width: scaleSize(18), height: scaleSize(18) }}
              />
            </Button>
          ) : null}

          {invoiceDetail?.checkoutId ? (
            <Button
              onPress={this.printCustomerInvoice}
              style={{
                position: "absolute",
                top: scaleSize(-12),
                right: scaleSize(8),
                width: scaleSize(35),
                height: scaleSize(35),
                backgroundColor: "#0764B0",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: scaleSize(4),
              }}
            >
              <Image
                source={IMAGE.print_btn}
                style={{ width: scaleSize(20), height: scaleSize(20) }}
              />
            </Button>
          ) : null}
        </View>
      </View>
    );
  }

  render() {
    const {
      language,
      navigation,
      visibleConfirmPrintInvoice,
      invoiceTabPermission,
      profileLoginInvoice,
    } = this.props;
    const {
      visibleCalendar,
      isFocus,
      visibleConfirmInvoiceStatus,
      transactionId,
      visiblePrintInvoice,
    } = this.state;

    return (
      <ParentContainer
        handleLockScreen={this.handleLockScreen}
        activeScreen={isFocus}
        navigation={navigation}
        clearIntervalById={this.clearIntervalById}
      >
        <View style={styles.container}>
          <StatusBarHeader />
          {this.renderHeader()}
          <View style={{ height: scaleSize(18) }} />
          {this.renderSearch()}
          <View style={{ height: scaleSize(16) }} />
          {this.renderFilter()}
          <View style={{ height: scaleSize(18) }} />
          {this.renderInvoice()}

          <Button onPress={this.openDrawer} style={configs.btn_left_position}>
            <Image
              source={IMAGE.openDrawer}
              style={{ width: scaleSize(34), height: scaleSize(34) }}
            />
          </Button>
        </View>
        <PopupCalendar
          ref={this.modalCalendarRef}
          visible={visibleCalendar}
          onRequestClose={() => this.setState({ visibleCalendar: false })}
          changeTitleTimeRange={this.changeTitleTimeRange}
        />
        <PopupCheckStaffPermission
          ref={this.checkInvoicePermissionRef}
          visiblePopupCheckStaffPermission={invoiceTabPermission}
          title={localize("Input PIN Number", language)}
          tabName={menuTabs.MENU_INVOICE}
          onRequestClose={this.closePopupCheckInvoiceTabPermission}
        />
        <PopupConfirmInvoiceStatus
          ref={this.confirmInvoiceStatusRef}
          visible={visibleConfirmInvoiceStatus}
          title={localize("Confirmation", language)}
          confirmChangeInvoiceStatus={this.confirmChangeInvoiceStatus}
          onRequestClose={() =>
            this.setState({ visibleConfirmInvoiceStatus: false })
          }
          profileLoginInvoice={profileLoginInvoice}
        />
        <PopupProcessingCredit
          ref={this.popupProcessingCreditRef}
          visible={this.state.visibleProcessingCredit}
          onRequestClose={this.cancelTransaction}
          language={language}
          transactionId={transactionId}
        />
        <PopupConfirmPrintInvoice
          visible={visibleConfirmPrintInvoice}
          title={localize("Confirmation", language)}
          message={`${localize("Do you want to print receipt", language)}?`}
          onRequestClose={this.closePopupConfirmPrintInvoice}
          confimYes={this.printInvoice}
          language={language}
        />

        <PopupInvoice ref={this.invoiceRef} />
      </ParentContainer>
    );
  }
}

const ItemPrintBasket = ({ item, index }) => {
  const price = item.data && item.data.price ? item.data.price : 0;
  const quanlitySet = item.quanlitySet ? item.quanlitySet : 1;
  const total = formatMoney(price * quanlitySet);
  const note = item.note ? item.note : "";

  return (
    <View style={{ flexDirection: "row", marginTop: scaleSize(3) }}>
      <View style={{ flex: 0.8, justifyContent: "center" }}>
        <Text style={[styles.txt_info]}>
          {`${index + 1}. ${item.data && item.data.name ? item.data.name : ""}`}
        </Text>
        {/* ------------ Note -------- */}
        {note ? (
          <Text style={[styles.txt_info, { fontSize: 13, marginLeft: 8 }]}>
            {`(Note: ${note})`}
          </Text>
        ) : null}
      </View>
      <View style={{ justifyContent: "center", width: scaleSize(70) }}>
        <Text style={[styles.txt_info]}>{`$ ${price}`}</Text>
      </View>
      <View
        style={{
          width: scaleSize(30),
          justifyContent: "center",
          paddingLeft: scaleSize(6),
        }}
      >
        <Text style={[styles.txt_info]}>{quanlitySet}</Text>
      </View>
      <View
        style={{
          flex: 0.5,
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <Text style={[styles.txt_info]}>{`$ ${total ? total : ""}`}</Text>
      </View>
    </View>
  );
};

const ItemTotal = ({ title, value, style }) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: scaleSize(4) }}>
      <Text
        style={[
          layouts.fontPrintSubTitleStyle,
          { alignSelf: "flex-start" },
          style,
        ]}
      >
        {title}
      </Text>
      <View style={{ flex: 1 }} />
      <Text style={[layouts.fontPrintStyle, { alignSelf: "flex-end" }, style]}>
        {`$ ${value}`}
      </Text>
    </View>
  );
};
