import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { layouts, colors, fonts } from "@shared/themes";
import {
  FormFullName,
  FormTitle,
  FormPhoneNumber,
  FormAddress,
  FormContactEmail,
  FormBirthDay,
  FormGender,
  FormCustomerGroup,
  FormLabelSwitch,
  ButtonGradient,
  ButtonGradientWhite,
  ButtonNormal,
  ProductOptionImage,
  ButtonGradientRed,
} from "@shared/components";
import IMAGE from "@resources";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import { InputSearch } from "@shared/components/InputSearch";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { dateToString, DATE_TIME_SHOW_FORMAT_STRING } from "@shared/utils";
import {
  DialogProductDetail,
  BasketContentView,
  FormEditNotes,
  FormShippingCarrier,
} from "../../widget";
import FastImage from "react-native-fast-image";
import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";
import { formatMoneyWithUnit } from "@utils";
import { CustomTableCheckBox } from "@shared/components/CustomCheckBox";

export const Layout = ({
  goBack,
  item,
  onHandleReturn,
  onCheckedRow,
  itemSelected,
  setNotes,
}) => {
  const [t] = useTranslation();

  const onRenderCell = ({ item, columnKey, rowIndex, cellWidth }) => {
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
          <Text style={styles.productName}>{item?.productName}</Text>
        </View>
      );
    }

    return null;
  };

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
            items={item?.products?.filter((x) => !x.isReturn) || []}
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
                {/* <InfoLine
                  label={t("Tax")}
                  infoValue={formatMoneyWithUnit(item?.tax)}
                />
                <InfoLine
                  label={t("Discount")}
                  infoValue={formatMoneyWithUnit(item?.discount)}
                /> */}
              </View>
              <InfoLine
                label={t("Grand Total")}
                infoValue={formatMoneyWithUnit(item?.total)}
                labelTextStyle={styles.highLabelTextStyle}
                infoTextStyle={styles.highInfoTextStyle}
              />
              {/*
              <InfoLine
                label={t("Total Return")}
                infoValue={formatMoneyWithUnit(item?.returnAmount)}
                labelTextStyle={styles.highLabelTextStyle}
                infoTextStyle={styles.highInfoTextStyle}
              /> */}
              {/* <InfoLine
                label={t("Total Due")}
                infoValue={formatMoneyWithUnit(item?.dueAmount)}
                labelTextStyle={styles.highLabelTextStyle}
                infoTextStyle={styles.highInfoTextStyle}
              /> */}
            </InfoContent>
            <View style={layouts.marginHorizontal} />
            <InfoContent label={t("Return Comments")}>
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
          disable={itemSelected?.length <= 0}
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
});
