import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";

import { useTranslation } from "react-i18next";
import { layouts, colors, fonts } from "@shared/themes";
import IMAGE from "@resources";
import {
  SHIPPING_CARRIER,
  STORE_PICKUPS,
  FLAT_RATE_SHIPPING,
  FREE_SHIPPING,
  SHIPPING_METHOD_GROUP,
} from "@shared/utils";
import { formatMoneyWithUnit } from "@utils";
import {
  ButtonGradient,
  FormAddress,
  FormContactEmail,
  FormFullName,
  FormPhoneNumber,
  FormTitle,
  FormSelect,
} from "@shared/components";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  useGetCustomer,
  useDeleteCustomer,
  useBlacklistCustomer,
  useEditAddress,
  useCreateAddress,
  useGetAppointmentByCustomer,
} from "@shared/services/api/retailer";
import {
  BIRTH_DAY_DATE_FORMAT_STRING,
  statusSuccess,
  dateToString,
} from "@shared/utils";
import { withDropdown } from "@shared/helpers/dropdown";
import NavigationServices from "@navigators/NavigatorServices";

export const FormAddressInformation = ({
  onChangeValue,
  billingAddress,
  shippingAddress,
  onChangeShippingAddress,
  onChangeBillingAddress,
  customerId,
}) => {
  const billingSelectRef = React.useRef(null);
  const billingRef = React.useRef(null);
  const billingNameRef = React.useRef(null);

  const shippingSelectRef = React.useRef(null);
  const shippingRef = React.useRef(null);
  const shippingNameRef = React.useRef(null);

  const [t] = useTranslation();
  const [addresses, setAddress] = React.useState([]);
  const [defaultBilling, setDefaultBilling] = React.useState(-1);
  const [defaultShipping, setDefaultShipping] = React.useState(-1);

  const [selectedBilling, setSelectedBilling] = React.useState(null);
  const [selectedShipping, setSelectedShipping] = React.useState(null);

  const billingAddressForm = useFormik({
    initialValues: {
      defaultBillingAddress: true,
      defaultShippingAddress: false,
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required(t("FirstName is required!")),
      lastName: Yup.string().required(t("LastName is required!")),
      phone: Yup.string().required(t("Phone Number is required")),
      street: Yup.string(),
      state: Yup.number(),
      city: Yup.string(),
      zip: Yup.string(),
      defaultBillingAddress: Yup.boolean(),
      defaultShippingAddress: Yup.boolean(),
    }),
    onSubmit: (values) => {},
  });

  const shippingAddressForm = useFormik({
    initialValues: {
      defaultBillingAddress: true,
      defaultShippingAddress: false,
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required(t("FirstName is required!")),
      lastName: Yup.string().required(t("LastName is required!")),
      phone: Yup.string().required(t("Phone Number is required")),
      street: Yup.string(),
      state: Yup.number(),
      city: Yup.string(),
      zip: Yup.string(),
      defaultBillingAddress: Yup.boolean(),
      defaultShippingAddress: Yup.boolean(),
    }),
    onSubmit: (values) => {},
  });

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [customer, getCustomer] = useGetCustomer();

  React.useEffect(() => {
    if (customerId) getCustomer(customerId);
  }, [customerId]);

  React.useEffect(() => {
    const { codeStatus, message, data } = customer || {};

    if (statusSuccess(codeStatus)) {
      if (data.addresses) {
        const newSelectItem = Object.create({
          label: t("Add new address"),
          value: -1,
        });
        const temps = data?.addresses?.map((address) =>
          Object.assign({}, address, {
            label: `${address?.addressFirstName} ${address?.addressLastName}, ${address?.street}, ${address?.city}, ${address?.stateName}`,
            value: address.id,
          })
        );
        setAddress(temps);

        billingSelectRef.current?.setFilterItems([...temps, newSelectItem]);
        shippingSelectRef.current?.setFilterItems([...temps, newSelectItem]);

        if (billingAddress) {
          // !! nhung dong code met moi
          const findItemIndex =
            temps.findIndex((x) => x.id === billingAddress?.id) || 0;
          const t = temps[findItemIndex];
          setSelectedBilling(t);
          setTimeout(() => {
            billingSelectRef.current?.selectIndex(findItemIndex);
          }, 500);
          // setDefaultBilling(t.id);
        }

        if (shippingAddress) {
          const findItemIndex =
            temps.findIndex((x) => x.id === shippingAddress?.id) || 0;
          const t = temps[findItemIndex];
          setSelectedShipping(t);
          setTimeout(() => {
            shippingSelectRef.current?.selectIndex(findItemIndex);
          }, 500);
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const onEditBillingAddress = () => {
    NavigationServices.navigate("retailer.address.edit", {
      isEdit: true,
      item: selectedBilling,
      isBillingAddress: true,
      customerId,
    });
  };

  const onSelectBillingAddress = (item) => {
    if (item === -1) {
      NavigationServices.navigate("retailer.address.edit", {
        isNew: true,
        isBillingAddress: true,
        customerId,
      });
    } else {
      const findItem = addresses.find((x) => x.id === item);
      billingRef.current?.updateAddress(findItem);
      billingNameRef.current?.updateFirstName(findItem?.addressFirstName);
      billingNameRef.current?.updateLastName(findItem?.addressLastName);

      setSelectedBilling(findItem);
    }
  };

  const onEditShippingAddress = () => {
    NavigationServices.navigate("retailer.address.edit", {
      isEdit: true,
      item: selectedShipping,
      isShippingAddress: true,
      customerId,
    });
  };

  const onSelectShippingAddress = (item) => {
    if (item === -1) {
      NavigationServices.navigate("retailer.address.edit", {
        isNew: true,
        isShippingAddress: true,
        customerId,
      });
    } else {
      const findItem = addresses.find((x) => x.id === item);
      shippingRef.current?.updateAddress(findItem);
      shippingNameRef.current?.updateFirstName(findItem?.addressFirstName);
      shippingNameRef.current?.updateLastName(findItem?.addressLastName);

      setSelectedShipping(findItem);
    }
  };

  return (
    <View style={layouts.horizontal}>
      <InfoContent label={t("Billing Address")}>
        <FormAddress
          ref={billingRef}
          reverse={true}
          onChangeCityValue={billingAddressForm.handleChange(
            "billingAddressForm.city"
          )}
          onChangeStateValue={(value) =>
            billingAddressForm.setFieldValue("billingAddressForm.state", value)
          }
          onChangeZipCodeValue={billingAddressForm.handleChange(
            "billingAddressForm.zip"
          )}
          onChangeStreetValue={billingAddressForm.handleChange(
            "billingAddressForm.street"
          )}
          defaultStateValue={selectedBilling?.stateId}
          defaultStreetValue={selectedBilling?.street}
          defaultCityValue={selectedBilling?.city}
          defaultZipCodeValue={selectedBilling?.zipCode}
          useDropDownMenu
          editable={false}
        />

        <FormFullName
          ref={billingNameRef}
          firstName={selectedBilling?.addressFirstName}
          lastName={selectedBilling?.addressLastName}
          onChangeFirstName={billingAddressForm.handleChange(
            "billingAddress.firstName"
          )}
          onChangeLastName={billingAddressForm.handleChange(
            "billingAddress.lastName"
          )}
          editable={false}
        />

        <FormPhoneNumber
          defaultPhone={selectedBilling?.addressPhone}
          onChangePhoneNumber={billingAddressForm.handleChange(
            "billingAddressForm.phone"
          )}
          editable={false}
        />

        <View style={[layouts.horizontal, layouts.center]}>
          <FormSelect
            isDropdown
            filterRef={billingSelectRef}
            filterItems={addresses}
            defaultValue={defaultBilling}
            onChangeValue={onSelectBillingAddress}
            style={{ flex: 1 }}
          />
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEditBillingAddress}
          >
            <Image source={IMAGE.edit_customer_icon} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </InfoContent>
      <View style={layouts.marginHorizontal} />
      <InfoContent label={t("Shipping Address")}>
        <FormAddress
          ref={shippingRef}
          reverse={true}
          onChangeCityValue={shippingAddressForm.handleChange(
            "shippingAddressForm.city"
          )}
          onChangeStateValue={(value) =>
            shippingAddressForm.setFieldValue(
              "shippingAddressForm.state",
              value
            )
          }
          onChangeZipCodeValue={shippingAddressForm.handleChange(
            "shippingAddressForm.zip"
          )}
          onChangeStreetValue={shippingAddressForm.handleChange(
            "shippingAddressForm.street"
          )}
          defaultStateValue={selectedShipping?.stateId}
          defaultStreetValue={selectedShipping?.street}
          defaultCityValue={selectedShipping?.city}
          defaultZipCodeValue={selectedShipping?.zipCode}
          useDropDownMenu
          editable={false}
        />

        <FormFullName
          ref={shippingNameRef}
          firstName={selectedShipping?.addressFirstName}
          lastName={selectedShipping?.addressLastName}
          onChangeFirstName={shippingAddressForm.handleChange(
            "billingAddress.firstName"
          )}
          onChangeLastName={shippingAddressForm.handleChange(
            "billingAddress.lastName"
          )}
          editable={false}
        />

        <FormPhoneNumber
          defaultPhone={selectedShipping?.addressPhone}
          onChangePhoneNumber={shippingAddressForm.handleChange(
            "shippingAddressForm.phone"
          )}
          editable={false}
        />

        <View style={[layouts.horizontal, layouts.center]}>
          <FormSelect
            isDropdown
            filterRef={shippingSelectRef}
            filterItems={addresses}
            defaultValue={defaultShipping}
            onChangeValue={onSelectShippingAddress}
            style={{ flex: 1 }}
          />
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEditShippingAddress}
          >
            <Image source={IMAGE.edit_customer_icon} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </InfoContent>
    </View>
  );
};

let InfoHeading = ({ label, onPress, editable = false, fontSize }) => {
  return (
    <View style={styles.infoLineContent}>
      {!!label && (
        <Text style={[styles.infoHeaderText, fontSize && { fontSize }]}>
          {label}
        </Text>
      )}
      {editable && (
        <TouchableOpacity onPress={onPress}>
          <Image
            style={{ width: scaleWidth(16), height: scaleHeight(16) }}
            source={IMAGE.edit_customer_icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

let InfoContent = ({
  label,
  onPress,
  children,
  editable = false,
  disabled = false,
}) => {
  return (
    <View
      style={styles.infoContent}
      pointerEvents={disabled ? "none" : "auto"}
      opacity={disabled ? 0.3 : 1}
    >
      <InfoHeading label={label} onPress={onPress} editable={editable} />
      <View style={[layouts.fill, { flexDirection: "column-reverse" }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: scaleHeight(80),
    borderWidth: scaleWidth(1),
    borderColor: "#C5C5C5",
    textAlignVertical: "top",
    padding: scaleWidth(16),
  },

  infoLineContent: {
    flexDirection: "row",
    // justifyContent: 'space-between',
    alignItems: "center",
  },

  infoHeaderText: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(17),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
    marginRight: scaleWidth(10),
  },

  infoContent: {
    flex: 1,
  },

  input: {
    width: scaleWidth(200),
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  textBoldStyle: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(15),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  editButton: {
    width: scaleWidth(40),
    height: scaleHeight(40),
    backgroundColor: colors.WHITE_FA,
    borderStyle: "solid",
    borderWidth: scaleWidth(1),
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    width: scaleWidth(18),
    height: scaleHeight(18),
    resizeMode: "contain",
    tintColor: colors.GREYISH_BROWN,
  },
});
