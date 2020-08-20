import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ReportStatisticLayout } from "../../../widget";
import { localize } from "@utils";

export default function SalesByProductStatistic(props, ref) {
  const { filterId } = props;
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const productSaleByProductList = useSelector(
    (state) => state.report.productSaleByProductList
  );

  /**state */
  const [table, setTable] = useState({});

  /**process */

  /**useEffect */
  useEffect(() => {
    const item = productSaleByProductList.find(
      (item) => item.type === filterId
    );

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
  }, [filterId, productSaleByProductList]);

  /**render */

  return (
    <ReportStatisticLayout
      {...props}
      {...table}
      title={"Sales by product statistics"}
    />
  );
}
