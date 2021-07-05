import IMAGE from "@resources";
import {
  ButtonCalendarFilter,
  ButtonGradient,
  ButtonGradientWhite,
  ButtonRightPanelFilter,
  ExportModal,
  FormSelect,
  Pagination,
  SlideInRightModal,
} from "@shared/components";
import { CustomTableCheckBox } from "@shared/components/CustomCheckBox";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import { HeaderToolBarTitle } from "@shared/components/HeaderToolBarTitle";
import { InputSearch } from "@shared/components/InputSearch";
import { OrderStatusView } from "@shared/components/OrderStatusView";
import { colors, fonts, layouts } from "@shared/themes";
import {
  dateToString,
  DATE_TIME_SHOW_FORMAT_STRING,
  ORDER_STATUS,
  PAYMENTS,
  PURCHASE_POINTS,
} from "@shared/utils";
import { formatMoneyWithUnit } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FormFilter } from "../../widget";

export const Layout = ({
  onChangeValueSearch,
  onButtonSearchPress,
  onButtonNewOrderPress,
  onSelectRow,
  onSortWithKey,
  items = [],
  onChangeTimeValue,
  onResetFilter,
  onApplyFilter,
  purchasePoint,
  setPurchasePoint,
  payment,
  setPayment,
  orderStatus,
  setOrderStatus,
  onRefresh,
  exportRef,
  callExportOrderList,
  setPage,
  DEFAULT_PAGE,
  pagination,
  sortById,
  isShowClearFilter,
}) => {
  const { t } = useTranslation();
  const [visibleFilter, setVisibleFilter] = React.useState(false);

  const onRenderTableCell = ({ item, columnKey, rowIndex, cellWidth }) => {
    if (columnKey === "code") {
      const handleCheckRow = (val) => {
        // onCheckedRow(item, val);
      };

      return (
        <TouchableOpacity
          onPress={() => {}}
          style={[layouts.horizontal, { width: cellWidth }, styles.cellStyle]}
          key={getUniqueId(columnKey, rowIndex, "cell-code")}
        >
          <CustomTableCheckBox
          //  value={defaultValue}
          //  onValueChange={onValueChange}
          />
          <Text style={styles.textName}>{item.code}</Text>
        </TouchableOpacity>
      );
    }

    if (columnKey === "status") {
      return (
        <View
          style={[{ width: cellWidth }, styles.cellStyle]}
          key={getUniqueId(columnKey, rowIndex, "cell-status")}
        >
          <OrderStatusView status={item.status} />
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={layouts.fill}>
        <Table
          items={items}
          headerKeyLabels={{
            code: t("ID"),
            purchasePoint: t("Purchase Point"),
            createdDate: t("Purchase Date"),
            billToName: t("Bill-to Name"),
            shipToName: t("Ship-to Name"),
            status: t("Status"),
            total: t("Grand Total"),
          }}
          whiteListKeys={[
            "code",
            "purchasePoint",
            "createdDate",
            "billToName",
            "shipToName",
            "status",
            "total",
          ]}
          sortedKeys={{ code: sortById }}
          primaryKey="code"
          // unitKeys={{ totalDuration: 'hrs' }}
          widthForKeys={{
            code: scaleWidth(180),
            purchasePoint: scaleWidth(120),
            createdDate: scaleWidth(175),
            billToName: scaleWidth(160),
            shipToName: scaleWidth(160),
            status: scaleWidth(120),
            total: scaleWidth(150),
          }}
          emptyDescription={t("No Orders")}
          styleTextKeys={{ total: styles.textName }}
          onSortWithKey={onSortWithKey}
          formatFunctionKeys={{
            createdDate: (value) =>
              dateToString(value, DATE_TIME_SHOW_FORMAT_STRING),
            total: (value) => `${formatMoneyWithUnit(value)}`,
          }}
          renderCell={onRenderTableCell}
          onRowPress={onSelectRow}
          onRefresh={onRefresh}
        />
      </View>
      <View style={styles.rowContent}>
        <HeaderToolBarTitle label={t("Orders")} style={styles.textTitle} />
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
          <ButtonGradientWhite
            label={t("Clean")}
            width={scaleWidth(86)}
            height={scaleHeight(32)}
            fontSize={scaleFont(15)}
            // onPress={onButtonSearchPress}
          >
            <View style={layouts.marginHorizontal} />
            <Image
              source={IMAGE.Clean}
              width={scaleWidth(20)}
              height={scaleWidth(20)}
              style={styles.icon}
            />
          </ButtonGradientWhite>
          <View style={layouts.marginHorizontal} />
          <ExportModal ref={exportRef} onExportFile={callExportOrderList} />
        </View>
      </View>

      <View style={styles.rowContent}>
        <View style={layouts.horizontal}>
          <ButtonCalendarFilter
            onChangeTimeValue={onChangeTimeValue}
            defaultValue={"This Week"}
            paddingLeft={scaleWidth(15)}
            paddingTop={scaleHeight(135)}
          />

          <View style={layouts.marginHorizontal} />

          <ButtonRightPanelFilter
            onReset={onResetFilter}
            onApply={onApplyFilter}
          >
            <View style={styles.filterContent}>
              <FormSelect
                required={false}
                label={t("Payment method")}
                filterItems={PAYMENTS}
                defaultValue={payment}
                onChangeValue={setPayment}
                titleStyle={styles.filterTitle}
              />

              <FormSelect
                required={false}
                label={t("Purchase point")}
                filterItems={PURCHASE_POINTS}
                defaultValue={purchasePoint}
                onChangeValue={setPurchasePoint}
                titleStyle={styles.filterTitle}
              />

              <FormSelect
                required={false}
                label={t("Status")}
                filterItems={ORDER_STATUS}
                defaultValue={orderStatus}
                onChangeValue={setOrderStatus}
                titleStyle={styles.filterTitle}
              />
            </View>
          </ButtonRightPanelFilter>
          <View style={layouts.marginHorizontal} />

          {payment?.length > 0 && (
            <FormFilter
              filterValue={`Payment:  ${payment}`}
              onClearFilter={setPayment}
            />
          )}

          {purchasePoint?.length > 0 && (
            <FormFilter
              filterValue={`Purchase point:  ${purchasePoint}`}
              onClearFilter={setPurchasePoint}
            />
          )}

          {orderStatus?.length > 0 && (
            <FormFilter
              filterValue={`Status:  ${orderStatus}`}
              onClearFilter={setOrderStatus}
            />
          )}
        </View>
        {isShowClearFilter() && (
          <TouchableOpacity style={styles.clearAll} onPress={onResetFilter}>
            <Text style={styles.clearAllText}>{t("Clear All")}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.rowContent}>
        <View style={styles.leftContent}>
          <InputSearch onSearch={onChangeValueSearch} width={scaleWidth(280)} />
          <View style={layouts.marginHorizontal} />
          <ButtonGradientWhite
            label={t("Search")}
            width={scaleWidth(120)}
            onPress={onButtonSearchPress}
          />
        </View>
        <ButtonGradient
          onPress={onButtonNewOrderPress}
          label={t("New Order")}
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
    marginTop: scaleHeight(20),
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

  cellStyle: {
    paddingHorizontal: scaleWidth(10),
  },

  filterContent: {
    flexDirection: "column-reverse",
  },

  icon: {
    tintColor: colors.GREYISH_BROWN,
    width: scaleWidth(20),
    height: scaleHeight(20),
  },

  filterTitle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },
  clearAll: {
    paddingRight: scaleWidth(10),
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  clearAllText: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 31,
    letterSpacing: 0,
    textAlign: "right",
    color: colors.ORANGEY_RED,
  },
});
