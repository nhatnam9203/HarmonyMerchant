import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ReportStatisticLayout } from "../../../widget";
import { localize } from "@utils";

export default function CustomerStatistic(props, ref) {
  const { filterId, ...subProps } = props;
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const customerReportList = useSelector(
    (state) => state.report.customerReportList
  );

  /**state */
  const [table, setTable] = useState({});

  /**process */

  /**useEffect */
  useEffect(() => {
    const item = customerReportList.find((item) => item.name === filterId);
    setTable({
      tableData: item?.details || [],
      tableHead: {
        appointmentId: localize("Appointment ID", language),
        dateString: localize("Date", language),
        time: localize("Time", language),
        serviceCount: localize("No. of Service", language),
        staffName: localize("Staff", language),
        payamount: localize("Pay Amount", language),
      },
      whiteKeys: [
        "appointmentId",
        "dateString",
        "time",
        "serviceCount",
        "staffName",
        "payamount",
      ],
      primaryId: "appointmentId",
      calcSumKeys: ["payamount"],
      sumTotalKey: "appointmentId",
      priceKeys: ["payamount"],
      sortKey: "appointmentId",
      tableCellWidth: { appointmentId: 180 },
    });
  }, [filterId, customerReportList]);

  /**render */

  return (
    <ReportStatisticLayout
      {...subProps}
      {...table}
      title={"Customer Statistics"}
      subTitle={filterId}
      isShowExportButton={false}
    />
  );
}
