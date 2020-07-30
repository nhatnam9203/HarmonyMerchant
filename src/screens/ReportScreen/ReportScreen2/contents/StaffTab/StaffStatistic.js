import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "react-native-material-dropdown";

import IMAGE from "@resources";
import {
  HeaderTitle,
  HeaderTooltip,
  PopupButton,
  TableList,
} from "../../widget";
import { localize } from "@utils";

const HEAD_FONT_SIZE = 17;
const TABLE_ROW_HEIGHT = 50;

export default function StaffStatistic({
  style,
  titleRangeTime,
  showCalendar,
  showExportFile,
  handleTheDownloadedFile,
  onChangeFilterStaff,
  dataStaffSalaryFilter,
  filterStaffItem,
}) {
  /**redux store*/
  const dispatch = useDispatch();
  const listStaffsCalendar = useSelector(
    (state) => state.staff.listStaffsCalendar
  );
  const language = useSelector((state) => state.dataLocal.language);
  const pathFileReportStaff = useSelector(
    (state) => state.staff.pathFileReportStaffStatistic
  );

  /**state */
  const [sumObjects, setSumObjects] = useState({});

  /**process */
  const onCellPress = ({ key, row, column, item }) => {};
  const onChangeSumObject = (sumObj) => {
    setSumObjects(sumObj);
  };

  /**render */
  const renderCell = ({ key, row, column, item }) => {
    return null;
  };

  const renderFooter = () => {
    return (
      <View style={styles.tableFooter}>
        <View style={styles.cell} key="total-key">
          {<Text style={styles.txtCalcSum}>{"Total"}</Text>}
        </View>

        {sumObjects &&
          Object.keys(sumObjects).map((key, index) => {
            return (
              <View style={styles.cell} key={key}>
                <Text style={styles.txtCalcSum}>{"$ " + sumObjects[key]}</Text>
              </View>
            );
          })}
      </View>
    );
  };

  return (
    <View style={style}>
      <HeaderTitle title={localize("Staff Statistics", language)} />
      <HeaderTooltip
        rightComponent={
          <>
            <PopupButton
              text="Export"
              imageSrc={IMAGE.Report_Export}
              onPress={showExportFile}
            />
            {pathFileReportStaff && (
              <PopupButton
                onPress={() => handleTheDownloadedFile(pathFileReportStaff)}
                style={{ backgroundColor: "rgb(235,93,57)", marginLeft: 20 }}
                txtStyle={{ color: "#fff" }}
                imageStyle={{ tintColor: "#fff" }}
                text={localize("Manager downloaded file", language)}
                imageSrc={IMAGE.Report_Export}
              />
            )}
          </>
        }
      >
        <PopupButton
          text={titleRangeTime}
          onPress={showCalendar}
          style={{ marginRight: 20 }}
        />
        <View style={{ width: 160, height: 45 }}>
          <Dropdown
            data={dataStaffSalaryFilter}
            onChangeText={(text) => onChangeFilterStaff(text)}
            renderBase={() => (
              <PopupButton
                text={filterStaffItem ?? "All Staff"}
                imageSrc={IMAGE.Report_Dropdown_Arrow}
              />
            )}
          />
        </View>
      </HeaderTooltip>

      <View style={{ flex: 1 }}>
        <TableList
          showSumOnBottom={true}
          tableData={listStaffsCalendar}
          tableHead={[
            localize("Date", language),
            localize("Service sales", language),
            localize("Service split", language),
            localize("Product sales", language),
            localize("Product split", language),
            localize("Tip amount", language),
            localize("Salary", language),
          ]}
          whiteKeys={[
            "date",
            "dateString",
            "serviceSales",
            "serviceSplit",
            "productSales",
            "productSplit",
            "tipAmount",
            "salary",
          ]}
          primaryId="date"
          calcSumKeys={[
            "serviceSales",
            "serviceSplit",
            "productSales",
            "productSplit",
            "tipAmount",
            "salary",
          ]}
          renderCell={renderCell}
          onCellPress={onCellPress}
          onChangeSumObjects={onChangeSumObject}
          renderFooter={() => (
            <View style={{ height: 50, backgroundColor: "transparent" }} />
          )}
        />
        {renderFooter()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tableContent: {
    backgroundColor: "red",
  },
  txtCalcSum: {
    fontSize: HEAD_FONT_SIZE,
    color: "#404040",
    fontWeight: "600",
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  tableFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "#E5E5E5",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
