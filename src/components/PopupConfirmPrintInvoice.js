import React from "react";
import { View, Text } from "react-native";

import ButtonCustom from "./ButtonCustom";
import PopupParent from "./PopupParent";
import { scaleSize, localize } from "../utils";

class PopupConfirmPrintInvoice extends React.Component {
  render() {
    const { title, visible, message, onRequestClose, confimYes, language } =
      this.props;

    return (
      <PopupParent
        title={title}
        visible={visible}
        onRequestClose={() => onRequestClose()}
      >
        <View
          style={{
            height: scaleSize(130),
            backgroundColor: "#fff",
            borderBottomLeftRadius: scaleSize(15),
            borderBottomRightRadius: scaleSize(15),
          }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "#404040", fontSize: scaleSize(18) }}>
              {message}
            </Text>
          </View>
          <View
            style={{
              height: scaleSize(45),
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, alignItems: "center" }}>
              <ButtonCustom
                width={"60%"}
                height={35}
                backgroundColor="#fff"
                title={localize("NO", language)}
                textColor="#6A6A6A"
                onPress={() => onRequestClose()}
                style={{
                  borderWidth: 1,
                  borderColor: "#C5C5C5",
                }}
                styleText={{
                  fontSize: scaleSize(14),
                }}
              />
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <ButtonCustom
                width={"60%"}
                height={35}
                backgroundColor="#0764B0"
                title={localize("PRINT", language)}
                textColor="#fff"
                onPress={() => confimYes()}
                styleText={{
                  fontSize: scaleSize(14),
                }}
              />
            </View>
          </View>
        </View>
      </PopupParent>
    );
  }
}

export default PopupConfirmPrintInvoice;
