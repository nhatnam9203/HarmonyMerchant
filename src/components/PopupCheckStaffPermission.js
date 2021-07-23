import React from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { TextInputMask } from "react-native-masked-text";

import ButtonCustom from "./ButtonCustom";
import PopupParent from "./PopupParent";
import { scaleSize } from "../utils";
import KeyboardNumeric from "./KeyboardNumeric";
import connectRedux from "@redux/ConnectRedux";

class PopupCheckStaffPermission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      customStyle: {},
      appointmentId: "",
      isBlock: false,
    };
  }

  setStateFromParent = async (
    value = "",
    appointmentId = "",
    isBlock = false
  ) => {
    await this.setState({
      value,
      appointmentId,
      isBlock,
    });
  };

  onChangeValue = (number) => {
    if (number === ".") return;
    let { value } = this.state;
    if (number === "x") {
      value = value.substring(0, value.length - 1);
    } else {
      if (value.toString().length < 4) {
        value += number;
      }
    }
    this.setState({ value });
  };

  submitPin = () => {
    const { profile, tabName } = this.props;
    const { value, appointmentId, isBlock } = this.state;
    if (value.length === 4) {
      this.props.actions.auth.checkStaffPermission(
        profile.merchantCode,
        value,
        tabName,
        appointmentId,
        isBlock
      );
    } else {
      Alert.alert(`PIN must be 4 digits.`);
    }
  };

  onRequestClose = async () => {
    await this.setState({
      value: "",
    });
    this.props.onRequestClose();
  };

  render() {
    const {
      title,
      isLoadingCheckStaffPermission,
      visiblePopupCheckStaffPermission,
      hideCloseButton,
      tabName,
    } = this.props;
    const { value, customStyle, appointmentId } = this.state;
    return (
      <PopupParent
        title={`${title}`}
        visible={visiblePopupCheckStaffPermission}
        onRequestClose={this.onRequestClose}
        hideCloseButton={hideCloseButton}
        style={customStyle}
        width={scaleWidth(380)}
      >
        <View
          style={{
            // minHeight: scaleSize(460),
            // maxHeight: scaleSize(530),
            backgroundColor: "#fff",
            borderBottomLeftRadius: scaleSize(15),
            borderBottomRightRadius: scaleSize(15),
            width: scaleWidth(380),
          }}
        >
          <View
            style={{
              alignItems: "center",
              marginTop: scaleSize(10),
              marginBottom: scaleSize(4),
              paddingHorizontal: scaleWidth(10),
            }}
          >
            <Text
              style={{
                color: "#404040",
                fontSize: scaleSize(16),
                fontWeight: "500",
                marginTop: scaleSize(5),
              }}
            >
              {"Please enter the authorized PIN number"}
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              paddingTop: scaleSize(10),
            }}
          >
            <View
              style={{
                width: "90%",
                height: scaleSize(45),
                borderColor: "#dddddd",
                borderWidth: 2,
              }}
            >
              <TextInputMask
                type="only-numbers"
                style={{
                  flex: 1,
                  fontSize: scaleSize(18),
                  textAlign: "center",
                  padding: 0,
                  margin: 0,
                }}
                placeholder="Your PIN"
                keyboardType="numeric"
                maxLength={4}
                value={value}
                onChangeText={(value) => this.setState({ value })}
                onSubmitEditing={this.submitPin}
                secureTextEntry={true}
                editable={false}
                showSoftInputOnFocus={false}
              />
            </View>
            <KeyboardNumeric onPress={this.onChangeValue} />
          </View>
          <View
            style={{
              height: scaleSize(50),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isLoadingCheckStaffPermission ? (
              <View
                style={{
                  width: "35%",
                  height: scaleSize(40),
                  backgroundColor: "#0764B0",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : (
              <ButtonCustom
                width={"35%"}
                height={40}
                backgroundColor="#0764B0"
                title="SUBMIT"
                textColor="#fff"
                onPress={this.submitPin}
                styleText={{
                  fontSize: scaleSize(14),
                }}
                style={{
                  borderRadius: scaleSize(4),
                }}
              />
            )}
          </View>
        </View>
      </PopupParent>
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener?.remove();
    this.keyboardDidHideListener?.remove();
  }
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  isLoadingCheckStaffPermission: state.auth.isLoadingCheckStaffPermission,
  profile: state.dataLocal.profile,
});

export default connectRedux(mapStateToProps, PopupCheckStaffPermission);
