import NavigationServices from "@navigators/NavigatorServices";
import { useFocusEffect } from "@react-navigation/native";
import {
  useCreateProducts,
  useEditProducts,
  useGetCategoriesList,
} from "@shared/services/api/retailer";
import { statusSuccess } from "@shared/utils";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { productReducer } from "./ProductState";

const log = (obj, message = "") => {
  Logger.log(`[InventoryEditProduct] ${message}`, obj);
};

export const useProps = ({ params: { isNew, isEdit, item, reload } }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const categories = useSelector(
    (state) => state.inventoryRetailer?.categories
  );
  const filterCategoryRef = React.useRef(null);

  const [errorMsg, setErrorMsg] = React.useState(null);
  const [categoriesFilter, setCategoriesFilter] = React.useState([]);
  const [productItem, dispatchProduct] = React.useReducer(productReducer, item);
  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [productData, createProduct] = useCreateProducts();
  const [productEdit, editProduct] = useEditProducts();
  const [, getCategoriesList] = useGetCategoriesList();

  /**
  |--------------------------------------------------
  | VALIDATE
  |--------------------------------------------------
  */
  const form = useFormik({
    initialValues: productItem ?? {},
    validationSchema: Yup.object().shape({
      name: Yup.string().required(t("Product name is required")),
      maxThreshold: Yup.number()
        .min(
          Yup.ref("minThreshold"),
          t("High threshold should be high than Low threshold")
        )
        .default(0),
    }),

    onSubmit: (values) => {
      values.barCode = values.barCode || values.sku;
      const formatOptions = values?.options?.map((x) => ({
        attributeId: x.attributeId,
        // id: x.id,
        values: x.values
          ?.filter((v) => v.checked)
          ?.map((v) => ({
            attributeValueId: v.attributeValueId,
            valueAdd: v.valueAdd ?? 0,
            fileId: v.fileId ?? 0,
          })),
      }));

      if (isNew) {
        createProduct(Object.assign({}, values, { options: formatOptions }));
      } else if (isEdit) {
        editProduct(
          Object.assign({}, values, { options: formatOptions }),
          values.productId
        );
      }
    },
  });

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */

  useFocusEffect(
    React.useCallback(() => {
      if (reload) getCategoriesList();
    }, [reload])
  );

  React.useEffect(() => {
    if (!productData && !productEdit) {
      return;
    }

    const { codeStatus, message, data } = productData || productEdit;
    if (statusSuccess(codeStatus)) {
      setErrorMsg(null);
      NavigationServices.navigate("retailer.inventory.list", { reload: true });

      return;
    }

    if (message) {
      setErrorMsg(message);
    }
  }, [productData, productEdit]);

  React.useEffect(() => {
    const { maxThreshold } = form.errors;
    if (maxThreshold) {
      setErrorMsg(maxThreshold);
    } else {
      setErrorMsg(null);
    }
  }, [form.errors]);

  const reloadCategory = React.useCallback(() => {
    const list = categories
      ?.filter((x) => x.isSubCategory)
      .map((x) => ({
        value: x.categoryId,
        label: x.name,
      }));

    setCategoriesFilter(list);
    filterCategoryRef.current?.setFilterItems(list);
  }, [categories]);

  React.useEffect(() => {
    reloadCategory();
  }, [categories]);

  React.useEffect(() => {
    if (productItem) {
      form.setFieldValue("options", productItem?.options);
    }
  }, [productItem]);

  return {
    isEdit,
    isNew,
    errorMsg,
    buttonCancelPress: () => {
      NavigationServices.goBack();
    },
    productItem,
    onNewCategory: () => {
      NavigationServices.navigate("retailer.inventory.product.category", {
        isNew: true,
      });
    },
    form,
    filterCategoryRef,
    dispatchProduct,
    categoriesFilter: categoriesFilter,
  };
};
