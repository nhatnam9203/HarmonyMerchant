import React from "react";
import {
  useGetProducts,
  useDeleteProducts,
  useRestockProducts,
  useGetAdjustHistoryList,
  useGetAdjustPendingList,
  useSubmitAdjustQuantity,
} from "@shared/services/api/retailer";
import { useTranslation } from "react-i18next";
import NavigationServices from "@navigators/NavigatorServices";
import { NEED_TO_ORDER, statusSuccess } from "@shared/utils/app";

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

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [product, getProducts] = useGetProducts();
  const [productsRestock, restockProducts] = useRestockProducts();
  const [adjustQuantityData, adjustQuantity] = useSubmitAdjustQuantity();
  const [adjustHistoryList, getAdjustHistoryList] = useGetAdjustHistoryList();
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
      getAdjustHistoryList(productId);
      getAdjustPendingList(productId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const { codeStatus, data } = adjustPendingList || {};
    if (statusSuccess(codeStatus)) {
      setAdjustVersions(
        data?.quantities.map((x) => {
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

        let adjustItem = {
          id: 0,
          productQuantityId: cellItem.id,
          label: cellItem.label,
          adjustQuantity: parseInt(value),
          reason: reason,
        };

        const submitIndex = listSubmit?.findIndex(
          (x) => x.productQuantityId === cellItem.id
        );

        if (submitIndex >= 0) {
          const existItem = listSubmit[submitIndex];
          adjustItem.id = existItem.id;
          adjustItem.productQuantityId = existItem.productQuantityId;
          let newArray = [...listSubmit];
          newArray[submitIndex] = adjustItem;

          setListSubmit(newArray);
        } else {
          // const pendingItem = adjustPendingList?.data?.pending?.find(x => x.)
          setListSubmit([...listSubmit, adjustItem]);
        }
      }
    },
    adjustHistoryList: adjustHistoryList?.data,
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
    pendingList
  };
};
