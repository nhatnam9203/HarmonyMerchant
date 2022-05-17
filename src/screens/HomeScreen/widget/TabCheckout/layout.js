import {
  Button,
  ButtonCustom,
  PopupActiveGiftCard,
  PopupChangeMoney,
  PopupChangePriceAmountProduct,
  PopupChangeStylist,
  PopupChangeTip,
  PopupCheckStaffPermission,
  PopupConfirm,
  PopupInvoicePrint,
  PopupProcessingCredit,
  PopupScanCode,
  PopupSendLinkInstall,
  ScrollableTabView,
  Text,
} from "@components";
import { DialogPayCompleted } from "@components/DialogPayCompleted";

import { QRCodePay } from "@components/PaymentButtons";
import ICON from "@resources";
import { PopupReceipt } from "@shared/components";
import {
  checkCategoryIsNotExist,
  formatMoney,
  formatNumberFromCurrency,
  localize,
  menuTabs,
  roundFloatNumber,
  scaleSize,
} from "@utils";
import * as l from "lodash";
import _ from "ramda";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import styles from "./style";
import {
  EnterCustomerPhonePopup,
  ErrorMessagePaxModal,
  ItemAmount,
  ItemBlockBasket,
  ItemCategory,
  ItemCustomerBasket,
  ItemExtra,
  ItemPaymentMethod,
  ItemProductService,
  PopupAddEditCustomer,
  PopupAddItemIntoAppointments,
  PopupBill,
  PopupBlockDiscount,
  PopupDiscount,
  PopupDiscountLocal,
  PopupEnterAmountCustomService,
  PopupEnterAmountGiftCard,
  PopupGiftCardDetail,
  PopupPaymentDetails,
} from "./widget";
import { StaffItem } from "./widget/NewCheckoutComponent";

class Layout extends React.Component {
  renderHeader() {
    const { language, groupAppointment, customerInfoBuyAppointment } =
      this.props;
    let firstName = customerInfoBuyAppointment?.firstName || "";
    let lastName = customerInfoBuyAppointment?.lastName || "";
    let phone = customerInfoBuyAppointment?.phone || "";
    let customerId = customerInfoBuyAppointment?.customerId || 0;
    const displayName = `${firstName} ${lastName}`;
    const firstLetter = customerInfoBuyAppointment?.firstName
      ? customerInfoBuyAppointment?.firstName[0]
      : "";

    return (
      <View style={styles.headerContainer}>
        {customerId ? (
          <Button
            onPress={this.displayCustomerInfoPopup}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <View style={styles.avatar_box}>
              <Text style={styles.txt_avatar}>{`${firstLetter}`}</Text>
            </View>
            <View style={{ marginLeft: scaleSize(12) }}>
              <Text style={styles.txt_customer_name}>{`${displayName}`}</Text>
              <Text style={styles.txt_customer_phone}>{`${phone}`}</Text>
            </View>

            {/* -------- Enter other number --------- */}
            <Button onPress={this.displayEnterUserPhonePopup}>
              <Text style={styles.txt_enter_other_phone_number}>
                {`Enter another phone`}
              </Text>
            </Button>
          </Button>
        ) : (
          <Button
            onPress={this.displayEnterUserPhonePopup}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Image
              source={ICON.checkout_customer_icon}
              style={{ width: scaleSize(30), height: scaleSize(30) }}
            />
            <Text
              style={{
                color: "#404040",
                fontSize: scaleSize(12),
                fontWeight: "600",
                marginHorizontal: scaleSize(8),
              }}
            >
              {`Walking Customer`}
            </Text>
            <Image
              source={ICON.add_customer_info_checkout_tab}
              style={{ width: scaleSize(20), height: scaleSize(20) }}
            />
          </Button>
        )}

        {/* -------- Button open cash -------- */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          {!_.isEmpty(groupAppointment) ? (
            <View style={{ flexDirection: "row" }}>
              <Button
                onPress={this.shareTemptInvoice}
                style={[styles.btnCashier, { marginRight: scaleSize(8) }]}
              >
                <Image
                  source={ICON.share_icon}
                  style={{ width: scaleSize(14), height: scaleSize(16) }}
                />
                <Text
                  style={[
                    styles.textBtnCashier,
                    { fontSize: scaleSize(9), fontWeight: "500" },
                  ]}
                >
                  {localize("Share Receipt", language)}
                </Text>
              </Button>
              <Button
                onPress={this.printTemptInvoice}
                style={[styles.btnCashier, { marginRight: scaleSize(8) }]}
              >
                <Image
                  source={ICON.print_btn}
                  style={{ width: scaleSize(14), height: scaleSize(16) }}
                />
                <Text
                  style={[
                    styles.textBtnCashier,
                    { fontSize: scaleSize(9), fontWeight: "500" },
                  ]}
                >
                  {localize("Print Receipt", language)}
                </Text>
              </Button>
            </View>
          ) : (
            <View />
          )}

          <Button onPress={this.checkStatusCashier} style={styles.btnCashier}>
            <Image
              source={ICON.cashier_btn}
              style={{ width: scaleSize(16), height: scaleSize(13) }}
            />
            <Text
              style={[
                styles.textBtnCashier,
                { fontSize: scaleSize(9), fontWeight: "500" },
              ]}
            >
              {localize("Open Cashier", language)}
            </Text>
          </Button>
        </View>
      </View>
    );
  }

  renderStaffColumn() {
    const { staffListCurrentDate } = this.props;
    const {
      isShowCategoriesColumn,
      selectedStaff,
      isBlockBookingFromCalendar,
    } = this.state;
    const tempWidth = isShowCategoriesColumn ? 70 : 180;
    const tempStyleBox = isShowCategoriesColumn
      ? styles.staff_column_box_small
      : {};

    return (
      <View
        style={[
          { width: scaleSize(tempWidth) },
          styles.staff_column_box,
          tempStyleBox,
        ]}
      >
        {/* ----------  StaffColumn Header ----------  */}
        <View style={styles.staff_column_header}>
          <Text
            style={
              (styles.txt_staff_column_header, styles.txt_category_header_extra)
            }
          >
            {`Staff`}
          </Text>
        </View>

        {/* ----------  StaffColumn Header ----------  */}
        <View style={{ flex: 1 }}>
          <FlatList
            ref={this.staffFlatListRef}
            data={staffListCurrentDate}
            renderItem={({ item, index }) => (
              <StaffItem
                staff={item}
                displayCategoriesColumn={this.displayCategoriesColumn(item)}
                selectedStaff={selectedStaff}
              />
            )}
            extraData={selectedStaff}
            keyExtractor={(item, index) => `${item?.staffId}_${index}`}
            showsVerticalScrollIndicator={false}
            onScrollToIndexFailed={() => {}}
          />
        </View>
        {isBlockBookingFromCalendar && (
          <View
            style={{
              flex: 1,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.5)",
            }}
          />
        )}
      </View>
    );
  }

  renderCategoriesCheckout() {
    const { language, categoriesByMerchant, groupAppointment, isOfflineMode } =
      this.props;
    const {
      isShowColProduct,
      isBlockBookingFromCalendar,
      categoryStaff,
      isLoadingCategory,
    } = this.state;

    let tempWidth = 180;
    tempWidth = isShowColProduct ? 100 : tempWidth;

    const temptColorHeader = isShowColProduct ? { color: "#6A6A6A" } : {};
    const categoriesFilter = categoriesByMerchant?.filter(
      (category, index) => category.isDisabled === 0
    );

    const appointments = groupAppointment?.appointments || [];
    let tempIdCategoriesList = [];
    for (let appointment of appointments) {
      let categories = appointment?.categories || [];
      for (let category of categories) {
        tempIdCategoriesList.push(category?.categoryId || 0);
      }
    }

    const IdCategoriesList = [...new Set(tempIdCategoriesList)];
    let selectCategories = [];
    let notSelectCategories = [];
    let tempCategories = [];

    if (IdCategoriesList.length > 0) {
      for (let i = 0; i < IdCategoriesList.length; i++) {
        for (let j = 0; j < categoriesFilter.length; j++) {
          if (IdCategoriesList[i] === categoriesFilter[j].categoryId) {
            selectCategories.push({
              ...categoriesFilter[j],
              isSelect: true,
            });
            break;
          }
        }
      }
      if (isOfflineMode || isBlockBookingFromCalendar) {
        notSelectCategories = categoriesFilter.filter((category, index) =>
          checkCategoryIsNotExist(category, IdCategoriesList)
        );
        tempCategories = [...selectCategories, ...notSelectCategories];
      } else {
        let categoriesStaffFilter = [];

        for (let i = 0; i < categoryStaff.length; i++) {
          const findItem = l.find(selectCategories, (item) => {
            return item.categoryId == categoryStaff[i].categoryId;
          });
          if (!findItem) {
            categoriesStaffFilter.push(categoryStaff[i]);
          }
        }
        tempCategories = [...selectCategories, ...categoriesStaffFilter];
      }
    } else {
      if (isOfflineMode || isBlockBookingFromCalendar) {
        tempCategories = [...categoriesFilter];
      } else {
        tempCategories = [...categoryStaff];
      }
    }

    return (
      <View
        style={[{ width: scaleSize(tempWidth) }, styles.categories_column_box]}
      >
        {/* ------- Header ----- */}
        <View style={[styles.categoriesHeader]}>
          <Text
            style={[
              styles.textHeader,
              temptColorHeader,
              styles.txt_category_header_extra,
            ]}
          >
            {localize("Categories", language)}
          </Text>
        </View>
        {/* ------- Body ----- */}
        {isLoadingCategory ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="grey" />
          </View>
        ) : (
          <View style={styles.categoriesBody}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
            >
              {tempCategories.map((category, index) => (
                <ItemCategory
                  key={index}
                  category={category}
                  onPressSelectCategory={this.onPressSelectCategory}
                  colorText={temptColorHeader}
                  categorySelected={this.state.categorySelected}
                />
              ))}

              {/* --------- Gift Card --------  */}
              <ItemCategory
                category={{
                  name: "Gift Card",
                  categoryId: 1,
                }}
                onPressSelectCategory={this.onSelectGiftCard}
                colorText={temptColorHeader}
                categorySelected={this.state.categorySelected}
              />
            </ScrollView>
          </View>
        )}
      </View>
    );
  }

  renderProductCheckout() {
    const {
      language,
      groupAppointment,
      customService,
      profile,
      isBookingFromCalendar,
      blockAppointments,
    } = this.props;
    const {
      isShowColAmount,
      categorySelected,
      productSeleted,
      categoryTypeSelected,
      isLoadingService,
      isBookingFromAppointmentTab,
    } = this.state;

    let tempWidth = 200;
    tempWidth = isShowColAmount ? 120 : tempWidth;
    const temptColorHeader = isShowColAmount ? { color: "#6A6A6A" } : {};
    const data = this.getDataColProduct();
    const tempTitle =
      categorySelected?.categoryType === "Service" ? "Services" : "Products";
    const isCustomService = profile?.isCustomService ?? false;

    return (
      <View
        style={[{ width: scaleSize(tempWidth) }, styles.product_column_box]}
      >
        {/* ----- Header ---- */}
        <View style={[styles.categoriesHeader]}>
          <Text
            style={[
              styles.textHeader,
              temptColorHeader,
              styles.txt_category_header_extra,
            ]}
          >
            {localize(tempTitle, language)}
          </Text>
        </View>
        {/* --------- List ------- */}
        <View style={{ flex: 1 }}>
          {isLoadingService ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="grey" />
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
            >
              {isCustomService &&
                !isBookingFromCalendar &&
                categoryTypeSelected != "Product" &&
                blockAppointments.length == 0 &&
                customService && (
                  <ItemProductService
                    key="custom_service"
                    index={-1}
                    item={Object.assign({}, customService, {
                      name: "Custom service",
                      category: categorySelected,
                    })}
                    defaultThumb={ICON.custom_service_thumb}
                    colorText={temptColorHeader}
                    itemSelected={productSeleted}
                    categoryTypeSelected={categoryTypeSelected}
                    isShowColAmount={isShowColAmount}
                    groupAppointment={groupAppointment}
                    showColAmount={this.showCustomServiceAmount}
                  />
                )}
              {data.map((item, index) => (
                <ItemProductService
                  key={index}
                  item={item}
                  showColAmount={this.showColAmount}
                  colorText={temptColorHeader}
                  itemSelected={productSeleted}
                  categoryTypeSelected={categoryTypeSelected}
                  isShowColAmount={isShowColAmount}
                  groupAppointment={groupAppointment}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    );
  }

  renderAmountCheckout() {
    const { language, groupAppointment } = this.props;
    const {
      categorySelected,
      categoryTypeSelected,
      productSeleted,
      isShowColProduct,
      arrSelectedExtra,
    } = this.state;
    const temptHeader =
      categorySelected.categoryType === "Service" ? "Extra" : "Amount";

    return (
      <View style={[{ flex: 1 }, styles.product_column_box]}>
        <View
          style={{
            flex: 1,
            borderLeftColor: "#DDDDDD",
            borderLeftWidth: 1,
            borderRightColor: "#DDDDDD",
            borderRightWidth: 1,
          }}
        >
          {/* ----- Header ---- */}
          <View style={[styles.categoriesHeader]}>
            <Text style={[styles.textHeader, styles.txt_category_header_extra]}>
              {localize(temptHeader, language)}
            </Text>
          </View>
          {/* ------- Content ----- */}
          <View style={{ flex: 1 }}>
            {categoryTypeSelected === "Product" ? (
              <ItemAmount ref={this.amountRef} price={productSeleted.price} />
            ) : (
              <ScrollView keyboardShouldPersistTaps="always">
                {this.getExtrasFromRedux(productSeleted).map((extra, index) => (
                  <ItemExtra
                    key={index}
                    extra={extra}
                    onPressSelectExtra={this.onPressSelectExtra}
                    arrSelectedExtra={arrSelectedExtra}
                    groupAppointment={groupAppointment}
                  />
                ))}
              </ScrollView>
            )}
          </View>
          {/* ------- Footer -------- */}
          <View
            style={{
              height: scaleSize(52),
              paddingHorizontal: scaleSize(6),
              paddingBottom: scaleSize(8),
            }}
          >
            <ButtonCustom
              width={`100%`}
              backgroundColor="#F1F1F1"
              title={localize("ADD", language)}
              textColor="#6A6A6A"
              onPress={this.addAmount}
              style={{
                borderWidth: 1,
                borderColor: "#C5C5C5",
                backgroundColor: "#0764B0",
                flex: 1,
                borderRadius: 4,
              }}
              styleText={{
                fontSize: scaleSize(19),
                fontWeight: "bold",
                color: "#fff",
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  renderGroupAppointments() {
    const {
      language,
      groupAppointment,
      paymentDetailInfo,
      isOfflineMode,
      isBookingFromCalendar,
    } = this.props;
    const { basket, subTotalLocal, tipLocal, discountTotalLocal, taxLocal } =
      this.state;
    const appointments = groupAppointment?.appointments
      ? groupAppointment.appointments
      : [];
    const temptGrandTotal = groupAppointment.total ? groupAppointment.total : 0;

    const totalLocal = roundFloatNumber(
      formatNumberFromCurrency(subTotalLocal) +
        formatNumberFromCurrency(tipLocal) +
        formatNumberFromCurrency(taxLocal) -
        formatNumberFromCurrency(discountTotalLocal)
    );
    const paidAmounts = paymentDetailInfo.paidAmounts
      ? paymentDetailInfo.paidAmounts.slice(0).reverse()
      : [];
    const tempTotal = isOfflineMode ? totalLocal : temptGrandTotal;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {_.isEmpty(groupAppointment) ? (
            basket.length > 0 ? (
              <ItemCustomerBasket
                language={language}
                subTotalLocal={subTotalLocal}
                tipLocal={tipLocal}
                discountTotalLocal={discountTotalLocal}
                taxLocal={taxLocal}
                removeItemBasket={this.removeItemBasket}
                changeStylist={this.changeStylist}
                changeProduct={this.changeProduct}
                showModalDiscount={this.showModalDiscount}
                basketLocal={basket}
                isOfflineMode={true}
                showModalTipAppointment={this.showModalTipAppointment}
                showModalCheckPermission={this.showModalCheckPermission}
              />
            ) : (
              <View />
            )
          ) : (
            appointments.map((appointment, index) => (
              <ItemCustomerBasket
                key={`${appointment.appointmentId}_${index}`}
                language={language}
                appointmentDetail={appointment}
                subTotalLocal={subTotalLocal}
                tipLocal={tipLocal}
                discountTotalLocal={discountTotalLocal}
                taxLocal={taxLocal}
                removeItemBasket={this.removeItemBasket}
                changeStylist={this.changeStylist}
                changeProduct={this.changeProduct}
                showModalDiscount={this.showModalDiscount}
                basketLocal={basket}
                showModalTipAppointment={this.showModalTipAppointment}
                showModalCheckPermission={this.showModalCheckPermission}
              />
            ))
          )}
          {/* ----------- Grand Total ----------- */}
          {parseFloat(tempTotal) > 0 ? (
            <View style={{ paddingHorizontal: scaleSize(10) }}>
              <View
                style={{
                  height: 2,
                  backgroundColor: "#0764B0",
                  marginTop: scaleSize(10),
                  marginBottom: scaleSize(15),
                }}
              />
              <View style={styles.payNumberTextContainer}>
                <Text
                  style={[
                    styles.textPay,
                    {
                      fontSize: scaleSize(18),
                      fontWeight: "600",
                      color: "#0764B0",
                    },
                  ]}
                >
                  {`${localize("Grand Total", language)}:`}
                </Text>
                <Text
                  style={[
                    styles.textPay,
                    {
                      fontSize: scaleSize(18),
                      fontWeight: "600",
                      color: "rgb(65,184,85)",
                    },
                  ]}
                >
                  {`$ ${formatMoney(tempTotal)}`}
                </Text>
              </View>
            </View>
          ) : null}

          {/* ----------- Paid Amount ----------- */}
          {!isBookingFromCalendar && !_.isEmpty(paymentDetailInfo) ? (
            <View
              style={{
                paddingHorizontal: scaleSize(10),
                marginBottom: scaleSize(8),
              }}
            >
              <View
                style={{
                  height: 2,
                  backgroundColor: "#DDDDDD",
                  marginTop: scaleSize(10),
                  marginBottom: scaleSize(15),
                }}
              />
              {/* ---------- Paid amount ------ */}
              {paidAmounts.map((paidAmountInfo, index) => (
                <View
                  key={index}
                  style={[
                    styles.payNumberTextContainer,
                    {
                      justifyContent: "space-between",
                      marginBottom: scaleSize(8),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.textPay,
                      {
                        fontSize: scaleSize(18),
                        fontWeight: "600",
                        color: "#404040",
                      },
                    ]}
                  >
                    {`${localize("Paid ", language)}`}
                    <Text
                      style={[
                        styles.textPay,
                        {
                          fontSize: scaleSize(18),
                          fontWeight: "300",
                          color: "#404040",
                        },
                      ]}
                    >
                      {` (${paidAmountInfo.paymentMethod})`}
                    </Text>
                  </Text>
                  <Text
                    style={[
                      styles.textPay,
                      {
                        fontSize: scaleSize(18),
                        fontWeight: "600",
                        color: "#404040",
                      },
                    ]}
                  >
                    {`  $ ${formatMoney(paidAmountInfo.amount)}`}
                  </Text>
                </View>
              ))}

              {/* ---------- Due amount ------ */}
              {!isBookingFromCalendar && paymentDetailInfo.dueAmount ? (
                <View
                  style={[
                    styles.payNumberTextContainer,
                    { justifyContent: "space-between" },
                  ]}
                >
                  <Text
                    style={[
                      styles.textPay,
                      {
                        fontSize: scaleSize(18),
                        fontWeight: "600",
                        color: "#FF3B30",
                      },
                    ]}
                  >
                    {`${localize("Amount Due", language)}:`}
                  </Text>
                  <Text
                    style={[
                      styles.textPay,
                      {
                        fontSize: scaleSize(18),
                        fontWeight: "600",
                        color: "#FF3B30",
                      },
                    ]}
                  >
                    {`   $ ${formatMoney(paymentDetailInfo.dueAmount)}`}
                  </Text>
                </View>
              ) : (
                <View />
              )}
            </View>
          ) : (
            <View />
          )}
          <View style={{ height: scaleSize(50) }} />
        </ScrollView>
      </View>
    );
  }

  renderBlocksAppointments() {
    const { infoUser } = this.state;
    const { language, blockAppointments } = this.props;
    const { basket, subTotalLocal, tipLocal, discountTotalLocal, taxLocal } =
      this.state;

    let temptGrandTotal = 0;
    for (let i = 0; i < blockAppointments.length; i++) {
      temptGrandTotal =
        temptGrandTotal + formatNumberFromCurrency(blockAppointments[i].total);
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {blockAppointments.map((appointment, index) => (
            <ItemBlockBasket
              ref={this.addBlockAppointmentRef}
              key={`${appointment.appointmentId}_${index}`}
              blockIndex={index}
              language={language}
              appointmentDetail={appointment}
              subTotalLocal={subTotalLocal}
              tipLocal={tipLocal}
              discountTotalLocal={discountTotalLocal}
              taxLocal={taxLocal}
              removeItemBasket={this.removeItemBasket}
              showModalDiscount={this.showModalDiscount}
              basketLocal={basket}
              infoUser={infoUser}
              showModalTipAppointment={this.showModalTipAppointment}
              toggleCollaps={this.toggleCollaps}
              removeBlockAppointment={this.removeBlockAppointment}
              createABlockAppointment={this.createABlockAppointment}
              showModalCheckPermission={this.showModalCheckPermission}
            />
          ))}

          {/* ----------- Grand Total ----------- */}
          <View
            style={{
              paddingHorizontal: scaleSize(10),
              marginTop: scaleSize(15),
            }}
          >
            <View
              style={{
                height: 2,
                backgroundColor: "#0764B0",
                marginTop: scaleSize(10),
                marginBottom: scaleSize(15),
              }}
            />
            {/* ---------- Tip ------ */}
            <View style={styles.payNumberTextContainer}>
              <Text
                style={[
                  styles.textPay,
                  {
                    fontSize: scaleSize(18),
                    fontWeight: "600",
                    color: "#0764B0",
                  },
                ]}
              >
                {`${localize("Grand Total", language)}:`}
              </Text>
              <Text
                style={[
                  styles.textPay,
                  {
                    fontSize: scaleSize(18),
                    fontWeight: "600",
                    color: "rgb(65,184,85)",
                  },
                ]}
              >
                {`$ ${formatMoney(temptGrandTotal)}`}
              </Text>
            </View>
          </View>

          <View style={{ height: scaleSize(70) }} />
        </ScrollView>
      </View>
    );
  }

  renderBasket() {
    const {
      language,
      groupAppointment,
      paymentDetailInfo,
      blockAppointments,
      isBookingFromCalendar,
    } = this.props;
    const { isShowColAmount, isBlockBookingFromCalendar } = this.state;
    const checkoutPayments =
      !_.isEmpty(paymentDetailInfo) && paymentDetailInfo.checkoutPayments
        ? paymentDetailInfo.checkoutPayments
        : [];
    const length_blockAppointments = blockAppointments
      ? blockAppointments.length
      : 0;
    const isShowAddBlock =
      length_blockAppointments > 0 &&
      blockAppointments[length_blockAppointments - 1].total != "0.00"
        ? true
        : false;
    const tempStyle = !isShowColAmount
      ? { borderLeftWidth: 3, borderLeftColor: "#EEEEEE" }
      : {};

    const isShowAddButton =
      (!isBlockBookingFromCalendar || !isBookingFromCalendar) &&
      ((!_.isEmpty(groupAppointment) && checkoutPayments.length === 0) ||
        (blockAppointments.length && isShowAddBlock) > 0);

    return (
      <View style={[styles.basket_box, tempStyle]}>
        {/* -------- Header Basket -------- */}
        <View
          style={[
            styles.headerBasket,
            {
              flexDirection: "row",
              paddingHorizontal: scaleSize(8),
              backgroundColor: "#F1F1F1",
            },
          ]}
        >
          <View style={{ flex: 1 }} />
          <Text
            style={[
              styles.textHeader,
              { fontWeight: "600", fontSize: scaleSize(16) },
            ]}
          >
            {localize("Basket", language)}
          </Text>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            {isShowAddButton ? (
              <Button onPress={() => this.addAppointmentCheckout()}>
                <Image
                  source={ICON.add_appointment_checkout}
                  style={{ width: scaleSize(25), height: scaleSize(25) }}
                />
              </Button>
            ) : (
              <View />
            )}
          </View>
        </View>
        {/* -------- Content Basket -------- */}
        {blockAppointments.length > 0
          ? this.renderBlocksAppointments()
          : this.renderGroupAppointments()}

        {/* -------- Footer Basket -------- */}
        <View
          style={{
            height: scaleSize(52),
            paddingHorizontal: scaleSize(8),
            paddingBottom: scaleSize(8),
          }}
        >
          {this.renderButtonChekout()}
        </View>
      </View>
    );
  }

  renderPaymetsMethod() {
    const { language, groupAppointment } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={[styles.payment_header, { paddingLeft: scaleSize(20) }]}>
          <Text
            style={[
              styles.textHeader,
              { fontWeight: "600", fontSize: scaleSize(15) },
            ]}
          >
            {localize("Select payment method", language)}
          </Text>
        </View>

        <View style={styles.box_payment_container}>
          <QRCodePay
            key="QRCodePay"
            appointment={groupAppointment}
            onPaidAppointment={this.onCodePayPaidAppointment}
          />
          {["Cash"].map((title, index) => (
            <ItemPaymentMethod
              key={index}
              title={title}
              selectedPayment={this.selectedPayment}
              paymentSelected={this.state.paymentSelected}
            />
          ))}
        </View>
        <View style={styles.box_payment_container}>
          {["Credit Card", "Other"].map((title, index) => (
            <ItemPaymentMethod
              key={index}
              title={title}
              selectedPayment={this.selectedPayment}
              paymentSelected={this.state.paymentSelected}
            />
          ))}
        </View>
        {/* ------ Footer ----- */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: scaleSize(8),
          }}
        >
          <ButtonCustom
            width={scaleSize(300)}
            title={localize("BACK", language)}
            backgroundColor="#0764B0"
            textColor="#fff"
            onPress={this.backAddBasket}
            style={styles.btn_back}
            styleText={styles.txt_btn_basket}
          />
        </View>
      </View>
    );
  }

  renderButtonChekout() {
    const {
      language,
      isDonePayment,
      groupAppointment,
      blockAppointments,
      isBookingFromCalendar,
    } = this.props;
    const {
      tabCurrent,
      basket,
      paymentSelected,
      changeButtonDone,
      isCancelHarmonyPay,
    } = this.state;

    let isAcceptPay = !_.isEmpty(groupAppointment)
      ? groupAppointment.total && parseFloat(groupAppointment.total) > 0
        ? true
        : false
      : basket.length > 0
      ? true
      : false;
    isAcceptPay = paymentSelected === "Cash" ? true : isAcceptPay;

    if (tabCurrent === 1) {
      if (changeButtonDone && isCancelHarmonyPay) {
        if (paymentSelected === "HarmonyPay") {
          return (
            <ButtonCustom
              width={`100%`}
              backgroundColor="#0764B0"
              title={localize("CANCEL", language)}
              textColor="#fff"
              onPress={this.cancelHarmonyPayment}
              style={styles.btn_basket}
              styleText={styles.txt_btn_basket}
            />
          );
        }
        return (
          <ButtonCustom
            width={`100%`}
            backgroundColor="#F1F1F1"
            title={localize("DONE", language)}
            textColor="#6A6A6A"
            onPress={() => {}}
            style={styles.btn_basket}
            styleText={styles.txt_btn_basket}
            activeOpacity={1}
          />
        );
      } else if (changeButtonDone && isDonePayment) {
        return (
          <ButtonCustom
            width={`100%`}
            backgroundColor="#0764B0"
            title={localize("DONE", language)}
            textColor="#fff"
            onPress={() => {}}
            style={styles.btn_basket}
            styleText={styles.txt_btn_basket}
          />
        );
      } else if (
        paymentSelected === "" ||
        paymentSelected === "Gift Card" ||
        !isAcceptPay
      ) {
        return (
          <ButtonCustom
            width={`100%`}
            backgroundColor="#F1F1F1"
            title={localize("PAY", language)}
            textColor="#6A6A6A"
            onPress={() => {}}
            style={styles.btn_basket}
            activeOpacity={1}
            styleText={styles.txt_btn_basket}
          />
        );
      }
      return (
        <ButtonCustom
          width={`100%`}
          backgroundColor="#0764B0"
          title={localize("PAY", language)}
          textColor="#fff"
          onPress={this.payBasket}
          style={styles.btn_basket}
          styleText={styles.txt_btn_basket}
        />
      );
    } else if (tabCurrent === 2) {
      return (
        <ButtonCustom
          width={`100%`}
          backgroundColor="#0764B0"
          title={localize("CONFIRM", language)}
          textColor="#fff"
          onPress={this.confimPayOfflinemode}
          style={styles.btn_basket}
          styleText={styles.txt_btn_basket}
        />
      );
    } else {
      if (blockAppointments.length > 0) {
        const isBooking = this.checkBlockAppointment(blockAppointments);
        if (isBooking) {
          return (
            <ButtonCustom
              width={`100%`}
              backgroundColor="#0764B0"
              title={localize("BOOK", language)}
              textColor="#fff"
              onPress={this.bookBlockAppointment}
              style={styles.btn_basket}
              styleText={styles.txt_btn_basket}
            />
          );
        }
        return (
          <ButtonCustom
            width={`100%`}
            backgroundColor="#F1F1F1"
            title={localize("BOOK", language)}
            textColor="#6A6A6A"
            onPress={() => {}}
            style={styles.btn_basket}
            activeOpacity={1}
            styleText={styles.txt_btn_basket}
          />
        );
      } else if (isBookingFromCalendar) {
        if (
          !_.isEmpty(groupAppointment) &&
          formatNumberFromCurrency(groupAppointment?.total) > 0
        ) {
          return (
            <ButtonCustom
              width={`100%`}
              backgroundColor="#0764B0"
              title={localize("BOOK", language)}
              textColor="#fff"
              onPress={this.bookAppointmentFromCalendar}
              style={styles.btn_basket}
              styleText={styles.txt_btn_basket}
            />
          );
        } else {
          return (
            <ButtonCustom
              width={`100%`}
              backgroundColor="#F1F1F1"
              title={localize("BOOK", language)}
              textColor="#6A6A6A"
              onPress={() => {}}
              style={styles.btn_basket}
              activeOpacity={1}
              styleText={styles.txt_btn_basket}
            />
          );
        }
      } else if (basket.length > 0 || !_.isEmpty(groupAppointment)) {
        return (
          <ButtonCustom
            width={`100%`}
            backgroundColor="#0764B0"
            title={localize("SELECT PAYMENT", language)}
            textColor="#fff"
            onPress={this.selectPayment}
            style={styles.btn_basket}
            styleText={styles.txt_btn_basket}
          />
        );
      }
      return (
        <ButtonCustom
          width={`100%`}
          backgroundColor="#F1F1F1"
          title={localize("SELECT PAYMENT", language)}
          textColor="#6A6A6A"
          onPress={() => {}}
          style={styles.btn_basket}
          activeOpacity={1}
          styleText={styles.txt_btn_basket}
        />
      );
    }
  }

  renderOfflineMode() {
    const { language } = this.props;
    const { appointmentOfflineMode } = this.state;

    return (
      <View style={{ flex: 1, paddingHorizontal: scaleSize(22) }}>
        <Text
          style={[
            styles.textHeader,
            {
              fontSize: scaleSize(19),
              marginTop: scaleSize(10),
              marginBottom: scaleSize(12),
            },
          ]}
        >
          {localize("Offline mode", language)}
        </Text>
        <View style={{ alignItems: "center", marginBottom: scaleSize(30) }}>
          <Text style={[styles.textHeader, { fontSize: scaleSize(18) }]}>
            {localize("Use consumer app to scan QR code below", language)}
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={styles.containerQrcode}>
            <QRCode
              value={JSON.stringify(appointmentOfflineMode)}
              size={scaleSize(200)}
            />
          </View>
        </View>
        <View style={{ alignItems: "center", marginTop: scaleSize(25) }}>
          <Text style={[styles.textHeader, { fontSize: scaleSize(18) }]}>
            {localize("Then scan the QR code on the phone", language)}
          </Text>
          <Text style={[styles.textHeader, { fontSize: scaleSize(18) }]}>
            {localize("to complete the transaction", language)}
          </Text>
        </View>
        {/* ------ Footer ----- */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: scaleSize(8),
          }}
        >
          <ButtonCustom
            width={scaleSize(300)}
            title={localize("BACK", language)}
            backgroundColor="#0764B0"
            textColor="#fff"
            onPress={() => this.scrollTabRef.current?.goToPage(1)}
            style={styles.btn_back}
            styleText={styles.txt_btn_basket}
          />
        </View>
      </View>
    );
  }

  renderBodyCheckout() {
    const { isShowCategoriesColumn, isShowColProduct, isShowColAmount } =
      this.state;

    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ width: scaleSize(480) }}>
          <ScrollableTabView
            ref={this.scrollTabRef}
            style={{
              flex: 1,
            }}
            initialPage={0}
            locked={true}
            renderTabBar={() => <View />}
            onChangeTab={(index) => {
              this.setState({ tabCurrent: index.i });
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              {this.renderStaffColumn()}
              {isShowCategoriesColumn ? this.renderCategoriesCheckout() : null}
              {isShowColProduct ? this.renderProductCheckout() : null}
              {isShowColAmount ? this.renderAmountCheckout() : null}
              <View style={{ width: scaleSize(4) }} />
            </View>
            {this.renderPaymetsMethod()}
            {this.renderOfflineMode()}
          </ScrollableTabView>
        </View>
        {this.renderBasket()}
      </View>
    );
  }

  render() {
    const {
      language,
      visiblePopupPaymentDetails,
      visiblePopupCheckDiscountPermission,
      isCancelAppointment,
      isOfflineMode,
      groupAppointment,
      isBookingFromCalendar,
      appointmentIdBookingFromCalendar,
    } = this.props;

    const {
      visibleConfirm,
      visibleChangeStylist,
      visiblePopupDiscountLocal,
      visibleScanCode,
      visiblePopupAddItemIntoBasket,
      visibleAddEditCustomerPopup,
      visibleErrorMessageFromPax,
      errorMessageFromPax,
      selectedStaff,
      staffOfService,
      visibleConfirmPayment,
      visibleInvoice,
      paymentSelected,
    } = this.state;

    let app0 = null;
    if (groupAppointment && groupAppointment?.appointments?.length > 0) {
      app0 = groupAppointment?.appointments[0];
    }

    const titleExitCheckoutTab =
      (isCancelAppointment &&
        app0 &&
        app0.services.length + app0.products.length + app0.giftCards.length ===
          0) ||
      (isBookingFromCalendar &&
        appointmentIdBookingFromCalendar &&
        app0 &&
        app0.services.length + app0.products.length + app0.giftCards.length ===
          0) ||
      (!isBookingFromCalendar &&
        appointmentIdBookingFromCalendar == 0 &&
        app0 &&
        app0.services.length + app0.products.length + app0.giftCards.length ===
          0)
        ? "The appointment will be canceled if you do not complete your payment. Are you sure you want to exit Check-out? "
        : "Are you sure you want to exit Check-Out?";

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderBodyCheckout()}
        <PopupDiscount
          ref={this.popupDiscountRef}
          title={localize("Discount", language)}
        />
        <PopupBlockDiscount title={localize("Discount", language)} />
        <PopupDiscountLocal
          ref={this.popupDiscountLocalRef}
          visible={visiblePopupDiscountLocal}
          title={localize("Discount", language)}
          onRequestClose={this.onRequestClosePopupDiscountLocal}
          callbackDiscountToParent={(
            customDiscountPercentLocal,
            customDiscountFixedLocal,
            discountTotalLocal
          ) =>
            this.callbackDiscountToParent(
              customDiscountPercentLocal,
              customDiscountFixedLocal,
              discountTotalLocal
            )
          }
        />
        <PopupConfirm
          visible={visibleConfirm}
          title={localize("Confirmation", language)}
          message={titleExitCheckoutTab}
          onRequestClose={() => {
            this.setState({ visibleConfirm: false });
          }}
          confimYes={this.clearDataCofrim}
        />
        <PopupConfirm
          visible={visibleConfirmPayment ? true : false}
          title={localize("VerifyPayment", language)}
          message={localize("VerifyPaymentMessage", language)}
          onRequestClose={() => {
            this.setState({ visibleConfirmPayment: false });
          }}
          confimYes={this.confirmPaymentClover}
          confirmNo={this.rejectPaymentClover}
          textLeftButton={localize("Reject", language)}
          textRightButton={localize("Accept", language)}
          hideCloseButton={true}
        />

        {/* ----------------- Display Error Message From Pax Machine ------------------ */}
        <ErrorMessagePaxModal
          visible={visibleErrorMessageFromPax}
          title={localize("Trasaction Fail", language)}
          message={errorMessageFromPax}
          onRequestClose={() => {
            this.setState({ visibleErrorMessageFromPax: false });
          }}
          confimYes={() => {
            this.setState({ visibleErrorMessageFromPax: false });
          }}
        />
        <PopupChangeMoney
          ref={this.cashBackRef}
          title={localize("Confirmation", language)}
          onRequestClose={() => {
            this.setState({ visibleChangeMoney: false });
          }}
          confimOK={this.doneBillByCash}
        />
        <PopupChangeStylist
          ref={this.changeStylistRef}
          visible={visibleChangeStylist}
          title={localize("Modify Service", language)}
          onRequestClose={() => {
            this.setState({ visibleChangeStylist: false, staffOfService: [] });
          }}
          changeStylistBasketLocal={this.changeStylistBasketLocal}
          staffOfService={staffOfService}
          isOfflineMode={isOfflineMode}
        />
        <PopupChangePriceAmountProduct
          ref={this.changePriceAmountProductRef}
          visible={this.state.visibleChangePriceAmountProduct}
          title={localize("Modification", language)}
          onRequestClose={() => {
            this.setState({ visibleChangePriceAmountProduct: false });
          }}
          changeProductBasketLocal={this.changeProductBasketLocal}
        />

        <PopupChangeTip
          ref={this.changeTipRef}
          visible={this.state.visibleChangeTip}
          title={localize("Add Tip", language)}
          onRequestClose={() => {
            this.setState({ visibleChangeTip: false });
          }}
        />

        <DialogPayCompleted
          onRequestClose={() => {}}
          printBill={this.printBill}
          donotPrintBill={this.donotPrintBill}
          cancelInvoicePrint={this.cancelInvoicePrint}
          doPrintClover={this.doPrintClover}
          paymentSelected={paymentSelected}
          groupAppointmentId={groupAppointment?.mainAppointmentId}
        />
        <PopupProcessingCredit
          visible={this.state.visibleProcessingCredit}
          onRequestClose={this.cancelTransaction}
          language={language}
        />
        <PopupBill
          ref={this.modalBillRef}
          title={localize("Enter Amount", language)}
          visible={this.state.visibleBillOfPayment}
          onRequestClose={this.onRequestCloseBillModal}
          language={language}
          extractBill={this.extractBill}
          doneBill={this.doneBill}
        />

        <PopupEnterAmountGiftCard
          ref={this.popupEnterAmountGiftCardRef}
          onRequestClose={this.onRequestCloseBillModal}
          language={language}
          extractBill={this.extractBill}
          doneBill={this.doneBill}
        />

        <PopupSendLinkInstall
          ref={this.popupSendLinkInstallRef}
          visible={this.state.visibleSendLinkPopup}
          title={localize("Confirmation", language)}
          onRequestClose={() => this.setState({ visibleSendLinkPopup: false })}
          confimYes={this.sendLinkInstallApp}
        />
        <PopupActiveGiftCard
          ref={this.activeGiftCardRef}
          title={localize("Active Gift Card", language)}
          onRequestClose={this.closePopupActiveGiftCard}
          submitSerialCode={this.submitSerialCode}
        />
        <PopupPaymentDetails
          title={localize("Payment Details", language)}
          visible={visiblePopupPaymentDetails}
          onRequestClose={this.closePopupProductPaymentDetails}
          language={language}
          nextPayment={this.nextPayment}
        />
        <PopupScanCode
          visible={visibleScanCode}
          onRequestClose={this.onRequestCloseScanCode}
          resultScanCode={this.resultScanCode}
        />
        <PopupInvoicePrint
          ref={this.invoicePrintRef}
          visiblePrintInvoice={this.state.visiblePrintInvoice}
          onRequestClose={this.cancelInvoicePrint}
          doPrintClover={(imageUri) => this.doPrintClover(imageUri)}
        />
        <EnterCustomerPhonePopup
          ref={this.popupCustomerInfoRef}
          title={localize("Enter Phone Number", language)}
          onRequestClose={() => {
            this.setState({ visibleCustomerName: false });
          }}
          changeStylistBasketLocal={this.changeStylistBasketLocal}
        />
        <PopupAddItemIntoAppointments
          ref={this.popupAddItemIntoAppointmentsRef}
          title={localize("Modification", language)}
          visible={visiblePopupAddItemIntoBasket}
          onRequestClose={() =>
            this.setState({ visiblePopupAddItemIntoBasket: false })
          }
          selectedStaff={this.state.selectedStaff}
        />

        <PopupGiftCardDetail
          title={localize("Gift Card Details", language)}
          onRequestClose={this.closePopupProductPaymentDetails}
          language={language}
          nextPayment={this.nextPayment}
          cancelGiftCardPayment={this.cancelGiftCardPayment}
        />
        <PopupCheckStaffPermission
          ref={this.popupCheckDiscountPermissionRef}
          visiblePopupCheckStaffPermission={visiblePopupCheckDiscountPermission}
          title={localize("Input PIN Number", language)}
          tabName={menuTabs.CHECKOUT_DISCOUNT}
          onRequestClose={this.closePopupCheckDiscountPermission}
        />

        <PopupAddEditCustomer
          ref={this.addEditCustomerInfoRef}
          visible={visibleAddEditCustomerPopup}
          title={"Customer Information"}
          onRequestClose={() =>
            this.setState({ visibleAddEditCustomerPopup: false })
          }
          editCustomerInfo={this.editCustomerInfo}
          addCustomerInfo={this.addCustomerInfo}
        />

        <PopupReceipt
          ref={this.invoiceRef}
          groupAppointment={groupAppointment}
          doPrintClover={this.doPrintClover}
          cancelInvoicePrint={this.cancelInvoicePrint}
        />

        <PopupEnterAmountCustomService
          ref={this.popupEnterAmountCustomServiceRef}
          language={language}
          submitAddCustomService={this.submitAddCustomService}
        />
      </View>
    );
  }
}

export default Layout;
