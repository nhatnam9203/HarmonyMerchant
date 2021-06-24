import { Button, ButtonCustom, ModalCustom } from "@components";
import IMAGE from "@resources";
import { localize, scaleSzie } from "@utils";
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
              height: scaleSzie(55),
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
                  fontSize: scaleSzie(22),
                  fontWeight: "bold",
                }}
              >
                {title}
              </Text>
            </View>
            <View
              style={{
                width: scaleSzie(70),
                justifyContent: "center",
                alignItems: "flex-end",
                paddingRight: scaleSzie(12),
              }}
            >
              <Button
                onPress={() => onRequestClose()}
                style={{
                  width: scaleSzie(34),
                  height: scaleSzie(34),
                  backgroundColor: "#fff",
                  borderRadius: scaleSzie(17),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={IMAGE.closePopup}
                  style={{ width: scaleSzie(16), height: scaleSzie(16) }}
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
            <View style={{ flexDirection: "row", height: scaleSzie(40) }}>
              <View
                style={{ marginRight: scaleSzie(10), justifyContent: "center" }}
              >
                <Text style={{ color: "#404040", fontSize: scaleSzie(20) }}>
                  {localize("Save as", language)}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#C5C5C5",
                  paddingHorizontal: scaleSzie(10),
                }}
              >
                <TextInput
                  style={{ flex: 1, fontSize: scaleSzie(18), color: "#404040" }}
                  value={exportTitle}
                  onChangeText={(value) => setExportTitle(value)}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              height: scaleSzie(55),
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ButtonCustom
              width={scaleSzie(120)}
              height={40}
              backgroundColor="#0764B0"
              title={localize("Export", language)}
              textColor="#fff"
              onPress={onExportButtonPressed}
              style={{ borderWidth: 1, borderColor: "#C5C5C5" }}
              styleText={{ fontSize: scaleSzie(18), fontWeight: "normal" }}
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
    borderRadius: scaleSzie(15),
    overflow: "hidden",
  },
});

export default PopupExportReport;
