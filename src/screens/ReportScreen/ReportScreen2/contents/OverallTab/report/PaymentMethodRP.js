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

const formatServerNumber = (numStr) => {
  return numStr ? numStr.split(",").join("") : numStr;
};

/**create new object from two value for two key of object */
const createChartObjectFromValues = (array, key, keyValue) => {
  let response = [];
  array.forEach((obj) => {
    let mapObj = Object.create({});
    mapObj[obj[key]] = formatServerNumber(obj[keyValue]);
    response.push(mapObj);
  });

  return response;
};

export default function PaymentMethodRp({
  style,
  showCalendar,
  titleRangeTime,
  urlRangeTime,
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
    await dispatch(actions.report.getOverallPaymentMethod(true, urlRangeTime));
  };

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

  useEffect(() => {
    getOverallPaymentMethod();
  }, [urlRangeTime]);

  /**callback */
  const renderActionCell = ({ key, row, column, item }) => {
    return (
      <View style={styles.cellAction}>
        <TouchableOpacity onPress={() => goStaffStatistics(item)}>
          <View style={styles.btnInCell}>
            <Image style={styles.imgDetail} source={IMAGE.Report_Detail} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCell = ({ key, row, column, item }) => {
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
            onCellPress={onCellPress}
            renderActionCell={renderActionCell}
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
