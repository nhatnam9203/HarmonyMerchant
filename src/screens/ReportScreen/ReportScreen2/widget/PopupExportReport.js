import { Button, ButtonCustom, ModalCustom } from "@components";
import IMAGE from "@resources";
import { localize, ScaleSzie } from "@utils";
import React, { useEffect, useState } from "react";
import {
  Image, KeyboardAvoidingView, StyleSheet, Text,


  TextInput, View
} from "react-native";



function PopupExportReport({
  title,
  visible,
  onRequestClose,
  language,
  exportFile,
  fileName,
}) {
  /**state */
  const [exportTitle, setExportTitle] = useState("Report Staff");

  /**func */
  const onExportButtonPressed = () => {
    if (exportFile) {
      exportFile();
    }
  };

  /**useEffect */
  useEffect(() => {
    if (fileName?.length > 0) {
      setExportTitle(fileName);
    }
  }, [fileName]);

  /**render */
  return (
    <ModalCustom
      visible={visible}
      onRequestClose={onRequestClose}
      style={{}}
      transparent={true}
    >
      <KeyboardAvoidingView
        behavior="padding"
        style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
      >
        <View style={styles.container}>
          <View
            style={{
              height: ScaleSzie(55),
              backgroundColor: "#0764B0",
              flexDirection: "row",
              width: "100%",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: ScaleSzie(22),
                  fontWeight: "bold",
                }}
              >
                {title}
              </Text>
            </View>
            <View
              style={{
                width: ScaleSzie(70),
                justifyContent: "center",
                alignItems: "flex-end",
                paddingRight: ScaleSzie(12),
              }}
            >
              <Button
                onPress={() => onRequestClose()}
                style={{
                  width: ScaleSzie(34),
                  height: ScaleSzie(34),
                  backgroundColor: "#fff",
                  borderRadius: ScaleSzie(17),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={IMAGE.closePopup}
                  style={{ width: ScaleSzie(16), height: ScaleSzie(16) }}
                />
              </Button>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              marginBottom: 20,
              padding: 20,
            }}
          >
            <View style={{ flexDirection: "row", height: ScaleSzie(40) }}>
              <View
                style={{ marginRight: ScaleSzie(10), justifyContent: "center" }}
              >
                <Text style={{ color: "#404040", fontSize: ScaleSzie(20) }}>
                  {localize("Save as", language)}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#C5C5C5",
                  paddingHorizontal: ScaleSzie(10),
                }}
              >
                <TextInput
                  style={{ flex: 1, fontSize: ScaleSzie(18), color: "#404040" }}
                  value={exportTitle}
                  onChangeText={(value) => setExportTitle(value)}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              height: ScaleSzie(55),
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ButtonCustom
              width={ScaleSzie(120)}
              height={40}
              backgroundColor="#0764B0"
              title={localize("Export", language)}
              textColor="#fff"
              onPress={onExportButtonPressed}
              style={{ borderWidth: 1, borderColor: "#C5C5C5" }}
              styleText={{ fontSize: ScaleSzie(18), fontWeight: "normal" }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ModalCustom>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 600,
    backgroundColor: "#fff",
    borderRadius: ScaleSzie(15),
    overflow: "hidden",
  },
});

export default PopupExportReport;
