import { localize } from "@utils";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReportStatisticLayout, TableList } from "../../../../widget";

export default function StaffDurationStatistic(props, ref) {
  const { filterId, onRefresh, isRefreshing } = props;
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const listStaffsSalary = useSelector(
    (state) => state.report.staffServiceDurationDetailList
  );

  /**state */
  const [table, setTable] = useState({});

  /**process */

  /**useEffect */
  useEffect(() => {
    setTable({
      tableData: listStaffsSalary || [],
      tableHead: {
        date: localize("Date", language),
        service: localize("Service", language),
        duration: localize("Service duration", language),
        toTime: localize("Start time", language),
        fromTime: localize("End time", language),
        differenceDurationMinute: localize("Difference duration", language),
      },
      whiteKeys: [
        "date",
        "service",
        "duration",
        "toTime",
        "fromTime",
        "differenceDurationMinute",
      ],
      primaryId: "id",
      sumTotalKey: "date",
      calcSumKeys: ["differenceDurationMinute"],
      formatKeys: { differenceDurationMinute: "hhmm" },
      priceKeys: [
        // "serviceSales",
        // "surcharge",
        // "netServiceSales",
        // "serviceSplit",
        // "productSales",
        // "productSplit",
        // "workingHour",
        // "salaryWage",
        // "tipAmount",
        // "discountByStaff",
        // "salary",
      ],
      sortKey: "date",
      unitKeys: { workingHour: "hrs" },
      tableCellWidth: {
        date: scaleWidth(200),
        service: scaleWidth(200),
        logoutTime: 140,
      },
    });
  }, [filterId, listStaffsSalary]);

  useEffect(() => {}, [filterId]);

  const onCellPress = ({ key, row, column, item }) => {};

  const renderCell = ({ key, row, column, item }) => {
    return null;
  };

  /**render */

  const renderTable = () => {
    return (
      <TableList
        {...table}
        renderCell={renderCell}
        onCellPress={onCellPress}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />
    );
  };

  return (
    <ReportStatisticLayout
      {...props}
      {...table}
      title={"Staff Service Duration Statistics"}
      renderTable={renderTable}
    />
  );
}
