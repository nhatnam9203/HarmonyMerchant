import NavigationServices from "@navigators/NavigatorServices";
import {
  useGetAdjustHistoryList,
  useGetAdjustPendingList,
  useGetProducts,
  useRestockProducts,
  useSubmitAdjustQuantity,
} from "@shared/services/api/retailer";
import { statusSuccess } from "@shared/utils/app";
import React from "react";
import { useTranslation } from "react-i18next";

const log = (obj, message = "") => {
  Logger.log(`[Inventory Product Qty] ${message}`, obj);
};

export const useProps = ({ params: { item } }) => {
  const { t } = useTranslation();
  const scrollTabRef = React.useRef(null);

  const [productItem] = React.useState(item);
  const [adjustVersions, setAdjustVersions] = React.useState();
  const [listSubmit, setListSubmit] = React.useState([]);
  const [pendingList, setPendingList] = React.useState([]);
  const [currentTab, setCurrentTab] = React.useState(0);

  const [page, setPage] = React.useState(1);
  const [historyList, setHistoryList] = React.useState([]);
  const [isLoadMoreHistory, setIsLoadMoreHistory] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    pages: 0,
    count: 0,
  });

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [product, getProducts] = useGetProducts();
  const [productsRestock, restockProducts] = useRestockProducts();
  const [adjustQuantityData, adjustQuantity] = useSubmitAdjustQuantity();
  const [adjustHistoryList, getAdjustHistoryList] = useGetAdjustHistoryList();
  const callGetAdjustHistoryList = React.useCallback(() => {
    if (productItem?.productId) {
      getAdjustHistoryList(productItem?.productId, {
        page: page,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, productItem?.productId]);

  const [adjustPendingList, getAdjustPendingList] = useGetAdjustPendingList();

  /**
  |--------------------------------------------------
  | USE EFFECT
  |--------------------------------------------------
  */
  React.useEffect(() => {
    const productId = item?.productId;
    if (productId) {
      // getProducts(productId);
      // getAdjustHistoryList(productId);
      setPage(1);
      getAdjustPendingList(productId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    callGetAdjustHistoryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, productItem?.productId]);

  React.useEffect(() => {
    const { codeStatus, data } = adjustPendingList || {};
    if (statusSuccess(codeStatus)) {
      setAdjustVersions(
        data?.quantities?.map((x) => {
          if (x.tempQuantity === 0)
            return Object.assign({}, x, { tempQuantity: x.quantity });

          return x;
        })
      );
      setPendingList(data?.pendings);
    }
  }, [adjustPendingList]);

  React.useEffect(() => {
    const { codeStatus, data } = adjustQuantityData || {};
    if (statusSuccess(codeStatus)) {
      // NavigationServices.goBack();
      NavigationServices.navigate("retailer.inventory.list", { reload: true });
    }
  }, [adjustQuantityData]);

  React.useEffect(() => {
    setIsLoadMoreHistory(false);
    const { codeStatus, data, pages = 0, count = 0 } = adjustHistoryList || {};
    if (statusSuccess(codeStatus)) {
      if (page > 1 && page <= pages && items) {
        setHistoryList(historyList.concat(data));
      } else {
        setHistoryList(data);
      }

      setPagination({
        pages,
        count,
      });
    }
  }, [adjustHistoryList]);

  return {
    productItem,
    onGoBack: () => {
      NavigationServices.goBack();
    },
    onSubmitAdjust: (cellItem, value, reason = t("New stock")) => {
      let cloneArr = [...adjustVersions];
      const itemIndx = cloneArr?.findIndex((x) => x.id === cellItem.id);
      if (itemIndx >= 0) {
        let replaceItem = cloneArr[itemIndx];
        replaceItem.tempQuantity = parseInt(value);
        cloneArr[itemIndx] = replaceItem;
        setAdjustVersions(cloneArr);

        const adjustQty = parseInt(value) - cellItem.quantity;

        let adjustItem = {
          id: 0,
          productQuantityId: cellItem.id,
          label: cellItem.label,
          adjustQuantity: adjustQty > 0 ? "+" + adjustQty : adjustQty,
          reason: reason,
        };

        const submitIndex = listSubmit?.findIndex(
          (x) => x.productQuantityId === cellItem.id
        );

        const pendingItemIndex = pendingList?.findIndex(
          (x) => x.productQuantityId === adjustItem.productQuantityId
        );

        if (submitIndex >= 0) {
          const existItem = listSubmit[submitIndex];
          adjustItem.id = existItem.id;
          adjustItem.productQuantityId = existItem.productQuantityId;
          let newArray = [...listSubmit];
          newArray[submitIndex] = adjustItem;

          setListSubmit(newArray);
        } else {
          if (pendingItemIndex >= 0) {
            adjustItem.id = pendingList[pendingItemIndex].id;
          }
          setListSubmit([...listSubmit, adjustItem]);
        }

        // Update Pending List
        if (pendingItemIndex >= 0) {
          let clonePendingList = [...pendingList];
          let pendingItem = clonePendingList[pendingItemIndex];

          pendingItem.adjustQuantity = adjustItem.adjustQuantity;
          pendingItem.reason = adjustItem.reason;

          clonePendingList[pendingItemIndex] = pendingItem;

          setPendingList(clonePendingList);
        } else {
          const currentDate = new Date();
          const newPendingItem = {
            id: adjustItem.id,
            label: adjustItem.label,
            adjustQuantity: adjustItem.adjustQuantity,
            reason: adjustItem.reason,
            createdByName: "",
            createdDate: currentDate.getTime(),
          };

          setPendingList([...pendingList, newPendingItem]);
        }
      }
    },
    adjustHistoryList: historyList,
    adjustPendingList: adjustPendingList?.data,
    adjustVersions,
    submit: () => {
      if (listSubmit) {
        adjustQuantity(productItem?.productId, listSubmit);
      }
    },
    scrollTabRef,
    onChangeTab: (tabIndex) => {
      setCurrentTab(tabIndex?.i);
    },
    currentTab,
    onSwitchTabPending: () => {
      if (currentTab === 1) {
        scrollTabRef.current?.goToPage(0);
      }
    },

    onSwitchTabHistory: () => {
      if (currentTab === 0) {
        scrollTabRef.current?.goToPage(1);
      }
    },
    pendingList,
    onLoadMoreHistory: () => {
      if (page < pagination?.pages) {
        setIsLoadMoreHistory(true);
        setPage((prev) => prev + 1);
      }
    },
    isLoadMoreHistory: isLoadMoreHistory,
  };
};
