import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ReportStatisticLayout } from "../../widget";
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
        tipAmount: localize("Tip Amount", language),
        salary: localize("Salary", language),
      },
      whiteKeys: [
        "dateString",
        "serviceSales",
        "serviceSplit",
        "productSales",
        "productSplit",
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
        "tipAmount",
        "salary",
      ],
      priceKeys: [
        "serviceSales",
        "serviceSplit",
        "productSales",
        "productSplit",
        "tipAmount",
        "salary",
      ],
      tableCellWidth: { appointmentId: 80 },
    });
  }, [filterId, listStaffsSalary]);

  /**render */

  return (
    <ReportStatisticLayout {...props} {...table} title={"Staff Statistics"} />
  );
}
