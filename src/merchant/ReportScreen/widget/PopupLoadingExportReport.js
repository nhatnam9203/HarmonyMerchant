import { ButtonCustom, ModalCustom } from "@components";
import { localize, scaleSize } from "@utils";
import React from "react";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";

const { width } = Dimensions.get("window");

function PopupLoadingExportReport({
  title,
  visible,
  onRequestClose,
  language,
  typeFile,
}) {
  return (
    <ModalCustom transparent={true} visible={visible} onRequestClose={() => {}}>
      <View
        style={{
          height: scaleSize(280),
          width: scaleSize(420),
          backgroundColor: "#fff",
          borderRadius: scaleSize(15),
          paddingTop: scaleSize(16),
        }}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              color: "#0764B0",
              fontSize: scaleSize(24),
              fontWeight: "bold",
            }}
          >
            {`${localize("Please wait", language)}!`}
          </Text>
          <Text
            style={{
              color: "#404040",
              fontSize: scaleSize(18),
              marginTop: scaleSize(4),
            }}
          >
            {`${localize(`${typeFile} file is being created`, language)} ...`}
          </Text>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              transform: [{ scale: 4 }],
            }}
          >
            <ActivityIndicator size={"large"} color="rgb(83,157,209)" />
          </View>

          <View style={{ paddingVertical: scaleSize(14) }}>
            <ButtonCustom
              width={scaleSize(120)}
              height={40}
              backgroundColor="#F1F1F1"
              title={localize("Cancel", language)}
              textColor="#6A6A6A"
              onPress={onRequestClose}
              style={{
                borderWidth: 1,
                borderColor: "#C5C5C5",
                borderRadius: 0,
              }}
              styleText={{ fontSize: scaleSize(15), fontWeight: "normal" }}
            />
          </View>
        </View>
      </View>
    </ModalCustom>
  );
}

export default PopupLoadingExportReport;
