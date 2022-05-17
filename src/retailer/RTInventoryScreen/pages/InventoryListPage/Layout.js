import IMAGE from "@resources";
import {
  ButtonGradient,
  ButtonGradientWhite,
  ButtonGradientGreen,
  DropdownMenu,
  // ExportModal,
  ExportModalInventory,
  Pagination,
  TableImageCell,
} from "@shared/components";
import { CustomTableCheckBox } from "@shared/components/CustomCheckBox";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import { HeaderToolBarTitle } from "@shared/components/HeaderToolBarTitle";
import { InputSearch } from "@shared/components/InputSearch";
import { WithDialogRestock } from "@shared/HOC/withDialogRestock";
import { WithDialogScanQR } from "@shared/HOC/withDialogScanQR";
import { colors, fonts, layouts } from "@shared/themes";
import {
  dateToString,
  DATE_SHOW_FORMAT_STRING,
  NEED_TO_ORDER,
} from "@shared/utils";
import { formatMoneyWithUnit } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const RestockButton = WithDialogRestock(ButtonGradientWhite);
const ScanQRButton = WithDialogScanQR(ButtonGradientWhite);
const IMAGE_WIDTH = scaleWidth(120);
export const Layout = ({
  items,
  onButtonNewProductPress,
  onEditProduct,
  needToOrderRef,
  onLoadProductDetail,
  categories,
  onChangeValueSearch,
  onButtonSearchPress,
  category,
  setCategory,
  needToOrder,
  setNeedToOrder,
  onSubmitRestock,
  onCheckedRow,
  onRefresh,
  callExportProduct,
  exportRef,
  setPage,
  DEFAULT_PAGE,
  pagination,
  onResultScanCode,
  onCheckedAll,
  getCheckedValue,
  onButtonApprovePress,
  onHandleQuantity,
  isPermission,
  isWareHouse,
}) => {
  const { t } = useTranslation();

  const onRenderTableCell = ({
    item,
    columnKey,
    rowIndex,
    textStyle,
    cellWidth,
  }) => {
    if (columnKey === "imageUrl") {
      const handleCheckRow = (val) => {
        onCheckedRow(item, val);
      };

      const onGetCheckedValue = () => {
        return getCheckedValue(item);
      };

      return (
        <TableImageCell
          width={IMAGE_WIDTH}
          imageUrl={item?.imageUrl}
          key={getUniqueId(columnKey, rowIndex, "cell-image-checked")}
          onPress={() => {}}
          defaultValue={onGetCheckedValue}
          onValueChange={handleCheckRow}
        />
      );
    }

    if (columnKey === "actions") {
      const onHandleEdit = () => {
        onEditProduct(item);
      };
      const onHandleQty = () => {
        onHandleQuantity(item);
      };
      return (
        <View
          style={[layouts.fill, layouts.horizontal]}
          key={getUniqueId(columnKey, rowIndex, "cell-action")}
        >
          <ButtonGradientWhite
            label={t("Quantity")}
            width={scaleWidth(72)}
            height={scaleHeight(30)}
            borderRadius={scaleWidth(3)}
            fontSize={scaleFont(14)}
            fontWeight="normal"
            onPress={onHandleQty}
          />
          <View style={layouts.marginHorizontal} />
          <ButtonGradient
            disable={!isPermission()}
            label={t("Edit")}
            width={scaleWidth(72)}
            height={scaleHeight(30)}
            borderRadius={scaleWidth(3)}
            fontSize={scaleFont(14)}
            textColor={colors.WHITE}
            fontWeight="normal"
            onPress={onHandleEdit}
          />
        </View>
      );
    }

    if (columnKey === "quantity") {
      const warningQty = () => {
        return (
          item.quantity < item.needToOrder ||
          item.quantity < item.minThreshold ||
          (item.countQuantities !== -1 && item.minQty < item.minThreshold)
        );
      };

      return (
        <View
          style={{
            width: cellWidth,
            paddingVertical: scaleHeight(2),
            paddingLeft: scaleWidth(10),
          }}
          key={getUniqueId(columnKey, rowIndex, "cell-quantity")}
        >
          <Text
            style={[
              textStyle,
              {
                textAlign: "left",
                textAlignVertical: "center",
              },
              warningQty() && { color: "#ffc130" },
              item.isAdjust && { color: "red" },
            ]}
            numberOfLines={5}
            ellipsizeMode="tail"
          >
            {item?.quantity}
          </Text>
        </View>
      );
    }

    if (columnKey === "price") {
      return (
        <View
          style={{ width: cellWidth, paddingVertical: scaleHeight(2) }}
          key={getUniqueId(columnKey, rowIndex, "cell-price")}
        >
          <Text
            style={[
              textStyle,
              {
                textAlign: "left",
                textAlignVertical: "center",
              },
            ]}
          >
            {item?.countQuantities > 0 ? item?.priceRange : item?.price}
          </Text>
        </View>
      );
    }

    return null;
  };

  const onRenderHeaderCell = ({ key, index, cellWidth, text, textStyle }) => {
    if (key === "imageUrl") {
      const onValueChange = (bl) => {
        onCheckedAll(bl);
      };

      const onGetCheckedValue = () => {
        return getCheckedValue(null);
      };

      return (
        <TouchableOpacity
          onPress={() => {}}
          style={[{ width: cellWidth }, styles.cellStyle]}
          key={getUniqueId(key, index, "header-image")}
          activeOpacity={1}
        >
          <CustomTableCheckBox
            defaultValue={onGetCheckedValue}
            onValueChange={onValueChange}
          />
          <Text style={textStyle}>{text}</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const onHandlePressedRow = (params) => {
    if (!isPermission()) {
      return;
    }
    onLoadProductDetail(params);
  };

  return (
    <View
      style={styles.container}
      // onTouchStart={() => needToOrderRef.current?.closePicker()}
    >
      <View style={layouts.fill}>
        <Table
          items={items}
          renderHeaderCell={onRenderHeaderCell}
          headerKeyLabels={{
            imageUrl: t("Image"),
            name: t("Product Name"),
            categoryName: t("Category"),
            sku: t("SKU"),
            price: t("Price"),
            quantity: t("Qty"),
            needToOrder: t("Need To Order"),
            actions: t("Actions"),
          }}
          whiteListKeys={[
            "imageUrl",
            "name",
            "categoryName",
            "price",
            "sku",
            "quantity",
            "needToOrder",
            "actions",
          ]}
          primaryKey="productId"
          widthForKeys={{
            imageUrl: IMAGE_WIDTH,
            name: scaleWidth(160),
            categoryName: scaleWidth(110),
            sku: scaleWidth(135),
            price: scaleWidth(125),
            quantity: scaleWidth(100),
            needToOrder: scaleWidth(80),
          }}
          emptyDescription={t("No Products")}
          styleTextKeys={{ name: styles.textName, sku: styles.textSku }}
          formatFunctionKeys={{
            createdDate: (value) =>
              dateToString(value, DATE_SHOW_FORMAT_STRING),
            price: (value) => `${formatMoneyWithUnit(value)}`,
            needToOrder: (value) => (value ? `${value}` : "0"),
          }}
          renderCell={onRenderTableCell}
          onRowPress={onHandlePressedRow}
          onRefresh={onRefresh}
        />
      </View>

      <View style={styles.rowContent}>
        <HeaderToolBarTitle label={t("Products")} style={styles.textTitle} />
        <View style={layouts.horizontal}>
          <Pagination
            onChangePage={setPage}
            onChangeItemsPerPage={() => {}}
            visibleItemsPerPage={false}
            defaultPage={DEFAULT_PAGE}
            {...pagination}
            length={items?.length}
          />
          <View style={layouts.marginHorizontal} />
          <ExportModalInventory
            disable={!isPermission()}
            ref={exportRef}
            onExportFile={callExportProduct}
            title={t("ReportInventory")}
          />
        </View>
      </View>

      <View style={[styles.rowContent, { justifyContent: "flex-start" }]}>
        <View style={styles.leftContent}>
          <DropdownMenu
            items={categories}
            defaultIndex={0}
            onChangeValue={(item) => {
              setCategory(item?.value);
            }}
            width={scaleWidth(208)}
            placeholder={t("Select Category")}
          />
          <View style={layouts.marginHorizontal} />

          <DropdownMenu
            ref={needToOrderRef}
            items={NEED_TO_ORDER}
            defaultValue={needToOrder}
            onChangeValue={(item) => {
              setNeedToOrder(item?.value);
            }}
            placeholder={t("Need to order")}
            width={scaleWidth(160)}
          />
        </View>

        <ButtonGradientGreen
          disable={!isPermission()}
          onPress={onButtonApprovePress}
          label={t("Approve Change")}
          width={scaleWidth(140)}
          borderRadius={scaleWidth(3)}
        />
      </View>

      <View style={styles.rowContent}>
        <View style={styles.leftContent}>
          <InputSearch onSearch={onChangeValueSearch} width={scaleWidth(280)} />
          <View style={layouts.marginHorizontal} />
          <ButtonGradientWhite
            label={t("Search")}
            width={scaleWidth(120)}
            borderRadius={scaleWidth(3)}
            onPress={onButtonSearchPress}
          />
          <View style={layouts.marginHorizontal} />

          <ScanQRButton
            disable={!isPermission()}
            label={t("Scan")}
            title={t("Scan Barcode")}
            width={scaleWidth(120)}
            borderRadius={scaleWidth(3)}
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
        <ButtonGradient
          disable={!isPermission() || !isWareHouse}
          onPress={onButtonNewProductPress}
          label={t("Add Product")}
          width={scaleWidth(140)}
          borderRadius={scaleWidth(3)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
  },

  rowContent: {
    marginTop: scaleHeight(10),
    marginBottom: scaleHeight(10),
    paddingHorizontal: scaleWidth(16),
    height: scaleHeight(40),
    flexDirection: "row",
    justifyContent: "space-between",
  },

  leftContent: {
    flex: 1,
    flexDirection: "row",
  },

  textTitle: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(26),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },

  textName: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(15),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },
  textSku: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  cellStyle: {
    paddingHorizontal: scaleWidth(15),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
