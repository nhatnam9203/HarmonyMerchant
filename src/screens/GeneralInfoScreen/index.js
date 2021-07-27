import React from "react";
import { Alert } from "react-native";

import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";
import strings from "./strings";
import {
  validateEmail,
  getIdStateByName,
  scaleSize,
  checkStateIsValid,
} from "@utils";

class GeneralInfoScreen extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      generalInfo: {
        businessName: "",
        doingBusiness: "",
        tax: {
          prefix: "",
          suffix: "",
        },
        businessAddress: {
          address: "",
          city: "",
          state: "",
          zip: "",
        },
        dbaAddress: {
          address: "",
          city: "",
          state: "",
          zip: "",
        },
        businessPhone: "",
        email: "",
        firstName: "",
        lastName: "",
        position: "",
        contactPhone: "",
      },
      isDBAAddress: true,
      dynamicMarginBottomBA: 24,
      dynamicMarginBottomDA: 24,
    };
    this.businessPhoneRef = React.createRef();
    this.contactPhoneRef = React.createRef();
    this.srollGeneralRef = React.createRef();
  }

  scrollGeneralTo(position) {
    this.srollGeneralRef.current?.scrollTo({
      x: 0,
      y: scaleSize(position),
      animated: true,
    });
  }

  updateGeneralInfo(key, value, keyParent = "") {
    const { generalInfo, isDBAAddress } = this.state;
    if (keyParent !== "") {
      const temptParent = generalInfo[keyParent];
      const temptChild = { ...temptParent, [key]: value };
      let temptUpdate;
      if (keyParent === "businessAddress" && isDBAAddress) {
        temptUpdate = {
          ...generalInfo,
          [keyParent]: temptChild,
          dbaAddress: temptChild,
        };
      } else {
        temptUpdate = { ...generalInfo, [keyParent]: temptChild };
      }

      this.setState({
        generalInfo: temptUpdate,
      });
    } else {
      const temptUpdate = { ...generalInfo, [key]: value };
      this.setState({
        generalInfo: temptUpdate,
      });
    }
  }

  nextTab = async () => {
    const { generalInfo, isDBAAddress } = this.state;
    const arrayKey = Object.keys(generalInfo);
    const { stateCity } = this.props;
    let keyError = "";
    for (let i = 0; i < arrayKey.length; i++) {
      if (arrayKey[i] == "tax") {
        if (generalInfo.tax.prefix == "") {
          keyError = "taxPrefix";
          break;
        }
        if (generalInfo.tax.suffix == "") {
          keyError = "taxSuffix";
          break;
        }
      } else if (arrayKey[i] == "businessAddress") {
        if (generalInfo.businessAddress.address == "") {
          keyError = "address";
          break;
        }
        if (generalInfo.businessAddress.city == "") {
          keyError = "city";
          break;
        }
        if (generalInfo.businessAddress.state == "") {
          keyError = "state";
          break;
        }

        if (!checkStateIsValid(stateCity, generalInfo.businessAddress.state)) {
          keyError = "stateInvalid";
          break;
        }

        if (generalInfo.businessAddress.zip == "") {
          keyError = "zip";
          break;
        }
      }
      // ------------- Check DBA Address --------
      else if (arrayKey[i] == "dbaAddress" && !isDBAAddress) {
        if (generalInfo.dbaAddress.address == "") {
          keyError = "address";
          break;
        }
        if (generalInfo.dbaAddress.city == "") {
          keyError = "city";
          break;
        }
        if (generalInfo.dbaAddress.state == "") {
          keyError = "state";
          break;
        }

        if (!checkStateIsValid(stateCity, generalInfo.dbaAddress.state)) {
          keyError = "stateInvalid";
          break;
        }

        if (generalInfo.dbaAddress.zip == "") {
          keyError = "zip";
          break;
        }
      } else if (arrayKey[i] == "email") {
        if (!validateEmail(generalInfo[arrayKey[i]])) {
          keyError = "emailInvalid";
          break;
        }
      } else {
        if (generalInfo[arrayKey[i]] === "") {
          keyError = arrayKey[i];
          break;
        }
      }
    }

    if (keyError !== "") {
      Alert.alert(`${strings[keyError]}`);
    } else {
      const { businessAddress, dbaAddress } = generalInfo;
      const temptBusinessAddress = {
        ...businessAddress,
        state: getIdStateByName(stateCity, businessAddress.state),
      };
      const temptDBAAddress = {
        ...dbaAddress,
        state: getIdStateByName(stateCity, dbaAddress.state),
      };
      const temptGeneralInfo = {
        ...generalInfo,
        tax: `${generalInfo.tax.prefix}-${generalInfo.tax.suffix}`,
        businessPhone: `${this.businessPhoneRef.current?.state.codeAreaPhone}${generalInfo.businessPhone}`,
        contactPhone: `${this.contactPhoneRef.current?.state.codeAreaPhone}${generalInfo.contactPhone}`,
        businessAddress: temptBusinessAddress,
        dbaAddress: temptDBAAddress,
      };
      this.props.actions.app.setGeneralInfo(temptGeneralInfo);
      this.props.goToPage(1);
    }
  };

  setMerchantType = (val) => {
    this.props.actions.app.setMerchantType(val);
  };

  toggleDBAAddress = async () => {
    await this.setState({
      isDBAAddress: !this.state.isDBAAddress,
    });

    if (this.state.isDBAAddress) {
      this.setState({
        generalInfo: {
          ...this.state.generalInfo,
          dbaAddress: this.state.generalInfo.businessAddress,
        },
      });
    } else {
      this.setState({
        generalInfo: {
          ...this.state.generalInfo,
          dbaAddress: {
            address: "",
            city: "",
            state: "",
            zip: "",
          },
        },
      });
    }
  };
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  stateCity: state.dataLocal.stateCity,
});

export default connectRedux(mapStateToProps, GeneralInfoScreen);
