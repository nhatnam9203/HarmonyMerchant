import React from "react";
import { View, Image, Text, StyleSheet, TextInput } from "react-native";
import { TextInputMask } from "react-native-masked-text";

import IMAGE from "@resources";
import { Button } from "@components";
import { scaleSize } from "@utils";

export default class ItemScalary extends React.Component {
  constructor(props) {
    super(props);
    const { dataInit } = this.props;
    this.state = {
      isCheck: dataInit.isCheck,
      value: dataInit.value,
    };
  }

  setStateFromParent = async (value = "0", isCheck = false) => {
    await this.setState({
      value,
      isCheck,
    });
  };

  onPress = () => {
    if (!this.props.isNotToggleCheck) {
      this.setState(
        (prevState, props) => ({
          isCheck: !prevState.isCheck,
        }),
        () => {
          if (!this.state.isCheck) {
            this.setState({
              value: "0",
            });
          } else {
            this.props.toogleCheck && this.props.toogleCheck();
          }
        }
      );
    }
  };

  render() {
    const { title, placeholder, onFocus, maxLength } = this.props;
    const { isCheck, value } = this.state;
    const temptIconCheck = isCheck ? IMAGE.checkBox : IMAGE.checkBoxEmpty;
    return (
      <View
        style={{
          flexDirection: "row",
          height: scaleSize(36),
          paddingHorizontal: scaleSize(90),
          marginTop: scaleSize(14),
        }}
      >
        <Button
          onPress={this.onPress}
          style={{ width: scaleSize(30), justifyContent: "center" }}
        >
          <Image
            source={temptIconCheck}
            style={{ width: scaleSize(15), height: scaleSize(15) }}
          />
        </Button>

        <View style={{ width: scaleSize(120), justifyContent: "center" }}>
          <Text
            style={{
              color: "#404040",
              fontSize: scaleSize(14),
              fontWeight: "600",
            }}
          >
            {`${title}`}
          </Text>
        </View>

        <View
          style={[
            { width: scaleSize(150), paddingLeft: scaleSize(5) },
            styles.borderTextInput,
          ]}
        >
          <TextInputMask
            type={"money"}
            options={{
              precision: 2,
              separator: ".",
              delimiter: ",",
              unit: "",
              suffixUnit: "",
            }}
            style={{ flex: 1, fontSize: scaleSize(14), color: "#404040" }}
            placeholder={placeholder}
            value={value}
            onChangeText={(val) => this.setState({ value: val })}
            onFocus={() => onFocus()}
            editable={isCheck}
            maxLength={maxLength}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  borderTextInput: {
    borderWidth: 1,
    borderColor: "#C5C5C5",
  },
});
