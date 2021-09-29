import React from "react";
import {
  useGetProducts,
  useDeleteProducts,
  useRestockProducts,
} from "@shared/services/api/retailer";
import { useTranslation } from "react-i18next";
import NavigationServices from "@navigators/NavigatorServices";
import { NEED_TO_ORDER, statusSuccess } from "@shared/utils/app";
import { useFocusEffect } from "@react-navigation/native";

const log = (obj, message = "") => {
  Logger.log(`[Inventory Product Detail] ${message}`, obj);
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
  const [, deleteProducts] = useDeleteProducts(() => {
    NavigationServices.navigate("retailer.inventory.list", { reload: true });
  });
  const [productsRestock, restockProducts] = useRestockProducts();

  /**
  |--------------------------------------------------
  | USE EFFECT
  |--------------------------------------------------
  */
  // React.useEffect(() => {
  //   console.log(item);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [item?.productId]);

  useFocusEffect(
    React.useCallback(() => {
      if (item?.productId) getProducts(item?.productId);
    }, [item])
  );

  React.useEffect(() => {
    const { codeStatus } = productsRestock || {};
    if (statusSuccess(codeStatus)) {
      getProducts(item?.productId);
    }
  }, [productsRestock]);

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
    onEditProduct: () => {
      NavigationServices.navigate("retailer.inventory.product.edit", {
        isEdit: true,
        item: productItem,
      });
    },
    onHandleDeleteProduct: () => {
      deleteProducts(productItem?.productId);
    },
    onSubmitRestock: (value, reason = t("New stock")) => {
      restockProducts({
        ids: [productItem?.productId],
        quantity: value || 0,
        reason: reason,
      });
    },
    onHandleQuantity: () => {
      NavigationServices.navigate("retailer.inventory.product.qty", {
        item,
      });
    },
  };
};
