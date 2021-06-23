import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";

import { ButtonCustom, PopupParent, Button, ModalCustom } from "@components";
import { ScaleSzie, localize, getCategoryName } from "@utils";
import IMAGE from "@resources";

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
          height: ScaleSzie(280),
          width: ScaleSzie(420),
          backgroundColor: "#fff",
          borderRadius: ScaleSzie(15),
          paddingTop: ScaleSzie(16),
        }}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              color: "#0764B0",
              fontSize: ScaleSzie(24),
              fontWeight: "bold",
            }}
          >
            {`${localize("Please wait", language)}!`}
          </Text>
          <Text
            style={{
              color: "#404040",
              fontSize: ScaleSzie(18),
              marginTop: ScaleSzie(4),
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

          <View style={{ paddingVertical: ScaleSzie(14) }}>
            <ButtonCustom
              width={ScaleSzie(120)}
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
              styleText={{ fontSize: ScaleSzie(15), fontWeight: "normal" }}
            />
          </View>
        </View>
      </View>
    </ModalCustom>
  );
}

export default PopupLoadingExportReport;
