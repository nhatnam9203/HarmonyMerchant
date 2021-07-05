import {
  ButtonCalendarFilter,
  FormTitle,
  ExportModal,
} from '@shared/components';
import { getQuickFilterTimeRange, formatMoneyWithUnit } from '@utils';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { Table } from '@shared/components/CustomTable';
import {
  dateToString,
  DATE_SHOW_FORMAT_STRING,
  statusSuccess,
} from '@shared/utils';
import { layouts } from '@shared/themes';
import { DropdownMenu } from '@shared/components';
import NavigationServices from '@navigators/NavigatorServices';
import { useExportSaleByCategory } from '@shared/services/api/retailer';
const filterItems = [
  { label: 'Top categories', value: 'top' },
  { label: 'All categories', value: 'all' },
];

export default function SalesByCategory({
  onChangeTimeValue,
  data,
  timeValue,
  navigation,
  setFilterCategory,
  onRefresh,
  exportRef,
  callExportSaleByCategory,
  sortTotalProfit,
  onSortWithKey,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const calendarRef = React.useRef(null);

  // create filter name data
  // const bindFilterName = () => {
  //   if (!productSaleByCategoryList) return [];

  //   let array = [];

  //   const arrMap = productSaleByCategoryList.map((item) => ({
  //     value: item.categoryName,
  //     ...item,
  //   }));
  //   array.push(...arrMap);

  //   setFilterNames(array);

  //   if (onChangeFilterNames) {
  //     onChangeFilterNames(array);
  //   }
  // };

  // binding data list for name filter
  // const filterDataTable = () => {
  //   return filterNameItem &&
  //     !defaultFilterList?.find((x) => x.value === filterNameItem)
  //     ? productSaleByCategoryList.filter(
  //         (item) => item.categoryName === filterNameItem
  //       )
  //     : productSaleByCategoryList;
  // };

  // callback
  // const onChangeFilterName = (filterName) => {
  //   setFilterNameItem(filterName);
  //   if (onChangeFilterId) {
  //     onChangeFilterId(filterName);
  //   }
  // };

  // const goStatistics = async (item) => {
  //   if (!item) return;
  //   // change to statistic tab

  //   await onGoStatistics(item);
  // };
  // React.useEffect(() => {
  //   const unsubscribeFocus = navigation.addListener("focus", (props) => {
  //     if (timeValue) calendarRef.current?.setTimeValue(timeValue);
  //   });

  //   const unsubscribeBlur = navigation.addListener("blur", () => {});

  //   return () => {
  //     unsubscribeFocus();
  //     unsubscribeBlur();
  //   };
  // }, [navigation]);

  React.useEffect(() => {
    if (timeValue) {
      calendarRef.current?.updateTimeValue(timeValue);
    }
  }, [timeValue]);

  const onSelectRow = ({ item }) => {
    NavigationServices.navigate('ReportSaleCategory_Detail', {
      detailName: item?.name,
      timeValue: timeValue,
    });
  };

  const onRenderCell = ({ columnKey, rowIndex, columnIndex, item }) => {
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Table
          items={data}
          headerKeyLabels={{
            name: t('Category name'),
            quantity: t('Qty sold'),
            totalRevenue: t('Total revenue'),
            totalCost: t('Total cost'),
            totalTax: t('Total tax'),
            totalProfit: t('Total profit'),
          }}
          whiteListKeys={[
            'name',
            'quantity',
            'totalRevenue',
            'totalCost',
            'totalTax',
            'totalProfit',
          ]}
          sortedKeys={{ totalProfit: sortTotalProfit }}
          primaryKey="name"
          //   unitKeys={{ totalDuration: "hrs" }}
          widthForKeys={{
            name: scaleWidth(200),
            quantity: scaleWidth(120),
            totalRevenue: scaleWidth(180),
            totalCost: scaleWidth(180),
            totalTax: scaleWidth(180),
          }}
          emptyDescription={t('No Report Data')}
          //   styleTextKeys={{ customerName: styles.textName }}
          onSortWithKey={onSortWithKey}
          formatFunctionKeys={{
            // date: (value) => dateToString(value, DATE_SHOW_FORMAT_STRING),
            totalRevenue: (value) => `${formatMoneyWithUnit(value)}`,
            totalCost: (value) => `${formatMoneyWithUnit(value)}`,
            totalTax: (value) => `${formatMoneyWithUnit(value)}`,
            totalProfit: (value) => `${formatMoneyWithUnit(value)}`,
          }}
          renderCell={onRenderCell}
          onRowPress={onSelectRow}
          onRefresh={onRefresh}
        />
      </View>

      <View style={styles.rowContent}>
        <View style={layouts.horizontal}>
          <ButtonCalendarFilter
            ref={calendarRef}
            onChangeTimeValue={onChangeTimeValue}
            paddingLeft={scaleWidth(15)}
            paddingTop={scaleHeight(165)}
            defaultValue={'This Week'}
          />
          <View style={layouts.marginHorizontal} />
          <DropdownMenu
            items={filterItems}
            onChangeValue={setFilterCategory}
            defaultIndex={0}
            width={scaleWidth(208)}
            height={scaleHeight(40)}
            placeholder={t('Select Category')}
          />
        </View>
      </View>
      <View style={styles.rowContent}>
        <Text style={layouts.title}>{t('Top Performing Categories')}</Text>
        <ExportModal ref={exportRef} onExportFile={callExportSaleByCategory} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column-reverse',
  },

  content: {
    flex: 1,
    marginTop: scaleHeight(20),
  },

  rowContent: {
    marginTop: scaleHeight(20),
    paddingHorizontal: scaleWidth(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
