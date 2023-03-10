import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ReportStatisticLayout } from "../../../widget";
import { localize } from "@utils";



export default function MarketingEfficiencyStatistic(props, ref) {
  const { filterId } = props;
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const marketingEfficiencyList = useSelector(
    (state) => state.report.marketingEfficiencyList
  );
  /**state */
  const [table, setTable] = useState({});

  /**process */

  /**useEffect */
  useEffect(() => {
    const item = marketingEfficiencyList.find((item) => item.name === filterId);

    setTable({
      tableData: item?.statistics,
      tableHead: {
        dateString: localize("Date", language),
        revenue: localize("Revenue", language),
        discount: localize("Discount", language),
      },
      whiteKeys: ["dateString", "revenue", "discount"],
      primaryId: "dateString",
      calcSumKeys: ["revenue", "discount"],
      sumTotalKey: "dateString",
      priceKeys: ["revenue", "discount"],
      tableCellWidth: { date: 180 },
    });
  }, [filterId, marketingEfficiencyList]);

  /**render */

  return (
    <ReportStatisticLayout
      {...props}
      {...table}
      title={"Marketing Efficiency Statistics"}
    />
  );
}
