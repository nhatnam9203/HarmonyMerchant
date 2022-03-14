import IMAGE from "@resources";
import {
  ButtonGradient,
  ButtonGradientWhite,
  CustomCheckBox,
  FormTitle,
} from "@shared/components";
import { CustomTableCheckBox } from "@shared/components/CustomCheckBox";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import { colors, fonts, layouts } from "@shared/themes";
import { formatMoneyWithUnit, formatNumberFromCurrency } from "@utils";
import _ from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInputMask } from "react-native-masked-text";
import { FormEditNotes } from "../../widget";

export const Layout = ({
  goBack,
  item,
  onHandleReturn,
  onCheckedRow,
  itemSelected,
  setNotes,
  updateQuantity,
  updateTotal,
  setToggleReturnShipping,
}) => {
  const [t] = useTranslation();

  const onRenderCell = ({ item, columnKey, rowIndex, cellWidth }) => {
    const findIndex = _.findIndex(itemSelected, (itemFind) => {
      return itemFind.productId == item.productId;
    });
    const isSelected = findIndex != -1;

    if (columnKey === "productName") {
      const handleCheckRow = (val) => {
        onCheckedRow(item, val);
      };
      return (
        <View
          key={getUniqueId(columnKey, rowIndex, "cell-product-name")}
          style={[layouts.horizontal, { width: cellWidth }, styles.cellStyle]}
        >
          <CustomTableCheckBox
            //  value={defaultValue}
            onValueChange={handleCheckRow}
          />
          <FastImage
            style={styles.imageStyle}
            source={
              item.imageUrl
                ? {
                    uri: item.imageUrl,
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
              {item?.productName || item?.name}
            </Text>
            <View style={styles.productNameMarginVertical} />
            {!!item?.value && (
              <Text style={styles.productOption}>{`${item?.value}`}</Text>
            )}
          </View>
        </View>
      );
    } else if (columnKey === "quantity") {
      return (
        <View key={getUniqueId(columnKey, rowIndex, "cell-quantity")}>
          <Text
            style={[
              {
                width: scaleWidth(100),
              },
              styles.textStyle,
            ]}
          >
            {`  ${_.get(item, "quantity", 0)}`}
          </Text>
          {item.bookingProductId &&
            (isSelected ? (
              <TextInputMask
                type="only-numbers"
                placeholder=""
                style={[
                  {
                    width: scaleWidth(100),
                  },
                  styles.textStyle,
                  styles.textInputStyle,
                ]}
                value={_.get(item, "returnQuantity", 0)}
                onChangeText={(value) => updateQuantity(item, value)}
              />
            ) : (
              <Text
                style={[
                  {
                    width: scaleWidth(100),
                  },
                  styles.textStyle,
                  { color: "red" },
                ]}
              >
                {`- ${_.get(item, "returnQuantity", 0)}`}
              </Text>
            ))}
        </View>
      );
    } else if (columnKey === "total") {
      return (
        <View key={getUniqueId(columnKey, rowIndex, "cell-total")}>
          <Text
            style={[
              styles.textTotalStyle,
              {
                width: scaleWidth(100),
              },
            ]}
          >
            {`  ${formatMoneyWithUnit(_.get(item, "total"))}`}
          </Text>
          {item.bookingProductId &&
            (isSelected ? (
              <TextInputMask
                type="money"
                placeholder="$ 0.00"
                options={{
                  precision: 2,
                  separator: ".",
                  delimiter: ",",
                  unit: "",
                  suffixUnit: "",
                }}
                style={[
                  {
                    width: scaleWidth(90),
                  },
                  styles.textStyle,
                  styles.textInputStyle,
                ]}
                value={_.get(item, "returnAmount", 0)}
                onChangeText={(value) => updateTotal(item, value)}
              />
            ) : (
              <Text
                style={[
                  styles.textTotalStyle,
                  {
                    width: scaleWidth(100),
                    color: "red",
                  },
                ]}
              >
                {`- ${formatMoneyWithUnit(_.get(item, "returnAmount", 0))}`}
              </Text>
            ))}
        </View>
      );
    }

    return null;
  };

  const filterListNotEmpty = _.filter(itemSelected, (temp) => {
    return (
      (temp.bookingProductId &&
        (_.get(temp, "returnAmount") > 0 ||
          _.get(temp, "returnQuantity") > 0)) ||
      temp.bookingGiftCardId
    );
  });
  const disableButton =
    itemSelected?.length <= 0 ||
    (itemSelected?.length > 0 && filterListNotEmpty?.length == 0);

  return (
    <View style={layouts.fill}>
      <View style={styles.headContent}>
        <Text style={styles.headTitle}>{t("Return order")}</Text>
        <View style={styles.headerRightContent}>
          <View style={layouts.marginHorizontal} />
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
          <FormTitle label={t("Items To Return")} />
          <Table
            // items={item?.products?.filter((x) => !x.isReturn) || []}
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
            primaryKey="key"
            widthForKeys={{
              productName: scaleWidth(280),
              price: scaleWidth(150),
              quantity: scaleWidth(100),
              subTotal: scaleWidth(120),
              tax: scaleWidth(120),
              discount: scaleWidth(120),
              total: scaleWidth(170),
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
            renderFooterComponent={() => (
              <View style={{ height: scaleHeight(10) }} />
            )}
          />
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
                label={t("Total Return")}
                infoValue={formatMoneyWithUnit(item?.returnAmount)}
                labelTextStyle={styles.highLabelTextStyle}
                infoTextStyle={styles.highInfoTextStyle}
              />

              {formatNumberFromCurrency(item?.dueAmount) < 0 ? (
                <InfoLine
                  label={t("Change Amount")}
                  infoValue={formatMoneyWithUnit(Math.abs(item?.dueAmount))}
                  labelTextStyle={styles.highLabelTextStyle}
                  infoTextStyle={styles.highInfoTextStyle}
                />
              ) : (
                <InfoLine
                  label={t("Total Due")}
                  infoValue={formatMoneyWithUnit(item?.dueAmount)}
                  labelTextStyle={styles.highLabelTextStyle}
                  infoTextStyle={styles.highInfoTextStyle}
                />
              )}
            </InfoContent>
            <View style={layouts.marginHorizontal} />

            <InfoContent label={t("Return Comments")}>
              {/* <CustomCheckBox
                label={t("Return shipping and tip")}
                onValueChange={setToggleReturnShipping}
                selectedColor={colors.OCEAN_BLUE}
                onCheckColor="#fff"
                textStyle={[styles.textStyle, { color: colors.OCEAN_BLUE }]}
                style={{ height: scaleHeight(40) }}
              /> */}
              <FormEditNotes
                // defaultValue={item?.note}
                // onSubmitNotes={onSubmitNotes}
                isShowButtonSubmit={false}
                onChangeValue={setNotes}
              />
            </InfoContent>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.buttonContent}>
        {/* <ButtonGradientWhite
          // onPress={buttonCancelPress}
          label={t("return").toUpperCase()}
          width={scaleWidth(400)}
          height={scaleHeight(60)}
          textColor={colors.GREYISH_BROWN}
          fontSize={scaleFont(25)}
          fontWeight="500"
        /> */}
        <ButtonGradient
          label={t("return").toUpperCase()}
          width={scaleWidth(400)}
          height={scaleHeight(60)}
          fontSize={scaleFont(25)}
          textColor={colors.WHITE}
          fontWeight="500"
          disable={disableButton}
          onPress={onHandleReturn}
        />
      </View>
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

  infoContent: {
    flex: 1,
  },

  personContent: {
    backgroundColor: colors.WHITE_F_6,
    marginTop: scaleHeight(5),
    paddingHorizontal: scaleWidth(10),
    paddingVertical: scaleHeight(10),
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
    flex: 1,
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

  buttonContent: {
    height: scaleHeight(84),
    backgroundColor: colors.WHITE,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
    paddingLeft: 15,
  },
  textInputStyle: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.PALE_GREY,
    paddingLeft: scaleWidth(5),
    paddingRight: scaleWidth(5),
    paddingBottom: scaleWidth(5),
    paddingTop: scaleWidth(5),
  },
  textTotalStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },

  productNameContent: {
    flex: 1,
  },

  productNameMarginVertical: { height: scaleHeight(4) },

  productOption: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(15),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },
});
