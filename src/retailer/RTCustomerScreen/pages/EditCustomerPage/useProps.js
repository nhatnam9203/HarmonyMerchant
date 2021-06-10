import { useFormik } from "formik";
import * as Yup from "yup";
import NavigationServices from "@navigators/NavigatorServices";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetCustomer,
  useCreateCustomer,
  useEditCustomer,
} from "@shared/services/api/retailer";
import {
  BIRTH_DAY_DATE_FORMAT_STRING,
  statusSuccess,
  dateToString,
} from "@shared/utils";

const log = (obj, message = "") => {
  Logger.log(`[EditCustomerPage] ${message}`, obj);
};

export const useProps = ({ params: { isNew, isEdit, item } }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [errorMsg, setErrorMsg] = React.useState(null);
  /**
  |--------------------------------------------------
  | CALL API

  |--------------------------------------------------
  */
  const [customerCreate, createCustomer] = useCreateCustomer();
  const [customerEdit, editCustomer] = useEditCustomer();
  const [customerGet, getCustomer] = useGetCustomer();

  /**
  |--------------------------------------------------
  | VALIDATE
  |--------------------------------------------------
  */
  const form = useFormik({
    initialValues: {
      firstName: item?.firstName ?? "",
      lastName: item?.lastName ?? "",
      phone: item?.phone ?? "",
      email: item?.email ?? "",
      birthDate: dateToString(
        item?.birthDate ?? new Date(),
        BIRTH_DAY_DATE_FORMAT_STRING
      ),
      gender: "Male",
      IsVip: 0,
      addressPost: {
        firstName: "",
        lastName: "",
        phone: "",
        street: "",
        state: 1,
        city: "",
        zip: "",
        defaultBillingAddress: true,
        defaultShippingAddress: true,
      },
    },
    validationSchema: Yup.object().shape({
      lastName: Yup.string().required(t("FirstName is required!")),
      phone: Yup.string().required(t("Phone is required")),
      email: Yup.string(),
      birthDate: Yup.string(),
      gender: Yup.string(),
      IsVip: Yup.number(),
      addressPost: Yup.object().shape({
        firstName: Yup.string().required(t("FirstName is required!")),
        lastName: Yup.string().required(t("FirstName is required!")),
        phone: Yup.string().required(t("Phone is required")),
        street: Yup.string(),
        state: Yup.number(),
        city: Yup.string(),
        zip: Yup.string(),
        defaultBillingAddress: Yup.boolean(),
        defaultShippingAddress: Yup.boolean(),
      }),
    }),
    onSubmit: (values) => {
      // alert(JSON.stringify(values));
      if (isNew) {
        createCustomer(values);
      } else if (isEdit) {
        editCustomer(values, values.customerId);
      }
    },
  });

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */
  React.useEffect(() => {
    if (!customerCreate && !customerEdit) {
      return;
    }

    const { codeStatus, message, data } = customerCreate || customerEdit;
    if (statusSuccess(codeStatus)) {
      setErrorMsg(null);
      // NavigationServices.goBack();
      NavigationServices.navigate("retailer.customer.list", { reload: true });

      return;
    }

    if (message) {
      setErrorMsg(message);
    }
  }, [customerCreate, customerEdit]);

  React.useEffect(() => {
    if (isEdit && item) {
      getCustomer(item?.customerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!customerGet) return;

    const { codeStatus, message, data } = customerGet;

    if (statusSuccess(codeStatus)) {
      form?.setValues(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerGet]);

  // React.useEffect(() => {
  //   const { email, password, terminalId } = formik.errors;
  //   if (email) {
  //     setErrorMsg(email);
  //   } else if (password) {
  //     setErrorMsg(password);
  //   } else if (terminalId) {
  //     setErrorMsg(terminalId);
  //   } else {
  //     setErrorMsg(null);
  //   }
  // }, [formik.errors]);

  return {
    form,
    errorMsg,
    buttonCancelPress: () => {
      NavigationServices.goBack();
    },
    isEdit,
    isNew,
  };
};
