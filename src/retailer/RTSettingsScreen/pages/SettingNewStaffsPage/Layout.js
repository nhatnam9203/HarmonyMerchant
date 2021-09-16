import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { layouts, colors, fonts } from "@shared/themes";
import {
  FormFullName,
  FormTitle,
  FormPhoneNumber,
  FormAddress,
  FormContactEmail,
  FormBirthDay,
  FormGender,
  FormInputSalary,
  ButtonGradient,
  ButtonGradientWhite,
  FormPinCode,
  CustomCheckBox,
  FormSelect,
  FormLabelSwitch,
  CustomSwitch,
} from "@shared/components";
import {
  dateToString,
  BIRTH_DAY_DATE_FORMAT_STRING,
  STAFF_PERMISSIONS,
  STAFF_PERMISSIONS_ROLES,
} from "@shared/utils";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";

export const Layout = ({
  form,
  buttonCancelPress,
  isEdit,
  isNew,
  current_staff,
  salary,
  setSalary,
  SALARY_TYPE,
  onChangeStaffPermissions,
  staffPermission,
  onChangePermissionRole,
  roleSelectRef,
  permission,
}) => {
  const [t] = useTranslation();

  const onRenderCell = ({
    columnKey,
    rowIndex,
    columnIndex,
    cellWidth,
    item: cellItem,
  }) => {
    if (columnKey === "isChecked") {
      const onChangeSettingPermission = (val) => {
        // console.log(cellItem);
        // if (val === cellItem.isChecked) {
        //   return;
        // }
        onChangePermissionRole(Object.assign({}, cellItem, { isChecked: val }));
      };

      return (
        <View
          style={{ width: cellWidth }}
          key={getUniqueId(columnKey, rowIndex, "cell-role")}
        >
          <CustomSwitch
            onValueChange={onChangeSettingPermission}
            defaultValue={cellItem?.isChecked}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={layouts.fill}>
      {/* <Text style={styles.headTitle}>{errorMsg}</Text> */}
      <View style={styles.headContent}>
        {isEdit && <Text style={styles.headTitle}>{t("Edit Staff")}</Text>}
        {isNew && <Text style={styles.headTitle}>{t("New Staff")}</Text>}
      </View>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={{ ...layouts.fill, margin: scaleWidth(16) }}>
          <FormTitle label={t("General Informations")} />
        </View>

        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.bottomContent}>
              <FormContactEmail
                onChangeEmail={form.handleChange("email")}
                defaultValue={current_staff?.email}
              />

              <FormAddress
                onChangeCityValue={(value) =>
                  form.setFieldValue("address.city", value)
                }
                onChangeStateValue={(value) =>
                  form.setFieldValue("address.state", value)
                }
                onChangeZipCodeValue={(value) =>
                  form.setFieldValue("address.zip", value)
                }
                onChangeStreetValue={(value) =>
                  form.setFieldValue("address.street", value)
                }
                defaultStateValue={current_staff?.address?.state}
                defaultStreetValue={current_staff?.address?.street}
                defaultCityValue={current_staff?.address?.city}
                defaultZipCodeValue={current_staff?.address?.zip}
                useDropDownMenu
                // reverse={true}
              />
            </View>

            <FormFullName
              firstName={current_staff?.firstName}
              lastName={current_staff?.lastName}
              onChangeFirstName={form?.handleChange("firstName")}
              onChangeLastName={form?.handleChange("lastName")}
            />
          </View>

          <View style={styles.content}>
            <FormPinCode
              defaultValue={current_staff?.pin}
              onChangePinCode={form?.handleChange("pin")}
            />

            <View style={[layouts.horizontal, { alignItems: "center" }]}>
              <View style={[layouts.fill, { paddingRight: scaleWidth(16) }]}>
                <FormBirthDay
                  defaultDateString={dateToString(
                    current_staff?.birthdate ?? new Date(),
                    BIRTH_DAY_DATE_FORMAT_STRING
                  )}
                  onChangeDate={(date) =>
                    form.setFieldValue(
                      "birthdate",
                      dateToString(date, BIRTH_DAY_DATE_FORMAT_STRING)
                    )
                  }
                />
              </View>
              <FormGender
                defaultValue={current_staff?.gender}
                onChangeValue={form.handleChange("gender")}
                height={scaleHeight(40)}
                style={layouts.fill}
              />
            </View>

            <FormPhoneNumber
              defaultPhone={current_staff?.cellphone}
              onChangePhoneNumber={form.handleChange("cellphone")}
            />
          </View>
        </View>

        <View
          style={{
            ...layouts.fill,
            marginHorizontal: scaleWidth(16),
            marginBottom: scaleHeight(12),
            // flexDirection: 'column-reverse',
          }}
        >
          <FormTitle label={t("Salary settings")} />
        </View>

        <View style={styles.container}>
          <View style={styles.content}>
            <FormInputSalary
              label={t("Commission (%)")}
              onChangeText={form?.handleChange(
                "productSalary.commission.value"
              )}
              editable={salary === SALARY_TYPE.COMMISSION}
              defaultValue={
                current_staff?.productSalaries?.commission?.value + ""
              }
            />
            <CustomCheckBox
              selectedColor={colors.OCEAN_BLUE}
              onCheckColor={"#FFFF"}
              label={t("Product Salary")}
              style={{ height: "30%" }}
              textStyle={{
                ...layouts.fontLightBrown,
                fontFamily: fonts.MEDIUM,
              }}
              defaultValue={salary === SALARY_TYPE.COMMISSION}
              onValueChange={(value) => {
                form?.setFieldValue("productSalary.commission.isCheck", value);
                setSalary(
                  value ? SALARY_TYPE.COMMISSION : SALARY_TYPE.PER_HOUR
                );
              }}
            />
          </View>
          <View style={styles.content}>
            <FormInputSalary
              label={t("Salary per hour ($)")}
              onChangeText={form?.handleChange("salary.perHour.value")}
              editable={salary === SALARY_TYPE.PER_HOUR}
              defaultValue={current_staff?.salaries?.perHour?.value + ""}
            />
            <CustomCheckBox
              selectedColor={colors.OCEAN_BLUE}
              onCheckColor={"#FFFF"}
              label={t("Hourly Wages")}
              style={{ height: "30%" }}
              textStyle={{
                ...layouts.fontLightBrown,
                fontFamily: fonts.MEDIUM,
              }}
              onValueChange={(value) => {
                form?.setFieldValue("salary.perHour.isCheck", value);
                setSalary(
                  value ? SALARY_TYPE.PER_HOUR : SALARY_TYPE.COMMISSION
                );
              }}
              defaultValue={salary === SALARY_TYPE.PER_HOUR}
            />
          </View>
        </View>

        <View style={{ ...layouts.fill, margin: scaleWidth(16) }}>
          <FormTitle label={t("Edit permission")} />
        </View>

        <View style={styles.container}>
          <View style={styles.content}>
            <FormSelect
              // isDropdown
              filterRef={roleSelectRef}
              label={t("Roles")}
              required={false}
              filterItems={STAFF_PERMISSIONS}
              defaultValue={staffPermission}
              onChangeValue={onChangeStaffPermissions}
              style={{ flex: 1 }}
            />
          </View>
          <View style={styles.content}>
            {/* <FormLabelSwitch
              defaultValue={true}
              onValueChange={(value) => {}}
              label={t("Is Active")}
              textStyle={styles.textStyle}
              style={{
                width: "25%",
                height: scaleHeight(40),
                flex: 0,
              }}
            /> */}
          </View>
        </View>

        {staffPermission === "Manager" && permission && (
          <View style={styles.container}>
            <View style={styles.permission}>
              <Table
                items={permission}
                headerKeyLabels={{
                  label: t("Tabs"),
                  // inputType: t('Input Type'),
                  isChecked: t("Active"),
                }}
                whiteListKeys={["label", "isChecked"]}
                primaryKey="key"
                widthForKeys={{
                  label: "75%",
                }}
                emptyDescription={t("No Data")}
                // styleTextKeys={{ label: layouts.tableName }}
                renderCell={onRenderCell}
                onRowPress={() => {}}
              />
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
      <View style={styles.buttonContent}>
        <ButtonGradientWhite
          onPress={buttonCancelPress}
          label={t("Cancel").toUpperCase()}
          width={scaleWidth(400)}
          height={scaleHeight(60)}
          textColor={colors.GREYISH_BROWN}
          fontSize={scaleFont(25)}
          fontWeight="500"
        />
        <ButtonGradient
          label={t("Save").toUpperCase()}
          width={scaleWidth(400)}
          height={scaleHeight(60)}
          fontSize={scaleFont(25)}
          textColor={colors.WHITE}
          fontWeight="500"
          disable={!form?.isValid} // || !form?.dirty
          onPress={form?.handleSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scaleWidth(0),
    // paddingVertical: scaleHeight(10),
    flexDirection: "row",
    alignItems: "flex-start",
  },

  content: {
    flex: 1,
    marginHorizontal: scaleWidth(16),
    flexDirection: "column-reverse",
  },

  buttonContent: {
    height: scaleHeight(84),
    backgroundColor: colors.WHITE,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
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
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: scaleWidth(16),
  },

  bottomContent: {
    // flexDirection: 'column-reverse',
  },

  headTitle: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(23),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  containerInputSalary: {
    ...layouts.horizontal,
    ...layouts.horizontalSpaceBetween,
    width: scaleWidth(440),
    marginTop: scaleHeight(10),
    marginBottom: scaleHeight(25),
  },

  textStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  permission: {
    flex: 1,
    paddingHorizontal: scaleWidth(16),
  },
});
