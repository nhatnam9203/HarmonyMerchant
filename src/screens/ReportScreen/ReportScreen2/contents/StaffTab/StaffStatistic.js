import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ReportStatisticLayout, TableListExtended } from "../../widget";
import { localize } from "@utils";

export default function StaffStatistic(props, ref) {
  const { filterId } = props;
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const listStaffsSalary = useSelector((state) => state.staff.listStaffsSalary);

  /**state */
  const [table, setTable] = useState({});

  /**process */

  /**useEffect */
  useEffect(() => {
    const item = listStaffsSalary.find((item) => item.name === filterId);

    setTable({
      tableData: item?.salariesByDate || [],
      tableHead: {
        dateString: localize("Date", language),
        serviceSales: localize("Service Sales", language),
        serviceSplit: localize("Service Split", language),
        productSales: localize("Product Sales", language),
        productSplit: localize("Product Split", language),
        workingHour: localize("Working Hour", language),
        salaryWage: localize("Salary Wage", language),
        tipAmount: localize("Tip Amount", language),
        salary: localize("Salary", language),
      },
      whiteKeys: [
        "dateString",
        "serviceSales",
        "serviceSplit",
        "productSales",
        "productSplit",
        "workingHour",
        "salaryWage",
        "tipAmount",
        "salary",
      ],
      primaryId: "date",
      sumTotalKey: "dateString",
      calcSumKeys: [
        "serviceSales",
        "serviceSplit",
        "productSales",
        "productSplit",
        "workingHour",
        "salaryWage",
        "tipAmount",
        "salary",
      ],
      priceKeys: [
        "serviceSales",
        "serviceSplit",
        "productSales",
        "productSplit",
        "workingHour",
        "salaryWage",
        "tipAmount",
        "salary",
      ],
      sortKey: "dateString",
      tableCellWidth: { appointmentId: 80 },
    });
  }, [filterId, listStaffsSalary]);

  const onCellPress = ({ key, row, column, item }) => {};

  const renderCell = ({ key, row, column, item }) => {
    return null;
  };

  /**render */

  const renderTable = () => {
    return (
      <TableListExtended
        {...table}
        renderCell={renderCell}
        onCellPress={onCellPress}
      />
    );
  };

  return (
    <ReportStatisticLayout
      {...props}
      {...table}
      title={"Staff Statistics"}
      renderTable={renderTable}
    />
  );
}
