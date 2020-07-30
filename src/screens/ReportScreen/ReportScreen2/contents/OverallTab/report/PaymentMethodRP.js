import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { Dropdown } from "react-native-material-dropdown";
import IMAGE from "@resources";
import { localize } from "@utils";
import actions from "@actions";

import { HeaderTooltip, PopupButton, TableList } from "../../../widget";
import PaymentBarChart from "./PaymentBarChart";
import PaymentPieChart from "./PaymentPieChart";

const VIEW_MODE = {
  LIST: "LIST",
  CHART: "CHART",
};

const ACTIVE_COLOR = "#0764B0";
const INACTIVE_COLOR = "#6A6A6A";

/**pick value of an attribute in object */
const pickValuesFromKey = (array, pickKey) => {
  const filterArray = array.map((obj) => {
    const filterObject = Object.fromEntries(
      Object.entries(obj).filter(([key]) => pickKey === key)
    );
    return Object.values(filterObject)[0];
  });

  return filterArray;
};

/**create new object from two value for two key of object */
const createChartObjectFromValues = (array, key, keyValue) => {
  let response = [];
  array.forEach((obj) => {
    let mapObj = Object.create({});
    mapObj[obj[key]] = obj[keyValue];
    response.push(mapObj);
  });

  return response;
};

export default function PaymentMethodRp({
  style,
  showCalendar,
  titleRangeTime,
}) {
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

  /**component mount*/

  const getOverallPaymentMethod = async () => {
    await dispatch(actions.report.getOverallPaymentMethod());
  };

  useEffect(() => {
    getOverallPaymentMethod();
  }, []);

  const bindChartData = async () => {
    if (!overallPaymentMethodList) return [];
    console.log(overallPaymentMethodList);
    const data = createChartObjectFromValues(
      overallPaymentMethodList,
      "method",
      "netPayment"
    );
    await setChartData(data);
  };

  useEffect(() => {
    bindChartData();
  }, [overallPaymentMethodList]);

  /**callback */
  const renderCell = ({ key, row, column, item }) => {
    if (key === "netPayment") {
      return (
        <View style={styles.cellSalary}>
          <Text style={styles.txtSalary}>{item[key] + "$"}</Text>

          <View style={styles.imgContent}>
            <TouchableOpacity onPress={() => goStaffStatistics(item)}>
              <View style={styles.btnInCell}>
                <Image style={styles.imgDetail} source={IMAGE.Report_Detail} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  const onCellPress = ({ key, row, column, item }) => {
    // if (key === "salary") {
    //   dispatch(actions.staff.getListStaffCalendar(item.staffId));
    //   onGoStatistics();
    // }
    // showPopupStaffInvoice(item);
  };
  /**func */
  const changeViewMode = (mode) => {
    if (!mode) return;
    setViewMode(mode);
  };

  const viewModeList = () => changeViewMode(VIEW_MODE.LIST);
  const viewModeChart = () => changeViewMode(VIEW_MODE.CHART);

  return (
    <View style={[styles.container, style]}>
      <HeaderTooltip
        rightComponent={
          <>
            {viewMode === VIEW_MODE.LIST && (
              <PopupButton
                text="Export"
                imageSrc={IMAGE.Report_Export}
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
                imageSrc={IMAGE.Report_Export}
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
          onPress={showCalendar}
          style={{ marginRight: 20 }}
        />
        {viewMode === VIEW_MODE.LIST && (
          <View style={{ width: 160, height: 45 }}>
            <Dropdown
              // data={dataStaffSalaryFilter}
              // onChangeText={(text) => onChangeFilterStaff(text)}
              renderBase={() => (
                <PopupButton
                  text={"All Method"}
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
            tableData={overallPaymentMethodList}
            tableHead={[
              localize("Payment", language),
              localize("Transactions", language),
              localize("Gross payments", language),
              localize("Refunds", language),
              localize("Net payments", language),
            ]}
            whiteKeys={[
              "method",
              "transactions",
              "grossPayment",
              "refund",
              "netPayment",
            ]}
            primaryId=""
            calcSumKeys={[
              "transactions",
              "grossPayment",
              "refund",
              "netPayment",
            ]}
            // tableCellWidth={{ salary: 195, Salary: 195, name: 200, Name: 200 }}
            renderCell={renderCell}
            onCellPress={onCellPress}
          />
        ) : (
          <View style={{ flex: 1, flexDirection: "row", margin: 20 }}>
            <PaymentBarChart data={chartData} />
            <PaymentPieChart data={chartData} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  cellSalary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flex: 1,
  },
  txtSalary: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#6A6A6A",
    marginRight: 5,
  },
  imgContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 0,
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
