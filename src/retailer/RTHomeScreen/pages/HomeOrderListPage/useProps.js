import NavigationServices from "@navigators/NavigatorServices";
import { useFocusEffect } from "@react-navigation/native";
import {
  useExportOrderList,
  useGetOrderList,
} from "@shared/services/api/retailer";
import { getTimeTitleFile, statusSuccess } from "@shared/utils";
import { getQuickFilterTimeRange } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";

export const useProps = ({ params: { reload } }) => {
  const { t } = useTranslation();
  const exportRef = React.useRef();
  const [page, setPage] = React.useState(1);
  const [searchVal, setSearchVal] = React.useState();
  const [timeVal, setTimeVal] = React.useState();
  const [itemSelected, setItemSelected] = React.useState(null);
  const [purchasePoint, setPurchasePoint] = React.useState(null);
  const [payment, setPayment] = React.useState(null);
  const [orderStatus, setOrderStatus] = React.useState(null);
  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [orderList, getOrderList] = useGetOrderList();
  const callGetOrderList = React.useCallback(() => {
    getOrderList({
      page: page,
      ...timeVal,
      key: searchVal,
      sort: {},
      ...((orderStatus?.length > 0 ||
        payment?.length > 0 ||
        purchasePoint?.length > 0) && {
        filters: {
          ...(orderStatus?.length > 0 && { status: orderStatus }),
          ...(purchasePoint?.length > 0 && { purchasePoint: purchasePoint }),
          ...(payment?.length > 0 && { payment: payment }),
        },
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchVal, timeVal, orderStatus, payment, purchasePoint]);

  /**
  |--------------------------------------------------
  |  API EXPORT
  |--------------------------------------------------
  */
  const [exportOrderList, ExportOrderList] = useExportOrderList();
  const callExportOrderList = (values) => {
    const params = Object.assign({}, values, {
      ...timeVal,
    });
    exportRef.current?.onSetFileName(getTimeTitleFile("ReportOrder", params));
    ExportOrderList(params);
  };

  React.useEffect(() => {
    const { codeStatus, data } = exportOrderList || {};
    if (statusSuccess(codeStatus)) {
      exportRef.current?.onCreateFile(data);
    }
  }, [exportOrderList]);

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */
  React.useEffect(() => {
    callGetOrderList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    callGetOrderList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchVal, timeVal, orderStatus, payment, purchasePoint]);

  useFocusEffect(
    React.useCallback(() => {
      if (reload) callGetOrderList();
    }, [reload])
  );

  const onChangeValueSearch = (text) => {
    setSearchVal(text);
  };

  const onButtonSearchPress = () => {
    callGetOrderList();
  };

  const onRefresh = () => {
    callGetOrderList();
  };

  const onCheckedRow = (item, selected) => {
    const cloneList =
      itemSelected?.filter((v) => v.productId !== item.productId) || [];
    if (selected) {
      setItemSelected([...cloneList, item]);
    } else {
      setItemSelected(cloneList);
    }
  };

  return {
    onChangeValueSearch,
    onButtonSearchPress,
    onButtonNewOrderPress: () => {
      NavigationServices.navigate("retailer.home.checkout", {});
    },
    onSelectRow: ({ item }) => {
      NavigationServices.navigate("retailer.home.order.detail", {
        order: item,
      });
    },
    onRenderCell: () => {},
    onSortWithKey: () => {},
    items: orderList?.data,
    onChangeTimeValue: (quickFilter, timeState) => {
      if (timeState === "Customize Date") {
        setTimeVal({
          quickFilter: "custom",
          timeStart: timeState.startDate,
          timeEnd: timeState.endDate,
        });
      } else {
        setTimeVal({ quickFilter: getQuickFilterTimeRange(quickFilter) });
      }
    },
    onResetFilter: () => {
      setPayment("");
      setPurchasePoint("");
      setOrderStatus("");
    },
    onApplyFilter: () => {},
    purchasePoint,
    setPurchasePoint,
    payment,
    setPayment,
    orderStatus,
    setOrderStatus,
    onRefresh,
    exportRef,
    callExportOrderList,
  };
};
