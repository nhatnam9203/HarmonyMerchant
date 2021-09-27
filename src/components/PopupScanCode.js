import React from "react";
import { View, Image } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";

import PopupParent from "./PopupParent";
import { scaleSize } from "../utils";
import connectRedux from "@redux/ConnectRedux";
import ICON from "@resources";
import Button from "./Button";

class PopupScanCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraType: "front",
    };
    this.scannerRef = React.createRef();
  }

  onSuccess = (e) => {
    this.props.resultScanCode(e);
  };

  switchCamera = () => {
    this.setState((prevState) => ({
      cameraType: prevState.cameraType === "front" ? "back" : "front",
    }));
  };

  render() {
    const { onRequestClose, hideCloseButton, visible } = this.props;
    const { customStyle } = this.state;
    return (
      <PopupParent
        title={"Scan Your Code"}
        visible={visible}
        onRequestClose={() => onRequestClose()}
        hideCloseButton={hideCloseButton}
        style={customStyle}
        width={scaleSize(500)}
      >
        <View
          style={{
            height: scaleSize(400),
            width: scaleSize(500),
            backgroundColor: "#fff",
            borderBottomLeftRadius: scaleSize(15),
            borderBottomRightRadius: scaleSize(15),
            overflow: "hidden",
          }}
        >
          <QRCodeScanner
            ref={this.scannerRef}
            onRead={this.onSuccess}
            // cameraProps={{ flashMode: RNCamera.Constants.FlashMode.auto }}
            showMarker={true}
            reactivateTimeout={3000}
            containerStyle={{
              height: scaleSize(400),
              width: scaleSize(500),
            }}
            cameraStyle={{
              height: scaleSize(400),
              width: scaleSize(500),
            }}
            cameraType={this.state.cameraType}
          />
          <View
            style={{
              backgroundColor: "transparent",
              alignItems: "center",
              position: "absolute",
              bottom: scaleSize(15),
              right: 0,
              left: 0,
            }}
          >
            <Button
              onPress={this.switchCamera}
              style={{
                width: scaleSize(40),
                height: scaleSize(40),
                backgroundColor: "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image source={ICON.camera_switcher} />
            </Button>
          </View>
        </View>
      </PopupParent>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  isShowButtonEnterPinCode: state.staff.isShowButtonEnterPinCode,
  visiblePopupActiveGiftCard: state.appointment.visiblePopupActiveGiftCard,
});

export default connectRedux(mapStateToProps, PopupScanCode);
