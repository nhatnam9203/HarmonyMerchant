import IMAGE from "@resources";
import {
  CustomCheckBox,
  DialogColorPicker,
  FormUploadImage,
} from "@shared/components";
import { CustomInput, CustomInputMask } from "@shared/components/CustomInput";
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
import { removeOption, updateOptionsQty } from "./ProductState";

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
              style={[styles.customInput, { width: scaleWidth(120) }]}
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
            <CustomInputMask
              style={[styles.customInput, { width: scaleWidth(150) }]}
              type={"money"}
              options={{
                precision: 2,
                separator: ".",
                delimiter: ",",
                unit: "",
                suffixUnit: "",
              }}
              textInputProps={{
                placeholder: "Price",
                fontSize: scaleFont(17),
                textAlign: "left",
                defaultValue: cellItem?.costPrice || 0,
                onChangeText: onHandleChangeCostPrice,
              }}
            />
          </View>
        );
      case "additionalPrice":
        const onHandleChangeAdditionalPrice = async (text) => {
          dispatchProduct(
            updateOptionsQty(
              Object.assign({}, cellItem, {
                additionalPrice: text ?? 0,
              })
            )
          );
        };

        return (
          <View
            style={{ width: cellWidth }}
            key={getUniqueId(columnKey, rowIndex, "cell-value-addition")}
          >
            <CustomInputMask
              style={[styles.customInput, { width: scaleWidth(150) }]}
              type={"money"}
              options={{
                precision: 2,
                separator: ".",
                delimiter: ",",
                unit: "",
                suffixUnit: "",
              }}
              textInputProps={{
                placeholder: "Price",
                fontSize: scaleFont(17),
                textAlign: "left",
                defaultValue: cellItem?.additionalPrice || 0,
                onChangeText: onHandleChangeAdditionalPrice,
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
            additionalPrice: t("Additional price"),
            quantity: t("Qty"),
          }}
          whiteListKeys={[
            "imageUrl",
            "label",
            "costPrice",
            "additionalPrice",
            "quantity",
          ]}
          primaryKey="label"
          widthForKeys={{
            imageUrl: scaleWidth(80),
            label: "40%",
            costPrice: scaleWidth(180),
            additionalPrice: scaleWidth(180),
            quantity: scaleWidth(120),
          }}
          emptyDescription={t("No Options Qty")}
          renderCell={onRenderTableCell}
          onRowPress={() => {}}
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
