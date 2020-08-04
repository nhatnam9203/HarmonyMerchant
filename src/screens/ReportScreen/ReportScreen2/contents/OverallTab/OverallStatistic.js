import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import actions from "@actions";

import { ReportStatisticLayout } from "../../widget";
import { localize } from "@utils";

const HEAD_FONT_SIZE = 17;
const TABLE_ROW_HEIGHT = 50;

export default function OverallStatistic(props, ref) {
  const { tabIndex, getTitle } = props;
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);
  const overallPaymentMethodList = useSelector(
    (state) => state.report.overallPaymentMethodList
  );
  const overallPMFilterId = useSelector(
    (state) => state.report.overallPMFilterId
  );
  const overallPMFilters = useSelector(
    (state) => state.report.overallPMFilters
  );

  /**state */
  const [table, setTable] = useState({});
  const [title, setTitle] = useState("");
  const [filterNameItem, setFilterNameItem] = useState(undefined);
  const [filterNames, setFilterNames] = useState([]);

  /**process */

  const onChangeFilterName = async (text) => {
    switch (tabIndex) {
      case 0:
        dispatch(actions.report.filterOPM(text));
        break;

      default:
        break;
    }
  };

  const bindNameFilter = async () => {
    switch (tabIndex) {
      case 0:
        await setFilterNameItem(overallPMFilterId);
        await setFilterNames(overallPMFilters);
        break;

      default:
        break;
    }
  };

  /**useEffect */
  useEffect(() => {
    bindNameFilter();
    setTitle(getTitle());

    switch (tabIndex) {
      case 0:
        const item = overallPaymentMethodList.find(
          (item) => item.method === overallPMFilterId
        );
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
  }, [overallPMFilterId, tabIndex, overallPaymentMethodList]);

  /**render */

  return (
    <ReportStatisticLayout
      {...props}
      {...table}
      title={title}
      onChangeFilter={onChangeFilterName}
      dataFilters={filterNames}
      filterId={filterNameItem}
    />
  );
}
