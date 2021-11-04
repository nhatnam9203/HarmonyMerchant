import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ReportStatisticLayout } from "../../../../widget";
import { localize } from "@utils";

export const SalesByProductStatistic = React.forwardRef((props, ref) => {
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

  const reloadTable = React.useCallback(() => {
    if (!filterId || !productSaleByProductList?.length > 0) {
      setTable({});
    }

    const item = productSaleByProductList.find((x) => x.name === filterId);
    // console.log(item.details);
    setTable({
      tableData: item?.details || [],
      tableHead: {
        dateString: localize("Date", language),
        quantity: localize("Qty Sold", language),
        avgPrice: localize("Av. Price", language),
        totalSales: localize("Total", language),
      },
      whiteKeys: ["dateString", "quantity", "avgPrice", "totalSales"],
      primaryId: "dateString",
      calcSumKeys: ["quantity", "totalSales"],
      sumTotalKey: "dateString",
      priceKeys: ["avgPrice", "totalSales"],
      tableCellWidth: { appointmentId: 80 },
      detailOfItem: item,
    });
  }, [filterId, productSaleByProductList]);

  /**useEffect */
  useEffect(() => {
    reloadTable();
  }, [filterId, productSaleByProductList]);

  React.useImperativeHandle(ref, () => ({
    didFocus: () => {
      reloadTable();
    },
  }));
  /**render */

  return (
    <ReportStatisticLayout
      {...props}
      {...table}
      title={"Sales by product statistics"}
    />
  );
});
