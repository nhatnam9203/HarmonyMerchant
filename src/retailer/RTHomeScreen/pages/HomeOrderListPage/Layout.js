import IMAGE from "@resources";
import {
  ButtonCalendarFilter,
  ButtonGradient,
  ButtonGradientWhite,
  ButtonRightPanelFilter,
  ExportModal,
  FormSelect,
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
}) => {
  const { t } = useTranslation();

  const onRenderTableCell = ({ item, columnKey, rowIndex, cellWidth }) => {
    if (columnKey === 'appointmentId') {
      const handleCheckRow = (val) => {
        // onCheckedRow(item, val);
      };

      return (
        <TouchableOpacity
          onPress={() => {}}
          style={[layouts.horizontal, { width: cellWidth }, styles.cellStyle]}
          key={getUniqueId(columnKey, rowIndex, 'cell-code')}
        >
          <CustomTableCheckBox
          //  value={defaultValue}
          //  onValueChange={onValueChange}
          />
          <Text style={styles.textName}>{item.appointmentId}</Text>
        </TouchableOpacity>
      );
    }

    if (columnKey === 'status') {
      return (
        <View
          style={[{ width: cellWidth }, styles.cellStyle]}
          key={getUniqueId(columnKey, rowIndex, 'cell-status')}
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
            appointmentId: t('ID'),
            purchasePoint: t('Purchase Point'),
            createdDate: t('Purchase Date'),
            billToName: t('Bill-to Name'),
            shipToName: t('Ship-to Name'),
            status: t('Status'),
            total: t('Grand Total'),
          }}
          whiteListKeys={[
            'appointmentId',
            'purchasePoint',
            'createdDate',
            'billToName',
            'shipToName',
            'status',
            'total',
          ]}
          // sortedKeys={{ customerName: sortName, phone: sortPhoneNumber }}
          primaryKey="appointmentId"
          // unitKeys={{ totalDuration: 'hrs' }}
          widthForKeys={{
            appointmentId: scaleWidth(110),
            purchasePoint: scaleWidth(130),
            createdDate: scaleWidth(200),
            billToName: scaleWidth(160),
            shipToName: scaleWidth(160),
            status: scaleWidth(150),
            total: scaleWidth(150),
          }}
          emptyDescription={t('No Orders')}
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
        <HeaderToolBarTitle label={t('Orders')} style={styles.textTitle} />
        <View style={layouts.horizontal}>
          <ButtonGradientWhite
            label={t('Clean')}
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
          {/* <ExportModal ref={exportRef} onExportFile={callExportOrderList} /> */}
        </View>
      </View>

      <View style={styles.rowContent}>
        <View style={layouts.horizontal}>
          <ButtonCalendarFilter
            onChangeTimeValue={onChangeTimeValue}
            defaultValue={'This Week'}
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
                label={t('Payment method')}
                filterItems={PAYMENTS}
                defaultValue={0}
                onChangeValue={setPayment}
              />

              <FormSelect
                label={t('Purchase point')}
                filterItems={PURCHASE_POINTS}
                defaultValue={0}
                onChangeValue={setPurchasePoint}
              />

              <FormSelect
                label={t('Status')}
                filterItems={ORDER_STATUS}
                defaultValue={0}
                onChangeValue={setOrderStatus}
              />
            </View>
          </ButtonRightPanelFilter>

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
      </View>
      <View style={styles.rowContent}>
        <View style={styles.leftContent}>
          <InputSearch onSearch={onChangeValueSearch} width={scaleWidth(280)} />
          <View style={layouts.marginHorizontal} />
          <ButtonGradientWhite
            label={t('Search')}
            width={scaleWidth(120)}
            onPress={onButtonSearchPress}
          />
        </View>
        <ButtonGradient
          onPress={onButtonNewOrderPress}
          label={t('New Order')}
          width={scaleWidth(140)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column-reverse',
  },

  rowContent: {
    marginTop: scaleHeight(20),
    paddingHorizontal: scaleWidth(16),
    height: scaleHeight(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  leftContent: {
    flex: 1,
    flexDirection: 'row',
  },

  textTitle: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(26),
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.OCEAN_BLUE,
  },

  textName: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(15),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },

  cellStyle: {
    paddingHorizontal: scaleWidth(10),
  },

  filterContent: {
    flexDirection: 'column-reverse',
  },

  icon: {
    tintColor: colors.GREYISH_BROWN,
    width: scaleWidth(20),
    height: scaleHeight(20),
  },
});
