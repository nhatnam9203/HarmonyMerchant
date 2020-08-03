import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "react-native-material-dropdown";

import IMAGE from "@resources";
import {
  HeaderTitle,
  HeaderTooltip,
  PopupButton,
  TableList,
  ReportStatisticLayout,
} from "../../widget";
import { localize } from "@utils";

const HEAD_FONT_SIZE = 17;
const TABLE_ROW_HEIGHT = 50;

export default function OverallStatistic(props ,ref) {
  const { item, tabIndex } = props;
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  /**state */
  const [table, setTable] = useState({});

  /**process */

  /**useEffect */
  useEffect(() => {
    switch (tabIndex) {
      case 0:
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
          priceKeys: ["transactions", "grossPayment", "refund", "netPayment"],
          tableCellWidth: { grossPayment: 180 },
        });
        break;
      case 1:
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
          primaryId: "dateString",
          calcSumKeys: ["transactions", "grossPayment", "refund", "netPayment"],
          sumTotalKey: "dateString",
          priceKeys: ["transactions", "grossPayment", "refund", "netPayment"],
          tableCellWidth: { grossPayment: 180 },
        });
        break;
      default:
        break;
    }
  }, [item, tabIndex]);

  /**render */

  return <ReportStatisticLayout {...props} {...table} />;
}

const styles = StyleSheet.create({});
