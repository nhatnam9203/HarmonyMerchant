import { useFormik } from 'formik';
import * as Yup from 'yup';
import NavigationServices from '@navigators/NavigatorServices';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  BIRTH_DAY_DATE_FORMAT_STRING,
  statusSuccess,
  dateToString,
} from '@shared/utils';
import {
  useEditAddress,
  useCreateAddress,
  useDeleteAddress,
} from '@shared/services/api/retailer';

export const useProps = ({ params: { isNew, isEdit, item, customerId } }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [currentAddress, setCurrentAddress] = React.useState(null);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [addressEdit, editAddress] = useEditAddress();
  const [addressCreate, createAddress] = useCreateAddress();
  const [, deleteAddress] = useDeleteAddress(() => {
    NavigationServices.navigate('retailer.customer.detail', {
      reload: true,
      customerId,
    });
  });
  /**
  |--------------------------------------------------
  | VALIDATE
  |--------------------------------------------------
  */
  const form = useFormik({
    initialValues: item
      ? Object.assign({}, item, {
          firstName: item?.addressFirstName,
          lastName: item?.addressLastName,
          zip: item?.zipCode,
          state: item?.stateId,
          phone: item?.addressPhone,
        })
      : {},
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required(t('FirstName is required!')),
      lastName: Yup.string().required(t('FirstName is required!')),
      phone: Yup.string().required(t('Phone is required')),
      street: Yup.string(),
      city: Yup.string(),
      zip: Yup.string(),
      state: Yup.number(),
      defaultShippingAddress: Yup.boolean(),
      defaultBillingAddress: Yup.boolean(),
    }),
    onSubmit: (values) => {
      if (isNew) {
        createAddress(values, customerId);
      } else if (isEdit) {
        editAddress(values, customerId);
      }
    },
  });

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */
  React.useEffect(() => {
    if (!addressCreate && !addressEdit) {
      return;
    }

    const { codeStatus, message, data } = addressCreate || addressEdit;
    if (statusSuccess(codeStatus)) {
      setErrorMsg(null);
      // NavigationServices.goBack();
      NavigationServices.navigate('retailer.customer.detail', {
        reload: true,
        customerId,
      });

      return;
    }

    if (message) {
      setErrorMsg(message);
    }
  }, [addressCreate, addressEdit]);

  React.useEffect(() => {
    if (item)
      setCurrentAddress(
        Object.assign({}, item, {
          firstName: item?.addressFirstName,
          lastName: item?.addressLastName,
          zip: item?.zipCode,
          state: item?.stateId,
          phone: item?.addressPhone,
        })
      );
  }, [item]);

  return {
    isNew,
    isEdit,
    form,
    buttonCancelPress: () => {
      NavigationServices.goBack();
    },
    onHandleDeleteAddress: () => {
      deleteAddress(form.values?.id, customerId);
    },
    currentAddress,
  };
};
