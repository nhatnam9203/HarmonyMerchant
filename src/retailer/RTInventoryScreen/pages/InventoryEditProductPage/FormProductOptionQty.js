import { ButtonGradientRed, FormUploadImage } from "@shared/components";
import { CustomInput, CustomInputMoney } from "@shared/components/CustomInput";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { deleteProductVersion, updateOptionsQty } from "./ProductState";
import IMAGE from "@resources";

const DeleteConfirmButton = WithDialogConfirm(ButtonGradientRed);

export const FormProductOptionQty = ({ dispatchProduct, items }) => {
  const [t] = useTranslation();
  const [optionsQty, setOptionsQty] = React.useState(null);

  React.useEffect(() => {
    setOptionsQty(items);
  }, [items]);

  const onAddNewVersion = () => {

  }

  const onRenderTableCell = ({
    item: cellItem,
    columnKey,
    rowIndex,
    cellWidth,
    textStyle,
  }) => {
    switch (columnKey) {
      case "imageUrl":
        const onChangeFile = (fileId) => {
          dispatchProduct(
            updateOptionsQty(Object.assign({}, cellItem, { fileId: fileId }))
          );
        };

        return (
          <View
            style={{ width: cellWidth }}
            key={getUniqueId(columnKey, rowIndex, "cell-quantity")}
          >
            <FormUploadImage
              style={styles.optionImage}
              height={scaleHeight(40)}
              width={scaleWidth(40)}
              fontSize={scaleWidth(9)}
              iconSize={scaleWidth(18)}
              // label={cellItem?.label}
              onSetFileId={onChangeFile}
              defaultValue={cellItem?.imageUrl}
            />
          </View>
        );

      case "quantity":
        const onHandleChange = (text) => {
          dispatchProduct(
            updateOptionsQty(
              Object.assign({}, cellItem, { quantity: parseInt(text) ?? 0 })
            )
          );
        };
        return (
          <View
            style={{ width: cellWidth }}
            key={getUniqueId(columnKey, rowIndex, "cell-quantity")}
          >
            <CustomInput
              style={[styles.customInput, { width: scaleWidth(60) }]}
              textInputProps={{
                placeholder: "Quantity",
                fontSize: scaleFont(17),
                textAlign: "left",
                defaultValue: cellItem?.quantity || 0,
                onChangeText: onHandleChange,
                keyboardType: "numeric",
              }}
            />
          </View>
        );

      case "costPrice":
        const onHandleChangeCostPrice = async (text) => {
          dispatchProduct(
            updateOptionsQty(
              Object.assign({}, cellItem, { costPrice: text ?? 0 })
            )
          );
        };

        return (
          <View
            style={{ width: cellWidth }}
            key={getUniqueId(columnKey, rowIndex, "cell-value-cost")}
          >
            <CustomInputMoney
              style={[styles.customInput, { width: scaleWidth(100) }]}
              textInputProps={{
                placeholder: "Price",
                fontSize: scaleFont(17),
                textAlign: "left",
                defaultValue: cellItem?.costPrice || 0,
                onChangeText: onHandleChangeCostPrice,
                keyboardType: "numeric",
              }}
            />
          </View>
        );
      case "price":
        const onHandleChangeAdditionalPrice = async (text) => {
          dispatchProduct(
            updateOptionsQty(
              Object.assign({}, cellItem, {
                price: text ?? 0,
              })
            )
          );
        };

        return (
          <View
            style={{ width: cellWidth }}
            key={getUniqueId(columnKey, rowIndex, "cell-value-addition")}
          >
            <CustomInputMoney
              style={[styles.customInput, { width: scaleWidth(100) }]}
              textInputProps={{
                placeholder: "Price",
                fontSize: scaleFont(17),
                textAlign: "left",
                defaultValue: cellItem?.price || 0,
                onChangeText: onHandleChangeAdditionalPrice,
                keyboardType: "numeric",
              }}
            />
          </View>
        );
      case "actions":
        const onHandleDelete = () => {
          dispatchProduct(deleteProductVersion(cellItem));
        };
        return (
          <View
            style={[layouts.fill, layouts.horizontal]}
            key={getUniqueId(columnKey, rowIndex, "cell-action")}
          >
            <DeleteConfirmButton
              label={t("Delete")}
              width={scaleWidth(72)}
              height={scaleHeight(30)}
              borderRadius={scaleWidth(3)}
              fontSize={scaleFont(15)}
              textColor={colors.WHITE}
              fontWeight="normal"
              onPress={onHandleDelete}
            />
          </View>
        );

      case "description":
        const onHandleChangeDesc = (text) => {
          dispatchProduct(
            updateOptionsQty(
              Object.assign({}, cellItem, { description: text ?? null })
            )
          );
        };
        return (
          <View
            style={{ width: cellWidth }}
            key={getUniqueId(columnKey, rowIndex, "cell-description")}
          >
            <CustomInput
              style={{
                height: "80%",
                width: cellWidth - scaleWidth(20),
              }}
              textInputProps={{
                placeholder: t("Description"),
                fontSize: scaleFont(15),
                textAlign: "left",
                defaultValue: cellItem?.description,
                onChangeText: onHandleChangeDesc,
                editable: true,
                multiline: true,
                textAlignVertical: "top",
                textInputStyle: Object.assign({}, textStyle, {
                  height: scaleHeight(45),
                }),
              }}
            />
          </View>
        );
      case "label":
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[layouts.horizontal, { justifyContent: "space-between" }]}>
        <Text style={styles.infoHeaderText}>{t("Product Versions")}</Text>
        {/* <Pressable style={[layouts.horizontal, layouts.horizontalCenterRight]} onPress={onAddNewVersion}>
          <Image
            source={IMAGE.plus}
            style={{
              width: scaleWidth(16),
              height: scaleHeight(16),
              marginHorizontal: scaleWidth(8),
            }}
            resizeMode="contain"
          />
          <Text style={styles.headerOptionsLabel}>{t("Add new version")}</Text>
        </Pressable> */}
      </View>
      <View style={layouts.marginVertical} />
      {optionsQty && (
        <Table
          tableStyle={styles.content}
          items={optionsQty}
          headerKeyLabels={{
            imageUrl: t("Image"),
            label: t("Version"),
            description: t("Description"),
            costPrice: t("Cost price"),
            price: t("Price"),
            quantity: t("Qty"),
            actions: t("Actions"),
          }}
          whiteListKeys={[
            "imageUrl",
            "label",
            "description",
            "costPrice",
            "price",
            "quantity",
            "actions",
          ]}
          primaryKey="label"
          widthForKeys={{
            imageUrl: scaleWidth(60),
            label: scaleWidth(280),
            description: scaleWidth(250),
            costPrice: scaleWidth(120),
            price: scaleWidth(120),
            quantity: scaleWidth(80),
            actions: scaleWidth(80),
          }}
          emptyDescription={t("No Options Qty")}
          renderCell={onRenderTableCell}
          onRowPress={() => {}}
          renderFooterComponent={() => (
            <View style={{ height: scaleHeight(0) }} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleHeight(8),
    height: scaleHeight(380),
  },

  content: {
    flex: 1,
  },

  infoHeaderText: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(17),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
    marginRight: scaleWidth(10),
  },

  infoLineContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: scaleHeight(7),
  },

  flatList: {
    width: "100%",
    height: scaleHeight(200),
  },

  flatListContainer: {
    justifyContent: "flex-start",
    flexDirection: "row",
    // flexWrap: 'wrap',
  },

  itemSeparator: {
    width: scaleWidth(5),
  },

  optionImage: {
    // marginHorizontal: scaleWidth(15),
  },

  imageStyle: {
    height: scaleHeight(80),
    width: scaleWidth(80),
  },

  headerOptionsLabel: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },
});
