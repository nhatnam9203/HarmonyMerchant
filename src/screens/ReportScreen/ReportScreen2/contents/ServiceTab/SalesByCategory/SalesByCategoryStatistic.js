import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ReportStatisticLayout } from "../../../widget";
import { localize } from "@utils";

export default function SalesByCategoryStatistic(props, ref) {
  const { filterId } = props;
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const serviceSaleByCategoryList = useSelector(
    (state) => state.report.serviceSaleByCategoryList
  );

  /**state */
  const [table, setTable] = useState({});

  /**process */

  /**useEffect */
  useEffect(() => {
    const item = serviceSaleByCategoryList.find(
      (item) => item.categoryName === filterId
    );

    setTable({
      tableData: item?.details || [],
      tableHead: {
        dateString: localize("Date", language),
        serviceCount: localize("No. of Service", language),
        quantity: localize("Sale Qty", language),
        totalDuration: localize("Total Durations", language),
        totalSales: localize("Total Sales", language),
      },
      whiteKeys: [
        "dateString",
        "serviceCount",
        "quantity",
        "totalDuration",
        "totalSales",
      ],
      primaryId: "date",
      calcSumKeys: ["serviceCount", "quantity", "totalDuration", "totalSales"],
      sumTotalKey: "dateString",
      priceKeys: ["totalDuration", "totalSales"],
      sortKey: "dateString",
      unitKeys: { totalDuration: "hrs" },
      formatKeys: { totalDuration: "mins" },
      tableCellWidth: { dateString: 180 },
    });
  }, [filterId, serviceSaleByCategoryList]);

  /**render */

  return (
    <ReportStatisticLayout
      {...props}
      {...table}
      title={"Category statistics"}
    />
  );
}
