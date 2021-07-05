import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { layouts, colors, fonts } from "@shared/themes";
import {
  FormFullName,
  FormTitle,
  FormPhoneNumber,
  FormAddress,
  FormContactEmail,
  FormBirthDay,
  FormGender,
  FormCustomerGroup,
  FormLabelSwitch,
  ButtonGradient,
  ButtonGradientWhite,
  ButtonNormal,
} from "@shared/components";
import IMAGE from "@resources";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import { InputSearch } from "@shared/components/InputSearch";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { VIP_TYPE, getGroupCustomer } from "@shared/utils";
import { OrderStatusView } from "@shared/components/OrderStatusView";
import { formatMoneyWithUnit } from "@utils";

import {
  dateToString,
  DATE_TIME_SHOW_FORMAT_STRING,
  PURCHASE_POINTS,
  PAYMENTS,
  ORDER_STATUS,
  formatFullAddress,
} from "@shared/utils";

export const Layout = ({
  customer,
  onEditAddress,
  onGoBack,
  onEditCustomer,
  onChangeValueSearch,
  onButtonSearchPress,
  onButtonNewOrderPress,
  onEditBillingAddress,
  onEditShippingAddress,
  onNewCustomerAddress,
  onDeleteCustomer,
  onBlacklistCustomer,
  orders,
}) => {
  const [t] = useTranslation();

  const onRenderCell = ({ columnKey, rowIndex, columnIndex, item }) => {
    if (columnKey === "actions") {
      const onHandleAddress = () => {
        onEditAddress(item);
      };
      return (
        <View
          style={layouts.fill}
          key={getUniqueId(columnKey, rowIndex, "cell-action")}
        >
          <TouchableOpacity
            style={[layouts.fill, layouts.center]}
            onPress={onHandleAddress}
          >
            <Image
              style={{ width: scaleWidth(16), height: scaleHeight(16) }}
              source={IMAGE.edit_customer_icon}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const onRenderTableCell = ({ item, columnKey, rowIndex, cellWidth }) => {
    if (columnKey === "appointmentId") {
      const handleCheckRow = (val) => {
        // onCheckedRow(item, val);
      };

      return (
        <TouchableOpacity
          onPress={() => {}}
          style={[layouts.horizontal, { width: cellWidth }, styles.cellStyle]}
          key={getUniqueId(columnKey, rowIndex, "cell-code")}
        >
          <Text style={styles.textName}>{item.appointmentId}</Text>
        </TouchableOpacity>
      );
    }

    if (columnKey === "status") {
      return (
        <View
          style={[{ width: cellWidth }, styles.cellStyle]}
          key={getUniqueId(columnKey, rowIndex, "cell-status")}
        >
          <OrderStatusView status={item.status} />
        </View>
      );
    }

    return null;
  };

  return (
    <View style={layouts.fill}>
      <View style={styles.headContent}>
        <Text
          style={styles.headTitle}
        >{`${customer?.firstName} ${customer?.lastName} `}</Text>
        <View style={styles.headerRightContent}>
          <ButtonGradientWhite
            label={
              customer?.isVip !== VIP_TYPE.BLACK_LIST
                ? t("Add to blacklist")
                : t("Removed from blacklist")
            }
            width={
              customer?.isVip !== VIP_TYPE.BLACK_LIST
                ? scaleWidth(140)
                : scaleWidth(200)
            }
            height={scaleHeight(40)}
            fontSize={scaleFont(17)}
            textWeight="normal"
            borderRadius={scaleWidth(3)}
            onPress={onBlacklistCustomer}
          />
          <View style={layouts.marginHorizontal} />
          <ButtonNormal
            backgroundColor={colors.ORANGEY_RED}
            label={t("Delete")}
            width={scaleWidth(120)}
            height={scaleHeight(40)}
            onPress={onDeleteCustomer}
          />
          <View style={layouts.marginHorizontal} />
          <ButtonGradient
            label={t("Edit")}
            width={scaleWidth(120)}
            height={scaleHeight(40)}
            fontSize={scaleFont(17)}
            textColor={colors.WHITE}
            textWeight="normal"
            onPress={onEditCustomer}
          />
          <View style={layouts.marginHorizontal} />
          <ButtonGradientWhite
            width={scaleWidth(40)}
            height={scaleHeight(40)}
            fontSize={scaleFont(17)}
            textWeight="normal"
            onPress={onGoBack}
          >
            <Image source={IMAGE.back} />
          </ButtonGradientWhite>
        </View>
      </View>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <FormTitle label={t("Personal Information")} />
          <View style={layouts.horizontal}>
            <View style={styles.personContent}>
              <PersonalInfoLine
                label={t("Phone")}
                infoValue={customer?.phone}
              />
              <PersonalInfoLine
                label={t("Email")}
                infoValue={customer?.email}
              />
              <PersonalInfoLine
                label={t("Gender")}
                infoValue={customer?.gender}
              />
              <PersonalInfoLine
                label={t("Birthday")}
                infoValue={
                  customer?.birthdate ? dateToString(customer?.birthdate) : ""
                }
              />
              <PersonalInfoLine
                label={t("Group")}
                infoValue={getGroupCustomer(customer?.isVip)}
              />
              <PersonalInfoLine
                label={t("Customer Since")}
                infoValue={
                  customer?.createdDate
                    ? dateToString(customer?.createdDate)
                    : ""
                }
              />
            </View>
            <View style={layouts.marginHorizontal} />
            <View style={styles.personContent}>
              <PersonalInfoAddress
                label={t("Default Billing Address")}
                addressInfo={customer?.defaultBillingAddress}
                onPress={onEditBillingAddress}
              />
              <PersonalInfoAddress
                label={t("Default Shipping Address")}
                addressInfo={customer?.defaultShippingAddress}
                onPress={onEditShippingAddress}
              />
            </View>
          </View>

          <FormTitle label={t("Addresses")}>
            <View style={styles.headerAddress}>
              <ButtonGradientWhite
                width={scaleWidth(30)}
                height={scaleHeight(30)}
                fontSize={scaleFont(17)}
                textWeight="normal"
                onPress={onNewCustomerAddress}
              >
                <Image
                  source={IMAGE.plus}
                  style={{ width: scaleWidth(16), height: scaleHeight(16) }}
                  resizeMode="contain"
                />
              </ButtonGradientWhite>
              <View style={layouts.marginHorizontal} />
              <Text style={styles.headerAddressLabel}>
                {t("Add new address")}
              </Text>
            </View>
          </FormTitle>
          {customer?.addresses && (
            <Table
              items={customer?.addresses}
              headerKeyLabels={{
                addressFirstName: t("First Name"),
                addressLastName: t("Last Name"),
                street: t("Street Address"),
                city: t("City"),
                stateName: t("State"),
                zipCode: t("ZipCode"),
                addressPhone: t("Phone"),
                actions: t("Actions"),
              }}
              whiteListKeys={[
                "addressFirstName",
                "addressLastName",
                "street",
                "city",
                "stateName",
                "zipCode",
                "addressPhone",
                "actions",
              ]}
              widthForKeys={{
                addressFirstName: scaleWidth(150),
                addressLastName: scaleWidth(150),
                street: scaleWidth(150),
                city: scaleWidth(100),
                stateName: scaleWidth(100),
                zipCode: scaleWidth(120),
                addressPhone: scaleWidth(150),
              }}
              primaryKey="id"
              emptyDescription={t("No Addresses")}
              // renderActionCell={onRenderActionCell}
              renderCell={onRenderCell}
            />
          )}

          <FormTitle label={t("Orders")} />
          <View style={styles.rowContent}>
            <View style={styles.leftContent}>
              <InputSearch
                onSearch={onChangeValueSearch}
                width={scaleWidth(280)}
              />
              <View style={layouts.marginHorizontal} />
              <ButtonGradientWhite
                label={t("Search")}
                width={scaleWidth(120)}
                onPress={onButtonSearchPress}
              />
            </View>
            <ButtonGradient
              onPress={onButtonNewOrderPress}
              label={t("New Order")}
              width={scaleWidth(140)}
              borderRadius={scaleWidth(3)}
            />
          </View>

          <View style={layouts.marginVertical} />
          <View style={layouts.marginVertical} />

          <Table
            items={orders}
            headerKeyLabels={{
              appointmentId: t("ID"),
              purchasePoint: t("Purchase Point"),
              createdDate: t("Purchase Date"),
              billToName: t("Bill-to Name"),
              shipToName: t("Ship-to Name"),
              status: t("Status"),
              total: t("Grand Total"),
            }}
            whiteListKeys={[
              "appointmentId",
              "purchasePoint",
              "createdDate",
              "billToName",
              "shipToName",
              "status",
              "total",
            ]}
            // sortedKeys={{ customerName: sortName, phone: sortPhoneNumber }}
            primaryKey="appointmentId"
            // unitKeys={{ totalDuration: 'hrs' }}
            widthForKeys={{
              appointmentId: scaleWidth(110),
              purchasePoint: scaleWidth(130),
              createdDate: scaleWidth(200),
              billToName: scaleWidth(160),
              shipToName: scaleWidth(160),
              status: scaleWidth(120),
              total: scaleWidth(150),
            }}
            emptyDescription={t("No Orders")}
            styleTextKeys={{ total: styles.textName }}
            // onSortWithKey={onSortWithKey}
            formatFunctionKeys={{
              createdDate: (value) =>
                dateToString(value, DATE_TIME_SHOW_FORMAT_STRING),
              total: (value) => `${formatMoneyWithUnit(value)}`,
            }}
            renderCell={onRenderTableCell}
            // onRowPress={onSelectRow}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

let PersonalInfoLine = ({ label, infoValue }) => {
  return (
    <View style={styles.infoLineContent}>
      {!!label && <Text style={styles.infoLabelText}>{label}</Text>}
      {!!infoValue && <Text style={styles.infoText}>{infoValue}</Text>}
    </View>
  );
};

let PersonalInfoHeading = ({ label, onPress }) => {
  return (
    <View style={styles.infoLineContent}>
      {!!label && <Text style={styles.infoHeaderText}>{label}</Text>}
      <TouchableOpacity onPress={onPress}>
        <Image
          style={{ width: scaleWidth(16), height: scaleHeight(16) }}
          source={IMAGE.edit_customer_icon}
        />
      </TouchableOpacity>
    </View>
  );
};

let PersonalInfoAddress = ({ label, addressInfo, onPress }) => {
  return (
    <View style={styles.infoAddress}>
      <PersonalInfoHeading label={label} onPress={onPress} />
      <View style={[layouts.fill, layouts.verticalCenterLeft]}>
        {addressInfo && (
          <Text style={styles.infoLabelText}>{`${
            addressInfo?.addressFirstName
          } ${addressInfo?.addressLastName} \n${formatFullAddress(
            addressInfo
          )}`}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scaleWidth(16),
    paddingVertical: scaleHeight(16),
  },

  content: {
    flex: 1,
    marginHorizontal: scaleWidth(16),
    flexDirection: "column-reverse",
  },

  headContent: {
    height: scaleHeight(50),
    backgroundColor: colors.WHITE,
    shadowColor: "#0000001a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.32,
    alignItems: "center",
    paddingLeft: scaleWidth(16),
    flexDirection: "row",
  },

  headTitle: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(23),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1.15,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },

  headerRightContent: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: scaleWidth(16),
  },

  personContent: {
    backgroundColor: colors.WHITE_F_6,
    flex: 1,
    height: scaleHeight(220),
    marginTop: scaleHeight(5),
    paddingHorizontal: scaleWidth(10),
    paddingVertical: scaleHeight(10),
  },

  headerAddress: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  headerAddressLabel: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },

  infoLineContent: {
    flexDirection: "row",
    // justifyContent: 'space-between',
    alignItems: "center",
    paddingVertical: scaleHeight(7),
  },

  infoLabelText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
    flex: 1,
  },

  infoHeaderText: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(15),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
    marginRight: scaleWidth(10),
  },

  infoText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "right",
    color: colors.GREYISH_BROWN,
    flex: 1,
  },

  infoAddress: {
    flex: 1,
  },

  rowContent: {
    marginTop: scaleHeight(16),
    paddingHorizontal: scaleWidth(16),
    height: scaleHeight(40),
    flexDirection: "row",
    justifyContent: "space-between",
  },

  leftContent: {
    flex: 1,
    flexDirection: "row",
  },
});
