import { useFormik } from "formik";
import * as Yup from "yup";
import NavigationServices from "@navigators/NavigatorServices";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useCreateCategories } from "@shared/services/api/retailer";
import {
  BIRTH_DAY_DATE_FORMAT_STRING,
  statusSuccess,
  dateToString,
} from "@shared/utils";

const log = (obj, message = "") => {
  Logger.log(`[EditCategory] ${message}`, obj);
};

export const useProps = ({ params: { isNew, isEdit, item } }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const categories = useSelector(
    (state) => state.inventoryRetailer?.categories
  );
  const [isSubCategory, setIsSubCategory] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState(null);
  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [categoryData, createCategory] = useCreateCategories();

  /**
  |--------------------------------------------------
  | VALIDATE
  |--------------------------------------------------
  */
  const form = useFormik({
    initialValues: { categoryType: "Product", name: "", parentId: 0 },
    validationSchema: Yup.object().shape({
      categoryType: Yup.string(),
      name: Yup.string().required(t("Category name is required")),
      parentId: Yup.number(),
    }),
    onSubmit: (values) => {
      // alert(JSON.stringify(values));
      createCategory(values);
    },
  });

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */
  React.useEffect(() => {
    if (!categoryData) {
      return;
    }

    const { codeStatus, message, data } = categoryData || {};
    if (statusSuccess(codeStatus)) {
      setErrorMsg(null);
      // NavigationServices.goBack();
      NavigationServices.navigate("retailer.inventory.product.edit", {
        reload: true,
      });

      return;
    }

    if (message) {
      setErrorMsg(message);
    }
  }, [categoryData]);



  return {
    isEdit,
    isNew,
    buttonCancelPress: () => {
      NavigationServices.goBack();
    },
    categoryItem: item, // form
    isSubCategory,
    onIsSubcategory: (isSub) => {
      setIsSubCategory(isSub);
    },
    form,
    categories: categories
      ?.filter((x) => x.parentId === 0)
      .map((x) => ({
        value: x.categoryId,
        label: x.name,
      })),
  };
};
