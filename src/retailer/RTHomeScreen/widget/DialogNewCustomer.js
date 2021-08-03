import { basketRetailer } from "@redux/slices";
import {
  ButtonGradient,
  FormAddress,
  FormContactEmail,
  FormFullName,
  FormPhoneNumber,
  FormTitle,
} from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import {
  useCreateCustomer,
  useEditCustomer,
} from "@shared/services/api/retailer";
import { colors, fonts, layouts } from "@shared/themes";
import { statusSuccess } from "@shared/utils";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const log = (obj, message = "") => {
  Logger.log(`[DialogNewCustomer] ${message}`, obj);
};

export const DialogNewCustomer = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);
  const [isEdit, setEdit] = React.useState(false);

  const [currentCustomer, setCurrentCustomer] = React.useState(null);

  const [firstName, setFirstName] = React.useState(null);
  const [lastName, setLastName] = React.useState(null);
  const [phone, setPhone] = React.useState(null);

  /**
  |--------------------------------------------------
  | CALL API

  |--------------------------------------------------
  */
  const [customerData, createCustomer] = useCreateCustomer();
  const [customerEdit, editCustomer] = useEditCustomer();

  React.useImperativeHandle(ref, () => ({
    show: ({ phone, customer }) => {
      if (phone) {
        setEdit(false);
        setCurrentCustomer({ phone });

        form.setFieldValue("phone", phone);
        setPhone(phone);
      } else if (customer) {
        setEdit(true);
        const formatCustomer = Object.assign({}, customer, {
          addressPost: customer?.addressPost ?? {
            ...customer?.defaultAddress,
            firstName: customer?.defaultAddress?.addressFirstName,
            lastName: customer?.defaultAddress?.addressLastName,
            phone: customer?.defaultAddress?.addressPhone,
            zip: customer?.defaultAddress?.zipCode,
            state: customer?.defaultAddress?.stateId,
          },
        });
        form.setValues(formatCustomer);
        setCurrentCustomer(formatCustomer);

        setPhone(formatCustomer.phone);
        setFirstName(formatCustomer.firstName);
        setLastName(formatCustomer.lastName);
      }

      dialogRef.current?.show();
    },
    hide: () => {
      dialogRef.current?.hide();
    },
  }));

  const onHandleFirstNameChange = (text) => {
    form?.setFieldValue("firstName", text);
    if (!form.values.addressPost?.firstName) {
      // form?.setFieldValue("addressPost.firstName", text);
      setFirstName(text);
    }
  };
  const onHandleLastNameChange = (text) => {
    form?.setFieldValue("lastName", text);
    if (!form.values.addressPost?.lastName)
      // form?.setFieldValue("addressPost.lastName", text);
      setLastName(text);
  };

  const onHandlePhoneChange = (phone) => {
    form.setFieldValue("phone", phone);
    if (!form.values.addressPost?.phone) {
      // form?.setFieldValue("addressPost.phone", phone);
      setPhone(phone);
    }
  };

  /**
  |--------------------------------------------------
  | VALIDATE
  |--------------------------------------------------
  */
  const form = useFormik({
    initialValues: {},
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required(t("FirstName is required!")),
      lastName: Yup.string().required(t("LastName is required!")),
      phone: Yup.string().required(t("Phone Number is required")),
      email: Yup.string(),
      addressPost: Yup.object().shape({
        firstName: Yup.string(),
        lastName: Yup.string(),
        phone: Yup.string(),
        street: Yup.string(),
        state: Yup.number(),
        city: Yup.string(),
        zip: Yup.string(),
        defaultBillingAddress: Yup.boolean(),
        defaultShippingAddress: Yup.boolean(),
      }),
    }),
    onSubmit: (values) => {
      if (!isEdit) {
        let addressFirstName = form.values.addressPost?.firstName;
        if (!addressFirstName) {
          addressFirstName = firstName;
        }

        let addressLastName = form.values.addressPost?.lastName;
        if (!addressLastName) {
          addressLastName = lastName;
        }

        let addressPhone = form.values.addressPost?.phone;
        if (!addressPhone) {
          addressPhone = phone;
        }

        createCustomer(
          Object.assign({}, values, {
            addressPost: Object.assign({}, values.addressPost, {
              firstName: addressFirstName,
              lastName: addressLastName,
              phone: addressPhone,
            }),
          })
        );
      } else {
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
      dialogRef.current?.hide();
    },
  });

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */
  React.useEffect(() => {
    if (!customerData && !customerEdit) {
      return;
    }

    const { codeStatus, message, data } = customerData || customerEdit;
    if (statusSuccess(codeStatus)) {
      if (!isEdit) {
        dispatch(basketRetailer.setCustomer(data));
      } else {
        dispatch(basketRetailer.setCustomer(form.values));
      }
    }
  }, [customerData, customerEdit]);

  return (
    <View>
      <DialogLayout
        title={isEdit ? t("Edit customer") : t("New customer")}
        ref={dialogRef}
        behavior={"none"}
        bottomChildren={() => (
          <View style={styles.bottomStyle}>
            <ButtonGradient
              label={t("Next")}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              disable={!form.isValid || !form.dirty}
              onPress={form.handleSubmit}
            />
          </View>
        )}
        style={styles.dialog}
      >
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <View style={layouts.marginHorizontal} />
            {/* <View>
              <FormTitle label={t('Shipping address')} />
              <View style={layouts.marginHorizontal} />
              <View style={styles.row}>
                <CustomCheckBox
                  label={t('Same as billing address')}
                  value={true}
                  textStyle={styles.textStyle}
                  // onValueChange={setToggleCheckBox}
                />
              </View>
              <View style={layouts.marginHorizontal} />
              <FormFullName
                title={t('Name')}
                firstName={currentCustomer?.defaultAddress?.firstName}
                lastName={currentCustomer?.defaultAddress?.lastName}
                onChangeFirstName={form.handleChange('addressPost.firstName')}
                onChangeLastName={form.handleChange('addressPost.lastName')}
              />

              <FormAddress
                reverse={true}
                onChangeCityValue={form.handleChange('addressPost.city')}
                onChangeStateValue={(value) =>
                  form.setFieldValue('addressPost.state', value)
                }
                onChangeZipCodeValue={form.handleChange('addressPost.zip')}
                onChangeStreetValue={form.handleChange('addressPost.street')}
                defaultStateValue={currentCustomer?.defaultAddress?.state}
                defaultStreetValue={currentCustomer?.defaultAddress?.street}
                defaultCityValue={currentCustomer?.defaultAddress?.city}
                defaultZipCodeValue={currentCustomer?.defaultAddress?.zip}
              />
            </View> */}

            <FormFullName
              firstName={currentCustomer?.addressPost?.firstName ?? firstName}
              lastName={currentCustomer?.addressPost?.lastName ?? lastName}
              onChangeFirstName={form.handleChange("addressPost.firstName")}
              onChangeLastName={form.handleChange("addressPost.lastName")}
              required={false}
            />

            <FormPhoneNumber
              defaultPhone={currentCustomer?.addressPost?.phone ?? phone}
              onChangePhoneNumber={form.handleChange("addressPost.phone")}
              required={false}
            />

            <FormAddress
              reverse={true}
              onChangeCityValue={form.handleChange("addressPost.city")}
              onChangeStateValue={(value) =>
                form.setFieldValue("addressPost.state", value)
              }
              onChangeZipCodeValue={form.handleChange("addressPost.zip")}
              onChangeStreetValue={form.handleChange("addressPost.street")}
              defaultStateValue={currentCustomer?.addressPost?.state}
              defaultStreetValue={currentCustomer?.addressPost?.street}
              defaultCityValue={currentCustomer?.addressPost?.city}
              defaultZipCodeValue={currentCustomer?.addressPost?.zip}
              useDropDownMenu
              widthMenu={302}
            />

            <FormTitle label={t("Address")} />

            <View style={styles.row}>
              <View style={layouts.fill}>
                <FormPhoneNumber
                  defaultPhone={currentCustomer?.phone}
                  onChangePhoneNumber={onHandlePhoneChange}
                />
              </View>
              <View style={layouts.marginHorizontal} />
              <View style={layouts.fill}>
                <FormContactEmail
                  onChangeEmail={form.handleChange("email")}
                  defaultValue={currentCustomer?.email}
                />
              </View>
            </View>

            <FormFullName
              title={t("Customer Name")}
              firstName={currentCustomer?.firstName}
              lastName={currentCustomer?.lastName}
              onChangeFirstName={onHandleFirstNameChange}
              onChangeLastName={onHandleLastNameChange}
            />
          </View>
        </KeyboardAwareScrollView>
      </DialogLayout>
    </View>
  );
});

const styles = StyleSheet.create({
  dialog: {
    flex: 0,
    width: scaleWidth(680),
  },

  container: {
    flex: 0,
    flexDirection: "column-reverse",
  },

  row: { flexDirection: "row", alignItems: "center" },

  bottomStyle: {
    width: "100%",
    height: scaleHeight(80),
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  title: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(23),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.VERY_LIGHT_PINK_C_5,
  },
});
