import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { Dropdown } from "react-native-material-dropdown";
import IMAGE from "@resources";
import {
  localize,
  formatNumberFromCurrency,
  scaleSzie,
  getQuickFilterTimeRange,
} from "@utils";
import actions from "@actions";
import { PopupCalendar } from "@components";

import { HeaderTooltip, PopupButton, TableList } from "../../../widget";
import PaymentBarChart from "./PaymentBarChart";
import PaymentPieChart from "./PaymentPieChart";

const VIEW_MODE = {
  LIST: "LIST",
  CHART: "CHART",
};
const FILTER_NAME_DEFAULT = "All Method";

const ACTIVE_COLOR = "#0764B0";
const INACTIVE_COLOR = "#6A6A6A";

/**create new object from two value for two key of object */
const createChartObjectFromValues = (array, key, keyValue) => {
  let response = [];
  array.forEach((obj) => {
    let mapObj = Object.create({});
    mapObj[obj[key]] = formatNumberFromCurrency(obj[keyValue]);
    response.push(mapObj);
  });

  return response;
};

export default function PaymentMethodRp({ style, onGoStatistics }) {
  /**redux store*/
  const dispatch = useDispatch();
  const pathFileReportStaff = useSelector(
    (state) => state.staff.pathFileReportStaffSalary
  );
  const language = useSelector((state) => state.dataLocal.language);
  const overallPaymentMethodList = useSelector(
    (state) => state.report.overallPaymentMethodList
  );

  /**state */
  const [viewMode, setViewMode] = useState(VIEW_MODE.LIST);
  const [chartData, setChartData] = useState([]);
  const [filterNameItem, setFilterNameItem] = useState(FILTER_NAME_DEFAULT);
  const [filterNames, setFilterNames] = useState([]);

  const [visibleCalendar, setVisibleCalendar] = useState(false);
  const [titleRangeTime, setTitleRangeTime] = useState("This week");

  /**refs */
  const modalCalendarRef = useRef(null);

  /**component will mount*/
  useEffect(() => {
    getOverallPaymentMethod();
  }, []);

  const bindChartData = async () => {
    if (!overallPaymentMethodList) return [];
    // console.log(overallPaymentMethodList);
    const data = createChartObjectFromValues(
      overallPaymentMethodList,
      "method",
      "netPayment"
    );
    await setChartData(data);
  };

  useEffect(() => {
    bindChartData();
    bindStaffNameFilter();
  }, [overallPaymentMethodList]);

  const goStatistics = async (item) => {
    if (!item) return;
    // change to statistic tab
    await dispatch(actions.report.filterOPM(item.method));
    await onGoStatistics();
  };

  const renderCell = ({ key, row, column, item }) => {
    return null;
  };

  /**function */
  const changeViewMode = (mode) => {
    if (!mode) return;
    setViewMode(mode);
  };

  const viewModeList = () => changeViewMode(VIEW_MODE.LIST);
  const viewModeChart = () => changeViewMode(VIEW_MODE.CHART);

  // create filter name data
  const bindStaffNameFilter = () => {
    if (!overallPaymentMethodList) return [];

    let array = [];

    const arrMap = overallPaymentMethodList.map((paymentMethod) => ({
      value: paymentMethod.method,
      ...paymentMethod,
    }));
    array.push(...arrMap);

    setFilterNames(array);
    dispatch(actions.report.getOPMFilters(array));
  };

  const onChangeFilterName = async (text) => {
    await setFilterNameItem(text);
    const item = overallPaymentMethodList.find((x) => x.method === text);
    if (item) {
      dispatch(actions.report.filterOPM(item.method));
    }
  };

  // binding data list for name filter
  const filterDataTale = () => {
    return filterNameItem && filterNameItem !== FILTER_NAME_DEFAULT
      ? overallPaymentMethodList.filter(
          (item) => item.method === filterNameItem
        )
      : overallPaymentMethodList;
  };

  // create time range params
  const getFilterTimeParams = () => {
    if (!modalCalendarRef || !modalCalendarRef.current) {
      return `quickFilter=${getQuickFilterTimeRange("This Week")}`;
    }

    const {
      isCustomizeDate,
      startDate,
      endDate,
      quickFilter,
    } = modalCalendarRef.current.state;

    let url;

    if (isCustomizeDate) {
      url = `timeStart=${startDate}&timeEnd=${endDate}`;
    } else {
      const filter = quickFilter === false ? "This Week" : quickFilter;
      // console.log("quickFilter", quickFilter);
      url = `quickFilter=${getQuickFilterTimeRange(filter)}`;
    }

    return url;
  };

  // create title for time, to set default title print
  const getTimeTitle = () => {
    if (!modalCalendarRef || !modalCalendarRef.current) {
      return "This Week";
    }

    const {
      isCustomizeDate,
      startDate,
      endDate,
      quickFilter,
    } = modalCalendarRef.current.state;

    const filter = quickFilter === false ? "This Week" : quickFilter;
    let title = `${filter}`;

    if (startDate && endDate) {
      title = ` ${startDate} - ${endDate}`;
    }

    return title;
  };

  const getOverallPaymentMethod = async () => {
    await dispatch(
      actions.report.getOverallPaymentMethod(true, getFilterTimeParams())
    );
  };

  const changeTitleTimeRange = async (title) => {
    setVisibleCalendar(false);
    await setTitleRangeTime(title !== "Time Range" ? title : "All time");
    await getOverallPaymentMethod();
  };

  /**callback */
  const renderActionCell = ({ key, row, column, item }) => {
    return (
      <View style={styles.cellAction}>
        <TouchableOpacity onPress={() => goStatistics(item)}>
          <View style={styles.btnInCell}>
            <Image style={styles.imgDetail} source={IMAGE.Report_Detail} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  /**render */
  return (
    <View style={[styles.container, style]}>
      <HeaderTooltip
        rightComponent={
          <>
            {viewMode === VIEW_MODE.LIST && (
              <PopupButton
                text="Export"
                imageSrc={IMAGE.export}
                // onPress={showExportFile}
              />
            )}

            {pathFileReportStaff && (
              <PopupButton
                // onPress={() => handleTheDownloadedFile(pathFileReportStaff)}
                style={{ backgroundColor: "rgb(235,93,57)", marginLeft: 20 }}
                txtStyle={{ color: "#fff" }}
                imageStyle={{ tintColor: "#fff" }}
                text={localize("Manager downloaded file", language)}
                imageSrc={IMAGE.export}
              />
            )}

            <PopupButton
              imageSrc={IMAGE.Report_Chart}
              style={{ marginLeft: 20 }}
              imageStyle={{
                tintColor:
                  viewMode === VIEW_MODE.CHART ? ACTIVE_COLOR : INACTIVE_COLOR,
              }}
              onPress={viewModeChart}
            />

            <PopupButton
              imageSrc={IMAGE.Report_Grid}
              style={{ marginLeft: 10 }}
              imageStyle={{
                tintColor:
                  viewMode === VIEW_MODE.LIST ? ACTIVE_COLOR : INACTIVE_COLOR,
              }}
              onPress={viewModeList}
            />
          </>
        }
      >
        <PopupButton
          text={titleRangeTime}
          imageSrc={IMAGE.calendar}
          onPress={() => setVisibleCalendar(true)}
          style={{ marginRight: 20 }}
        />
        {viewMode === VIEW_MODE.LIST && (
          <View style={{ width: 160, height: 45 }}>
            <Dropdown
              rippleCentered={true}
              dropdownPosition={2}
              data={[{ value: FILTER_NAME_DEFAULT }, ...filterNames]}
              onChangeText={(text) => onChangeFilterName(text)}
              renderBase={() => (
                <PopupButton
                  text={filterNameItem ?? "All Method"}
                  imageSrc={IMAGE.Report_Dropdown_Arrow}
                />
              )}
            />
          </View>
        )}
      </HeaderTooltip>

      <View style={{ flex: 1 }}>
        {viewMode === VIEW_MODE.LIST ? (
          <TableList
            tableData={filterDataTale()}
            tableHead={{
              method: localize("Payment", language),
              transactions: localize("Transactions", language),
              grossPayment: localize("Gross Payments", language),
              refund: localize("Refunds", language),
              netPayment: localize("Net Payments", language),
            }}
            whiteKeys={[
              "method",
              "transactions",
              "grossPayment",
              "refund",
              "netPayment",
              "action",
            ]}
            primaryId="method"
            sumTotalKey="method"
            calcSumKeys={[
              "transactions",
              "grossPayment",
              "refund",
              "netPayment",
            ]}
            priceKeys={["grossPayment", "refund", "netPayment"]}
            tableCellWidth={{
              method: 200,
              transactions: 150,
              grossPayment: 200,
              refund: 160,
              netPayment: 200,
            }}
            renderCell={renderCell}
            // onCellPress={onCellPress}
            renderActionCell={renderActionCell}
          />
        ) : (
          <View style={{ flex: 1, flexDirection: "row", margin: 20 }}>
            <PaymentBarChart data={chartData} />
            <PaymentPieChart data={chartData} />
          </View>
        )}
      </View>

      <PopupCalendar
        type="report"
        ref={modalCalendarRef}
        visible={visibleCalendar}
        onRequestClose={() => setVisibleCalendar(false)}
        changeTitleTimeRange={changeTitleTimeRange}
        paddingLeft={scaleSzie(60)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  cellAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    flex: 1,
  },
  txtSalary: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#6A6A6A",
    marginRight: 5,
  },
  imgDetail: {
    tintColor: "#6A6A6A",
    width: 20,
    height: 20,
  },
  btnInCell: {
    height: "100%",
    width: 35,
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
