import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { Dropdown } from "react-native-material-dropdown";
import IMAGE from "@resources";
import { localize } from "@utils";

import { HeaderTooltip, PopupButton, TableList } from "../../../widget";
import PaymentBarChart from "./PaymentBarChart";
import PaymentPieChart from "./PaymentPieChart";

const VIEW_MODE = {
  LIST: "LIST",
  CHART: "CHART",
};

const ACTIVE_COLOR = "#0764B0";
const INACTIVE_COLOR = "#6A6A6A";

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

  /**state */
  const [viewMode, setViewMode] = useState(VIEW_MODE.LIST);

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
            <PopupButton
              text="Export"
              imageSrc={IMAGE.Report_Export}
              // onPress={showExportFile}
            />

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
      </HeaderTooltip>

      <View style={{ flex: 1 }}>
        {viewMode === VIEW_MODE.LIST ? (
          <TableList
            tableData={[]}
            tableHead={[
              localize("Name", language),
              localize("Service sales", language),
              localize("Service split", language),
              localize("Product sales", language),
              localize("Product split", language),
              localize("Tip amount", language),
              localize("Salary", language),
            ]}
            whiteKeys={[
              "staffId",
              "name",
              "serviceSales",
              "serviceSplit",
              "productSales",
              "productSplit",
              "tip",
              "salary",
            ]}
            primaryId="staffId"
            calcSumKeys={[
              "serviceSales",
              "serviceSplit",
              "productSales",
              "productSplit",
              "tip",
              "salary",
            ]}
            // tableCellWidth={{ salary: 195, Salary: 195, name: 200, Name: 200 }}
            // renderCell={renderCell}
            // onCellPress={onCellPress}
          />
        ) : (
          <View style={{ flex: 1, flexDirection: "row" }}>
            <PaymentBarChart />
            <PaymentPieChart />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
