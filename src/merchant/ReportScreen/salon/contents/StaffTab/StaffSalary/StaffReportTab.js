import IMAGE from "@resources";
import { localize } from "@utils";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import {
  PopupStaffInvoicePrint,
  ReportTabLayout,
  TableListExtended,
} from "../../../../widget";

const FILTER_NAME_DEFAULT = "All Staff";

export default function StaffReportTab({
  style,
  onGoStatistics,
  titleRangeTime,
  showCalendar,
  onChangeFilterNames,
  onChangeFilterId,
  showExportFile,
  pathFileExport,
  handleTheDownloadedFile,
  onRefresh,
  isRefreshing,
  onLoadMore,
  endLoadMore,
}) {
  const language = useSelector((state) => state.dataLocal.language);

  const listStaffsSalary = useSelector((state) => state.staff.listStaffsSalary);

  /**state */
  const [filterNameItem, setFilterNameItem] = useState(FILTER_NAME_DEFAULT);
  const [filterNames, setFilterNames] = useState([]);
  const [showStaffInvoicePrint, setShowStaffInvoicePrint] = useState(false);
  const [currentStaff, setCurrentStaff] = useState({});

  /**function */

  // create filter name data
  const bindFilterName = () => {
    if (!listStaffsSalary) return [];

    let array = [];

    const arrMap = listStaffsSalary.map((item) => ({
      value: item.name,
      ...item,
    }));
    array.push(...arrMap);

    setFilterNames(array);

    if (onChangeFilterNames) {
      onChangeFilterNames(array);
    }
  };

  // binding data list for name filter
  const filterDataTable = () => {
    return filterNameItem && filterNameItem !== FILTER_NAME_DEFAULT
      ? listStaffsSalary.filter((item) => item.name === filterNameItem)
      : listStaffsSalary;
  };

  // callback
  const onChangeFilterName = (filterName) => {
    setFilterNameItem(filterName);
    if (onChangeFilterId) {
      onChangeFilterId(filterName);
    }
  };

  const goStatistics = async (item) => {
    if (!item) return;
    // change to statistic tab

    await onGoStatistics(item);
  };

  const cancelStaffInvoicePrint = async () => {
    setShowStaffInvoicePrint(false);
    setCurrentStaff({});
  };

  const showPopupStaffInvoice = async (item) => {
    await setCurrentStaff(item);
    setShowStaffInvoicePrint(true);
  };

  const onRowPress = ({ item }) => {
    showPopupStaffInvoice(item);
  };

  /**effect */
  useEffect(() => {
    bindFilterName();
  }, [listStaffsSalary]);

  /**render */
  //callback render action cell
  const renderActionCell = ({ item }) => {
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

  const renderCell = () => {
    return null;
  };

  return (
    <View style={style}>
      <ReportTabLayout
        style={styles.container}
        onChangeFilterName={onChangeFilterName}
        isShowExportButton={true}
        isShowFilterButton={true}
        filterNames={filterNames}
        filterNameItem={filterNameItem}
        showCalendar={showCalendar}
        titleRangeTime={titleRangeTime}
        showExportFile={showExportFile}
        pathFileExport={pathFileExport}
        handleTheDownloadedFile={handleTheDownloadedFile}
        filterNameDefault={FILTER_NAME_DEFAULT}
        rightTooltip={<></>}
        title={localize("Staff Salary", language)}
      >
        <TableListExtended
          tableData={filterDataTable()}
          tableHead={{
            name: localize("Name ", language),
            serviceSales: localize("Service Sales", language),
            surcharge: localize("Surcharge", language),
            netServiceSales: localize("Net Service Sale", language),
            serviceSplit: localize("Service Split", language),
            // productSales: localize("Product Sales", language),
            // productSplit: localize("Product Split", language),
            // workingHour: localize("Working Hour", language),
            // salaryWage: localize("Salary Wage", language),
            tip: localize("Tip Amount", language),
            discountByStaff: localize("Discount By Staff", language),
            refundAmount: localize("Refund amount", language),
            salary: localize("Salary", language),
          }}
          whiteKeys={[
            "name",
            "serviceSales",
            "surcharge",
            "netServiceSales",
            "serviceSplit",
            // "productSales",
            // "productSplit",
            // "workingHour",
            // "salaryWage",
            "tip",
            "discountByStaff",
            "refundAmount",
            "salary",
            "action",
          ]}
          primaryId="staffId"
          sumTotalKey="name"
          calcSumKeys={[
            "serviceSales",
            "surcharge",
            "netServiceSales",
            "serviceSplit",
            // "productSales",
            // "productSplit",
            // "workingHour",
            // "salaryWage",
            "tip",
            "discountByStaff",
            "refundAmount",
            "salary",
          ]}
          priceKeys={[
            "serviceSales",
            "surcharge",
            "netServiceSales",
            "serviceSplit",
            // "productSales",
            // "productSplit",
            // "workingHour",
            // "salaryWage",
            "tip",
            "discountByStaff",
            "refundAmount",
            "salary",
          ]}
          unitKeys={{ workingHour: "hrs" }}
          sortDefault="NONE"
          sortKey="name"
          tableCellWidth={{}}
          renderCell={renderCell}
          renderActionCell={renderActionCell}
          onRowPress={onRowPress}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          onLoadMore={onLoadMore}
          endLoadMore={endLoadMore}
        />
      </ReportTabLayout>

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
  container: { flex: 1 },
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
  chartDetail: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
  },
  chartDetailItem: {
    flexDirection: "row",
    margin: 10,
    paddingLeft: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
