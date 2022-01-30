import connectRedux from "@redux/ConnectRedux";
import React from "react";
import {
  ActivityIndicator, Image, Keyboard, Text,
  TextInput, TouchableOpacity, View
} from "react-native";
import IMAGE from "../resources";
import { scaleSize } from "../utils";
import Button from "./Button";
import PopupParent from "./PopupParent";
import PopupScanCode from "./PopupScanCode";


class PopupActiveGiftCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      customStyle: {},
      loading: false,
      codeAreaPhone: "+1",
      visibleScanCode: false,
      scancode: "",
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardWillShow",
      this.keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardWillHide",
      this.keyboardDidHide
    );
  }

  setStateFromParent = async () => {
    await this.setState({
      scancode: "",
      visibleScanCode: false,
      value: "",
    });
  };

  keyboardDidShow = async () => {
    await this.setState({
      customStyle: {
        justifyContent: "flex-start",
        paddingTop: scaleSize(80),
      },
    });
  };

  keyboardDidHide = async () => {
    await this.setState({
      customStyle: {},
      // scancode: "",
    });
  };

  scanCodeGiftCard = () => {
    this.setState({
      visibleScanCode: true,
    });
  };

  onRequestCloseScanCode = () => {
    this.setState({
      visibleScanCode: false,
      scancode: "",
    });
  };

  resultScanCode = async (e) => {
    await this.setState({
      visibleScanCode: false,
      scancode: `${e.data}`.trim(),
    });
  };

  submitSerialCode = () => {
    const { scancode } = this.state;
    if (scancode === "") {
      alert("Enter your code!");
    } else {
      this.props.submitSerialCode(`${scancode}`);
      this.setState({ scancode: "" });
    }
  };

  render() {
    const {
      title,
      onRequestClose,
      hideCloseButton,
      visiblePopupActiveGiftCard,
      loading,
      visiblePopupGiftCard,
    } = this.props;

    const visiblePopup = visiblePopupGiftCard ?? visiblePopupActiveGiftCard;
    const { customStyle, scancode } = this.state;
    return (
      <>
        <PopupParent
          title={title}
          visible={visiblePopup}
          onRequestClose={() => onRequestClose()}
          hideCloseButton={hideCloseButton}
          style={customStyle}
        >
          <View
            style={{
              height: scaleSize(150),
              backgroundColor: "#fff",
              borderBottomLeftRadius: scaleSize(15),
              borderBottomRightRadius: scaleSize(15),
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: scaleSize(10),
                marginBottom: scaleSize(4),
              }}
            >
              <Text style={{ color: "#404040", fontSize: scaleSize(18) }}>
                {"Enter gift card serial number"}
              </Text>
            </View>
            <View
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              <View
                style={{
                  width: "80%",
                  height: scaleSize(45),
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    borderColor: "rgb(231,231,231)",
                    borderWidth: 2,
                    paddingHorizontal: scaleSize(10),
                  }}
                >
                  <TextInput
                    style={{
                      flex: 1,
                      fontSize: scaleSize(15),
                      fontWeight: "500",
                      textAlign: "center",
                      padding: 0,
                      margin: 0,
                    }}
                    placeholder="Your gift card"
                    keyboardType="numeric"
                    value={scancode}
                    onChangeText={(scancode) => this.setState({ scancode })}
                    onSubmitEditing={this.submitSerialCode}
                  />
                </View>
                <Button
                  onPress={this.scanCodeGiftCard}
                  style={{
                    width: scaleSize(50),
                    backgroundColor: "#F1F1F1",
                    borderColor: "rgb(231,231,231)",
                    borderWidth: 2,
                    borderLeftWidth: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image source={IMAGE.scancode} />
                </Button>
              </View>
            </View>
            <View
              style={{
                height: scaleSize(45),
                alignItems: "center",
              }}
            >
              {loading ? (
                <View
                  style={{
                    width: "30%",
                    height: scaleSize(35),
                    backgroundColor: "#0764B0",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={this.submitSerialCode}
                  style={{
                    width: "30%",
                    height: 45,
                    borderRadius: scaleSize(4),
                    backgroundColor: "#0764B0",
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute'
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: scaleSize(15), }}>{"Add Card"}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

        </PopupParent>

        <PopupScanCode
          visible={this.state.visibleScanCode}
          onRequestClose={this.onRequestCloseScanCode}
          resultScanCode={this.resultScanCode}
        />
      </>
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener?.remove();
    this.keyboardDidHideListener?.remove();
  }
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  isShowButtonEnterPinCode: state.staff.isShowButtonEnterPinCode,
  visiblePopupActiveGiftCard: state.appointment.visiblePopupActiveGiftCard,
  loading: state.app.loading,
});

export default connectRedux(mapStateToProps, PopupActiveGiftCard);

// 10120061202600003
