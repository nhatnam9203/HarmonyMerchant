import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { Dropdown } from "react-native-material-dropdown";

import IMAGE from "@resources";
import { Text } from "@components";
import { localize } from "@utils";
import actions from "@actions";

import {
  HeaderTitle,
  HeaderTooltip,
  PopupButton,
  TableList,
} from "../../widget";
import { PopupStaffInvoicePrint } from "../../../widget";

export default function StaffSalaryTab({
  style,
  onGoStatistics,
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
  const pathFileReportStaff = useSelector(
    (state) => state.staff.pathFileReportStaffSalary
  );

  const language = useSelector((state) => state.dataLocal.language);

  /**state */
  const [showStaffInvoicePrint, setShowStaffInvoicePrint] = useState(false);
  const [currentStaff, setCurrentStaff] = useState({});
  const listStaffsSalary = useSelector((state) => state.staff.listStaffsSalary);

  /**process */
  const onCellPress = ({ key, row, column, item }) => {
    // if (key === "salary") {
    //   dispatch(actions.staff.getListStaffCalendar(item.staffId));
    //   onGoStatistics();
    // }
    showPopupStaffInvoice(item);
  };

  const goStaffStatistics = async (item) => {
    if (!item) return;
    // bind redux state
    await dispatch(actions.staff.getListStaffCalendar(item.staffId));

    await onChangeFilterStaff(item.name);
    // change to statistic tab
    onGoStatistics();
  };

  const cancelStaffInvoicePrint = async () => {
    setShowStaffInvoicePrint(false);
    setCurrentStaff({});
  };

  const showPopupStaffInvoice = async (item) => {
    await setCurrentStaff(item);
    setShowStaffInvoicePrint(true);
  };

  // binding data list for name filter
  const filterDataTale = () => {
    return filterStaffItem && filterStaffItem !== "All Staff"
      ? listStaffsSalary.filter((staff) => staff.name === filterStaffItem)
      : listStaffsSalary;
  };

  /**render */
  const renderCell = ({ key, row, column, item }) => {
    if (key === "salary") {
      return (
        <View style={styles.cellSalary}>
          <Text style={styles.txtSalary}>{"$ " + item[key]}</Text>

          <View style={styles.imgContent}>
            <TouchableOpacity
              onPress={async () => await showPopupStaffInvoice(item)}
            >
              <View style={styles.btnInCell}>
                <Image style={styles.imgDetail} source={IMAGE.Report_Print} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => await goStaffStatistics(item)}
            >
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

  return (
    <View style={style}>
      <HeaderTitle title={localize("Staff Salary", language)} />
      <HeaderTooltip
        rightComponent={
          <>
            {/**export button */}
            <PopupButton
              text="Export"
              imageSrc={IMAGE.Report_Export}
              onPress={showExportFile}
            />
            {/**downloaded file handle button */}
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
        {/**calendar button */}
        <PopupButton
          text={titleRangeTime}
          onPress={showCalendar}
          style={{ marginRight: 20 }}
        />

        {/**name filter button */}
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
      {/**table list */}
      <View style={{ flex: 1 }}>
        <TableList
          tableData={filterDataTale()}
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
          tableCellWidth={{ salary: 180, Salary: 180, name: 180, Name: 180 }}
          renderCell={renderCell}
          onCellPress={onCellPress}
        />
      </View>

      <PopupStaffInvoicePrint
        // ref={this.invoicePrintRef}
        visiblePrintInvoice={showStaffInvoicePrint}
        onRequestClose={cancelStaffInvoicePrint}
        staff={currentStaff}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
