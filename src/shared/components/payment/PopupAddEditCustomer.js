import {
  ButtonCustom,
  Dropdown,
  PopupParent,
  TextInputSuggestion,
} from "@components";
import connectRedux from "@redux/ConnectRedux";
import {
  checkIsTablet,
  checkStateIsValid,
  getCodeAreaPhone,
  getIdStateByName,
  getNameStateById,
  ListCodeAreaPhone,
  localize,
  scaleSize,
} from "@utils";
import React from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";

class PopupAddEditCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerInfo: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        addressPost: {
          street: "",
          city: "",
          state: "",
          zip: "",
        },
        referrerPhone: "",
        favourite: "",
        isVip: "Normal",
      },
      customerId: 0,
      codeAreaPhone: "+1",
      codeReferrerPhone: "+1",
      dynamicMarginBottomState: 24,
    };
    this.scrollCustomerRef = React.createRef();
  }

  updateCustomerInfo(key, value, keyParent = "") {
    const { customerInfo } = this.state;
    if (keyParent !== "") {
      const temptParent = customerInfo[keyParent];
      const temptChild = { ...temptParent, [key]: value };
      const temptUpdate = { ...customerInfo, [keyParent]: temptChild };
      this.setState({
        customerInfo: temptUpdate,
      });
    } else {
      const temptUpdate = { ...customerInfo, [key]: value };
      this.setState({
        customerInfo: temptUpdate,
      });
    }
  }

  setStateFromParent = async (customer) => {
    await this.setState({
      customerInfo: {
        firstName: customer?.firstName || "",
        lastName: customer?.lastName || "",
        phone: getCodeAreaPhone(customer?.phone).phone,
        email: customer?.email || "",
        addressPost: {
          street: customer?.street || "",
          city: customer?.city || "",
          state: customer?.stateId
            ? getNameStateById(this.props.stateCity, customer?.stateId)
            : "",
          zip: customer?.zip || "",
        },
        referrerPhone: getCodeAreaPhone(customer?.referrerPhone).phone,
        favourite: customer?.favourite,
        isVip: customer?.isVip === 0 ? "Normal" : "VIP",
      },
      customerId: customer?.customerId || "",
      codeAreaPhone: getCodeAreaPhone(customer?.phone).areaCode,
      codeReferrerPhone: getCodeAreaPhone(customer?.referrerPhone).areaCode,
    });
  };

  setStateDefaultFromParent = async () => {
    await this.setState({
      customerInfo: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        addressPost: {
          street: "",
          city: "",
          state: "",
          zip: "",
        },
        referrerPhone: "",
        favourite: "",
        isVip: "Normal",
      },
    });
  };

  doneAddProduct = () => {
    const { stateCity } = this.props;
    const { customerInfo } = this.state;
    const arrayKey = Object.keys(customerInfo);
    let keyError = "";
    for (let i = 0; i <= arrayKey.length - 1; i++) {
      if (
        customerInfo[arrayKey[i]] == "" &&
        (arrayKey[i] === "firstName" ||
          arrayKey[i] === "lastName" ||
          arrayKey[i] === "phone")
      ) {
        keyError = arrayKey[i];
        break;
      }

      if (
        customerInfo?.addressPost?.state !== "" &&
        !checkStateIsValid(stateCity, customerInfo?.addressPost?.state)
      ) {
        keyError = "StateInvalid";
        break;
      }
    }

    if (keyError != "") {
      Alert.alert(`${strings[keyError]}`);
    } else {
      const { addressPost } = customerInfo;
      const temptAddress = {
        ...addressPost,
        state: addressPost?.state
          ? getIdStateByName(this.props.stateCity, addressPost.state)
          : 0,
      };
      const temptCustomerInfo = {
        ...customerInfo,
        phone: customerInfo.phone
          ? `${this.state.codeAreaPhone}${customerInfo.phone}`
          : "",
        referrerPhone: customerInfo.referrerPhone
          ? `${this.state.codeReferrerPhone}${customerInfo.referrerPhone}`
          : "",
        addressPost: temptAddress,
        isVip: customerInfo.isVip === "Normal" ? 0 : 1,
      };

      if (this.state.customerId) {
        this.props.editCustomerInfo(this.state.customerId, temptCustomerInfo);
      } else {
        this.props.addCustomerInfo(temptCustomerInfo);
      }

      // if (this.props.isSave) {
      //     this.props.editCustomer(this.state.customerId, temptCustomerInfo);
      // } else {
      //     this.props.addCustomer(temptCustomerInfo);
      // }
    }
  };

  scrollCustomerTo = (position) => () => {
    this.scrollCustomerRef.current?.scrollTo({
      x: 0,
      y: scaleSize(position),
      animated: true,
    });
  };

  onChangeText = (value, count = 0) => {
    this.updateCustomerInfo("state", value, "addressPost");
    this.setState({
      dynamicMarginBottomState: count * 24,
    });
  };

  onRequestClose = () => {
    this.props.actions.appointment.switchVisibleAddEditCustomerPopup(false);
  };

  // ----------- render ----------

  render() {
    const {
      title,
      visible,
      onRequestClose,
      isSave,
      language,
      visibleAddEditCustomerPopup,
    } = this.props;
    const temptTitleButton = isSave ? "Save" : "Add";

    const { dynamicMarginBottomState } = this.state;
    const {
      firstName,
      lastName,
      phone,
      email,
      referrerPhone,
      favourite,
      addressPost,
      isVip,
    } = this.state.customerInfo;
    const { street, city, state, zip } = addressPost;
    const tempHeight = checkIsTablet() ? scaleSize(390) : scaleSize(480);

    return (
      <PopupParent
        title={title}
        visible={visibleAddEditCustomerPopup}
        onRequestClose={this.onRequestClose}
        styleTitle={{
          fontSize: scaleSize(20),
          fontWeight: "600",
        }}
      >
        <View
          style={{
            height: tempHeight,
            backgroundColor: "#fff",
            borderBottomLeftRadius: scaleSize(15),
            borderBottomRightRadius: scaleSize(15),
            paddingHorizontal: scaleSize(30),
          }}
        >
          <View style={{ flex: 1 }}>
            <ScrollView
              ref={this.scrollCustomerRef}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
            >
              <TouchableOpacity activeOpacity={1}>
                {/* ----- */}
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: scaleSize(10),
                    marginBottom: scaleSize(10),
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#404040",
                        fontSize: scaleSize(12),
                        marginBottom: scaleSize(6),
                      }}
                    >
                      {`${localize("First Name", language)}*`}
                    </Text>
                    <View style={{ height: scaleSize(30) }}>
                      <View
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderColor: "#C5C5C5",
                          paddingHorizontal: scaleSize(5),
                        }}
                      >
                        <TextInput
                          placeholder="Jerry"
                          style={{
                            flex: 1,
                            fontSize: scaleSize(16),
                            padding: 0,
                          }}
                          value={firstName}
                          onChangeText={(value) =>
                            this.updateCustomerInfo("firstName", value)
                          }
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{ width: scaleSize(10) }} />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#404040",
                        fontSize: scaleSize(12),
                        marginBottom: scaleSize(6),
                      }}
                    >
                      {`${localize("Last Name", language)}*`}
                    </Text>
                    <View style={{ height: scaleSize(30) }}>
                      <View
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderColor: "#C5C5C5",
                          paddingHorizontal: scaleSize(5),
                        }}
                      >
                        <TextInput
                          placeholder="Nguyen"
                          style={{
                            flex: 1,
                            fontSize: scaleSize(16),
                            padding: 0,
                          }}
                          value={lastName}
                          onChangeText={(value) =>
                            this.updateCustomerInfo("lastName", value)
                          }
                        />
                      </View>
                    </View>
                  </View>
                </View>
                {/* ---- */}
                <Text
                  style={{
                    color: "#404040",
                    fontSize: scaleSize(12),
                    marginBottom: scaleSize(6),
                    marginTop: scaleSize(7),
                  }}
                >
                  {`${localize("Phone Number", language)}*`}
                </Text>
                <View
                  style={{
                    height: scaleSize(30),
                    flexDirection: "row",
                    marginBottom: scaleSize(10),
                  }}
                >
                  <View style={{ width: scaleSize(70) }}>
                    <Dropdown
                      label={"+1"}
                      data={ListCodeAreaPhone}
                      value={this.state.codeAreaPhone}
                      onChangeText={(codeAreaPhone) =>
                        this.setState({ codeAreaPhone })
                      }
                      containerStyle={{
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        borderColor: "#C5C5C5",
                        flex: 1,
                      }}
                    />
                  </View>
                  <View style={{ width: scaleSize(8) }} />
                  <View
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: "#C5C5C5",
                      paddingHorizontal: scaleSize(10),
                    }}
                  >
                    <TextInputMask
                      type={"custom"}
                      options={{
                        mask: "999-999-9999",
                      }}
                      placeholder="012-345-6456"
                      style={{ flex: 1, fontSize: scaleSize(16), padding: 0 }}
                      value={phone}
                      onChangeText={(value) =>
                        this.updateCustomerInfo("phone", value)
                      }
                      onFocus={this.scrollCustomerTo(60)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {/* ---- */}
                <Text
                  style={{
                    color: "#404040",
                    fontSize: scaleSize(12),
                    marginBottom: scaleSize(6),
                    marginTop: scaleSize(7),
                  }}
                >
                  {localize("Contact Email", language)}
                </Text>
                <View
                  style={{
                    height: scaleSize(30),
                    borderWidth: 1,
                    borderColor: "#C5C5C5",
                    paddingLeft: scaleSize(10),
                  }}
                >
                  <TextInput
                    placeholder="example@gmail.com"
                    style={{ flex: 1, fontSize: scaleSize(16), padding: 0 }}
                    value={email}
                    onChangeText={(value) =>
                      this.updateCustomerInfo("email", value)
                    }
                    onFocus={this.scrollCustomerTo(140)}
                  />
                </View>
                {/* ------- */}
                <Text
                  style={{
                    color: "#404040",
                    fontSize: scaleSize(12),
                    marginBottom: scaleSize(6),
                    marginTop: scaleSize(7),
                  }}
                >
                  {localize("Address", language)}
                </Text>
                <View
                  style={{
                    height: scaleSize(30),
                    borderWidth: 1,
                    borderColor: "#C5C5C5",
                    paddingLeft: scaleSize(10),
                  }}
                >
                  <TextInput
                    placeholder="Street"
                    style={{ flex: 1, fontSize: scaleSize(16), padding: 0 }}
                    value={street}
                    onChangeText={(value) =>
                      this.updateCustomerInfo("street", value, "addressPost")
                    }
                    onFocus={this.scrollCustomerTo(195)}
                  />
                </View>
                {/* ----- */}
                <View
                  style={{ flexDirection: "row", marginTop: scaleSize(10) }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ height: scaleSize(30) }}>
                      <View
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderColor: "#C5C5C5",
                          paddingHorizontal: scaleSize(5),
                        }}
                      >
                        <TextInput
                          placeholder={localize("City", language)}
                          style={{
                            flex: 1,
                            fontSize: scaleSize(16),
                            padding: 0,
                          }}
                          value={city}
                          onChangeText={(value) =>
                            this.updateCustomerInfo(
                              "city",
                              value,
                              "addressPost"
                            )
                          }
                          onFocus={this.scrollCustomerTo(195)}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={{ width: scaleSize(10) }} />
                  {/* -------  */}
                  <View style={{ flex: 1 }}>
                    <View style={{ height: scaleSize(30) }}>
                      <View
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderColor: "#C5C5C5",
                          paddingHorizontal: scaleSize(5),
                        }}
                      >
                        <TextInput
                          placeholder={localize("Zip Code", language)}
                          style={{
                            flex: 1,
                            fontSize: scaleSize(16),
                            padding: 0,
                          }}
                          value={zip}
                          onChangeText={(value) =>
                            this.updateCustomerInfo("zip", value, "addressPost")
                          }
                          onFocus={this.scrollCustomerTo(198)}
                          maxLength={5}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {/* ----------------- Zip Code --------------- */}
                <View
                  style={{ flexDirection: "row", marginTop: scaleSize(10) }}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        height: scaleSize(30),
                        marginBottom: scaleSize(dynamicMarginBottomState),
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <TextInputSuggestion
                          value={state}
                          onChangeText={this.onChangeText}
                          resetMarginState={() =>
                            this.setState({ dynamicMarginBottomState: 24 })
                          }
                          onFocus={this.scrollCustomerTo(290)}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{ width: scaleSize(10) }} />
                  <View style={{ flex: 1 }} />
                </View>

                {/* ---- Referrer Phone Number */}
                <Text
                  style={{
                    color: "#404040",
                    fontSize: scaleSize(12),
                    marginBottom: scaleSize(6),
                    marginTop: scaleSize(7),
                  }}
                >
                  {localize("Referral Phone", language)}
                </Text>
                <View style={{ height: scaleSize(30), flexDirection: "row" }}>
                  <View style={{ width: scaleSize(70) }}>
                    <Dropdown
                      label={"+1"}
                      data={ListCodeAreaPhone}
                      value={this.state.codeReferrerPhone}
                      onChangeText={(codeReferrerPhone) =>
                        this.setState({ codeReferrerPhone })
                      }
                      containerStyle={{
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        borderColor: "#C5C5C5",
                        flex: 1,
                      }}
                    />
                  </View>
                  <View style={{ width: scaleSize(8) }} />
                  <View
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: "#C5C5C5",
                      paddingHorizontal: scaleSize(10),
                    }}
                  >
                    <TextInputMask
                      type={"custom"}
                      options={{
                        mask: "999-999-9999",
                      }}
                      placeholder="0123 456 456"
                      style={{ flex: 1, fontSize: scaleSize(16), padding: 0 }}
                      value={referrerPhone}
                      onChangeText={(value) =>
                        this.updateCustomerInfo("referrerPhone", value)
                      }
                      onFocus={this.scrollCustomerTo(350)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {/* ----- Attribute Level ------- */}
                <Text
                  style={{
                    color: "#404040",
                    fontSize: scaleSize(12),
                    marginBottom: scaleSize(2),
                    marginTop: scaleSize(15),
                  }}
                >
                  {localize("Attribute Level", language)}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: scaleSize(5),
                    marginBottom: scaleSize(10),
                  }}
                >
                  <View style={{ flex: 1, paddingRight: scaleSize(10) }}>
                    <View style={{ height: scaleSize(30) }}>
                      <View style={{ flex: 1 }}>
                        <Dropdown
                          label={""}
                          data={[{ value: "Normal" }, { value: "VIP" }]}
                          value={isVip}
                          onChangeText={(value) =>
                            this.updateCustomerInfo("isVip", value)
                          }
                          containerStyle={{
                            backgroundColor: "#F1F1F1",
                            borderWidth: 1,
                            borderColor: "#C5C5C5",
                            flex: 1,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 1 }} />
                </View>

                {/* ---- */}
                <Text
                  style={{
                    color: "#404040",
                    fontSize: scaleSize(12),
                    marginBottom: scaleSize(10),
                    marginTop: scaleSize(7),
                  }}
                >
                  {localize("Note", language)}
                </Text>
                <View
                  style={{
                    height: scaleSize(110),
                    backgroundColor: "#F1F1F1",
                    paddingHorizontal: scaleSize(10),
                    paddingBottom: scaleSize(8),
                    paddingTop: scaleSize(8),
                  }}
                >
                  <Text
                    style={{
                      color: "#404040",
                      fontSize: scaleSize(14),
                      marginBottom: scaleSize(8),
                    }}
                  >
                    {localize("Note about customer's favourite", language)}
                  </Text>
                  <View style={{ flex: 1, justifyContent: "flex-end" }}>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        borderColor: "#C5C5C5",
                        borderTopLeftRadius: 4,
                        borderBottomLeftRadius: 4,
                        paddingHorizontal: scaleSize(10),
                        paddingVertical: 4,
                      }}
                    >
                      <TextInput
                        style={{
                          flex: 1,
                          fontSize: scaleSize(12),
                          padding: 0,
                          textAlignVertical: "top",
                        }}
                        value={favourite}
                        onChangeText={(value) =>
                          this.updateCustomerInfo("favourite", value)
                        }
                        onFocus={this.scrollCustomerTo(500)}
                        multiline={true}
                      />
                    </View>
                  </View>
                </View>
                {/* -----  */}
                <View style={{ height: scaleSize(250) }} />
              </TouchableOpacity>
            </ScrollView>
          </View>
          {/* ---- Footer ---- */}
          <View style={{ height: scaleSize(50), alignItems: "center" }}>
            <ButtonCustom
              width={150}
              height={35}
              backgroundColor="#0764B0"
              title={temptTitleButton}
              textColor="#fff"
              onPress={this.doneAddProduct}
              style={{ borderRadius: scaleSize(2) }}
              styleText={{
                fontSize: scaleSize(14),
              }}
            />
          </View>
        </View>
      </PopupParent>
    );
  }

  async componentDidUpdate(prevProps, prevState) {
    const { isGetCustomerInCheckoutTabSuccess, customerInfoInCheckoutTab } =
      this.props;
    if (
      isGetCustomerInCheckoutTabSuccess &&
      prevProps.isGetCustomerInCheckoutTabSuccess !==
        isGetCustomerInCheckoutTabSuccess
    ) {
      this.setStateFromParent({ ...customerInfoInCheckoutTab });
      this.props.actions.customer.resetStateIsGetCustomerInCheckoutTabSuccess(
        false
      );
    }
  }
}

const strings = {
  firstName: "Missing Info: First Name",
  lastName: "Missing Info: Last Name",
  phone: "Missing Info: Phone",
  StateInvalid: "State Invalid",
};

const mapStateToProps = (state) => ({
  stateCity: state?.dataLocal?.stateCity,
  visibleAddEditCustomerPopup: state.appointment.visibleAddEditCustomerPopup,
  isGetCustomerInCheckoutTabSuccess:
    state.customer.isGetCustomerInCheckoutTabSuccess,
  customerInfoInCheckoutTab: state.customer.customerInfoInCheckoutTab,
});

export default connectRedux(mapStateToProps, PopupAddEditCustomer);
