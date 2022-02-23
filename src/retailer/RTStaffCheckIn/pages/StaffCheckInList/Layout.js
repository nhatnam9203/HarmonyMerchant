import {
  ButtonCalendarFilter,
  ButtonGradient,
  ButtonGradientRed,
  ButtonGradientWhite,
  DropdownMenu,
  ExportModal,
} from "@shared/components";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import { HeaderToolBarTitle } from "@shared/components/HeaderToolBarTitle";
import { InputSearch } from "@shared/components/InputSearch";
import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";
import { WithDialogStaffCheckIn } from "@shared/HOC/withDialogStaffCheckIn";
import { colors, fonts, layouts } from "@shared/themes";
import { dateToString, DATE_SHOW_FORMAT_STRING } from "@shared/utils";
import { formatMoneyWithUnit } from "@utils";
import React from "react";
// import { ButtonFilter } from '@shared/components/ButtonFilter';
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

const DeleteConfirmButton = WithDialogConfirm(ButtonGradientRed);
const ButtonStaffCheckIn = WithDialogStaffCheckIn(ButtonGradient);

export const Layout = ({
  items,
  setType,
  STAFF_LOG_TIME_GROUPS,
  dropdownRef,
  onChangeValueSearch,
  onButtonSearchPress,
  onChangeTimeValue,
  deleteSession,
  onEditSuccess,
  RANGE_TIME_DEFAULT,
  sortDate,
  onSortWithKey,
  setPage,
  pagination,
  onRefresh,
  isPermission,
  exportRef,
  callExportOrderList,
}) => {
  const { t } = useTranslation();

  const onRenderCell = ({
    columnKey,
    rowIndex,
    columnIndex,
    item,
    cellWidth,
    textStyle,
  }) => {
    switch (columnKey) {
      case "type":
        return (
          <View
            style={[{ width: cellWidth }, styles.cellStyle]}
            key={getUniqueId(columnKey, rowIndex, "cell-type")}
          >
            <Text style={styles.textStyle}>
              {item?.type === 0 ? t("Check In") : t("Check Out")}
            </Text>
          </View>
        );
      case "note":
        return (
          <View
            style={[{ width: cellWidth }, styles.cellStyle]}
            key={getUniqueId(columnKey, rowIndex, "cell-note")}
          >
            <Text
              style={[
                textStyle,
                {
                  textAlign: "left",
                  textAlignVertical: "center",
                },
              ]}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {item?.note}
            </Text>
          </View>
        );
      case "actions":
        const showEditForm = () => {
          return item;
        };
        const onHandleDelete = () => {
          deleteSession(item);
        };

        return (
          <View
            style={[layouts.fill, layouts.horizontal]}
            key={getUniqueId(columnKey, rowIndex, "cell-action")}
          >
            <DeleteConfirmButton
              disable={!isPermission()}
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
            <ButtonStaffCheckIn
              disable={!isPermission()}
              label={t("Edit")}
              width={scaleWidth(72)}
              height={scaleHeight(30)}
              borderRadius={scaleWidth(3)}
              fontSize={scaleFont(15)}
              textColor={colors.WHITE}
              fontWeight="normal"
              showEditForm={showEditForm}
              onSuccess={onEditSuccess}
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
            staffName: t("Staff Name"),
            type: t("Type"),
            amount: t("Cash amount"),
            note: t("Note"),
            actions: t("Actions"),
          }}
          whiteListKeys={[
            "merchantStaffLogtimeId",
            "startDate",
            "startTime",
            "staffName",
            "type",
            "amount",
            "note",
            "actions",
          ]}
          // sortedKeys={{ startDate: sortDate }}
          primaryKey="merchantStaffLogtimeId"
          widthForKeys={{
            merchantStaffLogtimeId: scaleWidth(50),
            startDate: scaleWidth(150),
            startTime: scaleWidth(80),
            staffName: scaleWidth(120),
            type: scaleWidth(100),
            amount: scaleWidth(120),
            note: scaleWidth(230),
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
          onRefresh={onRefresh}
        />
      </View>
      <View style={styles.rowContent}>
        <HeaderToolBarTitle label={t("Sessions")} style={styles.textTitle} />

        <Pagination
          onChangePage={setPage}
          onChangeItemsPerPage={() => {}}
          visibleItemsPerPage={false}
          defaultPage={1}
          {...pagination}
          length={items?.length}
        />

        <ExportModal
          ref={exportRef}
          onExportFile={callExportOrderList}
          exportFuncs={[{ value: "excel", label: "EXCEL" }]}
        />
      </View>
      <View style={styles.rowContent}>
        <View style={layouts.horizontal}>
          <ButtonCalendarFilter
            onChangeTimeValue={onChangeTimeValue}
            defaultValue={RANGE_TIME_DEFAULT}
            paddingLeft={scaleWidth(15)}
            paddingTop={scaleHeight(135)}
          />
          <View style={layouts.marginHorizontal} />
          <DropdownMenu
            ref={dropdownRef}
            items={STAFF_LOG_TIME_GROUPS}
            onChangeValue={setType}
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

  cellStyle: {
    // flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingRight: scaleWidth(5),
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },
});
