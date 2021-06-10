import NavigationServices from '@navigators/NavigatorServices';
import {
  useCreateAttributes,
  useEditAttributes,
  useGetAttributes,
} from '@shared/services/api/retailer';
import { AttributesInputTypes, INPUT_TYPE, statusSuccess } from '@shared/utils';
import { useFormik } from 'formik';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

let counter = -1000000;
export const useProps = ({ params: { isNew, isEdit, item } }) => {
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [backupAttribute, setBackupAttribute] = React.useState(item);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  // new
  const [attributes, createAttributes] = useCreateAttributes();
  // edit
  const [attributeEdit, editAttributes] = useEditAttributes();
  const [attributesGet, getAttributes] = useGetAttributes();
  /**
  |--------------------------------------------------
  | VALIDATE
  |--------------------------------------------------
  */
  const form = useFormik({
    initialValues: item ?? {
      inputType: AttributesInputTypes[0].value,
      updateProductImage: false,
    },
    validationSchema: Yup.object().shape({
      label: Yup.string().required(t('Label Value is required')),
      inputType: Yup.string(),
      updateProductImage: Yup.boolean(),
      values: Yup.array().of(
        Yup.object().shape({
          label: Yup.string(),
          value: Yup.string(),
          position: Yup.number(),
        }),
      ),
    }),
    onSubmit: (values) => {
      // alert(JSON.stringify(values));
      if (isNew) {
        createAttributes(values);
      } else if (isEdit) {
        editAttributes(values);
      }
    },
  });

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */
  React.useEffect(() => {
    if (!attributes && !attributeEdit) {
      return;
    }

    const { codeStatus, message, data } = attributes || attributeEdit;
    if (statusSuccess(codeStatus)) {
      setErrorMsg(null);
      NavigationServices.navigate('retailer.settings.main', { reload: true });

      return;
    }

    if (message) {
      setErrorMsg(message);
    }
  }, [attributes, attributeEdit]);

  React.useEffect(() => {
    if (attributesGet?.data) {
      const formatValues = attributesGet?.data.values?.map((v) =>
        Object.assign({}, _.pickBy(v), { key: v.id }),
      );

      const attribute = Object.assign({}, attributesGet?.data, {
        values: formatValues,
      });

      form?.setValues(attribute);
      setBackupAttribute(attribute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributesGet?.data]);

  React.useEffect(() => {
    if (isEdit && item) {
      getAttributes(item.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getHeaderKeys = () => {
    return form?.values?.inputType === INPUT_TYPE.VISUAL_SWATCH
      ? {
          value: t('Swatch'),
          label: t('Value Label'),
          actions: t('Actions'),
        }
      : {
          label: t('Value Label'),
          actions: t('Actions'),
        };
  };

  const getTableKeys = () => {
    return form?.values?.inputType === INPUT_TYPE.VISUAL_SWATCH
      ? ['value', 'label', 'actions']
      : ['label', 'actions'];
  };

  const newAttributesByInputType = () => {
    counter++;

    switch (form?.values?.inputType) {
      case INPUT_TYPE.DROP_DOWN:
      case INPUT_TYPE.TEXT_SWATCH:
        return { label: null, position: -1, key: counter + '' };
      case INPUT_TYPE.VISUAL_SWATCH:
        return {
          label: null,
          value: null,
          position: -1,
          key: counter + '',
        };
      default:
        break;
    }
  };

  const addAttribute = () => {
    const newAttribute = newAttributesByInputType();

    form.setFieldValue('values', [
      ...(form?.values?.values ?? []),
      newAttribute,
    ]);
  };

  const editAttribute = (key, obj) => {
    let values = form?.values?.values || [];

    form.setFieldValue(
      'values',
      values.map((v) => {
        if (v.key === key) {
          return Object.assign({}, v, obj);
        }
        return v;
      }),
    );
  };

  const deleteAttribute = (key) => {
    let values = form?.values?.values || [];

    form.setFieldValue(
      'values',
      values.filter((v) => v.key !== key),
    );
  };

  const updateAttributes = (data) => {
    form.setFieldValue('values', data);
  };

  const onChangeInputType = (val) => {
    form?.setFieldValue('inputType', val);
    form.setFieldValue(
      'values',
      backupAttribute?.inputType === val ? backupAttribute.values : [],
    );
  };

  return {
    isNew,
    isEdit,
    buttonCancelPress: () => {
      NavigationServices.goBack();
    },
    getHeaderKeys,
    getTableKeys,
    form,
    onNewAttributeButtonPress: addAttribute,
    updateAttributes,
    editAttribute,
    deleteAttribute,
    onChangeInputType,
  };
};
