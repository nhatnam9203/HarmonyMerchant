import IMAGE from "@resources";
import {
  CustomCheckBox,
  DialogColorPicker,
  FormUploadImage,
  ButtonGradientRed,
} from "@shared/components";
import {
  CustomInput,
  CustomInputMask,
  CustomInputMoney,
} from "@shared/components/CustomInput";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import {
  useCreateAttributes,
  useEditAttributes,
  useGetAttributes,
} from "@shared/services/api/retailer";
import { colors, fonts, layouts } from "@shared/themes";
import { INPUT_TYPE, statusSuccess } from "@shared/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { deleteProductVersion, updateOptionsQty, changeOption } from "./ProductState";
import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";

const DeleteConfirmButton = WithDialogConfirm(ButtonGradientRed);

export const FormProductOptionQty = ({ dispatchProduct, items }) => {
  const [t] = useTranslation();
  const [optionsQty, setOptionsQty] = React.useState(null);

  React.useEffect(() => {
    setOptionsQty(items);
  }, [items]);

  const onRenderTableCell = ({
    item: cellItem,
    columnKey,
    rowIndex,
    cellWidth,
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
              style={[styles.customInput, { width: scaleWidth(100) }]}
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
              style={[styles.customInput, { width: scaleWidth(150) }]}
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
              style={[styles.customInput, { width: scaleWidth(150) }]}
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

      case "label":
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoHeaderText}>{t("Product Versions")}</Text>
      <View style={layouts.marginVertical} />
      {optionsQty && (
        <Table
          tableStyle={styles.content}
          items={optionsQty}
          headerKeyLabels={{
            imageUrl: t("Image"),
            label: t("Version"),
            costPrice: t("Cost price"),
            price: t("Price"),
            quantity: t("Qty"),
            actions: t("Actions"),
          }}
          whiteListKeys={[
            "imageUrl",
            "label",
            "costPrice",
            "price",
            "quantity",
            "actions",
          ]}
          primaryKey="label"
          widthForKeys={{
            imageUrl: scaleWidth(80),
            label: "35%",
            costPrice: scaleWidth(180),
            price: scaleWidth(180),
            quantity: scaleWidth(120),
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
});
