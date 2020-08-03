import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
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
  const onRowPress = ({ key, row, item }) => {
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
  const renderActionCell = ({ key, row, column, item, isPrice }) => {
    return (
      <View style={styles.cellAction}>
        <TouchableOpacity
          onPress={async () => await showPopupStaffInvoice(item)}
        >
          <View style={styles.btnInCell}>
            <Image style={styles.imgDetail} source={IMAGE.Report_Print} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => await goStaffStatistics(item)}>
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

  return (
    <View style={style}>
      <HeaderTitle title={localize("Staff Salary", language)} />
      <HeaderTooltip
        rightComponent={
          <>
            {/**export button */}
            <PopupButton
              text="Export"
              imageSrc={IMAGE.export}
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
                imageSrc={IMAGE.export}
              />
            )}
          </>
        }
      >
        {/**calendar button */}
        <PopupButton
          text={titleRangeTime}
          imageSrc={IMAGE.calendar}
          onPress={showCalendar}
          style={{ marginRight: 20 }}
        />

        {/**name filter button */}
        <View style={{ width: 160, height: 45 }}>
          <Dropdown
            rippleCentered={true}
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
          tableHead={{
            name: localize("Name", language),
            serviceSales: localize("Service Sales", language),
            serviceSplit: localize("Service Split", language),
            productSales: localize("Product Sales", language),
            productSplit: localize("Product Split", language),
            tip: localize("Tip Amount", language),
            salary: localize("Salary", language),
          }}
          whiteKeys={[
            "name",
            "serviceSales",
            "serviceSplit",
            "productSales",
            "productSplit",
            "tip",
            "salary",
            "action",
          ]}
          primaryId="staffId"
          sumTotalKey="name"
          calcSumKeys={[
            "serviceSales",
            "serviceSplit",
            "productSales",
            "productSplit",
            "tip",
            "salary",
          ]}
          priceKeys={[
            "serviceSales",
            "serviceSplit",
            "productSales",
            "productSplit",
            "tip",
            "salary",
          ]}
          tableCellWidth={{ name: 180 }}
          renderCell={renderCell}
          onRowPress={onRowPress}
          renderActionCell={renderActionCell}
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
  cellAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    width: 40,
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
