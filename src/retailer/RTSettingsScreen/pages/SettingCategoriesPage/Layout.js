import {
  ButtonGradient,
  ButtonGradientRed,
  SearchBar,
} from "@shared/components";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

const DeleteConfirmButton = WithDialogConfirm(ButtonGradientRed);

export const Layout = ({
  items,
  onChangeValueSearch,
  onButtonSearchPress,
  onButtonNewCategoriesPress,
  onButtonDeleteCategoriesPress,
  onButtonEditCategoriesPress,
  onSelectRow,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const onRenderCell = ({
    columnKey,
    rowIndex,
    columnIndex,
    item,
    cellWidth,
  }) => {
    const onHandleEdit = () => {
      onButtonEditCategoriesPress(item);
    };
    const onHandleDelete = () => {
      onButtonDeleteCategoriesPress(item);
    };

    if (columnKey === "name") {
      return (
        <View
          style={[{ width: cellWidth }, styles.cellStyle]}
          key={getUniqueId(columnKey, rowIndex, "cell-name")}
        >
          <Text
            style={[
              styles.nameStyle,
              item?.isSubCategory && {
                fontWeight: "500",
                fontFamily: fonts.REGULAR,
                fontSize: scaleFont(15),
              },
            ]}
          >
            {`${item?.isSubCategory ? "- " : ""}${item?.name}`}
          </Text>
        </View>
      );
    }

    if (columnKey === "actions") {
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
            fontWeight="normal"
            onPress={onHandleDelete}
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
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <SearchBar
        labelNewButton={t("New Categories")}
        onNewButtonPress={onButtonNewCategoriesPress}
        onButtonSearchPress={onButtonSearchPress}
        onChangeValueSearch={onChangeValueSearch}
      />
      <View style={layouts.formRow}>
        <Text style={layouts.formTitle}>{t("Categories")}</Text>
      </View>
      <View style={styles.tableHeader}>
        <Text style={layouts.formTitle}>{t("Menu")}</Text>
        <ButtonGradient
          label={t("Edit")}
          width={scaleWidth(72)}
          height={scaleHeight(30)}
          borderRadius={scaleWidth(3)}
          fontSize={scaleFont(15)}
          textColor={colors.WHITE}
          fontWeight="normal"
        />
      </View>
      <View style={layouts.fill}>
        <Table
          items={items}
          whiteListKeys={["name", "actions"]}
          primaryKey="categoryId"
          widthForKeys={{
            name: "75%",
          }}
          emptyDescription={t("No Attributes")}
          styleTextKeys={{ name: layouts.tableName }}
          renderCell={onRenderCell}
          onRowPress={onSelectRow}
          draggable={true}
          onRefresh={onRefresh}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableHeader: {
    height: scaleHeight(60),
    backgroundColor: colors.WHITE_F_6,
    borderStyle: "solid",
    borderWidth: scaleWidth(1),
    borderColor: "#dddddd",
    width: "100%",
    paddingHorizontal: scaleWidth(18),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  paddingHorizontal: scaleWidth(10),

  nameStyle: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(17),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },
});
