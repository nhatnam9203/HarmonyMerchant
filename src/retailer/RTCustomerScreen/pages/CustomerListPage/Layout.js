import React from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  ButtonGradient,
  ButtonGradientWhite,
  ExportModal,
  DropdownMenu,
  Pagination,
} from "@shared/components";
import { InputSearch } from "@shared/components/InputSearch";
// import { ButtonFilter } from '@shared/components/ButtonFilter';
import { useTranslation } from "react-i18next";
import { layouts, fonts, colors } from "@shared/themes";
import { HeaderToolBarTitle } from "@shared/components/HeaderToolBarTitle";
import { Table } from "@shared/components/CustomTable";
import IMAGE from "@resources";
import {
  dateToString,
  DATE_SHOW_FORMAT_STRING,
  formatPhoneNumber,
} from "@shared/utils";
import { getUniqueId } from "@shared/components/CustomTable/helpers";

export const Layout = ({
  items,
  groupType,
  setGroupType,
  customerGroups,
  getCustomerGroupLabel,
  sortName,
  sortPhoneNumber,
  onSortWithKey,
  onChangeValueSearch,
  onButtonSearchPress,
  onButtonNewCustomerPress,
  onSelectRow,
  onEditCustomer,
  onRefresh,
  callExportCustomer,
  exportRef,
  dropdownRef,
  pagination,
  setPage,
  DEFAULT_PAGE,
}) => {
  const { t } = useTranslation();
  const onRenderCell = ({ columnKey, rowIndex, columnIndex, item }) => {
    if (columnKey === "actions") {
      const onHandleEditCustomer = () => {
        onEditCustomer(item);
      };
      return (
        <View
          style={layouts.fill}
          key={getUniqueId(columnKey, rowIndex, "cell-action")}
        >
          <ButtonGradient
            label={t("Edit")}
            width={scaleWidth(72)}
            height={scaleHeight(28)}
            fontSize={scaleFont(15)}
            textColor={colors.WHITE}
            fontWeight="normal"
            onPress={onHandleEditCustomer}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={layouts.fill}>
        <Table
          items={items?.map((x) =>
            Object.assign({}, x, {
              customerName: `${x.firstName} ${x.lastName}`,
              group: getCustomerGroupLabel(x.isVip),
            })
          )}
          headerKeyLabels={{
            customerName: t("Name"),
            phone: t("Phone Number"),
            email: t("Email"),
            group: t("Group"),
            createdDate: t("Customer Since"),
            actions: t("Actions"),
          }}
          whiteListKeys={[
            "customerName",
            "phone",
            "email",
            "group",
            "createdDate",
            "actions",
          ]}
          sortedKeys={{ customerName: sortName, phone: sortPhoneNumber }}
          primaryKey="customerId"
          unitKeys={{ totalDuration: "hrs" }}
          widthForKeys={{
            customerName: scaleWidth(190),
            phone: scaleWidth(170),
            email: scaleWidth(280),
            group: scaleWidth(120),
            createdDate: scaleWidth(170),
          }}
          emptyDescription={t("No Customers")}
          styleTextKeys={{ customerName: styles.textName }}
          onSortWithKey={onSortWithKey}
          formatFunctionKeys={{
            createdDate: (value) =>
              dateToString(value, DATE_SHOW_FORMAT_STRING),
            phone: (value) => formatPhoneNumber(value),
          }}
          renderCell={onRenderCell}
          onRowPress={onSelectRow}
          onRefresh={onRefresh}
        />
      </View>
      <View style={styles.rowContent}>
        <HeaderToolBarTitle label={t("Customer")} style={styles.textTitle} />

        <View style={layouts.horizontal}>
          <Pagination
            onChangePage={setPage}
            onChangeItemsPerPage={() => {}}
            visibleItemsPerPage={false}
            defaultPage={DEFAULT_PAGE}
            {...pagination}
            length={items?.length}
          />
          <View style={layouts.marginHorizontal} />
          <ExportModal
            onExportFile={callExportCustomer}
            title={t("ReportCustomer")}
            ref={exportRef}
          />
        </View>
      </View>

      <View style={styles.rowContent}>
        <DropdownMenu
          ref={dropdownRef}
          items={customerGroups}
          onChangeValue={(item) => {
            setGroupType(item?.value);
          }}
          defaultIndex={customerGroups.findIndex((x) => x.value === groupType)}
          width={scaleWidth(208)}
          height={scaleHeight(40)}
        />
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
        <ButtonGradient
          onPress={onButtonNewCustomerPress}
          label={t("New Customer")}
          width={scaleWidth(140)}
        />
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
});
