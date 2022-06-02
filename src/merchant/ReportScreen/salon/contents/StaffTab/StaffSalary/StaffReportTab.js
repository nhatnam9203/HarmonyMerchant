import IMAGE from "@resources";
import { Pagination, PopupStaffSalaryReceipt } from "@shared/components";
import { layouts } from "@shared/themes";
import { localize } from "@utils";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  const popupStaffSalaryRef = React.useRef(null);

  const language = useSelector((state) => state.dataLocal.language);
  const {
    listStaffsSalary,
    listStaffsSalaryCount,
    listStaffsSalaryNextPage,
    listStaffsPages,
  } = useSelector((state) => state.staff);

  /**state */
  const [filterNameItem, setFilterNameItem] = useState(FILTER_NAME_DEFAULT);
  const [filterNames, setFilterNames] = useState([]);
  const [showStaffInvoicePrint, setShowStaffInvoicePrint] = useState(false);
  const [currentStaff, setCurrentStaff] = useState({});

  const [pagination, setPagination] = React.useState({
    pages: 0,
    count: 0,
  });
  const [page, setPage] = React.useState(1);

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
  const filterDataTable = React.useMemo(() => {
    return filterNameItem && filterNameItem !== FILTER_NAME_DEFAULT
      ? listStaffsSalary.filter((item) => item.name === filterNameItem)
      : listStaffsSalary;
  }, [listStaffsSalary]);

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

  React.useEffect(() => {
    setPagination({
      pages: listStaffsPages,
      count: listStaffsSalaryCount,
    });
  }, [listStaffsSalaryCount, listStaffsPages]);

  React.useEffect(() => {
    console.log(page);
    onLoadMore(page);
  }, [page]);

  const showPopupReceipts = () => {
    popupStaffSalaryRef.current?.show();
  };

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

  const buttonPrintAllStaffSalary = () => {
    return (
      <TouchableOpacity
        style={{
          width: scaleWidth(120),
          height: scaleHeight(40),
          justifyContent: "center",
          alignItems: "center",
          borderColor: "#CCCCCC",
          borderWidth: 1,
          flexDirection: "row",
          borderRadius: scaleWidth(3),
        }}
        onPress={showPopupReceipts}
      >
        <Text style={layouts.fontLabel}>{"Print all"}</Text>
        <View style={{ width: scaleWidth(10) }} />
        <Image
          source={IMAGE.print_btn}
          style={{
            width: scaleWidth(24),
            height: scaleHeight(24),
            tintColor: "#6A6A6A",
          }}
        />
      </TouchableOpacity>
    );
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
        leftTooltip={
          <>
            <Pagination
              onChangePage={setPage}
              onChangeItemsPerPage={() => {}}
              visibleItemsPerPage={false}
              defaultPage={1}
              {...pagination}
              length={filterDataTable.length}
            />
          </>
        }
        rightTooltip={
          <>
            <View style={layouts.marginHorizontal} />
            {buttonPrintAllStaffSalary()}
          </>
        }
        title={localize("Staff Salary", language)}
      >
        <TableListExtended
          tableData={filterDataTable}
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
          isRefreshing={false}
          isLoadMore={false}
          // onLoadMore={onLoadMore}
          // endLoadMore={endLoadMore}
        />
      </ReportTabLayout>

      <PopupStaffInvoicePrint
        // ref={this.invoicePrintRef}
        visiblePrintInvoice={showStaffInvoicePrint}
        onRequestClose={cancelStaffInvoicePrint}
        staff={currentStaff}
      />

      <PopupStaffSalaryReceipt
        ref={popupStaffSalaryRef}
        staffs={listStaffsSalary}
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
