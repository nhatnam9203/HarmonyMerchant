import { useFormik } from "formik";
import * as Yup from "yup";
import NavigationServices from "@navigators/NavigatorServices";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateProducts,
  useEditProducts,
  useGetCategoriesList,
} from "@shared/services/api/retailer";
import {
  BIRTH_DAY_DATE_FORMAT_STRING,
  statusSuccess,
  dateToString,
} from "@shared/utils";
import { merge } from "lodash";
import { useFocusEffect } from "@react-navigation/native";
import { productReducer, updateOption, updateProduct } from "./ProductState";

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
  const [listSelectCategories, setListSelectCategories] = React.useState([]);
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
      // categoryId: Yup.number(),
      // description: Yup.string(),
      // sku: Yup.string(),
      // barCode: Yup.string(),
      // price: Yup.number(),
      // costPrice: Yup.number(),
      // quantity: Yup.number(),
      // minThreshold: Yup.number(),
      // maxThreshold: Yup.number(),
      // fileId: Yup.number(),
      // options: Yup.array().of(
      //   Yup.object().shape({
      //     attributeId: Yup.number(),
      //     values: Yup.array().of(
      //       Yup.object().shape({
      //         attributeValueId: Yup.number(),
      //         valueAdd: Yup.number(),
      //         fileId: Yup.number(),
      //       }),
      //     ),
      //   }),
      // ),
    }),
    onSubmit: (values) => {
      // alert(JSON.stringify(values));

      const formatOptions = values?.options.map((x) => ({
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
      if (reload) getCategoriesList({ page: 1 });
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

  // React.useEffect(() => {
  //   const list = categories
  //     ?.filter((x) => x.isSubCategory)
  //     .map((x) => ({
  //       value: x.categoryId,
  //       label: x.name,
  //     }));

  //   setListSelectCategories(list);
  // }, [categories]);

  const reloadCategory = React.useCallback(() => {
    filterCategoryRef.current?.setFilterItems(
      categories
        ?.filter((x) => x.isSubCategory)
        .map((x) => ({
          value: x.categoryId,
          label: x.name,
        }))
    );
  }, [categories?.length]);

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
    listSelectCategories: categories
      ?.filter((x) => x.isSubCategory)
      .map((x) => ({
        value: x.categoryId,
        label: x.name,
      })),
    filterCategoryRef,
    dispatchProduct,
  };
};
