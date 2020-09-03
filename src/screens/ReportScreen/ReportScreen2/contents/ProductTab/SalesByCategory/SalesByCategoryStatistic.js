import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ReportStatisticLayout } from "../../../widget";
import { localize } from "@utils";

export default function SalesByCategoryStatistic(props, ref) {
  const { filterId } = props;
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const productSaleByCategoryList = useSelector(
    (state) => state.report.productSaleByCategoryList
  );

  /**state */
  const [table, setTable] = useState({});

  /**process */

  /**useEffect */
  useEffect(() => {
    const item = productSaleByCategoryList.find(
      (item) => item.categoryName === filterId
    );

    setTable({
      tableData: item?.details || [],
      tableHead: {
        dateString: localize("Date", language),
        quantity: localize("Qty Sold", language),
        avgPrice: localize("Av. Price", language),
        totalSales: localize("Total Amount", language),
      },
      whiteKeys: ["dateString", "quantity", "avgPrice", "totalSales"],
      primaryId: "date",
      calcSumKeys: ["quantity", "avgPrice", "totalSales"],
      sumTotalKey: "dateString",
      priceKeys: ["avgPrice", "totalSales"],
      sortKey: "dateString",
      tableCellWidth: { dateString: 180, totalSales: 180 },
    });
  }, [filterId, productSaleByCategoryList]);

  /**render */

  return (
    <ReportStatisticLayout
      {...props}
      {...table}
      title={"Sales by category statistics"}
    />
  );
}
