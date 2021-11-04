import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ReportStatisticLayout } from "../../../../widget";
import { localize } from "@utils";

export default function SalesByServiceStatistic(props, ref) {
  const { filterId } = props;
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const serviceSaleByServiceList = useSelector(
    (state) => state.report.serviceSaleByServiceList
  );

  /**state */
  const [table, setTable] = useState({});

  /**process */

  /**useEffect */
  useEffect(() => {
    const item = serviceSaleByServiceList.find(
      (item) => item.name === filterId
    );

    setTable({
      tableData: item?.details || [],
      tableHead: {
        dateString: localize("Date", language),
        quantity: localize("Sale Qty", language),
        totalDuration: localize("Total Durations", language),
        avgPrice: localize("Av. Price", language),
        totalSales: localize("Total Sales", language),
      },
      whiteKeys: [
        "dateString",
        "quantity",
        "totalDuration",
        "avgPrice",
        "totalSales",
      ],
      primaryId: "date",
      calcSumKeys: ["quantity", "totalDuration", "totalSales"],
      sumTotalKey: "dateString",
      priceKeys: ["totalDuration", "avgPrice", "totalSales"],
      sortKeys: "dateString",
      unitKeys: { totalDuration: "hrs" },
      // formatKeys: { totalDuration: "mins" },
      tableCellWidth: { dateString: 180, totalSales: 200 },
    });
  }, [filterId, serviceSaleByServiceList]);

  /**render */

  return (
    <ReportStatisticLayout {...props} {...table} title={"Service statistics"} />
  );
}
