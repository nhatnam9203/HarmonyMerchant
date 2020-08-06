import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import actions from "@actions";

import { ReportStatisticLayout } from "../../widget";
import { localize } from "@utils";

const HEAD_FONT_SIZE = 17;
const TABLE_ROW_HEIGHT = 50;

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
      tableData: item.statistics,
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
