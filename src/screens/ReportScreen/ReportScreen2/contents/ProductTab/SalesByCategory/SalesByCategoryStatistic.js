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
    const item = productSaleByCategoryList.find((item) => item.categoryId === filterId);

    setTable({
      tableData: item?.giftCardStatistics || [],
      tableHead: {
        appointmentId: localize("Appointment ID", language),
        dateString: localize("Date", language),
        time: localize("Time", language),
        no: localize("No. of Service", language),
        staff: localize("Staff", language),
        payAmount: localize("Pay Amount", language),
      },
      whiteKeys: [
        "appointmentId",
        "dateString",
        "time",
        "no",
        "staff",
        "payAmount",
      ],
      primaryId: "appointmentId",
      calcSumKeys: [],
      sumTotalKey: "",
      priceKeys: [],
      tableCellWidth: { appointmentId: 80 },
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
