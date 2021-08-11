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
  React.useEffect(() => {
    getProducts(item?.productId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        item: item,
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
