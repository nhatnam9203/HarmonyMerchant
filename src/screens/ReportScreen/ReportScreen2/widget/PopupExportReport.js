import React, { useState, useEffect, forwardRef } from "react";
import { View, Text, Dimensions, StyleSheet, TextInput } from "react-native";

import { ButtonCustom, PopupParent, Button } from "@components";
import { scaleSzie, localize } from "@utils";
import IMAGE from "@resources";

const { width } = Dimensions.get("window");

function PopupExportReport(
  { title, visible, onRequestClose, language, exportFile, fileName },
  ref
) {
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
    <PopupParent
      title={title}
      visible={visible}
      onRequestClose={() => onRequestClose()}
      style={{}}
      width={500}
    >
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
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

          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
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
      </View>
    </PopupParent>
  );
}

const styles = StyleSheet.create({
  container: {
    height: scaleSzie(140),
    backgroundColor: "#fff",
    borderBottomLeftRadius: scaleSzie(15),
    borderBottomRightRadius: scaleSzie(15),
    paddingHorizontal: scaleSzie(10),
    paddingTop: scaleSzie(10),
  },
});

export default PopupExportReport = forwardRef(PopupExportReport);
