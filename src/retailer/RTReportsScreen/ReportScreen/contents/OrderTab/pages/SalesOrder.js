import { ButtonCalendarFilter, ExportModal } from '@shared/components';
import { Table } from '@shared/components/CustomTable';
import {
  useReportSaleOrder,
  useExportSaleOrder,
} from '@shared/services/api/retailer';
import {
  dateToString,
  DATE_SHOW_FORMAT_STRING,
  statusSuccess,
  getTimeTitleFile,
} from '@shared/utils';
import { getQuickFilterTimeRange } from '@utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ButtonOverall } from '../../../widget';
import { formatMoneyWithUnit } from '@utils';
const log = (obj, message = '') => {
  Logger.log(`[SalesOrder] ${message}`, obj);
};
const RANGE_TIME_DEFAULT = 'This Week';

export const SalesOrder = () => {
  const { t } = useTranslation();
  const exportRef = React.useRef();
  const [timeVal, setTimeVal] = React.useState();
  const [data, setData] = React.useState();
  const [summary, setSummary] = React.useState();

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [reportSalesOrder, getReportSalesOrder] = useReportSaleOrder();
  const callGetReportSalesOrder = React.useCallback(() => {
    getReportSalesOrder({
      ...timeVal,
      sort: {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeVal]);

  /**
  |--------------------------------------------------
  |  API EXPORT
  |--------------------------------------------------
  */
  const [exportSalesOrder, ExportSalesOrder] = useExportSaleOrder();
  const callExportSalesOrder = (values) => {
    const params = Object.assign({}, values, {
      ...timeVal,
    });
    console.log('params', params);
    exportRef.current?.onSetFileName(
      getTimeTitleFile('ReportSaleOrder', params)
    );
    ExportSalesOrder(params);
  };

  React.useEffect(() => {
    const { codeStatus, data } = exportSalesOrder || {};
    if (statusSuccess(codeStatus)) {
      exportRef.current?.onCreateFile(data);
    }
  }, [exportSalesOrder]);

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */

  React.useEffect(() => {
    callGetReportSalesOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeVal]);

  React.useEffect(() => {
    const { codeStatus, message, data, summary } = reportSalesOrder || {};
    if (statusSuccess(codeStatus)) {
      log(data, 'response data');
      setData(data);
      setSummary(summary);
    }
  }, [reportSalesOrder]);

  const onChangeTimeValue = (quickFilter, timeState) => {
    if (quickFilter === 'Customize Date') {
      setTimeVal({
        quickFilter: 'custom',
        timeStart: timeState.startDate,
        timeEnd: timeState.endDate,
      });
    } else {
      setTimeVal({ quickFilter: getQuickFilterTimeRange(quickFilter) });
    }
  };

  const onRenderCell = ({ columnKey, rowIndex, columnIndex, item }) => {
    // if (columnKey === "actions") {
    //   const onHandleEditCustomer = () => {
    //     onEditCustomer(item);
    //   };
    //   return (
    //     <View
    //       style={layouts.fill}
    //       key={getUniqueId(columnKey, rowIndex, "cell-action")}
    //     >
    //       <ButtonGradient
    //         label={t("Edit")}
    //         width={scaleWidth(72)}
    //         height={scaleHeight(28)}
    //         fontSize={scaleFont(15)}
    //         textColor={colors.WHITE}
    //         fontWeight="normal"
    //         onPress={onHandleEditCustomer}
    //       />
    //     </View>
    //   );
    // }
    return null;
  };

  const onRefresh = () => callGetReportSalesOrder();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Table
          items={data}
          headerKeyLabels={{
            date: t('Date'),
            completed: t('Completed orders'),
            unCompleted: t('Uncompleted  orders'),
            canceled: t('Canceled orders'),
            returned: t('Returned orders'),
            total: t('Total orders'),
          }}
          whiteListKeys={[
            'date',
            'completed',
            'unCompleted',
            'canceled',
            'returned',
            'total',
          ]}
          //   sortedKeys={{ customerName: sortName, phone: sortPhoneNumber }}
          primaryKey="date"
          //   unitKeys={{ totalDuration: "hrs" }}
          widthForKeys={{
            date: scaleWidth(120),
            completed: scaleWidth(180),
            unCompleted: scaleWidth(180),
            canceled: scaleWidth(180),
            returned: scaleWidth(180),
          }}
          emptyDescription={t('No Report Data')}
          //   styleTextKeys={{ customerName: styles.textName }}
          //   onSortWithKey={onSortWithKey}
          formatFunctionKeys={{
            date: (value) => dateToString(value, DATE_SHOW_FORMAT_STRING),
            total: (value) => `${formatMoneyWithUnit(value)}`,
          }}
          renderCell={onRenderCell}
          onRefresh={onRefresh}
          //   onRowPress={onSelectRow}
        />
      </View>

      <View style={styles.rowContent}>
        <View style={{ flex: 1 }} />
        <ExportModal ref={exportRef} onExportFile={callExportSalesOrder} />
      </View>
      <View style={styles.rowContent}>
        <ButtonOverall
          label={t('total orders').toUpperCase()}
          amount={summary?.total}
        />
        <ButtonOverall
          label={t('completed orders').toUpperCase()}
          amount={summary?.completed}
        />
        <ButtonOverall
          label={t('uncompleted orders').toUpperCase()}
          amount={summary?.unCompleted}
        />
        <ButtonOverall
          label={t('canceled orders').toUpperCase()}
          amount={summary?.canceled}
        />
        <ButtonOverall
          label={t('returned orders').toUpperCase()}
          amount={summary?.returned}
        />
      </View>
      <View style={styles.rowContent}>
        <ButtonCalendarFilter
          onChangeTimeValue={onChangeTimeValue}
          defaultValue={RANGE_TIME_DEFAULT}
          paddingLeft={scaleWidth(15)}
          paddingTop={scaleHeight(120)}
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