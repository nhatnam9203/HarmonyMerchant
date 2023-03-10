import NavigationServices from "@navigators/NavigatorServices";
import { useFocusEffect } from "@react-navigation/native";
import {
  useExportOrderList,
  useGetOrderList,
  useCleanOrder,
} from "@shared/services/api/retailer";
import {
  getTimeTitleFile,
  SORT_TYPE,
  statusSuccess,
  PURCHASE_POINTS_ORDER,
} from "@shared/utils";
import { getQuickFilterTimeRange } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { basketRetailer } from "@redux/slices";

const DEFAULT_PAGE = 1;

export const useProps = ({ params: { reload } }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const exportRef = React.useRef();

  const [page, setPage] = React.useState(DEFAULT_PAGE);
  const [searchVal, setSearchVal] = React.useState();
  const [timeVal, setTimeVal] = React.useState();
  const [itemSelected, setItemSelected] = React.useState(null);
  const [purchasePoint, setPurchasePoint] = React.useState("");
  const [payment, setPayment] = React.useState("");
  const [orderStatus, setOrderStatus] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pages: 0,
    count: 0,
  });
  const [items, setItems] = React.useState(null);
  const [sortById, setSortById] = React.useState(SORT_TYPE.DESC);

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
      sorts: { code: sortById },
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
  }, [
    page,
    searchVal,
    timeVal,
    orderStatus,
    payment,
    purchasePoint,
    sortById,
    reload,
  ]);

  /**
  |--------------------------------------------------
  |  API EXPORT
  |--------------------------------------------------
  */
  const [exportOrderList, funcExportOrderList] = useExportOrderList();
  const callExportOrderList = (values) => {
    const params = Object.assign({}, values, {
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
    exportRef.current?.onSetFileName(getTimeTitleFile("ReportOrder", params));
    funcExportOrderList(params);
  };

  React.useEffect(() => {
    const { codeStatus, data } = exportOrderList || {};
    if (statusSuccess(codeStatus)) {
      exportRef.current?.onCreateFile(data);
    }
  }, [exportOrderList]);

  /**
  |--------------------------------------------------
  |  API CLEAN
  |--------------------------------------------------
  */

  const [orderClean, cleanOrder] = useCleanOrder();
  const callCleanOrder = () => {
    const ids = itemSelected?.map((id) => id.appointmentId) || [];
    ids?.length > 0 && cleanOrder(ids);
  };

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */

  React.useEffect(() => {
    const { codeStatus, data, pages = 0, count = 0 } = orderList || {};
    if (statusSuccess(codeStatus)) {
      setItems(data);
      setPagination({
        pages,
        count,
      });
    }
  }, [orderList]);

  React.useEffect(() => {
    const { codeStatus } = orderClean || {};
    if (statusSuccess(codeStatus)) {
      setItemSelected([]);
      callGetOrderList();
    }
  }, [orderClean]);

  React.useEffect(() => {
    callGetOrderList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    callGetOrderList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchVal, timeVal, orderStatus, payment, purchasePoint, sortById]);

  useFocusEffect(
    React.useCallback(() => {
      if (reload) {
        callGetOrderList();
      }
    }, [
      reload,
      page,
      searchVal,
      timeVal,
      orderStatus,
      payment,
      purchasePoint,
      sortById,
    ])
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
      itemSelected?.filter((v) => v.appointmentId !== item.appointmentId) || [];

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
      dispatch(basketRetailer.clearBasket());
      NavigationServices.navigate("retailer.home.order.check_out", {
        purchasePoint: PURCHASE_POINTS_ORDER,
      });
    },
    onSelectRow: ({ item }) => {
      NavigationServices.navigate("retailer.home.order.detail", {
        order: item,
        screenId: "retailer.home.order.list",
        backScreenId: "retailer.home.order.list",
      });
    },
    onRenderCell: () => {},
    onSortWithKey: (sortKey) => {
      switch (sortKey) {
        case "code":
          const sortedById =
            sortById === SORT_TYPE.ASC ? SORT_TYPE.DESC : SORT_TYPE.ASC;
          setSortById(sortedById);
          break;

        default:
          break;
      }
    },
    items,
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
    setPage,
    DEFAULT_PAGE,
    pagination,
    sortById,
    isShowClearFilter: () => {
      return (
        payment?.length > 0 ||
        purchasePoint?.length > 0 ||
        orderStatus?.length > 0
      );
    },
    onCheckedAll: (checked) => {
      if (checked) {
        setItemSelected(items);
      } else {
        setItemSelected(null);
      }
    },
    getCheckedValue: (item) => {
      if (item === "all") {
        return itemSelected && itemSelected?.length == items?.length;
      }

      return (
        itemSelected?.findIndex(
          (x) => item.appointmentId === x.appointmentId
        ) >= 0
      );
    },
    onCheckedRow,
    callCleanOrder,
  };
};
