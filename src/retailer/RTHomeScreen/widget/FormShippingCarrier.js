import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import {
  ButtonGradient,
  CustomRadioSelect,
  FormInput,
} from "@shared/components";
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

export const FormShippingCarrier = ({ onChangeValue }) => {
  const [t] = useTranslation();

  const freeSwitchRef = React.useRef(null);
  const flatRateSwitchRef = React.useRef(null);
  const storePickupSwitchRef = React.useRef(null);
  const shippingCarrierRef = React.useRef(null);

  const [shippingCarrier, setShippingCarrier] = React.useState();
  const [trackingNumber, setTrackingNumber] = React.useState();

  const [shippingMethodGroup, setShippingMethodGroup] = React.useState(
    SHIPPING_METHOD_GROUP.STORE_PICKUP
  );
  const [shippingMethodLabel, setShippingMethodLabel] = React.useState();

  const onHandleChangeMethod = (item) => {
    setShippingMethodLabel(item.label);

    switch (item.group) {
      case SHIPPING_METHOD_GROUP.STORE_PICKUP:
        setShippingMethodGroup(SHIPPING_METHOD_GROUP.STORE_PICKUP);

        freeSwitchRef.current?.reset();
        flatRateSwitchRef.current?.reset();
        shippingCarrierRef.current?.reset();
        setShippingCarrier(null);
        setTrackingNumber(null);
        break;
      case SHIPPING_METHOD_GROUP.FLAT_RATE:
        setShippingMethodGroup(SHIPPING_METHOD_GROUP.FLAT_RATE);

        freeSwitchRef.current?.reset();
        storePickupSwitchRef.current?.reset();
        break;
      case SHIPPING_METHOD_GROUP.FREE:
        setShippingMethodGroup(SHIPPING_METHOD_GROUP.FREE);

        flatRateSwitchRef.current?.reset();
        storePickupSwitchRef.current?.reset();

        break;
      default:
        break;
    }
  };

  const onHandleSetShippingCarrier = (item) => {
    setShippingCarrier(item.value);
  };

  React.useEffect(() => {
    if (onChangeValue && typeof onChangeValue === "function") {
      onChangeValue({
        shippingCarrier,
        trackingNumber,
        shippingMethodGroup,
        shippingMethodLabel,
      });
    }
  }, [
    shippingCarrier,
    trackingNumber,
    shippingMethodGroup,
    shippingMethodLabel,
  ]);

  return (
    <View style={layouts.horizontal}>
      <InfoContent
        label={t("Shipping carrier")}
        disabled={shippingMethodGroup === SHIPPING_METHOD_GROUP.STORE_PICKUP}
      >
        <CustomRadioSelect
          ref={shippingCarrierRef}
          data={SHIPPING_CARRIER}
          onSelect={onHandleSetShippingCarrier}
        />
        <InfoHeading label={t("Tracking number")} fontSize={scaleWidth(15)} />
        <FormInput
          style={styles.input}
          placeholder={t("Enter tracking number")}
          onChangeValue={setTrackingNumber}
          defaultValue={trackingNumber}
        />
      </InfoContent>
      <InfoContent label={t("Shipping method")} editable={true}>
        <InfoHeading label={t("Store Pickup")} fontSize={scaleWidth(15)} />
        <CustomRadioSelect
          ref={storePickupSwitchRef}
          data={STORE_PICKUPS}
          onSelect={onHandleChangeMethod}
          defaultValue={0}
          onRenderLabel={(x) => (
            <Text style={styles.textStyle}>
              {x?.label}
              <Text style={styles.textBoldStyle}>
                {" - "}
                {formatMoneyWithUnit(x?.value)}
              </Text>
            </Text>
          )}
        />

        <InfoHeading
          label={t("Flat rate shipping")}
          fontSize={scaleWidth(15)}
        />
        <CustomRadioSelect
          ref={flatRateSwitchRef}
          data={FLAT_RATE_SHIPPING}
          onSelect={onHandleChangeMethod}
          onRenderLabel={(x) => (
            <Text style={styles.textStyle}>
              {x?.label}
              <Text style={styles.textBoldStyle}>
                {" - "}
                {formatMoneyWithUnit(x?.value)}
              </Text>
            </Text>
          )}
        />

        <InfoHeading label={t("Free shipping")} fontSize={scaleWidth(15)} />
        <CustomRadioSelect
          ref={freeSwitchRef}
          data={FREE_SHIPPING}
          onSelect={onHandleChangeMethod}
          onRenderLabel={(x) => (
            <Text style={styles.textStyle}>
              {x?.label}
              <Text style={styles.textBoldStyle}>
                {" - "}
                {formatMoneyWithUnit(x?.value)}
              </Text>
            </Text>
          )}
        />
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
      <View style={layouts.marginVertical} />
      <View style={[layouts.fill]}>{children}</View>
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
});