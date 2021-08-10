import { basketRetailer } from "@redux/slices";
import IMAGE from "@resources";
import { ButtonGradientWhite } from "@shared/components";
import { WithDialogPhone } from "@shared/HOC/withDialogPhone";
import { useGetCustomerByPhone } from "@shared/services/api/retailer";
import { colors, fonts, layouts } from "@shared/themes";
import { getFullName, splitCodeAndPhone } from "@shared/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { DialogNewCustomer } from "./DialogNewCustomer";

const ButtonPhone = WithDialogPhone(ButtonGradientWhite);

export const CheckOutCustomerInfo = React.forwardRef(
  ({ customerInfo, canDelete = false }, ref) => {
    const [t] = useTranslation();
    const dispatch = useDispatch();
    const dialogNewRef = React.useRef(null);
    const dialogPhoneRef = React.useRef(null);

    const [customerByPhone, getCustomerByPhone] = useGetCustomerByPhone();
    const [customer, setCustomer] = React.useState(null);

    const [phone, setPhone] = React.useState();

    const onSubmitPhone = (phoneNumber) => {
      const phoneObj = splitCodeAndPhone(phoneNumber);
      const phoneTemp = `${phoneObj.areaCode}${phoneObj.phone}`;
      setPhone(phoneTemp);
      getCustomerByPhone(phoneTemp);
    };

    const onHandleDelete = () => {
      dispatch(basketRetailer.deleteCustomer(customerByPhone?.data));
    };

    const onHandleEditCustomer = () => {
      dialogNewRef.current?.show({ customer });
    };

    React.useImperativeHandle(ref, () => ({
      showPhoneInput: () => {
        setTimeout(() => {
          dialogPhoneRef.current?.show();
        }, 500);
      },
      setCustomer: (info) => {
        setCustomer(info);
      },
    }));

    React.useEffect(() => {
      if (customerByPhone?.data) {
        dispatch(basketRetailer.setCustomer(customerByPhone?.data));
      } else {
        if (phone) {
          setTimeout(() => {
            dialogNewRef.current?.show({ phone: "+" + phone });
          }, 200);
        }
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerByPhone]);

    React.useEffect(() => {
      setCustomer(customerInfo);
    }, [customerInfo]);

    return (
      <>
        {customer ? (
          <TouchableOpacity
            style={styles.container}
            onPress={onHandleEditCustomer}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {customer.firstName?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
            <View style={layouts.marginHorizontal} />
            <View style={styles.nameContent}>
              <Text style={styles.textName}>{getFullName(customer)}</Text>
              <View style={layouts.marginVertical} />
              <Text style={styles.textStyle}>{customer.phone}</Text>
            </View>
            <View style={layouts.marginHorizontal} />
            {canDelete && (
              <ButtonGradientWhite
                width={scaleWidth(40)}
                height={scaleHeight(40)}
                textWeight="normal"
                onPress={onHandleDelete}
              >
                <Image source={IMAGE.DeleteOutline} style={styles.icon} />
              </ButtonGradientWhite>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.container}>
            <Image
              source={IMAGE.checkout_customer_icon}
              style={styles.iconCustomer}
            />
            <View style={layouts.marginHorizontal} />
            <Text style={styles.textStyle}>{t("Walking customer")}</Text>
            <View style={layouts.marginHorizontal} />
            <ButtonPhone
              dialogPhoneRef={dialogPhoneRef}
              width={scaleWidth(30)}
              height={scaleHeight(30)}
              fontSize={scaleFont(13)}
              textWeight="normal"
              onPress={onSubmitPhone}
            >
              <Image source={IMAGE.plus} style={styles.icon} />
            </ButtonPhone>
          </View>
        )}
        <DialogNewCustomer ref={dialogNewRef} />
      </>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: scaleHeight(10),
  },

  customer: {},

  avatar: {
    width: scaleWidth(40),
    height: scaleHeight(40),
    borderRadius: scaleWidth(20),
    backgroundColor: colors.VERY_LIGHT_PINK_E_5,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(23),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.GREYISH_BROWN,
  },

  iconCustomer: { width: scaleWidth(30), height: scaleHeight(30) },

  icon: {
    width: scaleWidth(18),
    height: scaleHeight(18),
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(13),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.31,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  textName: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(15),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: -0.36,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },

  nameContent: {
    flex: 0,
  },
});
