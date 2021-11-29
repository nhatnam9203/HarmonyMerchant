import {
  ButtonGradient,
  ButtonGradientRed,
  ButtonGradientWhite,
  SearchBar,
} from "@shared/components";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import { colors, layouts } from "@shared/themes";
import { dateToString, DATE_SHOW_FORMAT_STRING } from "@shared/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";

const DeleteConfirmButton = WithDialogConfirm(ButtonGradientRed);
const RestoreConfirmButton = WithDialogConfirm(ButtonGradientWhite);

export const Layout = ({
  sortLabel,
  onSortWithKey,
  onChangeValueSearch,
  onButtonSearchPress,
  onButtonNewStaffPress,
  onButtonEditStaffPress,
  onSelectRow,
  getStaffListByMerchant,
  items,
  onButtonArchiveStaffPress,
  onButtonRestoreStaffPress,
}) => {
  const { t } = useTranslation();
  const onRenderCell = ({ columnKey, rowIndex, columnIndex, item }) => {
    const onHandleEdit = () => {
      onButtonEditStaffPress(item);
    };

    const onHandleArchive = () => {
      onButtonArchiveStaffPress(item);
    };

    const onHandleRestore = () => {
      onButtonRestoreStaffPress(item);
    };

    if (columnKey === "actions") {
      return (
        <View
          style={[layouts.fill, layouts.horizontal]}
          key={getUniqueId(columnKey, rowIndex, "cell-action")}
        >
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
          <View style={layouts.marginHorizontal} />

          {item?.isDisabled === 0 ? (
            <DeleteConfirmButton
              label={t("Archive")}
              width={scaleWidth(72)}
              height={scaleHeight(30)}
              borderRadius={scaleWidth(3)}
              fontSize={scaleFont(15)}
              textColor={colors.WHITE}
              fontWeight="normal"
              onPress={onHandleArchive}
              description={t("Do you want to archive this staff?")}
            />
          ) : (
            <RestoreConfirmButton
              label={t("Restore")}
              width={scaleWidth(72)}
              height={scaleHeight(30)}
              borderRadius={scaleWidth(3)}
              fontSize={scaleFont(15)}
              textColor={colors.GREYISH_BROWN}
              fontWeight="normal"
              onPress={onHandleRestore}
              description={t("Do you want to restore this staff?")}
            />
          )}
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <SearchBar
        labelNewButton={t("New Staff")}
        onNewButtonPress={onButtonNewStaffPress}
        onButtonSearchPress={onButtonSearchPress}
        onChangeValueSearch={(value) => onChangeValueSearch("keySearch", value)}
      />
      <View style={layouts.formRow}>
        <Text style={layouts.formTitle}>{t("Staffs")}</Text>
      </View>
      <View style={layouts.fill}>
        <Table
          items={items}
          headerKeyLabels={{
            displayName: t("Staff name"),
            phone: t("Phone Number"),
            email: t("Email"),
            roleName: t("Role"),
            actions: t("Actions"),
          }}
          whiteListKeys={[
            "displayName",
            "phone",
            "email",
            "roleName",
            "actions",
          ]}
          sortedKeys={{ displayName: sortLabel }}
          primaryKey="staffId"
          widthForKeys={{
            displayName: scaleWidth(180),
            roleName: scaleWidth(100),
            phone: scaleWidth(160),
            email: scaleWidth(250),
          }}
          emptyDescription={t("No Staffs")}
          styleTextKeys={{ displayName: layouts.tableName }}
          onSortWithKey={onSortWithKey}
          renderCell={onRenderCell}
          onRowPress={onSelectRow}
          draggable={false}
          onRefresh={getStaffListByMerchant}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
