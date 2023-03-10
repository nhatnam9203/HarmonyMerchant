import NavigationServices from "@navigators/NavigatorServices";
import {
  useCreateCustomer,
  useEditCustomer,
  useGetCustomer,
} from "@shared/services/api/retailer";
import {
  BIRTH_DAY_DATE_FORMAT_STRING,
  dateToString,
  statusSuccess,
} from "@shared/utils";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const log = (obj, message = "") => {
  Logger.log(`[EditCustomerPage] ${message}`, obj);
};

export const useProps = ({ params: { isNew, isEdit, item } }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [errorMsg, setErrorMsg] = React.useState(null);
  const [currentCustomer, setCurrentCustomer] = React.useState(null);
  const [collapsedAddress, setCollapsedAddress] = React.useState(false);
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
      birthdate: dateToString(
        item?.birthdate ?? new Date(),
        BIRTH_DAY_DATE_FORMAT_STRING
      ),
      gender: "Male",
      IsVip: 0,
      defaultAddress: {
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
      lastName: Yup.string()
        .ensure()
        .trim()
        .min(1)
        .required(t("LastName is required!")),
      firstName: Yup.string()
        .ensure()
        .trim()
        .min(1)
        .required(t("FirstName is required!")),
      phone: Yup.string()
        .ensure()
        .trim()
        .min(1)
        .required(t("Phone is required")),
      email: Yup.string().email(t("Email is not valid")),
      birthdate: Yup.string(),
      gender: Yup.string(),
      IsVip: Yup.number(),
      addressPost: Yup.object().shape({
        firstName: Yup.string().nullable(),
        lastName: Yup.string().nullable(),
        phone: Yup.string().nullable(),
        street: Yup.string().nullable(),
        state: Yup.number().nullable(),
        city: Yup.string().nullable(),
        zip: Yup.string().nullable(),
        defaultBillingAddress: Yup.boolean(),
        defaultShippingAddress: Yup.boolean(),
      }),
    }),
    onSubmit: (values) => {
      if (isNew) {
        createCustomer(values);
      } else if (isEdit) {
        const { addressPost, addresses, defaultAddress, ...customer } =
          values || {};
        editCustomer(
          Object.assign({}, customer, {
            addressPost: {
              firstName: addressPost.firstName,
              lastName: addressPost.lastName,
              phone: addressPost.phone,
              street: addressPost.street,
              state: addressPost.state,
              city: addressPost.city,
              zip: addressPost.zip,
              defaultBillingAddress: addressPost.defaultBillingAddress,
              defaultShippingAddress: addressPost.defaultShippingAddress,
            },
          }),
          values.customerId
        );
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
      const customer = Object.assign({}, data, {
        birthdate: dateToString(
          data?.birthdate ?? new Date(),
          BIRTH_DAY_DATE_FORMAT_STRING
        ),
        gender: data?.gender ?? "Male",
        addressPost: {
          ...data?.defaultAddress,
          firstName: data?.defaultAddress?.addressFirstName,
          lastName: data?.defaultAddress?.addressLastName,
          phone: data?.defaultAddress?.addressPhone,
          zip: data?.defaultAddress?.zipCode,
          state: data?.defaultAddress?.stateId,
        },
      });
      form.setValues(customer);
      setCurrentCustomer(customer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerGet]);

  // React.useEffect(() => {
  //   const { firstName, lastName, phone } = form.errors;
  //   if (firstName) {
  //     setErrorMsg(firstName);
  //   } else if (lastName) {
  //     setErrorMsg(lastName);
  //   } else if (phone) {
  //     setErrorMsg(phone);
  //   } else {
  //     setErrorMsg(null);
  //   }
  // }, [form?.errors]);

  return {
    form,
    errorMsg,
    buttonCancelPress: () => {
      NavigationServices.goBack();
    },
    isEdit,
    isNew,
    currentCustomer,
    collapsedAddress,
    collapsedAddressSelected: () => {
      setCollapsedAddress((prev) => !prev);
    },
  };
};
