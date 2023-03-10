import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Switch,
  FlatList,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";

import {
  Dropdown,
  ButtonCustom,
  Text,
  BrowserFile,
  TextInputSuggestion, Button
} from "@components";
import { scaleSize, localize, hideCharactes } from "@utils";
import { ItemAdminInfo, ItemAdminCellPhone } from "../componentTab";
import { ItemWorkingTime } from "../ItemWorkingTime";
import ItemScalary from "../ItemScalary";
import { ItemScalaryByIncome } from "../ItemScalaryByIncome";
import AssignSevices from "../AssignSevices";
import { colors } from '@shared/themes';
import _ from 'lodash';

class Layout extends React.Component {


  renderItemPermission = ({item}) => {
    return(
      <View style={{justifyContent: 'center',}}>
        <View style={styles.rowPermission}>
          <Text style={styles.textNormal}>
            {_.get(item, 'label')}
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#0764B0' }}
            ios_backgroundColor="#E5E5E5"
            onValueChange={(isEnable) => {this.switchPermission(_.get(item, 'key'), isEnable)}
            }
            value={_.get(item, 'isChecked')}
          />
        </View>
        <View style={styles.separateLine}/>
      </View>
    )
  }

  renderBody() {
    const {
      address,
      firstName,
      lastName,
      displayName,
      cellphone,
      email,
      pin,
      confirmPin,
      roles,
      driverlicense,
      socialSecurityNumber,
      professionalLicense,
      isDisabled,
      isActive,
      permission,
    } = this.state.user;
    const { street, city, state, zip } = address;
    const { nameRole } = roles;

    const { language, isEditStaff } = this.props;
    const { dynamicMarginBottomState, workingTime, tipFee, salary, productSalary, cashPercent } = this.state;

    return (
      <View style={styles.body}>
        <ScrollView
          ref={this.scrollStaffRef}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={true}
          keyboardShouldPersistTaps={"always"}
        >
          <View style={{ height: scaleSize(30) }} />
          <ItemAdminInfoDoubleItem
            title={`${localize("Name", language)}*`}
            placeholder={localize("First Name", language)}
            value={firstName}
            onChangeText={(value) => this.updateUserInfo("firstName", value)}
          >
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#C5C5C5",
                paddingLeft: scaleSize(5),
              }}
            >
              <TextInput
                style={{ flex: 1, fontSize: scaleSize(14), color: "#404040" }}
                placeholder={localize("Last Name", language)}
                value={lastName}
                onChangeText={(value) => this.updateUserInfo("lastName", value)}
              />
            </View>
          </ItemAdminInfoDoubleItem>

          <ItemAdminInfoDoubleItem
            title={`${localize("Display Name", language)}*`}
            placeholder={localize("Display Name", language)}
            value={displayName}
            onChangeText={(value) => this.updateUserInfo("displayName", value)}
          />

          <ItemAdminInfo
            title={localize("Address", language)}
            placeholder={localize("Street", language)}
            value={street}
            onChangeText={(value) =>
              this.updateUserInfo("street", value, "address")
            }
            onFocus={() => this.scrollStaffTo(140)}
          />

          <ItemAdminInfoDoubleItem
            title=""
            placeholder={localize("City", language)}
            value={city}
            onChangeText={(value) =>
              this.updateUserInfo("city", value, "address")
            }
          >
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#C5C5C5",
                paddingLeft: scaleSize(5),
              }}
            >
              <TextInputMask
                type="only-numbers"
                style={{ flex: 1, fontSize: scaleSize(14), color: "#404040" }}
                placeholder={localize("Zip Code", language)}
                value={zip}
                onChangeText={(value) =>
                  this.updateUserInfo("zip", value, "address")
                }
                maxLength={5}
                keyboardType="numeric"
                onFocus={() => this.scrollStaffTo(140)}
              />
            </View>
          </ItemAdminInfoDoubleItem>

          {/* ------------ Zip code ----------- */}
          <View
            style={{
              flexDirection: "row",
              height: scaleSize(36),
              paddingHorizontal: scaleSize(25),
              marginTop: scaleSize(14),
              marginBottom: scaleSize(dynamicMarginBottomState),
            }}
          >
            <View style={{ width: scaleSize(150) }} />
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <TextInputSuggestion
                  value={state}
                  onChangeText={(value, count) => {
                    this.updateUserInfo("state", value, "address");
                    this.setState({
                      dynamicMarginBottomState: count * 24,
                    });
                  }}
                  resetMarginState={() =>
                    this.setState({ dynamicMarginBottomState: 24 })
                  }
                  onFocus={() => { }}
                  inputContainerStyle={{
                    height: scaleSize(35),
                  }}
                  onFocus={() => this.scrollStaffTo(250)}
                />
              </View>
              <View style={{ flex: 1 }} />
            </View>
          </View>

          <ItemAdminCellPhone
            ref={this.cellphoneRef}
            title={`${localize("Cell Phone", language)}`}
            placeholder={localize("Phone Number", language)}
            value={cellphone}
            onChangeText={(value) => this.updateUserInfo("cellphone", value)}
            type={true}
            onFocus={() => this.scrollStaffTo(310)}
            style={{ marginTop: scaleSize(10) }}
          />
          <ItemAdminInfo
            title={`${localize("Contact Email", language)}`}
            placeholder={localize("Email")}
            value={email}
            onChangeText={(value) => this.updateUserInfo("email", value)}
            onFocus={() => this.scrollStaffTo(370)}
          />
          <ItemAdminInfo
            title={`${localize("Create PIN", language)}*`}
            placeholder="****"
            value={pin}
            onChangeText={(value) => this.updateUserInfo("pin", value)}
            secureTextEntry={true}
            maxLength={4}
            type={true}
            onFocus={() => this.scrollStaffTo(430)}
          />
          <ItemAdminInfo
            title={`${localize("Confirm PIN", language)}*`}
            placeholder="****"
            value={confirmPin}
            onChangeText={(value) => this.updateUserInfo("confirmPin", value)}
            secureTextEntry={true}
            maxLength={4}
            type={true}
            onFocus={() => this.scrollStaffTo(490)}
          />
          <ItemAdminInfoRole
            DropdowAdmin={() => (
              <Dropdown
                label={localize("Admin", language)}
                data={[{ value: "Admin" }, {value: "Manager"}, { value: "Staff" }]}
                value={nameRole}
                onChangeText={(value) =>
                  this.updateUserInfo("nameRole", value, "roles")
                }
                containerStyle={styles.dropdown}
              />
            )}
            DropdowStatusAdmin={() => (
              <Dropdown
                label={localize("Status", language)}
                data={[{ value: "Active" }, { value: "Disable" }]}
                value={isDisabled}
                onChangeText={(value) =>
                  this.updateUserInfo("isDisabled", value)
                }
                containerStyle={styles.dropdown}
              />
            )}
          />

          {
            nameRole == 'Manager' &&
            <View style={styles.rowTitle}>
              <Text style={styles.textNormal}>
                {localize("Accessibility", language)}
              </Text>
              <View style={styles.greyView}>
                <Text style={[styles.textNormal, {color: colors.OCEAN_BLUE}]}>
                  {localize("Tabs", language)}
                </Text>
              </View>
              <FlatList
                data={permission}
                renderItem={this.renderItemPermission}
                keyExtractor={item => _.get(item, 'key', '')}
              />
            </View>
          }



          {/* ----------- Active -------- */}
          <View
            style={{
              flexDirection: "row",
              height: scaleSize(36),
              paddingHorizontal: scaleSize(25),
              marginTop: scaleSize(25),
            }}
          >
            <View style={{ width: scaleSize(150), justifyContent: "center" }}>
              <Text
                style={{
                  color: "#404040",
                  fontSize: scaleSize(14),
                  fontWeight: "600",
                }}
              >
                {`Visible`}
              </Text>
            </View>

            <View style={{ flex: 1, justifyContent: "center" }}>
              <Switch
                trackColor={{ false: "#767577", true: "#0764B0" }}
                // thumbColor={toogle ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#E5E5E5"
                onValueChange={(isActive) =>
                  this.updateUserInfo("isActive", isActive)
                }
                value={isActive ? isActive : false}
              />
            </View>
          </View>

          {/* ------- Upload Image ----- */}
          <View style={{ paddingHorizontal: scaleSize(25) }}>
            <BrowserFile
              ref={this.browserFileRef}
              updateFileId={this.updateFileId}
              imageUrl={this.state.imageUrl}
              styleText={{
                color: "#404040",
                fontSize: scaleSize(14),
                fontWeight: "600",
              }}
              editButtonSubmit={this.editButtonSubmit}
            />
          </View>

          <TitleTabAdminInfo
            title={localize("Working Time", language)}
            style={{ color: "#0764B0" }}
          />
          {Object.keys(workingTime).map((day, index) => {
            return (
              <ItemWorkingTime
                key={index}
                // ref={this.setRefTimeWorking}
                title={day}
                data={workingTime[day]}
                selectCheckbox={this.selectCheckbox(day, workingTime[day]?.isCheck)}
                onChangeTimeOfWorkingTime={this.onChangeTimeOfWorkingTime}
                isEdit={this.state.isEditStaff}
              />
            );
          })}

          {/* ----- Service ---- */}

          <TitleTabAdminInfo title={localize("Services", language)} />

          {/* ------------- Assigns Services For Staff ----------- */}
          <AssignSevices
            ref={this.assignSevices}
          />

          {/* ----- Service Salary ---- */}
          <TitleTabAdminInfo title={localize("Service Salary", language)} />

          {/* ----- Per Hour ServiceSalary ---- */}
          <ItemScalary
            title={`${localize("Per Hour", language)} ($)`}
            placeholder={"10"}
            data={salary?.perHour}
            onFocus={() => { }}
            onPressCheckBox={this.handlePerHourCheckBox}
            onChangeValue={this.handleChangePerHourValue}
          />

          {/* ----- Commission ServiceSalary ---- */}
          <ItemScalaryByIncome
            title={`${localize("Incomes", language)}`}
            placeholder={"10"}
            onFocus={() => { }}
            data={salary?.commission}
            onPressIncomesCheckbox={this.onPressIncomesCheckbox}
            addMoreSalary={this.addMoreSalary}
            onChangeSalaryByIndex={this.onChangeSalaryByIndex}
            removeSalaryByIndex={this.removeSalaryByIndex}
          />

          {/* ----- Product Salary ---- */}
          <TitleTabAdminInfo title={localize("Product Salary", language)} />

          <ItemScalary
            title={`${localize("Commission", language)} (%)`}
            placeholder={"10"}
            onFocus={() => { }}
            data={productSalary?.commission}
            onPressCheckBox={this.handleProductSalaryCheckBox}
            onChangeValue={this.handleChangeProductSalaryValue}
          />

          {/* ----- Tip fee ---- */}
          <TitleTabAdminInfo title={localize("Tip", language)} />

          {/* ----- Percent Tip Fee ---- */}
          <ItemScalary
            title={`${localize("Percent", language)} (%)`}
            placeholder={"10"}
            onFocus={() => { }}
            data={tipFee?.percent}
            onPressCheckBox={this.handleTipFeePercentCheckBox}
            onChangeValue={this.handleChangeTipFeePercentValue}
          />

          {/* ----- Fix amount Tip Fee ---- */}
          <ItemScalary
            title={`${localize("Fixed Amount", language)} ($)`}
            placeholder={"10"}
            onFocus={() => { }}
            data={tipFee?.fixedAmount}
            onPressCheckBox={this.handleTipFeeFixedAmountCheckBox}
            onChangeValue={this.handleChangeTipFeeFixedAmountValue}
          />

          {/* -----  Payout With Cash ---- */}
          <TitleTabAdminInfo title={localize("Payout With Cash", language)} />

          {/* ----- Cash Percent ---- */}
          <ItemScalary
            title={`${localize("Cash Percent", language)} (%)`}
            placeholder={"10"}
            onFocus={() => { }}
            maxLength={6}
            isNotToggleCheck={true}
            data={{
              isCheck: true,
              value: cashPercent,
            }}
            onPressCheckBox={() => { }}
            onChangeValue={this.handleChangeCashPercentValue}
          />

          {/* ---- Address ---- */}
          <ItemAdminInfo
            title={localize("Driver License", language)}
            value={driverlicense}
            onChangeText={(value) =>
              this.updateUserInfo("driverlicense", value)
            }
            type={true}
            onFocus={() => { }}
          />

          {/* ----------- Handle Social Security Number -----------  */}
          {
            !this.state.isEditSSN && !isEditStaff ?
              <View style={[{
                flexDirection: 'row',
                height: scaleSize(36),
                paddingHorizontal: scaleSize(25),
                marginTop: scaleSize(25)
              }]} >
                <View style={{ width: scaleSize(150), justifyContent: 'center' }} >
                  <Text style={[{
                    color: '#404040',
                    fontSize: scaleSize(12),
                    fontWeight: "bold",

                  }]}  >
                    {`${localize("Social Security Number", language)}`}
                  </Text>
                </View>
                <Button onPress={() => {
                  this.setState({ isEditSSN: true });
                  this.updateUserInfo("socialSecurityNumber", "")
                }} style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingLeft: scaleSize(5), justifyContent: "center" }} >
                  <Text style={{ fontSize: scaleSize(14), color: '#404040', }} >
                    {hideCharactes(socialSecurityNumber)}
                  </Text>
                </Button>
              </View>
              :
              <ItemAdminInfo
                title={localize("Social Security Number", language)}
                placeholder="000-00-0000"
                value={socialSecurityNumber}
                onChangeText={(value) =>
                  this.updateUserInfo("socialSecurityNumber", value)
                }
                type={true}
                onFocus={() => this.scrollStaffTo(100000)}
                typeSocial="custom"
                mark="999-99-9999"
                style={{
                  fontSize: scaleSize(12),
                  fontWeight: "bold",
                }}
                autoFocus={true}
              />
          }

          <ItemAdminInfo
            title={localize("Professional License", language)}
            value={professionalLicense}
            onChangeText={(value) =>
              this.updateUserInfo("professionalLicense", value)
            }
            type={true}
            onFocus={() => this.scrollStaffTo(100000)}
          />
          <View
            style={{
              height: scaleSize(70),
              paddingHorizontal: scaleSize(25),
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            {this.renderButtonSubmit()}
          </View>
          <View style={{ height: scaleSize(300) }} />
        </ScrollView>
      </View>
    );
  }

  renderButtonSubmit() {
    const { language } = this.props;
    const { isSubmitButton } = this.state;
    const titleButton = this.state.isEditStaff ? "SAVE" : "ADD";
    if (isSubmitButton) {
      return (
        <ButtonCustom
          width={scaleSize(120)}
          height={40}
          backgroundColor="#F1F1F1"
          title={localize(titleButton, language)}
          textColor="#C5C5C5"
          onPress={this.addAdmin}
          style={{
            borderWidth: 1,
            borderColor: "#C5C5C5",
            backgroundColor: "#0764B0",
          }}
          styleText={{
            fontSize: scaleSize(15),
            fontWeight: "500",
            color: "#fff",
          }}
        />
      );
    } else {
      return (
        <View
          style={{
            width: scaleSize(120),
            height: scaleSize(40),
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
    return <View style={styles.container}>{this.renderBody()}</View>;
  }
}

const ItemAdminInfoDoubleItem = ({
  title,
  placeholder,
  children,
  value,
  onChangeText,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        height: scaleSize(36),
        paddingHorizontal: scaleSize(25),
        marginTop: scaleSize(14),
      }}
    >
      <View style={{ width: scaleSize(150), justifyContent: "center" }}>
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

      <View style={{ flex: 1, flexDirection: "row" }}>
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#C5C5C5",
            paddingLeft: scaleSize(5),
          }}
        >
          <TextInput
            style={{ flex: 1, fontSize: scaleSize(14), color: "#404040" }}
            placeholder={placeholder}
            value={value}
            onChangeText={(value) => onChangeText(value)}
          />
        </View>

        <View style={{ width: scaleSize(5) }} />

        <View style={{ flex: 1 }}>{children}</View>
      </View>
    </View>
  );
};

const ItemAdminInfoRole = ({ DropdowAdmin, DropdowStatusAdmin }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        height: scaleSize(36),
        paddingHorizontal: scaleSize(25),
        marginTop: scaleSize(14),
      }}
    >
      <View style={{ width: scaleSize(150), justifyContent: "center" }}>
        <Text
          style={{
            color: "#404040",
            fontSize: scaleSize(14),
            fontWeight: "600",
          }}
        >
          {`Roles`}
        </Text>
      </View>

      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1.3, flexDirection: "row" }}>
          <View style={{ flex: 1 }}>{DropdowAdmin()}</View>
          <View style={{ flex: 1 }} />
        </View>

        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{
                color: "#404040",
                fontSize: scaleSize(14),
                fontWeight: "600",
              }}
            >
              {`Status`}
            </Text>
          </View>
          <View style={{ flex: 1, paddingLeft: 20 }}>
            {DropdowStatusAdmin()}
          </View>
        </View>
      </View>
    </View>
  );
};

const TitleTabAdminInfo = ({ title, style }) => {
  return (
    <View
      style={{
        paddingHorizontal: scaleSize(25),
        marginTop: scaleSize(14),
      }}
    >
      <Text
        style={[
          {
            fontSize: scaleSize(16),
            fontWeight: "600",
            color: "#0764B0",
          },
          style,
        ]}
      >
        {`${title}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  footer: {
    height: scaleSize(50),
    flexDirection: "row",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
  },
  borderTextInput: {
    borderWidth: 1,
    borderColor: "#C5C5C5",
  },
  dropdown: {
    backgroundColor: "#F1F1F1",
    borderWidth: 1,
    borderColor: "#C5C5C5",
    flex: 1,
  },
  rowTitle:{
    paddingHorizontal: scaleSize(25),
    marginTop: scaleSize(25),
    marginLeft: scaleSize(150),
  },
  greyView:{
    backgroundColor: colors.LIGHT_GREY,
    marginTop: scaleSize(10),
    marginBottom: scaleSize(10),
    height: scaleSize(25),
    justifyContent: 'center',
    paddingLeft: scaleSize(10),
  },
  textNormal:{
    fontSize: scaleSize(14),
  },
  rowPermission:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    height: scaleSize(35),
    marginRight: scaleSize(10),
    alignItems: 'center',
  },
  separateLine:{
    backgroundColor: colors.LIGHT_GREY,
    height: 1,
    flex: 1,
  }
});

export default Layout;
