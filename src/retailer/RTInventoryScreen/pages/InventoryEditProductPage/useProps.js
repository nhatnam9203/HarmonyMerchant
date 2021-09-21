import NavigationServices from "@navigators/NavigatorServices";
import { useFocusEffect } from "@react-navigation/native";
import {
  useCreateProducts,
  useEditProducts,
  useGetCategoriesList,
  useGetProducts,
} from "@shared/services/api/retailer";
import { statusSuccess } from "@shared/utils";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  changeProductAttribute,
  changeProductName,
  productReducer,
  setProduct,
} from "./ProductState";

const log = (obj, message = "") => {
  Logger.log(`[InventoryEditProduct] ${message}`, obj);
};

export const useProps = ({
  params: { isNew, isEdit, item, reload, productBarcode },
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const categories = useSelector(
    (state) => state.inventoryRetailer?.categories
  );
  const filterCategoryRef = React.useRef(null);
  const visibilitySelectRef = React.useRef(null);

  const [errorMsg, setErrorMsg] = React.useState(null);
  const [categoriesFilter, setCategoriesFilter] = React.useState([]);
  const [productItem, dispatchProduct] = React.useReducer(productReducer, null);
  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [productData, createProduct] = useCreateProducts();
  const [productEdit, editProduct] = useEditProducts();
  const [, getCategoriesList] = useGetCategoriesList();
  const [productsGet, getProducts] = useGetProducts();

  /**
  |--------------------------------------------------
  | VALIDATE
  |--------------------------------------------------
  */
  const form = useFormik({
    initialValues: productItem ?? {},
    validationSchema: Yup.object().shape({
      name: Yup.string().required(t("Product name is required")),
      price: Yup.string(),
      sku: Yup.string().required(),
      costPrice: Yup.string(),
      categoryId: Yup.number().required(),
      quantity: Yup.number(),
      minThreshold: Yup.number().default(0),
      maxThreshold: Yup.number()
        .default(0)
        .min(
          Yup.ref("minThreshold"),
          t("High threshold should be high than Low threshold")
        )
        .notRequired(),
    }),
    onSubmit: (values) => {
      values.maxThreshold = values.maxThreshold || 0;
      values.minThreshold = values.minThreshold || 0;

      const formatOptions = productItem?.options?.map((x) => ({
        attributeId: x.attributeId,
        values: x.values
          ?.filter((v) => v.checked)
          ?.map((v) => {
            return {
              attributeValueId: v?.attributeValueId,
              valueAdd: v?.valueAdd ?? 0,
              fileId: v?.fileId ?? 0,
            };
          }),
      }));

      values.options = formatOptions;
      values.quantities = productItem?.quantities;

      if (isNew) {
        createProduct(values);
      } else if (isEdit) {
        editProduct(values, values.productId);
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
      if (item?.productId) getProducts(item?.productId);
    }, [item])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (reload) {
        getCategoriesList();
      }

      if (productBarcode) {
        form.setFieldValue("barCode", productBarcode);
        dispatchProduct(changeProductAttribute("barCode", productBarcode));
      }
    }, [reload, productBarcode])
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
    const { codeStatus, data } = productsGet || {};
    if (statusSuccess(codeStatus)) {
      dispatchProduct(setProduct(data));
      form.setValues(data);
      // visibilitySelectRef.current?.setFilterItems(list);
    }
  }, [productsGet]);

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

  // React.useEffect(() => {
  //   if (item?.productId) {
  //     getProducts(item?.productId);
  //   }
  // }, [item?.productId]);

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
    onHandleChangeProductName: (value) => {
      form.setFieldValue("name", value);
      dispatchProduct(changeProductName(value));
    },
    onHandleChangeProductImages: (values) => {
      form.setFieldValue("images", values);
      const defaultImage = values?.find((value) => value.isDefault);
      if (defaultImage) {
        form.setFieldValue("fileId", defaultImage.fileId);
      }
    },
    onHandleChangeProductDescription: (value) => {
      form.setFieldValue("description", value);
      dispatchProduct(changeProductAttribute("description", value));
    },
    onResultScanCode: (data) => {
      if (data) {
        form.setFieldValue("barCode", data);
        dispatchProduct(changeProductAttribute("barCode", data));
      }
    },
  };
};
