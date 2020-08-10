import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import actions from "@actions";

import { ReportStatisticLayout } from "../../../widget";
import { localize } from "@utils";

const HEAD_FONT_SIZE = 17;
const TABLE_ROW_HEIGHT = 50;

export default function PaymentStatistic(props, ref) {
  const { filterId } = props;
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const overallPaymentMethodList = useSelector(
    (state) => state.report.overallPaymentMethodList
  );
  /**state */
  const [table, setTable] = useState({});

  /**process */

  /**useEffect */
  useEffect(() => {
    const item = overallPaymentMethodList.find((item) => item.method === filterId);

    setTable({
      tableData: item.statistics,
      tableHead: {
        dateString: localize("Date", language),
        transactions: localize("Transactions", language),
        grossPayment: localize("Gross Payments", language),
        refund: localize("Refunds", language),
        netPayment: localize("Net Payments", language),
      },
      whiteKeys: [
        "dateString",
        "transactions",
        "grossPayment",
        "refund",
        "netPayment",
      ],
      primaryId: "date",
      calcSumKeys: ["transactions", "grossPayment", "refund", "netPayment"],
      sumTotalKey: "dateString",
      priceKeys: ["grossPayment", "refund", "netPayment"],
      tableCellWidth: { grossPayment: 180 },
    });
  }, [filterId, overallPaymentMethodList]);

  /**render */

  return (
    <ReportStatisticLayout
      {...props}
      {...table}
      title={"Payment Method Statistics"}
    />
  );
}
