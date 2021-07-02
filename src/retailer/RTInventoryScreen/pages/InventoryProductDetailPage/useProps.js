import React from "react";
import {
  useGetProducts,
  useDeleteProducts,
  useRestockProducts,
} from "@shared/services/api/retailer";
import { useTranslation } from "react-i18next";
import NavigationServices from "@navigators/NavigatorServices";
import { NEED_TO_ORDER, statusSuccess } from "@shared/utils/app";

export const useProps = ({ params: { item } }) => {
  const { t } = useTranslation();

  const [productItem, setProduct] = React.useState(item);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [product, getProduct] = useGetProducts();
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
    getProduct(item?.productId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const { codeStatus } = productsRestock || {};
    if (statusSuccess(codeStatus)) {
      getProduct(item?.productId);
    }
  }, [productsRestock]);

  React.useEffect(() => {
    const { codeStatus, data } = product || {};
    if (statusSuccess(codeStatus)) {
      setProduct(data);
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
  };
};
