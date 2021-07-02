import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '@shared/themes';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import SalesByCategory from './SalesByCategory';
import SalesByCategoryDetail from './SalesByCategoryDetail';
import {
  ButtonCalendarFilter,
  FormTitle,
  ExportModal,
} from '@shared/components';
import {
  useReportSaleCategory,
  useExportSaleByCategory,
} from '@shared/services/api/retailer';

import { getQuickFilterTimeRange } from '@utils';
import {
  dateToString,
  DATE_SHOW_FORMAT_STRING,
  statusSuccess,
  getTimeTitleFile,
} from '@shared/utils';

const { Screen, Navigator } = createStackNavigator();

function SalesByCategoryTab({
  route: {
    params: { showBackButton },
  },
}) {
  const exportRef = React.useRef();
  const [timeVal, setTimeVal] = React.useState(null);
  const [filterCategory, setFilterCategory] = React.useState(null);
  const [data, setData] = React.useState([]);
  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [reportSaleCategory, getReportSaleCategory] = useReportSaleCategory();
  const callGetReportSaleCategory = React.useCallback(() => {
    getReportSaleCategory({
      ...timeVal,
      category: filterCategory?.value ?? 'top',
      sort: {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeVal, filterCategory]);

  /**
  |--------------------------------------------------
  | API EXPORT
  |--------------------------------------------------
  */
  const [saleByCategoryExport, ExportSaleByCategory] =
    useExportSaleByCategory();

  const callExportSaleByCategory = (values) => {
    const params = Object.assign({}, values, {
      ...timeVal,
      category: filterCategory?.value ?? 'top',
    });
    exportRef.current?.onSetFileName(
      getTimeTitleFile('SaleByCategory', params)
    );
    ExportSaleByCategory(params);
  };

  React.useEffect(() => {
    const { codeStatus, data } = saleByCategoryExport || {};
    if (statusSuccess(codeStatus)) {
      exportRef.current?.onCreateFile(data);
    }
  }, [saleByCategoryExport]);
  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */

  React.useEffect(() => {
    callGetReportSaleCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeVal, filterCategory]);

  /**effect */
  React.useEffect(() => {
    const { codeStatus, message, data, summary } = reportSaleCategory || {};
    if (statusSuccess(codeStatus)) {
      setData(data);
    }
  }, [reportSaleCategory]);

  const onChangeTimeValue = (quickFilter, timeState) => {
    if (quickFilter === 'Customize Date') {
      setTimeVal({
        quickFilter: 'custom',
        quickFilterText: quickFilter,
        timeStart: timeState.startDate,
        timeEnd: timeState.endDate,
      });
    } else {
      setTimeVal({
        quickFilter: getQuickFilterTimeRange(quickFilter),
        quickFilterText: quickFilter,
      });
    }
  };

  const onRefresh = () => callGetReportSaleCategory();

  return (
    <View style={styles.container}>
      <Navigator
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
      >
        <Screen name="ReportSaleCategory">
          {(props) => (
            <SalesByCategory
              {...props}
              onChangeTimeValue={onChangeTimeValue}
              timeValue={timeVal}
              data={data}
              setFilterCategory={setFilterCategory}
              onRefresh={onRefresh}
              exportRef={exportRef}
              callExportSaleByCategory={callExportSaleByCategory}
            />
          )}
        </Screen>
        <Screen name="ReportSaleCategory_Detail">
          {(props) => (
            <SalesByCategoryDetail
              {...props}
              showBackButton={showBackButton}
              onChangeTimeValue={onChangeTimeValue}
              timeValue={timeVal}
              data={data}
              onRefresh={onRefresh}
            />
          )}
        </Screen>
      </Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE_FA,
  },
});

export default SalesByCategoryTab;