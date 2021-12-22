import IMAGE from "@resources";
import {
  ButtonGradient,
  ButtonGradientWhite,
  FormTitle,
} from "@shared/components";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import {
  ORDERED_STATUS,
  OrderStatusView,
} from "@shared/components/OrderStatusView";
import { PopupInvoice } from "@shared/components/payment";
import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";
import { colors, fonts, layouts } from "@shared/themes";
import { dateToString, DATE_TIME_SHOW_FORMAT_STRING } from "@shared/utils";
import { formatMoneyWithUnit } from "@utils";
import _ from "lodash";
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
import { PURCHASE_POINTS_ORDER, statusSuccess } from "@shared/utils";
import { PopupReturnReceipt } from "@shared/components";

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
  printCustomerInvoice,
  shareCustomerInvoice,
  invoiceRef,
  getShippingMethodLabel,
  shareReturnInvoice,
  printReturnInvoice,
  returnReceiptRef,
  doPrintClover,
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
      case ORDERED_STATUS.NOT_PAY:
        return (
          <>
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
        if (item?.payment?.length <= 0) {
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
        } else
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

  const onRenderCell = ({ item: cellItem, columnKey, rowIndex, cellWidth }) => {
    if (columnKey === "productName") {
      return (
        <View
          key={getUniqueId(columnKey, rowIndex, "cell-product-name")}
          style={[layouts.horizontal, { width: cellWidth }, styles.cellStyle]}
        >
          <FastImage
            style={styles.imageStyle}
            source={
              cellItem?.imageUrl
                ? {
                    uri: cellItem?.imageUrl,
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.immutable,
                  }
                : IMAGE.product_holder
            }
            resizeMode="contain"
          />
          <View style={layouts.marginHorizontal} />
          <View style={styles.productNameContent}>
            <Text style={styles.productName}>
              {cellItem?.productName || cellItem?.name}
            </Text>
            <View style={styles.productNameMarginVertical} />
            {!!cellItem?.value && (
              <Text style={styles.productOption}>{`${cellItem?.value}`}</Text>
            )}
          </View>
        </View>
      );
    } else if (columnKey === "quantity") {
      const quantityShow =
        _.get(cellItem, "quantity") - _.get(cellItem, "returnQuantity", 0);
      return (
        // <Text
        //   key={getUniqueId(columnKey, rowIndex, "cell-product-qty")}
        //   style={[
        //     {
        //       width: scaleWidth(50),
        //     },
        //     styles.textStyle,
        //   ]}
        // >
        //   {quantityShow}
        // </Text>
        <View key={getUniqueId(columnKey, rowIndex, "cell-product-qty")}>
          <Text
            style={[
              styles.textStyle,
              {
                width: scaleWidth(100),
              },
            ]}
          >
            {`  ${_.get(cellItem, "quantity", 0)}`}
          </Text>
          {_.get(item, "returnAmount", 0) > 0 && (
            <Text
              style={[
                {
                  width: scaleWidth(100),
                },
                styles.textStyle,
                { color: "red" },
              ]}
            >
              {`- ${_.get(cellItem, "returnQuantity", 0)}`}
            </Text>
          )}
        </View>
      );
    } else if (columnKey === "total") {
      const totalShow =
        _.get(cellItem, "total", 0) - _.get(cellItem, "returnAmount", 0);
      return (
        // <Text
        //   key={getUniqueId(columnKey, rowIndex, "cell-product-total")}
        //   style={[
        //     {
        //       width: scaleWidth(100),
        //     },
        //     styles.textStyle,
        //   ]}
        // >
        //   {formatMoneyWithUnit(totalShow)}
        // </Text>
        <View key={getUniqueId(columnKey, rowIndex, "cell-product-total")}>
          <Text
            style={[
              styles.textTotalStyle,
              {
                width: scaleWidth(100),
              },
            ]}
          >
            {`  ${formatMoneyWithUnit(_.get(cellItem, "total", 0))}`}
          </Text>

          {_.get(cellItem, "returnAmount", 0) > 0 && (
            <Text
              style={[
                styles.textTotalStyle,
                {
                  width: scaleWidth(100),
                  color: "red",
                },
              ]}
            >
              {`- ${formatMoneyWithUnit(_.get(cellItem, "returnAmount", 0))}`}
            </Text>
          )}
        </View>
      );
    } else if (columnKey === "status") {
      return cellItem?.isReturn ? (
        <OrderStatusView
          key={getUniqueId(columnKey, rowIndex, "cell-product-return")}
          status={
            cellItem.quantity > cellItem.returnQuantity
              ? "Partial Return"
              : "Return"
          }
        />
      ) : (
        <View key={getUniqueId(columnKey, rowIndex, "cell-product-return")} />
      );
    }

    return null;
  };

  const onRenderCellReturn = ({
    item: cellItem,
    columnKey,
    rowIndex,
    cellWidth,
  }) => {
    switch (columnKey) {
      case "receipt":
        return (
          <View
            key={getUniqueId(columnKey, rowIndex, "cell-return-receipt")}
            style={{ flexDirection: "row" }}
          >
            <TouchableOpacity
              onPress={() => {
                shareReturnInvoice(cellItem);
              }}
              style={{
                width: scaleWidth(40),
                height: scaleHeight(40),
                backgroundColor: "#0764B0",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: scaleWidth(4),
              }}
            >
              <Image
                source={IMAGE.share_icon}
                style={{
                  width: scaleWidth(20),
                  height: scaleHeight(20),
                }}
              />
            </TouchableOpacity>
            <View style={layouts.marginHorizontal} />

            <TouchableOpacity
              onPress={() => {
                printReturnInvoice(cellItem);
              }}
              style={{
                width: scaleWidth(40),
                height: scaleHeight(40),
                backgroundColor: "#0764B0",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: scaleWidth(4),
              }}
            >
              <Image
                source={IMAGE.print_btn}
                style={{
                  width: scaleWidth(20),
                  height: scaleHeight(20),
                }}
              />
            </TouchableOpacity>
          </View>
        );

      default:
        break;
    }
  };

  return (
    <View style={layouts.fill}>
      <View style={styles.headContent}>
        <Text style={styles.headTitle}>
          {t("Order")}{" "}
          {
            <Text style={[styles.headTitle, { color: colors.OCEAN_BLUE }]}>
              {`#${item?.code}`}
            </Text>
          }
        </Text>
        <View style={styles.headerRightContent}>
          <View style={layouts.marginHorizontal} />
          {renderButton()}
          <View style={layouts.marginHorizontal} />
          {item?.invoice?.checkoutId && (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={shareCustomerInvoice}
                style={{
                  width: scaleWidth(40),
                  height: scaleHeight(40),
                  backgroundColor: "#0764B0",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: scaleWidth(4),
                }}
              >
                <Image
                  source={IMAGE.share_icon}
                  style={{
                    width: scaleWidth(20),
                    height: scaleHeight(20),
                  }}
                />
              </TouchableOpacity>
              <View style={layouts.marginHorizontal} />

              <TouchableOpacity
                onPress={printCustomerInvoice}
                style={{
                  width: scaleWidth(40),
                  height: scaleHeight(40),
                  backgroundColor: "#0764B0",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: scaleWidth(4),
                }}
              >
                <Image
                  source={IMAGE.print_btn}
                  style={{
                    width: scaleWidth(20),
                    height: scaleHeight(20),
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
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
                <InfoLine label={t("ID")} infoValue={`#${item?.code}`} />
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
            items={
              [
                ...(item?.products?.map((x) =>
                  Object.assign({}, x, { key: x.bookingProductId })
                ) || []),
                ...(item?.giftCards?.map((x) =>
                  Object.assign({}, x, { key: x.bookingGiftCardId })
                ) || []),
              ] || []
            }
            tableStyle={styles.table}
            headerKeyLabels={{
              productName: t("Product"),
              // sku: t("SKU"),
              price: t("Price"),
              quantity: t("Qty"),
              subTotal: t("Subtotal"),
              tax: t("Tax"),
              discount: t("Discount"),
              total: t("Total"),
              // returnQuantity: t("Return Qty"),
              status: t("Return"),
            }}
            whiteListKeys={[
              "productName",
              // "sku",
              "price",
              "quantity",
              "subTotal",
              "tax",
              "totalDiscount",
              "total",
              // "returnQuantity",
              "status",
            ]}
            primaryKey="key"
            widthForKeys={{
              productName: scaleWidth(300),
              // sku: scaleWidth(100),
              price: scaleWidth(100),
              quantity: scaleWidth(100),
              subTotal: scaleWidth(100),
              tax: scaleWidth(100),
              discount: scaleWidth(100),
              // returnQuantity: scaleWidth(80),
              total: scaleWidth(100),
            }}
            emptyDescription={t("No Products")}
            styleTextKeys={{ total: styles.highLabelTextStyle }}
            formatFunctionKeys={{
              price: (value) => `${formatMoneyWithUnit(value || 0)}`,
              subTotal: (value) => `${formatMoneyWithUnit(value || 0)}`,
              tax: (value) => `${formatMoneyWithUnit(value || 0)}`,
              discount: (value) => `${formatMoneyWithUnit(value || 0)}`,
              total: (value) => `${formatMoneyWithUnit(value || 0)}`,
            }}
            renderCell={onRenderCell}
            renderFooterComponent={() => (
              <View style={{ height: scaleHeight(10) }} />
            )}
            // onRowPress={onSelectRow}
            // draggable={true}
          />

          {item?.returns?.length > 0 && (
            <View>
              <FormTitle label={`${t("Return History")}`} />
              <Table
                items={item?.returns || []}
                tableStyle={styles.table}
                headerKeyLabels={{
                  code: t("Code"),
                  createdDate: t("Date"),
                  notes: t("Note"),
                  createdBy: t("Staff"),
                  receipt: t("Receipt"),
                }}
                whiteListKeys={[
                  "code",
                  "createdDate",
                  "createdBy",
                  "notes",
                  "receipt",
                ]}
                primaryKey="code"
                widthForKeys={{
                  code: scaleWidth(200),
                  createdDate: scaleWidth(200),
                  createdBy: scaleWidth(200),
                  notes: scaleWidth(280),
                  receipt: scaleWidth(120),
                }}
                emptyDescription={t("No Returns History")}
                styleTextKeys={{ total: styles.highLabelTextStyle }}
                formatFunctionKeys={{
                  code: (value) => `#${value}`,
                  createdDate: (value) =>
                    dateToString(value, DATE_TIME_SHOW_FORMAT_STRING),
                }}
                renderCell={onRenderCellReturn}
                renderFooterComponent={() => (
                  <View style={{ height: scaleHeight(10) }} />
                )}
                // onRowPress={onSelectRow}
              />
            </View>
          )}

          {item?.status === ORDERED_STATUS.PENDING ||
          (item?.status === ORDERED_STATUS.PROCESS &&
            item.purchasePoint === PURCHASE_POINTS_ORDER &&
            item.payment?.length <= 0) ? (
            <>
              <FormTitle label={t("Shipping Method")} />
              <FormShippingCarrier
                onChangeValue={onChangeShippingMethod}
                appointment={item}
              />

              <FormTitle label={t("Address Information")} />
              <FormAddressInformation
                ref={formAddressRef}
                customerId={item?.customerId}
                shippingAddress={item?.shippingAddress}
                billingAddress={item?.billingAddress}
                onChangeShippingAddress={onEditShippingAddress}
                onChangeBillingAddress={onEditBillingAddress}
                screenId="retailer.home.order.detail"
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
                    item?.payment.map((payItem, indx) => (
                      <View
                        style={styles.personContent}
                        key={`${indx}-${payItem?.paymentMethod}-${payItem?.amount}`}
                      >
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
                {/** Shipping  */}
                <InfoContent label={t("Shipping & Handling Information")}>
                  {/** Shipping Carrier */}
                  {!!item?.shipping?.shippingCarrier && (
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

                  {item?.shipping?.shippingMethod && (
                    <View style={styles.personContent}>
                      <Text>{t("Shipping method")}</Text>
                      <View style={layouts.marginVertical} />

                      <View style={layouts.horizontal}>
                        <Text
                          style={styles.boldText}
                        >{`${getShippingMethodLabel()}`}</Text>
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
                  infoValue={formatMoneyWithUnit(item?.shippingFee)}
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
                  notes={item?.note}
                  onSubmitNotes={onSubmitNotes}
                  onDidNotPayCheck={onDidNotPayCheck}
                />
              </InfoContent>
            </InfoContent>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <PopupInvoice 
        ref={invoiceRef} 
        doPrintClover={doPrintClover}/>
        
      <PopupReturnReceipt ref={returnReceiptRef} />
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

let InfoHeading = ({ label, onPress, editable = false, rightComponent }) => {
  return (
    <View style={[styles.infoLineContent, { justifyContent: "space-between" }]}>
      <View style={layouts.horizontal}>
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
      {rightComponent && rightComponent()}
    </View>
  );
};

let InfoContent = ({
  label,
  onPress,
  children,
  editable = false,
  rightComponent,
}) => {
  return (
    <View style={styles.infoContent}>
      <InfoHeading
        label={label}
        onPress={onPress}
        editable={editable}
        rightComponent={rightComponent}
      />
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
    paddingVertical: scaleHeight(5),
    alignItems: "center",
  },

  productOption: {
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

  productName: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(17),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },
  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
    paddingLeft: scaleWidth(5),
  },
  table: {
    flex: 1,
  },
});
