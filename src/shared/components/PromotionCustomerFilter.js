import { basketRetailer } from "@redux/slices";
import {
  ButtonGradient,
  FormAddress,
  FormContactEmail,
  FormFullName,
  FormPhoneNumber,
  FormTitle,
} from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import {
  useCreateCustomer,
  useEditCustomer,
} from "@shared/services/api/retailer";
import { colors, fonts, layouts } from "@shared/themes";
import { statusSuccess } from "@shared/utils";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import {
  dateToString,
  DATE_SHOW_FORMAT_STRING,
  formatPhoneNumber,
} from "@shared/utils";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import {
  useCreatePromotionCustomer,
  useEditPromotionCustomer,
  useGetPromotionCustomer,
} from "@shared/services/api/app";
import { CustomTableCheckBox } from "@shared/components/CustomCheckBox";

const log = (obj, message = "") => {
  Logger.log(`[PromotionCustomerFilter] ${message}`, obj);
};

export const PromotionCustomerFilter = React.forwardRef(
  ({ setCustomerIds }, ref) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const dialogRef = React.useRef(null);

    const [customerList, setCustomerList] = React.useState(null);

    /**API */
    const [promotionCustomerGet, getPromotionCustomer] =
      useGetPromotionCustomer();

    const onHandleApply = () => {
      if (setCustomerIds && typeof setCustomerIds === "function") {
        const customerIds = customerList
          .filter((c) => c.checked)
          .map((customer) => customer.customerId);
        setCustomerIds(customerIds);
      }

      setCustomerList(null);
      dialogRef.current?.hide();
    };

    // public func
    React.useImperativeHandle(ref, () => ({
      show: (promotionId, merchantId) => {
        if (promotionId >= 0) {
          getPromotionCustomer(promotionId, merchantId);
        }
        dialogRef.current?.show();
      },
    }));

    /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */
    React.useEffect(() => {
      if (!promotionCustomerGet) {
        return;
      }

      const { codeStatus, message, data } = promotionCustomerGet || {};
      if (statusSuccess(codeStatus)) {
        setCustomerList(data);
      }
    }, [promotionCustomerGet]);

    const handleSelectRow = ({ item }) => {
      if (item) {
        const index = customerList.findIndex(
          (c) => c.customerId === item.customerId
        );
        if (index >= 0) {
          let clones = [...customerList];
          clones[index] = Object.assign({}, item, { checked: !item.checked });
          setCustomerList(clones);
        }
      }
    };

    const onRenderTableCell = ({
      item: cellItem,
      columnKey,
      rowIndex,
      cellWidth,
      textStyle,
    }) => {
      switch (columnKey) {
        case "customerName":
          const handleCheckRow = () => {
            handleSelectRow({ item: cellItem });
          };

          return (
            <TouchableOpacity
              onPress={handleCheckRow}
              style={[
                layouts.horizontal,
                { width: cellWidth },
                styles.cellStyle,
              ]}
              key={getUniqueId(columnKey, rowIndex, "cell-customerName")}
            >
              <CustomTableCheckBox
                defaultValue={cellItem?.checked}
                // onValueChange={handleCheckRow}
                editable={false}
              />
              <Text
                style={styles.textName}
              >{`${cellItem.firstName} ${cellItem.lastName}`}</Text>
            </TouchableOpacity>
          );
        default:
          return null;
      }
    };

    return (
      <View>
        <DialogLayout
          title={t("Filter customers")}
          ref={dialogRef}
          behavior={"none"}
          bottomChildren={() => (
            <View style={styles.bottomStyle}>
              <ButtonGradient
                label={t("Apply")}
                width={scaleWidth(140)}
                height={scaleHeight(40)}
                borderRadius={scaleWidth(3)}
                // disable={!form.isValid}
                onPress={onHandleApply}
              />
            </View>
          )}
          style={styles.dialog}
        >
          <View style={styles.container}>
            <Table
              items={customerList}
              headerKeyLabels={{
                customerName: t("Name"),
                phone: t("Phone Number"),
              }}
              whiteListKeys={["customerName", "phone"]}
              // sortedKeys={{ customerName: sortName, phone: sortPhoneNumber }}
              primaryKey="customerId"
              // unitKeys={{ totalDuration: "hrs" }}
              widthForKeys={{
                customerName: "60%",
                phone: scaleWidth(300),
              }}
              emptyDescription={t("No Customers")}
              // styleTextKeys={{ customerName: styles.textName }}
              // onSortWithKey={onSortWithKey}
              formatFunctionKeys={{
                phone: (value) => formatPhoneNumber(value),
              }}
              renderCell={onRenderTableCell}
              onRowPress={handleSelectRow}
              // onRefresh={onRefresh}
            />
          </View>
        </DialogLayout>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  dialog: {
    flex: 0,
    width: scaleWidth(680),
  },

  container: {
    height: scaleHeight(550),
  },

  row: { flexDirection: "row", alignItems: "center" },

  bottomStyle: {
    width: "100%",
    height: scaleHeight(80),
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  title: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(23),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.VERY_LIGHT_PINK_C_5,
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
