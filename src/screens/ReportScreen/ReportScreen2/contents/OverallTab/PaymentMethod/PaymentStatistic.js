import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import actions from "@actions";

import { ReportStatisticLayout } from "../../../widget";
import { localize } from "@utils";

const HEAD_FONT_SIZE = 17;
const TABLE_ROW_HEIGHT = 50;

export default function PaymentStatistic(props, ref) {
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

  const [filterNameItem, setFilterNameItem] = useState(undefined);
  const [filterNames, setFilterNames] = useState([]);

  /**process */

  const onChangeFilterName = async (text) => {
    dispatch(actions.report.filterOPM(text));
  };

  const bindNameFilter = async () => {
    await setFilterNameItem(overallPMFilterId);
    await setFilterNames(overallPMFilters);
  };

  /**useEffect */
  useEffect(() => {
    bindNameFilter();

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
  }, [overallPMFilterId, tabIndex, overallPaymentMethodList]);

  /**render */

  return (
    <ReportStatisticLayout
      {...props}
      {...table}
      title={"Payment Method Statistics"}
      onChangeFilter={onChangeFilterName}
      dataFilters={filterNames}
      filterId={filterNameItem}
    />
  );
}
