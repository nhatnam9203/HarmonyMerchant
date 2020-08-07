import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ReportStatisticLayout } from "../../widget";
import { localize } from "@utils";

export default function GiftCardStatistic(props, ref) {
  const { filterId } = props;
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const giftCardReportList = useSelector(
    (state) => state.report.giftCardReportList
  );

  /**state */
  const [table, setTable] = useState({});

  /**process */

  /**useEffect */
  useEffect(() => {
    const item = giftCardReportList.find((item) => item.type === filterId);

    setTable({
      tableData: item?.giftCardStatistics || [],
      tableHead: {
        dateString: localize("Date", language),
        quantity: localize("Qty Sold", language),
        sales: localize("Net Sales", language),
      },
      whiteKeys: ["dateString", "quantity", "sales"],
      primaryId: "date",
      calcSumKeys: ["quantity", "sales"],
      sumTotalKey: "dateString",
      priceKeys: ["sales"],
      tableCellWidth: { date: 180 },
    });
  }, [filterId, giftCardReportList]);

  /**render */

  return (
    <ReportStatisticLayout
      {...props}
      {...table}
      title={"Gift Card Statistics"}
    />
  );
}
