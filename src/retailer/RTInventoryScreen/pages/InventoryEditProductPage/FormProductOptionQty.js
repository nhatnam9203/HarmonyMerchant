import IMAGE from "@resources";
import {
  ButtonGradient,
  ButtonGradientRed,
  ButtonGradientWhite,
  FormUploadImage,
} from "@shared/components";
import { CustomInput, CustomInputMoney } from "@shared/components/CustomInput";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import { InputSearch } from "@shared/components/InputSearch";
import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";
import { WithDialogScanQR } from "@shared/HOC/withDialogScanQR";
import { colors, fonts, layouts } from "@shared/themes";
import { arrayIsEqual } from "@shared/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import { AddProductVersionDialog } from "./AddProductVersionDialog";
import {
  deleteProductVersion,
  generateProductVersion,
  updateOptionsQty,
} from "./ProductState";
import { useIsWareHouse } from "@shared/hooks";
import { InputMoney } from "@shared/components";
import { formatMoney } from "@utils";

const DeleteConfirmButton = WithDialogConfirm(ButtonGradientRed);
const GenerateConfirmButton = WithDialogConfirm(ButtonGradient);
const ScanQRButton = WithDialogScanQR(ButtonGradientWhite);

export const FormProductOptionQty = ({
  dispatchProduct,
  items,
  options,
  isExistItem,
  itemIsGenerated,
}) => {
  const [t] = useTranslation();
  const { isWareHouse } = useIsWareHouse();

  const flatListRef = React.useRef(null);
  const [optionsQty, setOptionsQty] = React.useState(null);
  const [highlightIndex, setHighlightIndex] = React.useState(-1);
  const [searchText, setSearchText] = React.useState(null);

  React.useEffect(() => {
    setHighlightIndex(-1);
    if (searchText) {
      setOptionsQty(
        items?.filter((x) => x?.label?.indexOf(searchText) !== -1) || null
      );
    } else {
      setOptionsQty(items);
    }
  }, [items, searchText]);

  React.useEffect(() => {
    if (itemIsGenerated) {
      const index = optionsQty?.findIndex((x) =>
        arrayIsEqual(x.attributeIds, itemIsGenerated.attributeIds)
      );

      if (index >= 0) {
        flatListRef.current?.scrollToIndex({ index: index });
        setHighlightIndex(index);
      }
    }
  }, [itemIsGenerated]);

  const autoGenerateVersions = () => {
    dispatchProduct(generateProductVersion());
  };
  const manualGenerateVersions = () => {};

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
              style={[styles.customInput, { width: scaleWidth(70) }]}
              textInputProps={{
                placeholder: "Quantity",
                fontSize: scaleFont(15),
                textAlign: "left",
                defaultValue: cellItem?.quantity || 0,
                onChangeText: onHandleChange,
                keyboardType: "numeric",
              }}
            />
          </View>
        );

      case "barCode":
        const onHandleChangeBarcode = (text) => {
          dispatchProduct(
            updateOptionsQty(
              Object.assign({}, cellItem, {
                barCode: text ?? "",
              })
            )
          );
        };

        const onResultScanCode = (data) => {
          dispatchProduct(
            updateOptionsQty(
              Object.assign({}, cellItem, { barCode: data ?? "" })
            )
          );
        };

        return (
          <View
            style={{
              width: cellWidth,
              flexDirection: "row",
              alignItems: "center",
            }}
            key={getUniqueId(columnKey, rowIndex, "cell-quantity")}
          >
            <CustomInput
              style={[styles.customInput, { width: scaleWidth(130) }]}
              textInputProps={{
                placeholder: "Barcode",
                fontSize: scaleFont(13),
                textAlign: "left",
                defaultValue: cellItem?.barCode || "",
                onChangeText: onHandleChangeBarcode,
                keyboardType: "numeric",
              }}
              formatText={(txt) => {
                const temp = txt.replace(/[^0-9]/g, "") ?? "";
                // console.log(temp);
                return temp;
              }}
            />
            <View style={{ width: scaleWidth(2) }} />
            <ScanQRButton
              label={null}
              title={t("Scan Barcode")}
              width={scaleWidth(40)}
              height={scaleHeight(50)}
              onResultScanCode={onResultScanCode}
              autoHideWhenComplete={true}
              leftChildren={() => (
                <Image
                  source={IMAGE.scancode}
                  style={{
                    width: scaleWidth(24),
                    height: scaleHeight(24),
                    marginHorizontal: scaleWidth(12),
                  }}
                />
              )}
            />
          </View>
        );

      case "tempQuantity":
        const onHandleChangeTempQty = (text) => {
          dispatchProduct(
            updateOptionsQty(
              Object.assign({}, cellItem, { tempQuantity: parseInt(text) ?? 0 })
            )
          );
        };
        return (
          <View
            style={{ width: cellWidth }}
            key={getUniqueId(columnKey, rowIndex, "cell-temp-quantity")}
          >
            <CustomInput
              style={[styles.customInput, { width: scaleWidth(70) }]}
              textInputProps={{
                placeholder: "Temp quantity",
                fontSize: scaleFont(15),
                textAlign: "left",
                defaultValue: cellItem?.tempQuantity || 0,
                onChangeText: onHandleChangeTempQty,
                keyboardType: "numeric",
              }}
            />
          </View>
        );

      case "costPrice":
        const onHandleChangeCostPrice = async (text) => {
          dispatchProduct(
            updateOptionsQty(
              Object.assign({}, cellItem, { costPrice: formatMoney(text) ?? 0 })
            )
          );
        };

        return (
          <View
            style={{ width: cellWidth }}
            key={getUniqueId(columnKey, rowIndex, "cell-value-cost")}
          >
            {/* <CustomInputMoney
              style={[styles.customInput, { width: scaleWidth(110) }]}
              textInputProps={{
                placeholder: "Price",
                fontSize: scaleFont(15),
                textAlign: "left",
                defaultValue: cellItem?.costPrice || 0,
                onChangeText: onHandleChangeCostPrice,
                keyboardType: "numeric",
              }}
            /> */}

            <InputMoney
              width={scaleWidth(110)}
              height={scaleHeight(40)}
              keyboardType="numeric"
              textAlign="center"
              value={`${cellItem?.costPrice}`}
              onChangeText={onHandleChangeCostPrice}
              // editable={!applyToCost}
            />
          </View>
        );
      case "price":
        const onHandleChangeAdditionalPrice = async (text) => {
          dispatchProduct(
            updateOptionsQty(
              Object.assign({}, cellItem, {
                price: formatMoney(text) ?? 0,
              })
            )
          );
        };

        return (
          <View
            style={{ width: cellWidth }}
            key={getUniqueId(columnKey, rowIndex, "cell-value-addition")}
          >
            {/* <CustomInputMoney
              style={[styles.customInput, { width: scaleWidth(110) }]}
              textInputProps={{
                placeholder: "Price",
                fontSize: scaleFont(15),
                textAlign: "left",
                defaultValue: cellItem?.price || 0,
                onChangeText: onHandleChangeAdditionalPrice,
                keyboardType: "numeric",
              }}
            /> */}

            <InputMoney
              width={scaleWidth(110)}
              height={scaleHeight(40)}
              keyboardType="numeric"
              textAlign="center"
              value={`${cellItem?.price}`}
              onChangeText={onHandleChangeAdditionalPrice}
              // editable={!applyToCost}
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
              disable={!isWareHouse}
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
                width: cellWidth - scaleWidth(10),
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

  const onChangeValueSearch = (text) => {
    setSearchText(text);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          layouts.horizontal,
          { justifyContent: "space-between", alignItems: "center" },
        ]}
      >
        <Text style={styles.infoHeaderText}>
          {t("Product Versions")}
          <Text style={styles.infoText}>{` · ${
            optionsQty?.length || 0
          } versions`}</Text>
        </Text>

        <View style={[layouts.horizontal, layouts.horizontalCenterRight]}>
          <InputSearch onSearch={onChangeValueSearch} width={scaleWidth(280)} />
          <View style={layouts.marginHorizontal} />

          <AddProductVersionDialog
            dispatchProduct={dispatchProduct}
            options={options}
            isExistItem={isExistItem}
            renderButton={(onShowDialog) => (
              <View style={[layouts.horizontal, layouts.horizontalCenterRight]}>
                <ButtonGradient
                  disable={!isWareHouse}
                  label={t("Manual Generate")}
                  width={scaleWidth(135)}
                  height={scaleHeight(35)}
                  fontSize={scaleFont(15)}
                  textColor={colors.WHITE}
                  fontWeight="500"
                  borderRadius={scaleWidth(3)}
                  onPress={onShowDialog}
                />
              </View>
            )}
          />

          <View style={layouts.marginHorizontal} />
          <GenerateConfirmButton
            disable={!isWareHouse}
            label={t("Auto Generate")}
            description={t("Do you want to generate auto ?")}
            width={scaleWidth(120)}
            height={scaleHeight(35)}
            fontSize={scaleFont(15)}
            textColor={colors.WHITE}
            fontWeight="500"
            borderRadius={scaleWidth(3)}
            onPress={autoGenerateVersions}
          />

          <View style={styles.itemSeparator} />
          <View style={styles.itemSeparator} />
        </View>
      </View>
      <View style={layouts.marginVertical} />
      {optionsQty && (
        <Table
          tableStyle={styles.content}
          rowHeight={scaleHeight(60)}
          items={optionsQty}
          flatListRef={flatListRef}
          highlightIndex={highlightIndex}
          headerKeyLabels={{
            imageUrl: t("Image"),
            label: t("Version"),
            barCode: t("Barcode"),
            description: t("Description"),
            costPrice: t("Cost price"),
            price: t("Price"),
            quantity: t("Qty"),
            tempQuantity: t("Temp qty"),
            actions: t("Actions"),
          }}
          whiteListKeys={[
            "imageUrl",
            "label",
            "barCode",
            "description",
            "costPrice",
            "price",
            "quantity",
            "tempQuantity",
            "actions",
          ]}
          primaryKey="label"
          widthForKeys={{
            imageUrl: scaleWidth(60),
            label: scaleWidth(150),
            barCode: scaleWidth(180),
            description: scaleWidth(120),
            costPrice: scaleWidth(120),
            price: scaleWidth(120),
            quantity: scaleWidth(80),
            tempQuantity: scaleWidth(80),
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
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(17),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },

  infoText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
    flex: 1,
  },
});
