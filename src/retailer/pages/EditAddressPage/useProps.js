import NavigationServices from "@navigators/NavigatorServices";
import {
  useCreateAddress,
  useDeleteAddress,
  useEditAddress,
} from "@shared/services/api/retailer";
import { statusSuccess } from "@shared/utils";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

export const useProps = ({
  params: {
    isNew,
    isEdit,
    item,
    customerId = 0,
    isBillingAddress = false,
    isShippingAddress = false,
    screenId,
    editShippingAddress,
    editBillingAddress,
  },
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = React.useState(null);

  const [currentAddress, setCurrentAddress] = React.useState({
    defaultShippingAddress: isShippingAddress,
    defaultBillingAddress: isBillingAddress,
  });

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [addressEdit, editAddress] = useEditAddress();
  const [addressCreate, createAddress] = useCreateAddress();
  const [, deleteAddress] = useDeleteAddress(() => {
    // NavigationServices.navigate("retailer.customer.detail", {
    //   reload: true,
    //   customerId,
    // });
    NavigationServices.goBack();
  });
  /**
  |--------------------------------------------------
  | VALIDATE
  |--------------------------------------------------
  */

  const form = useFormik({
    initialValues: item
      ? Object.assign({}, item, {
          ...(!item?.firstName && { firstName: item?.addressFirstName }),
          ...(!item?.lastName && { lastName: item?.addressLastName }),
          ...(!item?.zip && { zip: item?.zipCode }),
          ...(!item?.state && { state: item?.stateId }),
          ...(!item?.phone && { phone: item?.addressPhone }),
        })
      : {},
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required(t("FirstName is required!")),
      lastName: Yup.string().required(t("FirstName is required!")),
      phone: Yup.string().required(t("Phone is required")),
      street: Yup.string(),
      city: Yup.string(),
      zip: Yup.string(),
      state: Yup.number().required(),
      defaultShippingAddress: Yup.boolean().default(isShippingAddress),
      defaultBillingAddress: Yup.boolean().default(isBillingAddress),
    }),
    onSubmit: (values) => {
      if (isNew || !values?.id) {
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
      if (screenId) {
        NavigationServices.navigate(screenId, {
          reload: true,
          customerId,
          addressId: data,
          addressCreate: form.values,
          editShippingAddress,
          editBillingAddress,
        });
      } else {
        NavigationServices.goBack();
      }

      return;
    }

    if (message) {
      setErrorMsg(message);
    }
  }, [addressCreate, addressEdit]);

  React.useEffect(() => {
    if (item) {
      const temp = Object.assign({}, item, {
        ...(!item?.firstName && { firstName: item?.addressFirstName }),
        ...(!item?.lastName && { lastName: item?.addressLastName }),
        ...(!item?.zip && { zip: item?.zipCode }),
        ...(!item?.state && { state: item?.stateId }),
        ...(!item?.phone && { phone: item?.addressPhone }),
      });

      setCurrentAddress(temp);
    }
  }, [item]);

  return {
    isNew,
    isEdit,
    form,
    buttonCancelPress: () => {
      setCurrentAddress(null);
      NavigationServices.goBack();
    },
    onHandleDeleteAddress: () => {
      deleteAddress(form.values?.id, customerId);
    },
    currentAddress,
  };
};
