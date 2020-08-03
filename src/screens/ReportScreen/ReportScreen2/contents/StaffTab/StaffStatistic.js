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
import { localize, roundFloatNumber } from "@utils";

const HEAD_FONT_SIZE = 17;


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

  const renderFooter = ({
    whiteKeys,
    getCellWidth,
    isPriceCell,
    sumObject,
    sumTotalKey,
    calcSumKeys,
  }) => {
    return (
      <TableList.Row style={styles.tableFooter}>
        {whiteKeys.map((key, index) => (
          <TableList.Cell
            key={"total-key" + key}
            style={{
              width: getCellWidth(index, key),
              ...(isPriceCell(key) && {
                alignItems: "flex-end",
              }),
            }}
          >
            {key === sumTotalKey && (
              <Text style={styles.txtCalcSum}>{"Total"}</Text>
            )}

            {calcSumKeys.indexOf(key) > -1 && (
              <Text style={styles.txtCalcSum}>
                {isPriceCell(key)
                  ? "$ " + roundFloatNumber(sumObject[key])
                  : sumObject[key] ?? ""}
              </Text>
            )}
          </TableList.Cell>
        ))}
      </TableList.Row>
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
              imageSrc={IMAGE.export}
              onPress={showExportFile}
            />
            {pathFileReportStaff && (
              <PopupButton
                onPress={() => handleTheDownloadedFile(pathFileReportStaff)}
                style={{ backgroundColor: "rgb(235,93,57)", marginLeft: 20 }}
                txtStyle={{ color: "#fff" }}
                imageStyle={{ tintColor: "#fff" }}
                text={localize("Manager downloaded file", language)}
                imageSrc={IMAGE.export}
              />
            )}
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
          tableHead={{
            dateString: localize("Date", language),
            serviceSales: localize("Service Sales", language),
            serviceSplit: localize("Service Split", language),
            productSales: localize("Product Sales", language),
            productSplit: localize("Product Split", language),
            tipAmount: localize("Tip Amount", language),
            salary: localize("Salary", language),
          }}
          whiteKeys={[
            "dateString",
            "serviceSales",
            "serviceSplit",
            "productSales",
            "productSplit",
            "tipAmount",
            "salary",
          ]}
          primaryId="date"
          sumTotalKey="dateString"
          calcSumKeys={[
            "serviceSales",
            "serviceSplit",
            "productSales",
            "productSplit",
            "tipAmount",
            "salary",
          ]}
          priceKeys={[
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
          renderFooter={renderFooter}
        />
        {/* {renderFooter()} */}
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
  cell: {},
  tableFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "#E5E5E5",
    flexDirection: "row",
  },
});
