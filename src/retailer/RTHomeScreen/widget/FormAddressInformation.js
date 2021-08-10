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

export const FormAddressInformation = React.forwardRef(
  (
    {
      onChangeValue,
      billingAddress,
      shippingAddress,
      onChangeShippingAddress,
      onChangeBillingAddress,
      customerId,
      screenId,
    },
    ref
  ) => {
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

    React.useImperativeHandle(ref, () => ({
      reload: () => {
        if (customerId) getCustomer(customerId);
      },
      updateAddress: (addressId, addressCreate) => {
        console.log(addressCreate);
        setSelectedBilling(addressCreate);
        setSelectedShipping(addressCreate);
        setDefaultShipping(addressId);
        setDefaultBilling(addressId);
      },
    }));

    React.useEffect(() => {
      if (customerId) getCustomer(customerId);
    }, [customerId]);

    React.useEffect(() => {
      const { codeStatus, message, data } = customer || {};

      if (statusSuccess(codeStatus)) {
        if (data?.addresses) {
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

          if (billingAddress && !selectedBilling) {
            // !! nhung dong code met moi
            const findItemIndex =
              temps?.findIndex((x) => x.id === billingAddress?.id) || 0;
            if (findItemIndex >= 0 && temps?.length > findItemIndex) {
              const t = temps[findItemIndex];
              setSelectedBilling(t);
              setTimeout(() => {
                billingSelectRef.current?.selectIndex(findItemIndex);
              }, 500);
              setDefaultBilling(t?.id);
            }
          } else if (selectedBilling) {
            const findItemIndex =
              temps.findIndex((x) => x.id === selectedBilling?.id) || 0;

            const t = temps[findItemIndex];
            setSelectedBilling(t);
          }

          if (shippingAddress && !selectedShipping) {
            const findItemIndex =
              temps.findIndex((x) => x.id === shippingAddress?.id) || 0;
            if (findItemIndex >= 0 && temps?.length > findItemIndex) {
              const t = temps[findItemIndex];
              setSelectedShipping(t);
              setTimeout(() => {
                shippingSelectRef.current?.selectIndex(findItemIndex);
              }, 500);
              setDefaultShipping(t?.id);
            }
          } else if (selectedShipping) {
            const findItemIndex =
              temps.findIndex((x) => x.id === shippingAddress?.id) || 0;
            const t = temps[findItemIndex];
            setSelectedShipping(t);
          }
        }
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer]);

    const onEditBillingAddress = () => {
      NavigationServices.navigate("retailer.address.edit", {
        isEdit: true,
        item: selectedBilling,
        customerId,
        screenId,
      });
    };

    const onSelectBillingAddress = (item) => {
      if (item === -1) {
        NavigationServices.navigate("retailer.address.edit", {
          isNew: true,
          customerId,
          screenId,
        });
      } else {
        const findItem = addresses.find((x) => x.id === item);
        billingRef.current?.updateAddress(findItem);
        billingNameRef.current?.updateFirstName(findItem?.addressFirstName);
        billingNameRef.current?.updateLastName(findItem?.addressLastName);

        setSelectedBilling(findItem);
        if (
          onChangeBillingAddress &&
          typeof onChangeBillingAddress === "function"
        ) {
          onChangeBillingAddress(item);
        }
      }
    };

    const onEditShippingAddress = () => {
      NavigationServices.navigate("retailer.address.edit", {
        isEdit: true,
        item: selectedShipping,
        customerId,
        screenId,
      });
    };

    const onSelectShippingAddress = (item) => {
      if (item === -1) {
        NavigationServices.navigate("retailer.address.edit", {
          isNew: true,
          customerId,
          screenId,
        });
      } else {
        const findItem = addresses.find((x) => x.id === item);
        shippingRef.current?.updateAddress(findItem);
        shippingNameRef.current?.updateFirstName(findItem?.addressFirstName);
        shippingNameRef.current?.updateLastName(findItem?.addressLastName);

        setSelectedShipping(findItem);
        if (
          onChangeShippingAddress &&
          typeof onChangeShippingAddress === "function"
        ) {
          onChangeShippingAddress(item);
        }
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
              billingAddressForm.setFieldValue(
                "billingAddressForm.state",
                value
              )
            }
            onChangeZipCodeValue={billingAddressForm.handleChange(
              "billingAddressForm.zip"
            )}
            onChangeStreetValue={billingAddressForm.handleChange(
              "billingAddressForm.street"
            )}
            defaultStateValue={
              selectedBilling?.stateId || selectedBilling?.state
            }
            defaultStreetValue={selectedBilling?.street}
            defaultCityValue={selectedBilling?.city}
            defaultZipCodeValue={
              selectedBilling?.zipCode || selectedBilling?.zip
            }
            useDropDownMenu
            editable={false}
          />

          <FormFullName
            ref={billingNameRef}
            firstName={
              selectedBilling?.addressFirstName || selectedBilling?.firstName
            }
            lastName={
              selectedBilling?.addressLastName || selectedBilling?.lastName
            }
            onChangeFirstName={billingAddressForm.handleChange(
              "billingAddress.firstName"
            )}
            onChangeLastName={billingAddressForm.handleChange(
              "billingAddress.lastName"
            )}
            editable={false}
          />

          <FormPhoneNumber
            defaultPhone={
              selectedBilling?.addressPhone || selectedBilling?.phone
            }
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
            <View style={layouts.marginHorizontal} />
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
            defaultStateValue={
              selectedShipping?.stateId || selectedShipping?.state
            }
            defaultStreetValue={selectedShipping?.street}
            defaultCityValue={selectedShipping?.city}
            defaultZipCodeValue={
              selectedShipping?.zipCode || selectedShipping?.zip
            }
            useDropDownMenu
            editable={false}
          />

          <FormFullName
            ref={shippingNameRef}
            firstName={
              selectedShipping?.addressFirstName || selectedShipping?.firstName
            }
            lastName={
              selectedShipping?.addressLastName || selectedShipping?.lastName
            }
            onChangeFirstName={shippingAddressForm.handleChange(
              "billingAddress.firstName"
            )}
            onChangeLastName={shippingAddressForm.handleChange(
              "billingAddress.lastName"
            )}
            editable={false}
          />

          <FormPhoneNumber
            defaultPhone={
              selectedShipping?.addressPhone || selectedShipping?.phone
            }
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
            <View style={layouts.marginHorizontal} />
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
  }
);

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
