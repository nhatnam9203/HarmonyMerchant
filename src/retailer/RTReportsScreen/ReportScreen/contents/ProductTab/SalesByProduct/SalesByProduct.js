import NavigationServices from '@navigators/NavigatorServices';
import {
  ButtonCalendarFilter,
  DropdownMenu,
  ExportModal,
} from '@shared/components';
import { Table } from '@shared/components/CustomTable';
import { useReportSaleProduct } from '@shared/services/api/retailer';
import { layouts } from '@shared/themes';
import { statusSuccess } from '@shared/utils';
import { getQuickFilterTimeRange } from '@utils';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import React from 'react';
import { formatMoneyWithUnit } from '@utils';

const filterItems = [
  { label: 'Top products', value: 'top' },
  { label: 'All products', value: 'all' },
];

export default function SalesByProduct({
  onChangeTimeValue,
  data,
  timeValue,
  setFilterProduct,
  onRefresh,
  exportRef,
  callExportSaleByProduct,
  sortTotalProfit,
  onSortWithKey,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const calendarRef = React.useRef(null);

  React.useEffect(() => {
    if (timeValue) {
      calendarRef.current?.updateTimeValue(timeValue);
    }
  }, [timeValue]);

  const onSelectRow = ({ item }) => {
    NavigationServices.navigate('ReportSaleProduct_Detail', {
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
            name: t('Product name'),
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
          sortKey="totalProfit"
          primaryKey="name"
          widthForKeys={{
            name: scaleWidth(200),
            quantity: scaleWidth(120),
            totalRevenue: scaleWidth(180),
            totalCost: scaleWidth(180),
            totalTax: scaleWidth(180),
          }}
          emptyDescription={t('No Report Data')}
          onSortWithKey={onSortWithKey}
          formatFunctionKeys={{
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
            onChangeValue={setFilterProduct}
            defaultIndex={0}
            width={scaleWidth(208)}
            height={scaleHeight(40)}
            placeholder={t('Select Product')}
          />
        </View>
      </View>
      <View style={styles.rowContent}>
        <Text style={layouts.title}>{t('Top Performing Products')}</Text>
        <ExportModal ref={exportRef} onExportFile={callExportSaleByProduct} />
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

  cellAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    flex: 1,
  },
  txtSalary: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#6A6A6A',
    marginRight: 5,
  },
  imgDetail: {
    tintColor: '#6A6A6A',
    width: 20,
    height: 20,
  },
  btnInCell: {
    height: '100%',
    width: 35,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartDetail: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
  chartDetailItem: {
    flexDirection: 'row',
    margin: 10,
    paddingLeft: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
