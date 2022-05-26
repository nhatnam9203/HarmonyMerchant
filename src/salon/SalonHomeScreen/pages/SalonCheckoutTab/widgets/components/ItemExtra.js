import { Button, Text } from "@components";
import ICON from "@resources";
import { msToTime, scaleSize } from "@utils";
import _ from "ramda";
import React from "react";
import { View } from "react-native";
import FastImage from "react-native-fast-image";

const ItemExtra = ({
  extra,
  onPressSelectExtra,
  arrSelectedExtra,
  groupAppointment,
  appointmentDetail,
}) => {
  let isSelect = false;
  if (arrSelectedExtra && arrSelectedExtra.length > 0) {
    for (let i = 0; i < arrSelectedExtra.length; i++) {
      if (arrSelectedExtra[i]?.extraId === extra?.extraId) {
        isSelect = true;
        break;
      }
    }
  }

  let isSelectOnServer = false;
  const appointments = groupAppointment?.appointments || [];
  for (let i = 0; i < appointments.length; i++) {
    const extras = appointments[i]?.extras || [];
    for (let j = 0; j < extras.length; j++) {
      if (extras[j]?.extraId === extra?.extraId) {
        isSelectOnServer = true;
        break;
      }
    }
    if (isSelectOnServer) {
      break;
    }
  }

  if (!isSelectOnServer && !_.isEmpty(appointmentDetail)) {
    const extras = appointmentDetail?.extras || [];
    for (let j = 0; j < extras.length; j++) {
      if (extras[j]?.extraId === extra?.extraId) {
        isSelectOnServer = true;
        break;
      }
    }
  }

  const temtemptBackgrounColorSelectOnServer = isSelectOnServer
    ? { backgroundColor: "#DCF7FF" }
    : {};
  const temptBackgrounColor = isSelect ? { backgroundColor: "#0764B0" } : {};
  const temptTextColor = isSelect ? { color: "#fff" } : {};

  return (
    <Button
      onPress={() => onPressSelectExtra(extra)}
      style={[
        {
          height: scaleSize(70),
          justifyContent: "center",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#DDDDDD",
          backgroundColor: "#fff",
          flexDirection: "row",
          padding: scaleSize(8),
        },
        temtemptBackgrounColorSelectOnServer,
        temptBackgrounColor,
      ]}
    >
      <View
        style={{
          width: scaleSize(50),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: scaleSize(50),
            height: scaleSize(50),
            borderRadius: scaleSize(3),
            overflow: "hidden",
          }}
        >
          {extra?.imageUrl ? (
            <FastImage
              style={{ width: scaleSize(50), height: scaleSize(50) }}
              source={{
                uri: extra.imageUrl,
                priority: FastImage.priority.low,
                cache: FastImage.cacheControl.immutable,
              }}
              // onError={() => setSource(ICON.extra_holder)}
            />
          ) : (
            <FastImage
              style={{ width: scaleSize(50), height: scaleSize(50) }}
              source={ICON.extra_holder}
            />
          )}
        </View>
      </View>

      <View style={{ flex: 1, paddingLeft: scaleSize(8) }}>
        <View style={{ height: scaleSize(40) }}>
          <Text
            numberOflines={2}
            style={[
              { fontSize: scaleSize(12), color: "#0764B0", fontWeight: "600" },
              temptTextColor,
            ]}
          >
            {extra?.name || ""}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            numberOflines={2}
            style={
              ([
                {
                  fontSize: scaleSize(10),
                  color: "#6A6A6A",
                  fontWeight: "300",
                },
              ],
              temptTextColor)
            }
          >
            {`${msToTime(extra?.duration || 0)}`}
          </Text>

          <Text
            numberOflines={2}
            style={
              ([
                {
                  color: "#6A6A6A",
                  fontSize: scaleSize(10),
                  fontWeight: "600",
                },
              ],
              { ...temptTextColor, fontSize: scaleSize(10), fontWeight: "600" })
            }
          >
            {`$ ${extra?.price || ""}`}
          </Text>
        </View>
      </View>
    </Button>
  );
};

export default ItemExtra;
