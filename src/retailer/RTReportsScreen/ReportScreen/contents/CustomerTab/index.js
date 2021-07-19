import { createStackNavigator } from '@react-navigation/stack';
import {
  useReportCustomer,
  useExportSaleCustomer,
} from '@shared/services/api/retailer';
import { colors } from '@shared/themes';
import { statusSuccess, getTimeTitleFile, SORT_TYPE } from '@shared/utils';
import { getQuickFilterTimeRange } from '@utils';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import CustomerDetail from './CustomerDetail';
import CustomerOverall from './CustomerOverall';
import React from 'react';
import { useFocusEffect } from "@react-navigation/native";

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
    const [sortName, setSortName] = React.useState(SORT_TYPE.DESC);
    /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
    const [reportCustomer, getReportCustomer] = useReportCustomer();
    const callGetReportCustomer = React.useCallback(() => {
      getReportCustomer({
        ...timeVal,
        sort: { name: sortName },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeVal, sortName]);

    /**
  |--------------------------------------------------
  |  API EXPORT
  |--------------------------------------------------
  */
    const [saleCustomerExport, ExportCustomerSale] = useExportSaleCustomer();
    const callExportCustomer = (values) => {
      const params = Object.assign({}, values, {
        ...timeVal,
        sort: { name: sortName },
      });
      exportRef.current?.onSetFileName(
        getTimeTitleFile("ReportCustomer", params)
      );
      ExportCustomerSale(params);
    };

    React.useEffect(() => {
      const { codeStatus, data } = saleCustomerExport || {};
      if (statusSuccess(codeStatus)) {
        exportRef.current?.onCreateFile(data);
      }
    }, [saleCustomerExport]);

    /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */

    // React.useEffect(() => {
    //   callGetReportCustomer();
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [timeVal, sortName]);

    useFocusEffect(
      React.useCallback(() => {
        callGetReportCustomer();
      }, [timeVal, sortName])
    );

    /**effect */
    React.useEffect(() => {
      const { codeStatus, message, data, summary } = reportCustomer || {};
      if (statusSuccess(codeStatus)) {
        setData(data);
      }
    }, [reportCustomer]);

    const onChangeTimeValue = (quickFilter, timeState) => {
      if (quickFilter === "Customize Date") {
        setTimeVal({
          quickFilter: "custom",
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

    const onSortWithKey = (sortKey) => {
      switch (sortKey) {
        case "name":
          const sortedName =
            sortName === SORT_TYPE.ASC ? SORT_TYPE.DESC : SORT_TYPE.ASC;
          setSortName(sortedName);
          break;

        default:
          break;
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
                sortName={sortName}
                onSortWithKey={onSortWithKey}
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
