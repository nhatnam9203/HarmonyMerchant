import {
  ButtonCalendarFilter,
  ButtonGradient,
  ButtonGradientRed,
  ButtonGradientWhite,
  DropdownMenu,
} from "@shared/components";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import { HeaderToolBarTitle } from "@shared/components/HeaderToolBarTitle";
import { InputSearch } from "@shared/components/InputSearch";
import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";
import { colors, fonts, layouts } from "@shared/themes";
import { dateToString, DATE_SHOW_FORMAT_STRING } from "@shared/utils";
import { formatMoneyWithUnit } from "@utils";
import React from "react";
// import { ButtonFilter } from '@shared/components/ButtonFilter';
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const DeleteConfirmButton = WithDialogConfirm(ButtonGradientRed);

export const Layout = ({
  items,
  setGroupType,
  STAFF_LOG_TIME_GROUPS,
  dropdownRef,
  onChangeValueSearch,
  onButtonSearchPress,
  onChangeTimeValue,
}) => {
  const { t } = useTranslation();

  const onRenderCell = ({ columnKey, rowIndex, columnIndex, item }) => {
    switch (columnKey) {
      case "actions":
        const onHandleEdit = () => {};
        const onHandleDelete = () => {};

        return (
          <View
            style={[layouts.fill, layouts.horizontal]}
            key={getUniqueId(columnKey, rowIndex, "cell-action")}
          >
            <DeleteConfirmButton
              label={t("Delete")}
              width={scaleWidth(72)}
              height={scaleHeight(30)}
              borderRadius={scaleWidth(3)}
              fontSize={scaleFont(15)}
              textColor={colors.WHITE}
              borderRadius={scaleWidth(2)}
              fontWeight="normal"
              onPress={onHandleDelete}
              description={t("Are you sure you want to Delete this session ?")}
            />
            <View style={layouts.marginHorizontal} />
            <ButtonGradient
              label={t("Edit")}
              width={scaleWidth(72)}
              height={scaleHeight(30)}
              borderRadius={scaleWidth(3)}
              fontSize={scaleFont(15)}
              textColor={colors.WHITE}
              fontWeight="normal"
              onPress={onHandleEdit}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={layouts.fill}>
        <Table
          items={items}
          headerKeyLabels={{
            merchantStaffLogtimeId: t("Id"),
            startDate: t("Date"),
            startTime: t("Time"),
            amount: t("Cash amount"),
            note: t("Note"),
            actions: t("Actions"),
          }}
          whiteListKeys={[
            "merchantStaffLogtimeId",
            "startDate",
            "startTime",
            "amount",
            "note",
            "actions",
          ]}
          // sortedKeys={{ merchantStaffLogtimeId: sortName }}
          primaryKey="merchantStaffLogtimeId"
          widthForKeys={{
            merchantStaffLogtimeId: scaleWidth(80),
            startDate: scaleWidth(170),
            startTime: scaleWidth(100),
            amount: scaleWidth(120),
            note: scaleWidth(380),
          }}
          emptyDescription={t("No sessions")}
          // styleTextKeys={{ customerName: styles.textName }}
          // onSortWithKey={onSortWithKey}
          formatFunctionKeys={{
            startDate: (value) => dateToString(value, DATE_SHOW_FORMAT_STRING),
            startTime: (value) => dateToString(value, "LT"),
            amount: (value) => `${formatMoneyWithUnit(value)}`,
          }}
          renderCell={onRenderCell}
          // onRowPress={onSelectRow}
          // onRefresh={onRefresh}
        />
      </View>
      <View style={styles.rowContent}>
        <HeaderToolBarTitle label={t("Sessions")} style={styles.textTitle} />
      </View>
      <View style={styles.rowContent}>
        <View style={layouts.horizontal}>
          <ButtonCalendarFilter
            onChangeTimeValue={onChangeTimeValue}
            defaultValue={"This Week"}
            paddingLeft={scaleWidth(15)}
            paddingTop={scaleHeight(135)}
          />
          <View style={layouts.marginHorizontal} />
          <DropdownMenu
            ref={dropdownRef}
            items={STAFF_LOG_TIME_GROUPS}
            onChangeValue={setGroupType}
            defaultIndex={0}
            width={scaleWidth(208)}
            height={scaleHeight(40)}
          />
        </View>
      </View>

      <View style={styles.rowContent}>
        <View style={styles.leftContent}>
          <InputSearch onSearch={onChangeValueSearch} width={scaleWidth(280)} />
          <View style={layouts.marginHorizontal} />
          <ButtonGradientWhite
            label={t("Search")}
            width={scaleWidth(120)}
            onPress={onButtonSearchPress}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
  },

  rowContent: {
    marginTop: scaleHeight(20),
    paddingHorizontal: scaleWidth(16),
    height: scaleHeight(40),
    flexDirection: "row",
    justifyContent: "space-between",
  },

  leftContent: {
    flex: 1,
    flexDirection: "row",
  },

  textTitle: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(26),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },

  textName: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(15),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  textTitle: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(26),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },
});
