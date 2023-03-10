import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";

import ButtonCustom from "./ButtonCustom";
import PopupParent from "./PopupParent";
import BrowserFile from "./BrowserFile";
import { Dropdown } from "./react-native-material-dropdown";
import Button from "./Button";
import {
  scaleSize,
  getCategoryName,
  getArrayNameCategories,
  getCategoryIdByName,
  localize,
  checkIsTablet,
} from "@utils";
import connectRedux from "@redux/ConnectRedux";

class PopupAddEditService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceInfo: {
        categoryId: "",
        name: "",
        description: "",
        duration: "",
        openTime: "",
        secondTime: "",
        price: 0.0,
        isDisabled: "Active",
        supplyFee: 0.0,
      },
      arrayExtra: [],
      fileId: 0,
      imageUrl: "",
      isSubmitButton: true,
      isEditSecondTime: false,
    };
    this.durationRef = React.createRef();
    this.openTimeRef = React.createRef();
    this.secondTimeRef = React.createRef();
    this.brwoserFileRef = React.createRef();
    this.arrayExtraRef = [];

    this.nameServiceRef = React.createRef();
    this.scrollServiceRef = React.createRef();
    this.descripRef = React.createRef();
  }

  setServiceFromParent = async (service) => {
    const { categoriesByMerchant } = this.props;
    await this.setState({
      serviceInfo: {
        serviceId: service.serviceId ? service.serviceId : 0,
        categoryId: getCategoryName(categoriesByMerchant, service.categoryId),
        name: service.name ? service.name : "",
        description: service.description ? service.description : "",
        duration: service.duration ? service.duration : "",
        openTime: service.openTime ? service.openTime : "",
        secondTime: service.secondTime ? service.secondTime : "",
        price: service.price ? service.price : 0.01,
        isDisabled: service.isDisabled === 0 ? "Active" : "Disable",
        supplyFee: service.supplyFee ? service.supplyFee : 0.0,
      },
      arrayExtra: service.extras.length > 0 ? service.extras : [],
      fileId: 0,
      imageUrl: service.imageUrl,
      isEditSecondTime: service.openTime == "" ? false : true,
    });
  };

  setDefaultStateFromParent = async () => {
    await this.setState({
      serviceInfo: {
        categoryId: "",
        name: "",
        description: "",
        duration: "",
        openTime: "",
        secondTime: "",
        price: 0.0,
        isDisabled: "Active",
        supplyFee: 0.0,
      },
      arrayExtra: [],
      fileId: 0,
      imageUrl: "",
    });
  };

  addExtraRef = (ref) => {
    if (ref != null) {
      this.arrayExtraRef.push(ref);
    }
  };

  updateServiceInfo(key, value, keyParent = "") {
    const { serviceInfo } = this.state;
    if (keyParent !== "") {
      const temptParent = serviceInfo[keyParent];
      const temptChild = { ...temptParent, [key]: value };
      const temptUpdate = { ...serviceInfo, [keyParent]: temptChild };
      this.setState({
        serviceInfo: temptUpdate,
      });
    } else {
      const temptUpdate = { ...serviceInfo, [key]: value };
      this.setState({
        serviceInfo: temptUpdate,
      });
    }
  }

  done = () => {
    const { serviceInfo, isEditSecondTime } = this.state;
    const duration = this.durationRef.current?.state.value;
    const openTime = this.openTimeRef.current?.state.value;
    const secondTime = this.secondTimeRef.current?.state.value;
    const temptServiceInfo = {
      ...serviceInfo,
      duration,
      openTime,
      secondTime,
      categoryId:
        serviceInfo.categoryId !== ""
          ? getCategoryIdByName(
              this.props.categoriesByMerchant,
              serviceInfo.categoryId,
              "Service"
            )
          : "",
    };
    const arrayKey = Object.keys(temptServiceInfo);
    let keyError = "";
    for (let i = 0; i <= arrayKey.length - 1; i++) {
      if (
        arrayKey[i] === "description" ||
        arrayKey[i] === "openTime" ||
        arrayKey[i] === "secondTime"
      ) {
        continue;
      } else if (temptServiceInfo[arrayKey[i]] === "") {
        keyError = arrayKey[i];
        break;
      }
    }
    if (isEditSecondTime && secondTime == "") {
      keyError = "secondTime";
    }
    if (keyError != "") {
      Alert.alert(`${strings[keyError]}`);
    } else {
      // --- Handle extra ---
      const arrayExtra = [];
      let checkValidateExtra = true;
      let errorCheckExtra = "";
      this.arrayExtraRef.forEach((extra) => {
        if (extra != null) {
          if (extra.getInfoExtraFromParent().isValid) {
            const data = extra.getInfoExtraFromParent().data;
            const temptData = {
              ...data,
              isDisabled: data.isDisabled === "Active" ? 0 : 1,
            };
            arrayExtra.push(temptData);
          } else {
            checkValidateExtra = false;
            errorCheckExtra = extra.getInfoExtraFromParent().errorMessage;
          }
        }
      });
      if (checkValidateExtra) {
        const dataServiceAdd = { ...temptServiceInfo, extras: arrayExtra };
        this.arrayExtraRef = [];
        if (this.props.isSave) {
          this.props.editService({
            ...dataServiceAdd,
            isDisabled: dataServiceAdd.isDisabled === "Active" ? 0 : 1,
            fileId: this.state.fileId,
            openTime: openTime === "" ? 0 : openTime,
            secondTime: secondTime === "" ? 0 : secondTime,
          });
        } else {
          this.props.doneAddService({
            ...dataServiceAdd,
            isDisabled: dataServiceAdd.isDisabled === "Active" ? 0 : 1,
            fileId: this.state.fileId,
            openTime: openTime === "" ? 0 : openTime,
            secondTime: secondTime === "" ? 0 : secondTime,
          });
        }
      } else {
        Alert.alert(`${strings[errorCheckExtra]}`);
      }
    }
  };

  addMoreExtra = () => {
    const temptArrayExtra = [...this.state.arrayExtra];
    temptArrayExtra.push({
      name: "",
      description: "",
      duration: "",
      price: "",
      isDisabled: "Active",
    });
    this.setState({
      arrayExtra: temptArrayExtra,
    });
  };

  resetRefPopup = async () => {
    this.arrayExtraRef = [];
    await this.setState({
      fileId: 0,
    });
    this.props.onRequestClose();
  };

  updateFileId = async (fileId) => {
    await this.setState({
      fileId,
    });
  };

  removeExtra = async (indexRemove) => {
    const { arrayExtra } = this.state;
    const temptExtra = arrayExtra.filter(
      (extra, index) => index != indexRemove
    );
    this.arrayExtraRef = this.arrayExtraRef.filter(
      (extra, index) => index != indexRemove
    );
    await this.setState({
      arrayExtra: temptExtra,
    });
  };

  editButtonSubmit = async (isSubmit) => {
    await this.setState({
      isSubmitButton: isSubmit,
    });
  };

  handleInputSecondTime = async (value) => {
    if (value === "") {
      await this.setState({
        isEditSecondTime: false,
      });
      this.secondTimeRef.current?.setStateFromParent("");
    } else {
      await this.setState({
        isEditSecondTime: true,
      });
    }
  };

  scrollServiceTo(position) {
    this.scrollServiceRef.current?.scrollTo({
      x: 0,
      y: scaleSize(position),
      animated: true,
    });
  }

  // ------- Render -----

  renderButtonSubmit() {
    const { isSave, loading } = this.props;
    const { isSubmitButton } = this.state;
    const temptTitleButton = isSave ? "Save" : "Done";
    if (!loading) {
      return (
        <ButtonCustom
          width={150}
          height={35}
          backgroundColor="#0764B0"
          title={temptTitleButton}
          textColor="#fff"
          onPress={this.done}
          style={{ borderRadius: scaleSize(2) }}
          styleText={{
            fontSize: scaleSize(14),
          }}
        />
      );
    } else {
      return (
        <View
          style={{
            width: 150,
            height: scaleSize(35),
            backgroundColor: "#0764B0",
            borderRadius: scaleSize(2),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }
  }

  render() {
    const { title, visible, categoriesByMerchant, language } = this.props;
    const { categoryId, name, description, price, isDisabled, supplyFee } =
      this.state.serviceInfo;
    const tempHeight = checkIsTablet() ? scaleSize(390) : scaleSize(480);

    return (
      <PopupParent
        title={title}
        visible={visible}
        onRequestClose={this.resetRefPopup}
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
              ref={this.scrollServiceRef}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
            >
              <TouchableOpacity activeOpacity={1}>
                <Text
                  style={{
                    color: "#404040",
                    fontSize: scaleSize(12),
                    marginTop: scaleSize(10),
                    marginBottom: scaleSize(10),
                  }}
                >
                  {`${localize("Category", language)}*`}
                </Text>
                <View style={{ width: scaleSize(200), height: scaleSize(30) }}>
                  <Dropdown
                    label="Facial"
                    data={getArrayNameCategories(
                      categoriesByMerchant?.filter((x) => x.isDisabled != 1),
                      "Service"
                    )}
                    value={categoryId}
                    onChangeText={(value) =>
                      this.updateServiceInfo("categoryId", value)
                    }
                    containerStyle={{
                      backgroundColor: "#F1F1F1",
                      borderWidth: 1,
                      borderColor: "#C5C5C5",
                      flex: 1,
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: "#404040",
                    fontSize: scaleSize(12),
                    marginBottom: scaleSize(10),
                    marginTop: scaleSize(7),
                  }}
                >
                  {`${localize("Service", language)}*`}
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
                    ref={this.nameServiceRef}
                    placeholder="Gel Nails"
                    style={{ flex: 1, fontSize: scaleSize(16), padding: 0 }}
                    value={name}
                    onChangeText={(value) =>
                      this.updateServiceInfo("name", value)
                    }
                    onFocus={() => this.scrollServiceTo(70)}
                  />
                </View>
                <Text
                  style={{
                    color: "#404040",
                    fontSize: scaleSize(12),
                    marginBottom: scaleSize(10),
                    marginTop: scaleSize(7),
                  }}
                >
                  {`${localize("Description", language)}`}
                </Text>
                <View
                  style={{
                    height: scaleSize(60),
                    borderWidth: 1,
                    borderColor: "#C5C5C5",
                    paddingLeft: scaleSize(10),
                    backgroundColor: "#FAFAFA",
                    paddingTop: scaleSize(5),
                  }}
                >
                  <TextInput
                    ref={this.descripRef}
                    placeholder=""
                    style={{
                      flex: 1,
                      fontSize: scaleSize(14),
                      padding: 0,
                      textAlignVertical: "top",
                    }}
                    multiline={true}
                    value={description}
                    onChangeText={(value) =>
                      this.updateServiceInfo("description", value)
                    }
                    onFocus={() => this.scrollServiceTo(130)}
                  />
                </View>
                {/* -------------------------- */}
                <Text
                  style={{
                    color: "#404040",
                    fontSize: scaleSize(12),
                    marginBottom: scaleSize(10),
                    marginTop: scaleSize(7),
                  }}
                >
                  {`${localize("Duration", language)}*`}
                </Text>
                <View style={{ height: scaleSize(70), flexDirection: "row" }}>
                  <ItemTime
                    ref={this.durationRef}
                    title={`${localize("Minutes", language)} *`}
                    value={this.state.serviceInfo.duration}
                    editable={true}
                    onFocus={() => this.scrollServiceTo(250)}
                  />
                  <View style={{ width: scaleSize(10) }} />
                  <ItemTime
                    ref={this.openTimeRef}
                    title={`${localize("Open Time", language)}`}
                    editable={true}
                    value={this.state.serviceInfo.openTime}
                    onChangeText={this.handleInputSecondTime}
                    onFocus={() => this.scrollServiceTo(250)}
                  />
                  <View style={{ width: scaleSize(10) }} />
                  <ItemTime
                    ref={this.secondTimeRef}
                    title={`${localize("Second Time", language)}`}
                    value={this.state.serviceInfo.secondTime}
                    editable={this.state.isEditSecondTime}
                    onFocus={() => this.scrollServiceTo(250)}
                  />
                </View>
                <View style={{ height: scaleSize(70), flexDirection: "row" }}>
                  {/* -------------------- Price ----------------- */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#404040",
                        fontSize: scaleSize(12),
                        marginBottom: scaleSize(10),
                        marginTop: scaleSize(7),
                      }}
                    >
                      {`${localize("Price", language)} *`}
                    </Text>
                    <View
                      style={{
                        height: scaleSize(30),
                        paddingHorizontal: scaleSize(5),
                        borderWidth: 1,
                        borderColor: "#C5C5C5",
                        flexDirection: "row",
                      }}
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
                        style={{ flex: 1, fontSize: scaleSize(16), padding: 0 }}
                        placeholder="$ 0.00"
                        value={price}
                        onChangeText={(value) =>
                          this.updateServiceInfo("price", value)
                        }
                        onFocus={() => this.scrollServiceTo(320)}
                      />
                    </View>
                  </View>

                  <View style={{ width: scaleSize(10) }} />
                  {/* -------------------- Supply ----------------- */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#404040",
                        fontSize: scaleSize(12),
                        marginBottom: scaleSize(10),
                        marginTop: scaleSize(7),
                      }}
                    >
                      {`${localize("Surcharged", language)}`}
                    </Text>
                    <View
                      style={{
                        height: scaleSize(30),
                        paddingHorizontal: scaleSize(5),
                        borderWidth: 1,
                        borderColor: "#C5C5C5",
                        flexDirection: "row",
                      }}
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
                        style={{ flex: 1, fontSize: scaleSize(16), padding: 0 }}
                        placeholder="$ 0.00"
                        value={supplyFee}
                        onChangeText={(value) =>
                          this.updateServiceInfo("supplyFee", value)
                        }
                        onFocus={() => this.scrollServiceTo(320)}
                      />
                    </View>
                  </View>

                  <View style={{ width: scaleSize(10) }} />
                  {/* -------------------- Status ----------------- */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#404040",
                        fontSize: scaleSize(12),
                        marginBottom: scaleSize(10),
                        marginTop: scaleSize(7),
                      }}
                    >
                      {`${localize("Status", language)}*`}
                    </Text>
                    <View
                      style={{
                        height: scaleSize(30),
                        width: scaleSize(90),
                        flexDirection: "row",
                      }}
                    >
                      <Dropdown
                        label={`${localize("Active", language)}`}
                        data={[{ value: "Active" }, { value: "Disable" }]}
                        value={isDisabled}
                        onChangeText={(value) =>
                          this.updateServiceInfo("isDisabled", value)
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

                {/* ------- Upload Image ----- */}
                <BrowserFile
                  ref={this.brwoserFileRef}
                  updateFileId={this.updateFileId}
                  imageUrl={this.state.imageUrl}
                  editButtonSubmit={this.editButtonSubmit}
                />
                {/* ------ Line ------ */}
                {this.state.arrayExtra.map((extra, index) => (
                  <ItemExtra
                    ref={this.addExtraRef}
                    key={index}
                    extraInfo={extra}
                    removeExtra={() => this.removeExtra(index)}
                  />
                ))}

                {/* ------ Line ------ */}
                <View
                  style={{
                    height: 3,
                    backgroundColor: "#0764B0",
                    marginTop: scaleSize(8),
                    marginBottom: scaleSize(20),
                  }}
                />

                <View style={{ height: scaleSize(60) }}>
                  <ButtonCustom
                    width={"100%"}
                    height={35}
                    backgroundColor="#4CD964"
                    title={`${localize("Add More Extra", language)}`}
                    textColor="#fff"
                    onPress={this.addMoreExtra}
                    style={{ borderRadius: scaleSize(2) }}
                    styleText={{
                      fontSize: scaleSize(14),
                    }}
                  />
                </View>
                <View style={{ height: scaleSize(250) }} />
              </TouchableOpacity>
            </ScrollView>
          </View>
          {/* ---- Footer ---- */}
          <View style={{ height: scaleSize(50), alignItems: "center" }}>
            {this.renderButtonSubmit()}
          </View>
        </View>
      </PopupParent>
    );
  }
}

class ItemExtra extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      extraInfo: {
        name: "",
        description: "",
        duration: "",
        price: 0.0,
        supplyFee: 0.0,
        isDisabled: "Active",
      },
    };
    this.durationExtraRef = React.createRef();
  }

  componentDidMount() {
    const { extraInfo } = this.props;
    if (extraInfo.extraId) {
      this.setState({
        extraInfo: {
          extraId: extraInfo.extraId ? extraInfo.extraId : 0,
          name: extraInfo.name ? extraInfo.name : "",
          description: extraInfo.description ? extraInfo.description : "",
          duration: extraInfo.duration ? extraInfo.duration : "",
          price: extraInfo.price ? extraInfo.price : 0.0,
          supplyFee: extraInfo.supplyFee ? extraInfo.supplyFee : 0.0,
          isDisabled: extraInfo.isDisabled === 0 ? "Active" : "Disable",
        },
      });
      this.durationExtraRef.current?.setStateFromParent(extraInfo.duration);
    }
  }

  getInfoExtraFromParent = () => {
    const { extraInfo } = this.state;
    const duration = this.durationExtraRef.current?.state.value;
    const temptExtra = {
      ...extraInfo,
      duration: duration,
    };

    const arrayKey = Object.keys(temptExtra);
    let keyError = "";
    for (let i = 0; i <= arrayKey.length - 1; i++) {
      if (arrayKey[i] === "description" || arrayKey[i] === "supplyFee") {
        continue;
      } else if (temptExtra[arrayKey[i]] == "") {
        keyError = `${arrayKey[i]}_extra`;
        break;
      }
    }
    if (keyError != "") {
      return {
        isValid: false,
        errorMessage: keyError,
        data: {},
      };
    }
    return {
      isValid: true,
      errorMessage: "",
      data: temptExtra,
    };
  };

  updateExtraInfo(key, value, keyParent = "") {
    const { extraInfo } = this.state;
    if (keyParent !== "") {
      const temptParent = extraInfo[keyParent];
      const temptChild = { ...temptParent, [key]: value };
      const temptUpdate = { ...extraInfo, [keyParent]: temptChild };
      this.setState({
        extraInfo: temptUpdate,
      });
    } else {
      const temptUpdate = { ...extraInfo, [key]: value };
      this.setState({
        extraInfo: temptUpdate,
      });
    }
  }

  render() {
    const { name, description, duration, price, isDisabled, supplyFee } =
      this.state.extraInfo;
    const { removeExtra } = this.props;
    return (
      <View>
        <View
          style={{
            height: 3,
            backgroundColor: "#0764B0",
            marginTop: scaleSize(8),
            marginBottom: scaleSize(20),
          }}
        />
        {/* ------ Extra ---- */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              color: "#404040",
              fontSize: scaleSize(12),
              marginBottom: scaleSize(10),
              marginTop: scaleSize(7),
            }}
          >
            {`Extra Name*`}
          </Text>
          {/* --------------- */}

          <Button onPress={() => removeExtra()}>
            <Text
              style={{
                color: "red",
                fontSize: scaleSize(12),
                fontWeight: "bold",
                marginBottom: scaleSize(10),
                marginTop: scaleSize(7),
                textDecorationLine: "underline",
              }}
            >
              {`Remove Extra`}
            </Text>
          </Button>
        </View>

        <View
          style={{
            height: scaleSize(30),
            borderWidth: 1,
            borderColor: "#C5C5C5",
            paddingLeft: scaleSize(10),
          }}
        >
          <TextInput
            placeholder="Extra Name"
            style={{ flex: 1, fontSize: scaleSize(16), padding: 0 }}
            value={name}
            onChangeText={(value) => this.updateExtraInfo("name", value)}
          />
        </View>
        <Text
          style={{
            color: "#404040",
            fontSize: scaleSize(12),
            marginBottom: scaleSize(10),
            marginTop: scaleSize(7),
          }}
        >
          {`Description`}
        </Text>
        <View
          style={{
            height: scaleSize(60),
            borderWidth: 1,
            borderColor: "#C5C5C5",
            paddingLeft: scaleSize(10),
            backgroundColor: "#FAFAFA",
            paddingTop: scaleSize(5),
          }}
        >
          <TextInput
            placeholder=""
            style={{
              flex: 1,
              fontSize: scaleSize(14),
              padding: 0,
              textAlignVertical: "top",
            }}
            multiline={true}
            value={description}
            onChangeText={(value) => this.updateExtraInfo("description", value)}
          />
        </View>
        <Text
          style={{
            color: "#404040",
            fontSize: scaleSize(12),
            marginBottom: scaleSize(0),
            marginTop: scaleSize(10),
          }}
        >
          {`Duration*`}
        </Text>
        <ItemTime
          ref={this.durationExtraRef}
          title=""
          value={duration}
          style={{
            marginBottom: 0,
            marginTop: 0,
          }}
        />
        <View
          style={{
            height: scaleSize(70),
            flexDirection: "row",
            marginTop: scaleSize(8),
          }}
        >
          {/* -------------------- Price ----------------- */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#404040",
                fontSize: scaleSize(12),
                marginBottom: scaleSize(10),
                marginTop: scaleSize(7),
              }}
            >
              {`Price*`}
            </Text>
            <View
              style={{
                height: scaleSize(30),
                paddingHorizontal: scaleSize(5),
                borderWidth: 1,
                borderColor: "#C5C5C5",
                flexDirection: "row",
              }}
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
                style={{ flex: 1, fontSize: scaleSize(16), padding: 0 }}
                placeholder="$ 0.00"
                value={price}
                onChangeText={(value) => this.updateExtraInfo("price", value)}
              />
            </View>
          </View>

          <View style={{ width: scaleSize(10) }} />
          {/* -------------------- Supply ----------------- */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#404040",
                fontSize: scaleSize(12),
                marginBottom: scaleSize(10),
                marginTop: scaleSize(7),
              }}
            >
              {`Surcharged`}
            </Text>
            <View
              style={{
                height: scaleSize(30),
                paddingHorizontal: scaleSize(5),
                borderWidth: 1,
                borderColor: "#C5C5C5",
                flexDirection: "row",
              }}
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
                style={{ flex: 1, fontSize: scaleSize(16), padding: 0 }}
                placeholder="$ 0.00"
                value={supplyFee}
                onChangeText={(value) =>
                  this.updateExtraInfo("supplyFee", value)
                }
              />
            </View>
          </View>

          <View style={{ width: scaleSize(10) }} />
          {/* -------------------- Status ----------------- */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#404040",
                fontSize: scaleSize(12),
                marginBottom: scaleSize(10),
                marginTop: scaleSize(7),
              }}
            >
              {`Status*`}
            </Text>
            <View
              style={{
                height: scaleSize(30),
                width: scaleSize(90),
                flexDirection: "row",
              }}
            >
              <Dropdown
                label="Active"
                data={[{ value: "Active" }, { value: "Disable" }]}
                value={isDisabled}
                onChangeText={(value) =>
                  this.updateExtraInfo("isDisabled", value)
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
      </View>
    );
  }
}

class ItemTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }

  setStateFromParent = (value) => {
    this.setState({
      value,
    });
  };

  onChangeText = (value) => {
    this.setState({ value });
    if (this.props.title === "Open Time") {
      this.props.onChangeText(value);
    }
  };

  render() {
    const { title, editable, onFocus, style } = this.props;
    const { value } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={[
            {
              color: "#404040",
              fontSize: scaleSize(12),
              marginBottom: scaleSize(10),
              marginTop: scaleSize(7),
            },
            style,
          ]}
        >
          {title}
        </Text>
        <View
          style={{
            height: scaleSize(30),
            // width: scaleSize(90),
            borderWidth: 1,
            borderColor: "#C5C5C5",
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 1, paddingLeft: scaleSize(5) }}>
            <TextInputMask
              type="only-numbers"
              placeholder="10"
              style={{ flex: 1, fontSize: scaleSize(16), padding: 0 }}
              value={value}
              onChangeText={this.onChangeText}
              editable={editable}
              onFocus={() => onFocus && onFocus()}
            />
          </View>
          <View style={{ justifyContent: "flex-end", paddingRight: 4 }}>
            <Text style={{ color: "#C5C5C5", fontSize: scaleSize(14) }}>
              min
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const strings = {
  categoryId: "Missing Info: Category",
  name: "Missing Info: Name service",
  description: "Missing Info: Description",
  duration: "Missing Info: Duration",
  openTime: "Missing Info: Open Time",
  secondTime: "Missing Info: Second Time",
  price: "Missing Info: Price",
  status: "Missing Info:Status",
  // --- Extra ---
  name_extra: "Missing Info: Name Extra",
  description_extra: "Missing Info: Description Extra",
  duration_extra: "Missing Info: Duration Extra ",
  price_extra: "Missing Info: Price extra",
};

const mapStateToProps = (state) => ({
  loading: state.app.loading,
  language: state.dataLocal.language,
});

export default connectRedux(mapStateToProps, PopupAddEditService);
