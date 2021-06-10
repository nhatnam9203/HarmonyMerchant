import { useFormik } from 'formik';
import * as Yup from 'yup';
import NavigationServices from '@navigators/NavigatorServices';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  useCreateCategories,
  useGetCategories,
  useEditCategories,
} from '@shared/services/api/retailer';
import {
  BIRTH_DAY_DATE_FORMAT_STRING,
  statusSuccess,
  dateToString,
} from '@shared/utils';

export const useProps = ({ params: { isNew, isEdit, item } }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const categories = useSelector(
    (state) => state.inventoryRetailer?.categories,
  );
  const [isSubCategory, setIsSubCategory] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState(null);
  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [categoryData, createCategory] = useCreateCategories();
  const [categoryEdit, editCategory] = useEditCategories();
  const [categoriesGet, getCategories] = useGetCategories();

  /**
  |--------------------------------------------------
  | VALIDATE
  |--------------------------------------------------
  */
  const form = useFormik({
    initialValues: item ?? { categoryType: 'Product', name: '', parentId: 0 },
    validationSchema: Yup.object().shape({
      categoryType: Yup.string(),
      name: Yup.string().required(t('Category name is required')),
      parentId: Yup.number(),
    }),
    onSubmit: (values) => {
      // alert(JSON.stringify(values));
      if (isNew) {
        createCategory(values);
      } else if (isEdit) {
        editCategory(values, values.categoryId);
      }
    },
  });

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */
  React.useEffect(() => {
    if (!categoryData && !categoryEdit) {
      return;
    }

    const { codeStatus, message, data } = categoryData || categoryEdit;
    if (statusSuccess(codeStatus)) {
      setErrorMsg(null);
      NavigationServices.navigate('retailer.settings.main', { reload: true });

      return;
    }

    if (message) {
      setErrorMsg(message);
    }
  }, [categoryData, categoryEdit]);

  React.useEffect(() => {
    if (categoriesGet?.data) {
      form?.setValues(categoriesGet.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesGet?.data]);

  React.useEffect(() => {
    if (isEdit && item) {
      getCategories(item.categoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    categories,
  };
};
