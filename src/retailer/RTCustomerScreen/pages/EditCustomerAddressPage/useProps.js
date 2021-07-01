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
    customerId,
    isBillingAddress = false,
    isShippingAddress = false,
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
    NavigationServices.navigate("retailer.customer.detail", {
      reload: true,
      customerId,
    });
  });
  /**
  |--------------------------------------------------
  | VALIDATE
  |--------------------------------------------------
  */

  Yup.addMethod(Yup.object, "requiredIf", function (list) {
    return this.test({
      name: "requiredIf",
      message: "${path} must have at least one of these keys: ${keys}",
      exclusive: true,
      params: { keys: list.join(", ") },
      test: (value) => value == null || list.some((f) => value[f] != null),
    });
  });

  Yup.addMethod(Yup.object, "atLeastOneOf", function (list) {
    return this.test({
      name: "atLeastOneOf",
      message: "${path} must have at least one of these keys: ${keys}",
      exclusive: true,
      params: { keys: list.join(", ") },
      test: (value) => value == null || list.some((f) => value[f] != null),
    });
  });

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
      // NavigationServices.goBack();
      NavigationServices.navigate("retailer.customer.detail", {
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
    console.log(item);

    if (item) {
      setCurrentAddress(
        Object.assign({}, item, {
          firstName: item?.addressFirstName,
          lastName: item?.addressLastName,
          zip: item?.zipCode,
          state: item?.stateId,
          phone: item?.addressPhone,
        })
      );
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
