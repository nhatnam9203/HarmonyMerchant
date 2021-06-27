import { createStackNavigator } from '@react-navigation/stack';
import {
  useReportCustomer,
  useExportCustomer,
} from '@shared/services/api/retailer';
import { colors } from '@shared/themes';
import { statusSuccess, getTimeTitleFile } from '@shared/utils';
import { getQuickFilterTimeRange } from '@utils';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import CustomerDetail from './CustomerDetail';
import CustomerOverall from './CustomerOverall';
import React from 'react';

const RANGE_TIME_DEFAULT = 'This Week';
const { Screen, Navigator } = createStackNavigator();

export const CustomerTab = React.forwardRef(
  (
    {
      route: {
        params: { showBackButton },
      },
    },
    ref
  ) => {
    const dispatch = useDispatch();
    const exportRef = React.useRef();
    const [timeVal, setTimeVal] = React.useState(null);
    const [data, setData] = React.useState([]);

    /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
    const [reportCustomer, getReportCustomer] = useReportCustomer();
    const callGetReportCustomer = React.useCallback(() => {
      getReportCustomer({
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
    const [customerExport, ExportCustomer] = useExportCustomer();
    const callExportCustomer = (values) => {
      const params = Object.assign({}, values, {
        ...timeVal,
      });
      exportRef.current?.onSetFileName(
        getTimeTitleFile('ReportCustomer', params)
      );
      ExportCustomer(params);
    };

    React.useEffect(() => {
      const { codeStatus, data } = customerExport || {};
      if (statusSuccess(codeStatus)) {
        exportRef.current?.onCreateFile(data);
      }
    }, [customerExport]);

    /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */

    React.useEffect(() => {
      callGetReportCustomer();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeVal]);

    /**effect */
    React.useEffect(() => {
      const { codeStatus, message, data, summary } = reportCustomer || {};
      if (statusSuccess(codeStatus)) {
        setData(data);
      }
    }, [reportCustomer]);

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

    const onRefresh = () => {
      callGetReportCustomer();
    };

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
          <Screen name="ReportCustomerOverall">
            {(props) => (
              <CustomerOverall
                {...props}
                onChangeTimeValue={onChangeTimeValue}
                timeValue={timeVal}
                data={data}
                onRefresh={onRefresh}
                callExportCustomer={callExportCustomer}
                exportRef={exportRef}
              />
            )}
          </Screen>
          <Screen name="ReportCustomerDetail">
            {(props) => (
              <CustomerDetail
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
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
});

export default CustomerTab;
