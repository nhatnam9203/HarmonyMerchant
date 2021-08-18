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
const DeleteConfirmButton = WithDialogConfirm(ButtonGradientRed);

export const Layout = ({
  productItem,
  onGoBack,
  onEditProduct,
  onHandleDeleteProduct,
  onSubmitRestock,
  onHandleQuantity,
}) => {
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
      default:
        return null;
    }
  };

  return (
    <View style={layouts.fill}>
      <View style={styles.headContent}>
        <Text style={styles.headTitle}>{t("Product details")}</Text>
        <View style={styles.headerRightContent}>
          <View style={layouts.marginHorizontal} />
          <DeleteConfirmButton
            backgroundColor={colors.ORANGEY_RED}
            label={t("Delete")}
            width={scaleWidth(120)}
            height={scaleHeight(40)}
            textColor={colors.WHITE}
            borderRadius={scaleWidth(2)}
            fontWeight="normal"
            onPress={onHandleDeleteProduct}
          />

          <View style={layouts.marginHorizontal} />
          <ButtonGradientWhite
            label={t("Quantity")}
            width={scaleWidth(120)}
            height={scaleHeight(40)}
            fontSize={scaleFont(17)}
            // textColor={colors.WHITE}
            textWeight="normal"
            onPress={onHandleQuantity}
          >
            {/* <Image source={IMAGE.back} /> */}
          </ButtonGradientWhite>
          <View style={layouts.marginHorizontal} />

          <ButtonGradient
            label={t("Edit")}
            width={scaleWidth(120)}
            height={scaleHeight(40)}
            fontSize={scaleFont(17)}
            textColor={colors.WHITE}
            textWeight="normal"
            onPress={onEditProduct}
          />
          <View style={layouts.marginHorizontal} />
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
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <FormTitle label={t("General Details")} />
          <View style={layouts.horizontal}>
            <ProductOptionImage
              // width={scaleWidth(220)}
              imageUrl={productItem?.imageUrl}
              options={productItem?.options}
            />
            <View style={layouts.marginHorizontal} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{productItem?.name}</Text>
              <View style={layouts.marginVertical} />
              <View style={layouts.marginVertical} />

              <Text style={styles.productDescription}>
                {productItem?.description}
              </Text>
              <View style={layouts.marginVertical} />
              <View style={layouts.marginVertical} />

              <ProductInfoLine
                label={t("Category")}
                infoValue={productItem?.categoryName}
              />
              <ProductInfoLine label={t("SKU")} infoValue={productItem?.sku} />
              <ProductInfoLine
                label={t("Barcode")}
                infoValue={productItem?.barCode}
              />
              {/* <ProductInfoLine
                label={t("Price")}
                infoValue={`${formatMoneyWithUnit(productItem?.price)}`}
              /> */}

              {productItem?.quantities?.length > 0 ? (
                <ProductInfoLine
                  label={t("Price")}
                  infoValue={productItem?.priceRange}
                />
              ) : (
                <ProductInfoLine
                  label={t("Price")}
                  infoValue={`${formatMoneyWithUnit(productItem?.price)}`}
                />
              )}
              {/* <ProductInfoLine
                label={t("Cost Price")}
                infoValue={`${formatMoneyWithUnit(productItem?.costPrice)}`}
              /> */}
              <ProductInfoLine
                label={t("Total items in stock")}
                infoValue={productItem?.quantity + ""}
                textStyle={
                  productItem?.quantity < productItem?.minThreshold && {
                    color: "red",
                  }
                }
              />
              <ProductInfoLine
                label={t("Total items need to order")}
                infoValue={productItem?.needToOrder + ""}
              />
            </View>
          </View>
          <FormTitle label={t("Product versions")} />
          {productItem?.quantities && (
            <Table
              key={"table-version"}
              tableStyle={styles.tableProductVersion}
              items={productItem?.quantities}
              headerKeyLabels={{
                label: t("Versions"),
                barcode: t("Barcode"),
                description: t("Description"),
                costPrice: t("Cost price"),
                price: t("Price"),
                needToOrder: t("Need to order"),
                quantity: t("Qty"),
                tempQuantity: t("Temp qty"),
                imageUrl: t("Image"),
              }}
              whiteListKeys={[
                "label",
                "barcode",
                "description",
                "costPrice",
                "price",
                "needToOrder",
                "quantity",
                "tempQuantity",
                "imageUrl",
              ]}
              widthForKeys={{
                label: scaleWidth(230),
                barcode: scaleWidth(110),
                description: scaleWidth(180),
                costPrice: scaleWidth(100),
                price: scaleWidth(100),
                needToOrder: scaleWidth(70),
                quantity: scaleWidth(70),
                tempQuantity: scaleWidth(70),
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

          {/* <FormTitle label={t("Restock History")}>
            <View style={styles.headLabelButton}>
              <RestockButton
                label={t("Restock")}
                width={scaleWidth(100)}
                height={scaleHeight(32)}
                textColor={colors.BROWNISH_GREY}
                fontSize={scaleFont(15)}
                onPress={onSubmitRestock}
              />
            </View>
          </FormTitle>
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
          )} */}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

let ProductInfoLine = ({ label, infoValue, textStyle }) => {
  return (
    <View style={styles.infoLineContent}>
      {!!label && <Text style={styles.infoLabelText}>{label}</Text>}
      {!!infoValue && (
        <Text style={[styles.infoText, textStyle]}>{infoValue}</Text>
      )}
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
});
