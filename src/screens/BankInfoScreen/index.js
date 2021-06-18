import connectRedux from "@redux/ConnectRedux";
import { gotoSettingsDevice, scaleSize, validateIsNumber } from "@utils";
import React from "react";
import { Alert, Platform } from "react-native";
import * as ImagePicker from "react-native-image-picker";
import Layout from "./layout";
import strings from "./strings";

class BankInfoScreen extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      visibleUpload: false,
      uriUpload: "",
      savaFileUpload: false,
      isActiveScreen: true,
      fileUpload: {},
      fileId: -1,
      bankInfo: {
        bankName: "",
        accountHolderName: "",
        routingNumber: "",
        accountNumber: "",
      },
    };
    this.uploadVoidCheckRef = React.createRef();
    this.srollBankInfoRef = React.createRef();
  }

  scrollBankInfoTo(position) {
    this.srollBankInfoRef.current?.scrollTo({
      x: 0,
      y: scaleSize(position),
      animated: true,
    });
  }

  setStateFromparent = async (isActiveScreen) => {
    await this.setState({
      isActiveScreen,
    });
  };

  backScreen = async () => {
    await this.setState({
      isActiveScreen: false,
    });
    this.props.goToPage(1);
  };

  updateBankInfo(key, value, keyParent = "") {
    const { bankInfo } = this.state;
    if (keyParent !== "") {
      const temptParent = bankInfo[keyParent];
      const temptChild = { ...temptParent, [key]: value };
      const temptUpdate = { ...bankInfo, [keyParent]: temptChild };
      this.setState({
        bankInfo: temptUpdate,
      });
    } else {
      const temptUpdate = { ...bankInfo, [key]: value };
      this.setState({
        bankInfo: temptUpdate,
      });
    }
  }

  nextSreen = () => {
    const { bankInfo, uriUpload } = this.state;
    const arrayKey = Object.keys(bankInfo);
    let keyError = "";
    for (let i = 0; i < arrayKey.length; i++) {
      if (bankInfo[arrayKey[i]] === "") {
        keyError = arrayKey[i];
        break;
      } else {
        if (arrayKey[i] === "routingNumber") {
          if (!validateIsNumber(bankInfo[arrayKey[i]])) {
            keyError = "routingNumberNotNumber";
            break;
          }
        } else if (arrayKey[i] === "accountNumber") {
          if (!validateIsNumber(bankInfo[arrayKey[i]])) {
            keyError = "accountNumberNotNumber";
            break;
          }
        }
      }
    }
    if (keyError !== "") {
      Alert.alert(`${strings[keyError]}`);
    } else {
      if (uriUpload != "") {
        const temptBankInfo = { ...bankInfo, fileId: this.state.fileId };
        this.props.actions.app.setBankInfo(temptBankInfo);
        this.props.goToPage(3);
      } else {
        Alert.alert(`Please upload a photo`);
      }
    }
  };

  handleVoidCheck = async (response) => {
    if (response.error === "Photo library permissions not granted") {
      gotoSettingsDevice();
    } else if (response.uri) {
      let fileName = response.fileName;
      if (fileName) {
        if (
          Platform.OS === "ios" &&
          (fileName.endsWith(".heic") || fileName.endsWith(".HEIC"))
        ) {
          fileName = `${fileName.split(".")[0]}.JPG`;
        }
      }
      this.uploadVoidCheckRef.current?.setStateFromparent({
        uri: response.uri,
        fileName: fileName,
        type: response.type,
      });
      await this.setState({
        visibleUpload: true,
      });
    }
  };

  takePhoto = () => {
    ImagePicker.launchCamera({}, (response) => {
      if (response.uri) {
        this.handleVoidCheck(response);
      }
    });
  };

  openImageLibrary = () => {
    ImagePicker.launchImageLibrary({}, (response) => {
      if (response.uri) {
        this.handleVoidCheck(response);
      }
    });
  };

  saveVoidCheck = (value) => {
    this.props.actions.upload.uploadAvatar([value]);
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const { isUpload, dataUpload } = this.props;
    const { isActiveScreen } = this.state;
    if (isUpload && isActiveScreen && isUpload !== prevProps.isUpload) {
      await this.setState({
        savaFileUpload: true,
        visibleUpload: false,
        uriUpload: dataUpload.url,
        fileId: dataUpload.fileId,
      });
      this.props.actions.upload.resetStateUpload();
    }
  }
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  loading: state.app.loading,
  isUpload: state.upload.isUpload,
  dataUpload: state.upload.dataUpload,
});

export default connectRedux(mapStateToProps, BankInfoScreen);
