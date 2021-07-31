import IMAGE from "@resources";
import {
  ButtonGradient,
  ButtonGradientRed,
  ButtonGradientWhite,
  FormTitle,
  ProductOptionImage,
} from "@shared/components";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";
import { WithDialogRestock } from "@shared/HOC/withDialogRestock";
import { colors, fonts, layouts } from "@shared/themes";
import { dateToString, DATE_TIME_SHOW_FORMAT_STRING } from "@shared/utils";
import { formatMoneyWithUnit } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const RestockButton = WithDialogRestock(ButtonGradientWhite);

export const Layout = ({ productItem, onGoBack, onSubmitRestock }) => {
  const [t] = useTranslation();
  const onRenderTableCell = ({
    item: cellItem,
    columnKey,
    rowIndex,
    cellWidth,
    textStyle,
  }) => {
    switch (columnKey) {
      case "imageUrl":
        return (
          <View
            style={{ width: cellWidth }}
            key={getUniqueId(columnKey, rowIndex, "cell-image")}
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
          </View>
        );

      case "description":
        return (
          <View
            style={{ width: cellWidth, paddingVertical: scaleHeight(2) }}
            key={getUniqueId(columnKey, rowIndex, "cell-image")}
          >
            <Text
              style={[
                textStyle,
                {
                  height: "100%",
                  width: "100%",
                  textAlign: "left",
                  textAlignVertical: "center",
                },
              ]}
              numberOfLines={5}
              ellipsizeMode="tail"
            >
              {cellItem?.description}
            </Text>
          </View>
        );
      case "actions":
        const onHandleEdit = () => {
          onSubmitRestock(cellItem);
        };

        return (
          <View
            style={[layouts.fill, layouts.horizontal]}
            key={getUniqueId(columnKey, rowIndex, "cell-action")}
          >
            <RestockButton
              label={t("Edit")}
              width={scaleWidth(72)}
              height={scaleHeight(30)}
              borderRadius={scaleWidth(3)}
              fontSize={scaleFont(15)}
              // textColor={colors.WHITE}
              fontWeight="normal"
              onPress={onHandleEdit}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={layouts.fill}>
      <View style={styles.headContent}>
        <Text style={styles.headTitle}>
          {t("Adjust Quantity")} {" - "}
          {
            <Text style={[styles.headTitle, { color: colors.OCEAN_BLUE }]}>
              {productItem?.name}
            </Text>
          }
        </Text>
        <View style={styles.headerRightContent}>
          <View style={layouts.marginHorizontal} />

          {/* <ButtonGradient
            label={t("Edit")}
            width={scaleWidth(120)}
            height={scaleHeight(40)}
            fontSize={scaleFont(17)}
            textColor={colors.WHITE}
            textWeight="normal"
            // onPress={onEditProduct}
          />
          <View style={layouts.marginHorizontal} /> */}
          <ButtonGradientWhite
            width={scaleWidth(40)}
            height={scaleHeight(40)}
            fontSize={scaleFont(17)}
            textWeight="normal"
            onPress={onGoBack}
          >
            <Image source={IMAGE.back} />
          </ButtonGradientWhite>
        </View>
      </View>
      <KeyboardAwareScrollView bounces={false}>
        <View style={styles.container}>
          <FormTitle label={t("Product versions")} />
          {productItem?.quantities && (
            <Table
              key={"table-version"}
              tableStyle={styles.tableProductVersion}
              items={productItem?.quantities}
              headerKeyLabels={{
                imageUrl: t("Image"),
                label: t("Versions"),
                needToOrder: t("Need to order"),
                quantity: t("Qty"),
                tempQuantity: t("Temp qty"),
                actions: t("Actions"),
              }}
              whiteListKeys={[
                "imageUrl",
                "label",
                "needToOrder",
                "quantity",
                "tempQuantity",
                "actions",
              ]}
              widthForKeys={{
                label: scaleWidth(480),
                needToOrder: scaleWidth(120),
                quantity: scaleWidth(120),
                tempQuantity: scaleWidth(120),
                imageUrl: scaleWidth(60),
              }}
              primaryKey="id"
              emptyDescription={t("No product versions")}
              formatFunctionKeys={{
                costPrice: (value) => `${formatMoneyWithUnit(value)}`,
                quantity: (value) => (value ? `${value}` : "0"),
              }}
              renderCell={onRenderTableCell}
              onRowPress={() => {}}
            />
          )}
          <FormTitle label={t("History")} />
          {productItem?.restockHistory && (
            <Table
              key={"table-restock"}
              tableStyle={styles.tableProductVersion}
              items={productItem?.restockHistory}
              headerKeyLabels={{
                createdDate: t("Date time"),
                staffName: t("Staff"),
                reason: t("Reason"),
                adjustQuantity: t("Adjusted qty"),
                quantity: t("Items in stock"),
              }}
              whiteListKeys={[
                "createdDate",
                "staffName",
                "reason",
                "adjustQuantity",
                "quantity",
              ]}
              widthForKeys={{
                createdDate: scaleWidth(250),
                staffName: scaleWidth(150),
                reason: scaleWidth(250),
                adjustQuantity: scaleWidth(150),
                quantity: scaleWidth(150),
              }}
              primaryKey="id"
              emptyDescription={t("No Restock History")}
              formatFunctionKeys={{
                createdDate: (value) =>
                  dateToString(value, DATE_TIME_SHOW_FORMAT_STRING),
              }}
              onRowPress={() => {}}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.buttonContent}>
        <ButtonGradientWhite
          onPress={onGoBack}
          label={t("Back").toUpperCase()}
          width={scaleWidth(400)}
          height={scaleHeight(60)}
          textColor={colors.GREYISH_BROWN}
          fontSize={scaleFont(25)}
          fontWeight="500"
        />
        <ButtonGradient
          label={t("Save").toUpperCase()}
          width={scaleWidth(400)}
          height={scaleHeight(60)}
          fontSize={scaleFont(25)}
          textColor={colors.WHITE}
          fontWeight="500"
          // disable={!form.isValid}
          // disable={!form.isValid || !form.dirty} //loi  doi option no ko tinh
          // onPress={form?.handleSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scaleWidth(16),
    paddingVertical: scaleHeight(16),
  },

  content: {
    flex: 1,
    marginHorizontal: scaleWidth(16),
    flexDirection: "column-reverse",
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

  productInfo: {
    flex: 1,
    padding: scaleWidth(8),
  },

  productName: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(23),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },

  productDescription: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  infoLineContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scaleHeight(7),
  },

  infoLabelText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
    flex: 1,
  },

  infoText: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
    flex: 1,
  },

  headLabelButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  tableProductVersion: {
    height: scaleHeight(380),
  },

  imageStyle: {
    width: scaleWidth(44),
    height: scaleHeight(44),
  },

  buttonContent: {
    height: scaleHeight(84),
    backgroundColor: colors.WHITE,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
});
