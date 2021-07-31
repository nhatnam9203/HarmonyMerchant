import React from "react";
import {
  useGetProducts,
  useDeleteProducts,
  useRestockProducts,
} from "@shared/services/api/retailer";
import { useTranslation } from "react-i18next";
import NavigationServices from "@navigators/NavigatorServices";
import { NEED_TO_ORDER, statusSuccess } from "@shared/utils/app";

const log = (obj, message = "") => {
  Logger.log(`[Inventory Product Qty] ${message}`, obj);
};

export const useProps = ({ params: { item } }) => {
  const { t } = useTranslation();
  const [productItem, setProduct] = React.useState(item);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [product, getProducts] = useGetProducts();

  /**
  |--------------------------------------------------
  | USE EFFECT
  |--------------------------------------------------
  */
  React.useEffect(() => {
    getProducts(item?.productId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const { codeStatus, data } = product || {};
    if (statusSuccess(codeStatus)) {
      setProduct(data);
      log(data);
    }
  }, [product]);

  return {
    productItem,
    onGoBack: () => {
      NavigationServices.goBack();
    },
  };
};
