import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  RefreshControl,
  Image,
  Switch,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";

import {
  ButtonCustom,
  Text,
  Dropdown,
  DropdownCustom,
  ItemWorkingTime,
  Button,
} from "@components";
import {
  scaleSize,
  localize,
  getNameStateById,
  TimeZones,
  hideCharactes,
  WorkingTime,
} from "@utils";
import ICON from "@resources";

const AUTO_LOCK = [
  "2 Minutes",
  "5 Minutes",
  "10 Minutes",
  "15 Minutes",
  "Never",
];
const STAFF_COLUMN = [{ value: 5 }, { value: 8 }];
const SIGN_IN_APP_STYLE = [
  { value: "Services with categories" },
  { value: "Show categories only" },
];
const SEND_LINK_DATA = [
  { value: "Manually" },
  { value: "Automatic" },
  { value: "Off" },
];

class Layout extends React.Component {
  renderSetup() {
    const { language, autoLockScreenAfter, isTipOnPaxMachine } = this.props;

    const {
      languageApp,
      webLink,
      autoCloseAt,
      isTurnOnAutoClose,
      timezone,
      businessHour,
      turnAmount,
      staffColumn,
      signinAppStyle,
      sendReviewLinkOption,
      giftForNewEnabled,
      receiptFooter,
    } = this.state;

    return (
      <View style={{ width: "100%", marginTop: scaleSize(6) }}>
        <View style={{ flex: 1 }}>
          {/* ------- Item Change Language  ------ */}
          <ItemSetupGeneral
            title={`${localize("Language", language)}:`}
            data={[{ value: "English" }, { value: "Viet Nam" }]}
            value={languageApp}
            onChangeText={(value) => {
              this.setState({ languageApp: value });
            }}
            placeHolder={localize("Language", language)}
          />

          {/* ------- Item Auto close at:  ------ */}
          <View style={{ flexDirection: "row", marginTop: scaleSize(8) }}>
            <View style={{ width: scaleSize(180), justifyContent: "center" }}>
              <Text
                style={{
                  color: "#404040",
                  fontSize: scaleSize(16),
                  fontWeight: "600",
                }}
              >
                {localize("Auto close", language)}
              </Text>
            </View>
            <View
              style={{
                height: scaleSize(40),
                width: scaleSize(140),
                justifyContent: "center",
              }}
            >
              <Switch
                trackColor={{ false: "#767577", true: "#0764B0" }}
                ios_backgroundColor="#E5E5E5"
                onValueChange={this.switchAuToClose}
                value={isTurnOnAutoClose}
              />
            </View>
          </View>
          {isTurnOnAutoClose && (
            <ItemSetupGeneral
              title={`${localize("Auto close at", language)}:`}
              data={WorkingTime}
              value={autoCloseAt}
              onChangeText={(value) => this.setState({ autoCloseAt: value })}
              placeHolder="11:00 PM"
              isCustomDropDown={true}
            />
          )}

          {/* ------- Staff Columns On Calendar  ------ */}
          <ItemSetupGeneral
            title={`${localize("Staff Columns", language)}:`}
            data={STAFF_COLUMN}
            value={staffColumn}
            onChangeText={(value) => this.setState({ staffColumn: value })}
            placeHolder="08:00 AM"
          />

          {/* ------- Send Google Review Link  ------ */}
          <ItemSetupGeneral
            title={`${localize("Send google review link", language)}:`}
            data={SEND_LINK_DATA}
            value={sendReviewLinkOption}
            onChangeText={(value) =>
              this.setState({ sendReviewLinkOption: value })
            }
            placeHolder="08:00 AM"
          />

          {/* ------- Turn Amount  ------ */}
          <View style={{ flexDirection: "row", marginTop: scaleSize(8) }}>
            <View style={{ width: scaleSize(180), justifyContent: "center" }}>
              <Text
                style={{
                  color: "#404040",
                  fontSize: scaleSize(16),
                  fontWeight: "600",
                }}
              >
                {`Turn Amount:`}
              </Text>
            </View>
            <View style={{ height: scaleSize(40), width: scaleSize(140) }}>
              <TextInputMask
                type={"money"}
                options={{
                  precision: 2,
                  separator: ".",
                  delimiter: ",",
                  unit: "",
                  suffixUnit: "",
                }}
                placeholder="0.00"
                style={{
                  flex: 1,
                  fontSize: scaleSize(16),
                  borderWidth: 1,
                  borderColor: "#C5C5C5",
                  paddingHorizontal: scaleSize(10),
                }}
                value={turnAmount}
                onChangeText={(value) => this.setState({ turnAmount: value })}
              />
            </View>
          </View>

          {/* ------- Tip on pax machine  ------ */}
          <View style={{ flexDirection: "row", marginTop: scaleSize(8) }}>
            <View style={{ width: scaleSize(180), justifyContent: "center" }}>
              <Text
                style={{
                  color: "#404040",
                  fontSize: scaleSize(16),
                  fontWeight: "600",
                }}
              >
                {`Tip on payment terminal:`}
              </Text>
            </View>
            <View
              style={{
                height: scaleSize(40),
                width: scaleSize(140),
                justifyContent: "center",
              }}
            >
              <Switch
                trackColor={{ false: "#767577", true: "#0764B0" }}
                ios_backgroundColor="#E5E5E5"
                onValueChange={this.switchTipOnPaxMachine}
                value={isTipOnPaxMachine}
              />
            </View>
          </View>

          {/* ------- Gift for new customer  ------ */}
          {/* <View style={{ flexDirection: 'row', marginTop: scaleSize(8) }} >
                        <View style={{ width: scaleSize(180), justifyContent: 'center' }} >
                            <Text style={{
                                color: '#404040',
                                fontSize: scaleSize(16),
                                fontWeight: '600',
                            }}  >
                                {`Gift For New Customer:`}
                            </Text>
                        </View>
                        <View style={{ height: scaleSize(40), width: scaleSize(140), justifyContent: "center" }} >
                            <Switch
                                trackColor={{ false: "#767577", true: "#0764B0" }}
                                ios_backgroundColor="#E5E5E5"
                                onValueChange={(giftForNewEnabled) => this.setState({ giftForNewEnabled })}
                                value={giftForNewEnabled}
                            />
                        </View>
                    </View> */}

          {/* ------------ Item Auto lock ------------- */}
          <View style={{ flexDirection: "row", marginVertical: scaleSize(15) }}>
            <View style={{ width: scaleSize(180) }}>
              <Text
                style={{
                  color: "#404040",
                  fontSize: scaleSize(16),
                  fontWeight: "600",
                  marginTop: scaleSize(10),
                }}
              >
                {`${localize("Auto lock screen after", language)}:`}
              </Text>
            </View>
            <View
              style={{
                height: scaleSize(40 * 5),
                flex: 1,
                paddingHorizontal: scaleSize(10),
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#C5C5C5",
                borderRadius: scaleSize(6),
              }}
            >
              {AUTO_LOCK.map((item, index) => (
                <ItemAutoLock
                  key={item}
                  title={item}
                  isShowIcon={item == autoLockScreenAfter ? true : false}
                  isHideBorderBottom={index === 4 ? true : false}
                  onPress={this.changeAutoLockTime}
                />
              ))}
            </View>
          </View>

          {/* -------- Link website --------- */}
          <View style={{ flexDirection: "row", marginTop: scaleSize(8) }}>
            <View style={{ width: scaleSize(180), justifyContent: "center" }}>
              <Text
                style={{
                  color: "#404040",
                  fontSize: scaleSize(16),
                  fontWeight: "600",
                }}
              >
                {`${localize("Website", language)}:`}
              </Text>
            </View>
            <View
              style={{
                height: scaleSize(40),
                flex: 1,
                borderWidth: 1,
                borderColor: "#C5C5C5",
                paddingHorizontal: scaleSize(10),
              }}
            >
              <TextInput
                style={{ flex: 1, fontSize: scaleSize(18) }}
                placeholder="yoursite.com"
                value={webLink}
                onChangeText={(value) => this.setState({ webLink: value })}
              />
            </View>
          </View>
          {/* -------- Time Zone --------- */}
          {/* <View style={{ flexDirection: 'row', marginTop: scaleSize(8) }} >
                        <View style={{ width: scaleSize(180), justifyContent: 'center' }} >
                            <Text style={{
                                color: '#404040',
                                fontSize: scaleSize(16),
                                fontWeight: '600',
                            }}  >
                                {`${localize('Time Zone', language)}:`}
                            </Text>
                        </View>
                        <View style={{
                            height: scaleSize(40), flex: 1,
                        }} >
                            <Dropdown
                                label={"Time Zone"}
                                data={TimeZones}
                                value={timezone}
                                onChangeText={(timezone) => this.setState({ timezone })}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#C5C5C5',
                                    flex: 1
                                }}
                            />
                        </View>
                    </View> */}

          {/* -------- Sign in app display in --------- */}
          <View style={{ flexDirection: "row", marginTop: scaleSize(8) }}>
            <View style={{ width: scaleSize(180), justifyContent: "center" }}>
              <Text
                style={{
                  color: "#404040",
                  fontSize: scaleSize(16),
                  fontWeight: "600",
                }}
              >
                {`${localize("Sign in app display in", language)}:`}
              </Text>
            </View>
            <View
              style={{
                height: scaleSize(40),
                flex: 1,
              }}
            >
              {/* signinAppStyle:"service_with_category" */}
              <Dropdown
                label={""}
                data={SIGN_IN_APP_STYLE}
                value={signinAppStyle}
                onChangeText={(signinAppStyle) =>
                  this.setState({ signinAppStyle })
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

          {/* -------- Business Hours --------- */}
          <View style={{ flexDirection: "row", marginTop: scaleSize(8) }}>
            <View style={{ width: scaleSize(180), justifyContent: "center" }}>
              <Text
                style={{
                  color: "#404040",
                  fontSize: scaleSize(16),
                  fontWeight: "600",
                }}
              >
                {`${localize("Business Hours", language)}:`}
              </Text>
            </View>
            <View
              style={{
                height: scaleSize(40),
                width: scaleSize(400),
                flexDirection: "row",
              }}
            />
          </View>

          {/* -------- Bussiness Working Time --------- */}

          {Object.keys(businessHour).map((day, index) => {
            return (
              <ItemWorkingTime
                key={index}
                ref={this.setRefTimeWorking}
                title={day}
                dataInit={businessHour[day]}
              />
            );
          })}

          {/* --------  Receipt Footer  --------- */}
          <View style={{ flexDirection: "row", marginTop: scaleSize(16) }}>
            <View style={{ width: scaleSize(180), justifyContent: "center" }}>
              <Text
                style={{
                  color: "#404040",
                  fontSize: scaleSize(16),
                  fontWeight: "600",
                }}
              >
                {`${localize("Receipt Footer", language)}:`}
              </Text>
            </View>
            <View
              style={{
                height: scaleSize(60),
                flex: 1,
                borderWidth: 1,
                borderColor: "#C5C5C5",
                paddingHorizontal: scaleSize(10),
              }}
            >
              <TextInput
                style={{ flex: 1, fontSize: scaleSize(18) }}
                placeholder="Receipt footer input here..."
                value={receiptFooter}
                onChangeText={(value) =>
                  this.setState({ receiptFooter: value })
                }
                multiline={true}
                numberOfLines={3}
              />
            </View>
          </View>

          {/* ------ Button Save --- */}
          <View
            style={{
              justifyContent: "center",
              marginTop: scaleSize(35),
              flexDirection: "row",
            }}
          >
            <ButtonCustom
              width={scaleSize(150)}
              height={50}
              backgroundColor="#F1F1F1"
              title={localize("SAVE", language)}
              textColor="#6A6A6A"
              onPress={this.saveSettngApp}
              style={{
                borderWidth: 1,
                borderColor: "#C5C5C5",
                backgroundColor: "#0764B0",
              }}
              styleText={{
                fontSize: scaleSize(18),
                fontWeight: "500",
                color: "#fff",
              }}
            />
          </View>
          {/* ----------- */}
        </View>
      </View>
    );
  }

  renderBody() {
    const { profile, language, stateCity, refreshingGeneral, versionApp } =
      this.props;
    const {
      businessName,
      address,
      city,
      stateId,
      zip,
      taxId,
      phone,
      email,
      ein,
      merchantCode,
      businessBank,
      merchantId,
    } = profile || {};

    return (
      <View style={styles.body}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          refreshControl={
            <RefreshControl
              refreshing={refreshingGeneral}
              onRefresh={this.onRefreshGeneral}
            />
          }
        >
          {this.renderSetup()}
          {/* ------ Line ----- */}
          <View
            style={{
              height: scaleSize(2),
              width: "100%",
              backgroundColor: "#C5C5C5",
              marginTop: scaleSize(18),
            }}
          />

          <ItemTextStoreInfo
            title={localize("Business Name", language)}
            value={businessName}
          />
          <ItemTextStoreInfo
            title={localize("Business Address", language)}
            value={address}
          />
          <ItemTextStoreInfoNotTilte
            city={city}
            state={getNameStateById(stateCity, stateId)}
            zipcode={zip}
          />
          <ItemTextStoreInfo
            title={localize("Phone Number", language)}
            value={phone}
          />
          <ItemTextStoreInfo
            title={localize("Contact Email", language)}
            value={email}
          />
          <ItemTextStoreInfo
            title={localize("Bank Name", language)}
            value={businessBank && businessBank.name ? businessBank.name : ""}
          />
          <ItemTextStoreInfo
            title={localize("Account Number", language)}
            value={
              businessBank && businessBank.accountNumber
                ? hideCharactes(businessBank.accountNumber)
                : ""
            }
          />
          <ItemTextStoreInfo
            title={localize("Routing Number", language)}
            value={
              businessBank && businessBank.routingNumber
                ? hideCharactes(businessBank.routingNumber)
                : ""
            }
          />
          <ItemTextStoreInfo
            title="EIN"
            value={taxId ? hideCharactes(taxId) : ""}
          />
          <ItemTextStoreInfo
            title={localize("Merchant ID", language)}
            value={merchantCode}
          />

          <View
            style={{
              height: scaleSize(50),
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Text
              style={{
                color: "rrgb(57,54,60)",
                fontSize: scaleSize(14),
                fontWeight: "600",
              }}
            >
              {`${localize("Version", language)}: ${versionApp}`}
            </Text>
          </View>
          <View style={{ height: scaleSize(250) }} />
        </ScrollView>
      </View>
    );
  }

  render() {
    return <View style={styles.container}>{this.renderBody()}</View>;
  }
}

const ItemSetupGeneral = ({
  title,
  data,
  placeHolder,
  value = "",
  onChangeText,
  titStyle,
  isCustomDropDown = false,
}) => {
  return (
    <View style={{ flexDirection: "row", marginTop: scaleSize(8) }}>
      <View style={{ width: scaleSize(180), justifyContent: "center" }}>
        <Text
          style={[
            {
              color: "#404040",
              fontSize: scaleSize(16),
              fontWeight: "600",
            },
            titStyle,
          ]}
        >
          {title}
        </Text>
      </View>
      <View style={{ height: scaleSize(40), width: scaleSize(140) }}>
        {!isCustomDropDown ? (
          <Dropdown
            label={placeHolder}
            data={data}
            value={value}
            onChangeText={(value) => onChangeText(value)}
            containerStyle={{
              backgroundColor: "#F1F1F1",
              borderWidth: 1,
              borderColor: "#C5C5C5",
              flex: 1,
            }}
          />
        ) : (
          <DropdownCustom
            label={placeHolder}
            data={data}
            value={value}
            onChangeText={(value) => onChangeText(value)}
            containerStyle={{
              backgroundColor: "#F1F1F1",
              borderWidth: 1,
              borderColor: "#C5C5C5",
              flex: 1,
            }}
          />
        )}
      </View>
    </View>
  );
};

const ItemTextStoreInfoNotTilte = ({ city, state, zipcode }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingRight: scaleSize(50),
        marginTop: scaleSize(25),
      }}
    >
      <Text
        style={{
          color: "#404040",
          fontSize: scaleSize(16),
          fontWeight: "600",
          width: scaleSize(150),
        }}
      >
        {" "}
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: "#404040",
            fontSize: scaleSize(16),
          }}
        >
          {`City: ${city}`}
        </Text>
        <Text
          style={{
            color: "#404040",
            fontSize: scaleSize(16),
          }}
        >
          {`State: ${state}`}
        </Text>
        <Text
          style={{
            color: "#404040",
            fontSize: scaleSize(16),
          }}
        >
          {`Zip Code: ${zipcode}`}
        </Text>
      </View>
    </View>
  );
};

const ItemTextStoreInfo = ({ title, value }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: scaleSize(25),
      }}
    >
      <Text
        style={{
          color: "#404040",
          fontSize: scaleSize(16),
          fontWeight: "600",
          width: scaleSize(150),
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: "#404040",
          fontSize: scaleSize(16),
        }}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
};

const ItemAutoLock = ({ title, isHideBorderBottom, onPress, isShowIcon }) => {
  const styleBorder = !isHideBorderBottom
    ? { borderBottomWidth: 1, borderBottomColor: "#C5C5C5" }
    : {};

  return (
    <Button
      onPress={() => onPress(title)}
      style={[
        {
          height: scaleSize(40),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        styleBorder,
      ]}
    >
      <Text
        style={{
          color: "rgb(0,2,2)",
          fontSize: scaleSize(16),
          fontWeight: "500",
        }}
      >
        {title}
      </Text>

      {isShowIcon ? <Image source={ICON.check_package_pricing} /> : <View />}
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: scaleSize(18),
  },
  footer: {
    height: scaleSize(60),
    alignItems: "center",
  },
});

export default Layout;
