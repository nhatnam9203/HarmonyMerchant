import { ButtonGradient, Pagination } from "@shared/components";
import { CustomTableCheckBox } from "@shared/components/CustomCheckBox";
import { Table } from "@shared/components/CustomTable";
import { getUniqueId } from "@shared/components/CustomTable/helpers";
import { DialogLayout } from "@shared/layouts";
import { useGetPromotionCustomer } from "@shared/services/api/app";
import { colors, fonts, layouts } from "@shared/themes";
import { formatPhoneNumber, statusSuccess } from "@shared/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

const log = (obj, message = "") => {
  Logger.log(`[PromotionCustomerFilter] ${message}`, obj);
};
const DEFAULT_PAGE = 1;

export const PromotionCustomerFilter = React.forwardRef(
  ({ setCustomerIds }, ref) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const dialogRef = React.useRef(null);

    const [customerList, setCustomerList] = React.useState(null);
    const [promotion, setPromotion] = React.useState(null);
    const [pagination, setPagination] = React.useState({
      pages: 0,
      count: 0,
    });
    const [page, setPage] = React.useState(DEFAULT_PAGE);

    /**API */
    const [promotionCustomerGet, getPromotionCustomer] =
      useGetPromotionCustomer();

    const callGetPromotionsList = React.useCallback(() => {
      if (promotion) {
        getPromotionCustomer(promotion?.id, promotion?.merchantId, {
          page: page,
        });
      }
    }, [promotion]);

    const onHandleApply = () => {
      if (setCustomerIds && typeof setCustomerIds === "function") {
        const customerIds = customerList
          .filter((c) => c.checked)
          .map((customer) => customer.customerId);
        setCustomerIds(customerIds);
      }

      dialogRef.current?.hide();
    };

    React.useEffect(() => {
      if (promotion) {
        callGetPromotionsList();
      }
    }, [promotion]);

    // public func
    React.useImperativeHandle(ref, () => ({
      show: (list) => {
        setCustomerList(list);
        dialogRef.current?.show();
      },
      reset: () => {
        setPromotion(null);
        setCustomerList(null);
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

      const {
        codeStatus,
        data,
        pages = 0,
        count = 0,
      } = promotionCustomerGet || {};
      if (statusSuccess(codeStatus)) {
        setCustomerList(data);
        setPagination({
          pages,
          count,
        });
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
            <View style={layouts.marginVertical} />
            {/* <Pagination
              onChangePage={setPage}
              onChangeItemsPerPage={() => {}}
              visibleItemsPerPage={false}
              defaultPage={DEFAULT_PAGE}
              {...pagination}
              length={customerList?.length}
            /> */}
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
