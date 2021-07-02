import IMAGE from "@resources";
import {
  ButtonGradient,
  ButtonGradientWhite,
  FormTitle,
} from "@shared/components";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import { ORDERED_STATUS } from "@shared/components/OrderStatusView";
import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";
import { colors, fonts, layouts } from "@shared/themes";
import { dateToString, DATE_TIME_SHOW_FORMAT_STRING } from "@shared/utils";
import { formatMoneyWithUnit } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  FormAddressInformation,
  FormEditNotes,
  FormShippingCarrier,
} from "../../widget";

const CancelConfirmButton = WithDialogConfirm(ButtonGradientWhite);

export const Layout = ({
  item,
  cancel,
  goBack,
  shipping,
  confirm,
  onChangeShippingMethod,
  complete,
  onSubmitNotes,
  getPaymentString,
  refund,
  onEditShippingAddress,
  onEditBillingAddress,
  formAddressRef,
  onDidNotPayCheck,
}) => {
  const [t] = useTranslation();

  const renderButton = () => {
    switch (item?.status) {
      case ORDERED_STATUS.COMPLETE:
        return (
          <>
            <ButtonGradient
              label={t("Return")}
              width={scaleWidth(120)}
              height={scaleHeight(40)}
              fontSize={scaleFont(17)}
              textColor={colors.WHITE}
              textWeight="normal"
              onPress={refund}
            />
          </>
        );
      case ORDERED_STATUS.SHIP:
        return (
          <>
            <CancelConfirmButton
              label={t("Cancel")}
              width={scaleWidth(120)}
              height={scaleHeight(40)}
              fontSize={scaleFont(17)}
              textWeight="normal"
              onPress={cancel}
              description={t("Are you sure you want to Cancel this order ?")}
            />
            <View style={layouts.marginHorizontal} />
            <ButtonGradient
              label={t("Complete")}
              width={scaleWidth(120)}
              height={scaleHeight(40)}
              fontSize={scaleFont(17)}
              textColor={colors.WHITE}
              textWeight="normal"
              onPress={complete}
            />
          </>
        );
      case ORDERED_STATUS.PENDING:
        return (
          <>
            <CancelConfirmButton
              label={t("Cancel")}
              width={scaleWidth(120)}
              height={scaleHeight(40)}
              fontSize={scaleFont(17)}
              textWeight="normal"
              onPress={cancel}
              description={t("Are you sure you want to Cancel this order ?")}
            />
            <View style={layouts.marginHorizontal} />
            <ButtonGradient
              label={t("Confirm")}
              width={scaleWidth(120)}
              height={scaleHeight(40)}
              fontSize={scaleFont(17)}
              textColor={colors.WHITE}
              textWeight="normal"
              onPress={confirm}
            />
          </>
        );
      case ORDERED_STATUS.PROCESS:
        return (
          <>
            <CancelConfirmButton
              label={t("Cancel")}
              width={scaleWidth(120)}
              height={scaleHeight(40)}
              fontSize={scaleFont(17)}
              textWeight="normal"
              onPress={cancel}
              description={t("Are you sure you want to Cancel this order ?")}
            />
            <View style={layouts.marginHorizontal} />
            <ButtonGradient
              label={t("Ship")}
              width={scaleWidth(120)}
              height={scaleHeight(40)}
              fontSize={scaleFont(17)}
              textColor={colors.WHITE}
              textWeight="normal"
              onPress={shipping}
            />
          </>
        );
      case ORDERED_STATUS.CANCEL:
      case ORDERED_STATUS.CLOSED:
      case ORDERED_STATUS.RETURN:
      default:
        return (
          <>
            {/* <ButtonGradient
              label={t("Reorder")}
              width={scaleWidth(120)}
              height={scaleHeight(40)}
              fontSize={scaleFont(17)}
              textColor={colors.WHITE}
              textWeight="normal"
              // onPress={onEditProduct}
            /> */}
          </>
        );
    }
  };

  const onRenderCell = ({ item, columnKey, rowIndex, cellWidth }) => {
    if (columnKey === "productName") {
      return (
        <View
          key={getUniqueId(columnKey, rowIndex, "cell-product-name")}
          style={[layouts.horizontal, { width: cellWidth }, styles.cellStyle]}
        >
          <FastImage
            style={styles.imageStyle}
            source={
              item?.imageUrl
                ? {
                    uri: item?.imageUrl,
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.immutable,
                  }
                : IMAGE.product_holder
            }
            resizeMode="contain"
          />
          <View style={layouts.marginHorizontal} />
          <View style={styles.productNameContent}>
            <Text style={styles.productName}>{item?.productName}</Text>
            <View style={styles.productNameMarginVertical} />
            <Text style={styles.productName}>{`SKU: ${item?.sku}`}</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={layouts.fill}>
      <View style={styles.headContent}>
        <Text style={styles.headTitle}>
          {t("Order")}{" "}
          {
            <Text style={[styles.headTitle, { color: colors.OCEAN_BLUE }]}>
              {`#${item?.appointmentId}`}
            </Text>
          }
        </Text>
        <View style={styles.headerRightContent}>
          <View style={layouts.marginHorizontal} />
          {renderButton()}
          <View style={layouts.marginHorizontal} />
          <ButtonGradientWhite
            width={scaleWidth(40)}
            height={scaleHeight(40)}
            fontSize={scaleFont(17)}
            textWeight="normal"
            onPress={goBack}
          >
            <Image source={IMAGE.back} />
          </ButtonGradientWhite>
        </View>
      </View>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <FormTitle label={t("Order & Account Information")} />
          <View style={layouts.horizontal}>
            <InfoContent label={t("Order Information")}>
              <View style={styles.personContent}>
                <InfoLine
                  label={t("ID")}
                  infoValue={`#${item?.appointmentId}`}
                />
                <InfoLine
                  label={t("Purcharse Point")}
                  infoValue={item?.purchasePoint}
                />
                <InfoLine
                  label={t("Order Date")}
                  infoValue={dateToString(
                    item?.createdDate,
                    DATE_TIME_SHOW_FORMAT_STRING
                  )}
                />
                <InfoLine label={t("Order Status")} infoValue={item?.status} />
              </View>
            </InfoContent>

            <View style={layouts.marginHorizontal} />
            <InfoContent label={t("Account Information")}>
              <View style={styles.personContent}>
                <InfoLine
                  label={t("Customer Name")}
                  infoValue={`${item?.customer?.firstName} ${item?.customer?.lastName}`}
                  infoTextStyle={styles.highInfoTextStyle}
                />
                <InfoLine
                  label={t("Phone Number")}
                  infoValue={item?.customer?.phone}
                />
                <InfoLine
                  label={t("Email")}
                  infoValue={item?.customer?.email}
                />
                <InfoLine
                  label={t("Address")}
                  infoValue={item?.customer?.address}
                />
              </View>
            </InfoContent>
          </View>

          <FormTitle label={t("Items Ordered")} />
          <Table
            items={item?.products || []}
            headerKeyLabels={{
              productName: t("Product"),
              price: t("Price"),
              quantity: t("Qty"),
              subTotal: t("Subtotal"),
              tax: t("Tax"),
              discount: t("Discount"),
              total: t("Total"),
            }}
            whiteListKeys={[
              "productName",
              "price",
              "quantity",
              "subTotal",
              "tax",
              "discount",
              "total",
            ]}
            primaryKey="productId"
            widthForKeys={{
              productName: scaleWidth(300),
              price: scaleWidth(150),
              quantity: scaleWidth(100),
              subTotal: scaleWidth(120),
              tax: scaleWidth(120),
              discount: scaleWidth(120),
              total: scaleWidth(150),
            }}
            emptyDescription={t("No Products")}
            styleTextKeys={{ total: styles.highLabelTextStyle }}
            formatFunctionKeys={{
              price: (value) => `${formatMoneyWithUnit(value)}`,
              subTotal: (value) => `${formatMoneyWithUnit(value)}`,
              tax: (value) => `${formatMoneyWithUnit(value)}`,
              discount: (value) => `${formatMoneyWithUnit(value)}`,
              total: (value) => `${formatMoneyWithUnit(value)}`,
            }}
            renderCell={onRenderCell}
            // onRowPress={onSelectRow}
            // draggable={true}
          />

          {item?.status === ORDERED_STATUS.PENDING ? (
            <>
              <FormTitle label={t("Shipping Method")} />
              <FormShippingCarrier onChangeValue={onChangeShippingMethod} />

              <FormTitle label={t("Address Information")} />
              <FormAddressInformation
                ref={formAddressRef}
                customerId={item?.customerId}
                shippingAddress={item?.shippingAddress}
                billingAddress={item?.billingAddress}
                onChangeShippingAddress={onEditShippingAddress}
                onChangeBillingAddress={onEditBillingAddress}
              />
            </>
          ) : (
            <>
              <FormTitle label={t("Address Information")} />
              <View style={layouts.horizontal}>
                <InfoContent label={t("Billing Address")}>
                  {item?.billingAddress && (
                    <View style={styles.personContent}>
                      <Text>{`${item?.billingAddress?.addressFirstName} ${item?.billingAddress?.addressLastName}\n${item?.billingAddress?.street} ${item?.billingAddress?.city} ${item?.billingAddress?.stateName}\n${item?.billingAddress?.addressPhone}`}</Text>
                    </View>
                  )}
                </InfoContent>
                <View style={layouts.marginHorizontal} />
                <InfoContent label={t("Shipping Address")}>
                  {item?.shippingAddress && (
                    <View style={styles.personContent}>
                      <Text>{`${item?.shippingAddress?.addressFirstName} ${item?.shippingAddress?.addressLastName}\n${item?.shippingAddress?.street} ${item?.shippingAddress?.city} ${item?.shippingAddress?.stateName}\n${item?.shippingAddress?.addressPhone}`}</Text>
                    </View>
                  )}
                </InfoContent>
              </View>

              <FormTitle label={t("Payment & Shipping Method")} />
              <View style={layouts.horizontal}>
                <InfoContent label={t("Payment Informations")}>
                  {item?.payment?.length > 0 &&
                    item?.payment.map((payItem) => (
                      <View style={styles.personContent}>
                        <Text style={styles.boldText}>
                          {`${getPaymentString(
                            payItem?.paymentMethod
                          )} - ${formatMoneyWithUnit(payItem?.amount)}`}
                        </Text>
                      </View>
                    ))}
                  {item?.didNotPay && (
                    <View style={styles.personContent}>
                      <Text style={styles.boldText}>
                        {`${t("Did not pay")}`}
                      </Text>
                    </View>
                  )}
                </InfoContent>
                <View style={layouts.marginHorizontal} />
                <InfoContent label={t("Shipping & Handling Infomation")}>
                  {item?.shipping?.shippingCarrier && (
                    <View style={styles.personContent}>
                      <Text>{t("Shipping carrier")}</Text>
                      <View style={layouts.marginVertical} />

                      <View style={layouts.horizontal}>
                        {item?.shipping?.shippingCarrier && (
                          <Text
                            style={styles.boldText}
                          >{`${item?.shipping?.shippingCarrier}`}</Text>
                        )}
                        {item?.shipping?.shippingCarrier &&
                          item?.shipping?.trackingNumber && (
                            <Text style={styles.boldText}>{" - "}</Text>
                          )}
                        {item?.shipping?.trackingNumber && (
                          <Text style={styles.boldText}>{`${
                            item?.shipping?.trackingNumber
                          } (${t("Tracking number")})`}</Text>
                        )}
                      </View>
                    </View>
                  )}

                  {item?.shipping?.shippingMethodGroup && (
                    <View style={styles.personContent}>
                      <Text>{t("Shipping method")}</Text>
                      <View style={layouts.marginVertical} />

                      <View style={layouts.horizontal}>
                        {item?.shipping?.shippingMethodGroup && (
                          <Text
                            style={styles.boldText}
                          >{`${item?.shipping?.shippingMethodGroup}`}</Text>
                        )}
                        {item?.shipping?.shippingMethodLabel && (
                          <Text
                            style={styles.boldText}
                          >{`/${item?.shipping?.shippingMethodLabel}`}</Text>
                        )}
                      </View>
                    </View>
                  )}
                </InfoContent>
              </View>
            </>
          )}

          <FormTitle label={t("Order Total")} />
          <View style={layouts.horizontal}>
            <InfoContent label={t("Order Total")}>
              <View style={styles.personContent}>
                <InfoLine
                  label={t("Subtotal")}
                  infoValue={formatMoneyWithUnit(item?.subTotal)}
                />
                <InfoLine
                  label={t("Shipping & Handling")}
                  infoValue={formatMoneyWithUnit(item?.shippingAmount)}
                />
                <InfoLine
                  label={t("Tax")}
                  infoValue={formatMoneyWithUnit(item?.tax)}
                />
                <InfoLine
                  label={t("Discount")}
                  infoValue={formatMoneyWithUnit(item?.discount)}
                />
              </View>
              <InfoLine
                label={t("Grand Total")}
                infoValue={formatMoneyWithUnit(item?.total)}
                labelTextStyle={styles.highLabelTextStyle}
                infoTextStyle={styles.highInfoTextStyle}
              />
              <InfoLine
                label={t("Total Paid")}
                infoValue={formatMoneyWithUnit(item?.paidTotal)}
                labelTextStyle={styles.highLabelTextStyle}
                infoTextStyle={styles.highInfoTextStyle}
              />
              <InfoLine
                label={t("Total Return")}
                infoValue={formatMoneyWithUnit(item?.returnAmount)}
                labelTextStyle={styles.highLabelTextStyle}
                infoTextStyle={styles.highInfoTextStyle}
              />
              <InfoLine
                label={t("Total Due")}
                infoValue={formatMoneyWithUnit(item?.dueAmount)}
                labelTextStyle={styles.highLabelTextStyle}
                infoTextStyle={styles.highInfoTextStyle}
              />
            </InfoContent>
            <View style={layouts.marginHorizontal} />
            <InfoContent label={t("Invoice")}>
              <View style={styles.personContent}>
                <InfoLine
                  label={t("Invoice ID")}
                  infoValue={item?.invoice?.checkoutId}
                  infoTextStyle={styles.highInfoTextStyle}
                />
                <InfoLine
                  label={t("Invoice Date")}
                  infoValue={dateToString(
                    item?.invoice?.createdDate,
                    DATE_TIME_SHOW_FORMAT_STRING
                  )}
                />
                <InfoLine
                  label={t("Status")}
                  infoValue={item?.invoice?.status}
                />
              </View>
              <InfoContent label={t("Note for in Order ")}>
                <FormEditNotes
                  orderStatus={item?.status}
                  defaultValue={item?.note}
                  onSubmitNotes={onSubmitNotes}
                  onDidNotPayCheck={onDidNotPayCheck}
                />
              </InfoContent>
            </InfoContent>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

let InfoLine = ({ label, infoValue, labelTextStyle, infoTextStyle }) => {
  return (
    <View style={styles.infoLineContent}>
      {!!label && (
        <Text style={labelTextStyle ?? styles.infoLabelText}>{label}</Text>
      )}
      {!!infoValue && (
        <Text style={infoTextStyle ?? styles.infoText}>{infoValue}</Text>
      )}
    </View>
  );
};

let InfoHeading = ({ label, onPress, editable = false }) => {
  return (
    <View style={styles.infoLineContent}>
      {!!label && <Text style={styles.infoHeaderText}>{label}</Text>}
      {editable && (
        <TouchableOpacity onPress={onPress}>
          <Image
            style={{ width: scaleWidth(16), height: scaleHeight(16) }}
            source={IMAGE.edit_customer_icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

let InfoContent = ({ label, onPress, children, editable = false }) => {
  return (
    <View style={styles.infoContent}>
      <InfoHeading label={label} onPress={onPress} editable={editable} />
      <View style={[layouts.fill]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scaleWidth(16),
    paddingVertical: scaleHeight(16),
  },

  headContent: {
    height: scaleHeight(50),
    backgroundColor: colors.WHITE,
    shadowColor: "#0000001a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.32,
    alignItems: "center",
    paddingLeft: scaleWidth(16),
    flexDirection: "row",
  },

  headTitle: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(23),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1.15,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  headerRightContent: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: scaleWidth(16),
  },

  infoLineContent: {
    flexDirection: "row",
    // justifyContent: 'space-between',
    alignItems: "center",
    paddingVertical: scaleHeight(7),
  },

  infoLabelText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
    flex: 1,
  },

  infoHeaderText: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(15),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
    marginRight: scaleWidth(10),
  },

  infoText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "right",
    color: colors.GREYISH_BROWN,
    flex: 1,
  },

  infoContent: {
    flex: 1,
  },

  personContent: {
    backgroundColor: colors.WHITE_F_6,
    marginTop: scaleHeight(5),
    paddingHorizontal: scaleWidth(10),
    paddingVertical: scaleHeight(10),
  },

  imageStyle: {
    width: scaleWidth(44),
    height: scaleHeight(44),
  },

  cellStyle: {
    paddingHorizontal: scaleWidth(5),
    alignItems: "center",
  },

  productName: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(15),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  highLabelTextStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(15),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
    textAlignVertical: "center",
  },

  highInfoTextStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(15),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: colors.OCEAN_BLUE,
    textAlign: "right",
    flex: 1,
  },

  boldText: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(15),
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  productNameContent: {
    flex: 1,
  },

  productNameMarginVertical: { height: scaleHeight(4) },
});
