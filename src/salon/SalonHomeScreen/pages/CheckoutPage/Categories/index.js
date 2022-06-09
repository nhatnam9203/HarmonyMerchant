import { colors } from "@shared/themes";
import { scaleSize } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SalonHomeContext } from "../SalonHomeContext";
import {
  CategoriesColumn,
  ExtraAmountColumn,
  ItemsColumn,
  StaffColumn,
} from "./columns";

const TXT_COLOR = "#404040";
const BULE_SKY = "#0764B0";

export const Categories = React.forwardRef((props, ref) => {
  const staffFlatListRef = React.useRef(null);

  const { t } = useTranslation();
  const ctx = React.useContext(SalonHomeContext);
  const {
    isBlockBookingFromCalendar,
    isShowCategoriesColumn,
    staffListCurrentDate,
    selectedStaff,
    displayCategoriesColumn,
    isShowColProduct,
    categoriesByMerchant,
    groupAppointment,
    categoryStaff,
    isLoadingCategory,
    onPressSelectCategory,
    categorySelected,
    onSelectGiftCard,
    isOfflineMode,
    isLoadingService = false,
    isBookingFromCalendar,
    categoryTypeSelected,
    blockAppointments,
    customService,
    productSeleted,
    isShowColAmount,
    showCustomServiceAmount,
    showColAmount,
    amountRef,
    getExtrasFromRedux,
    onPressSelectExtra,
    arrSelectedExtra,
    addAmount,
    profile,
  } = ctx || {};

  React.useImperativeHandle(ref, () => ({
    scrollFlatListToStaffIndex: (staffId, isFirstPressCheckout) => {
      if (!staffListCurrentDate?.length) {
        return;
      }
      let index = -1;
      for (let i = 0; i < staffListCurrentDate?.length; i++) {
        if (staffListCurrentDate[i]?.staffId === staffId) {
          index = i;
          break;
        }
      }

      if (index !== -1) {
        if (staffFlatListRef?.current) {
          if (isFirstPressCheckout) {
            setTimeout(() => {
              staffFlatListRef?.current?.scrollToIndex({
                index,
              });
            }, 300);
          } else {
            staffFlatListRef?.current?.scrollToIndex({
              index,
            });
          }
        } else {
          setTimeout(() => {
            staffFlatListRef?.current?.scrollToIndex({
              index,
            });
          }, 200);
        }
      }
    },
  }));

  const renderStaffColumn = () => {
    return (
      <StaffColumn
        disable={isBlockBookingFromCalendar}
        items={staffListCurrentDate}
        selectedStaff={selectedStaff}
        displayCategoriesColumn={displayCategoriesColumn}
        staffFlatListRef={staffFlatListRef}
      />
    );
  };

  const renderCategoriesCheckout = () => {
    return <CategoriesColumn />;
  };

  const renderCategoryItemCheckout = () => {
    return (
      <ItemsColumn
        isShowCustomService={
          profile.isCustomService &&
          !isBookingFromCalendar &&
          categoryTypeSelected !== "Product" &&
          blockAppointments.length == 0 &&
          customService
        }
      />
    );
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", zIndex: 100 }}>
      {renderStaffColumn()}
      {isShowCategoriesColumn && renderCategoriesCheckout()}
      {isShowColProduct && renderCategoryItemCheckout()}
      {isShowColAmount && <ExtraAmountColumn />}
      <View style={{ width: scaleSize(4) }} />
    </View>
  );
});

const styles = StyleSheet.create({
  txt_category_header_extra: {
    color: "#404040",
    fontSize: scaleSize(15),
    fontWeight: "500",
  },

  txt_staff_column_header: {
    color: TXT_COLOR,
    fontSize: scaleSize(18),
    fontWeight: "600",
  },

  // ------------- Categories Column Style -------------

  categories_column_box: {
    backgroundColor: "#fff",
    borderRightColor: "#EEEEEE",
    borderRightWidth: 1,
    borderLeftColor: "#EEEEEE",
    borderLeftWidth: 1,
    ...Platform.select({
      ios: {
        shadowRadius: 5,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 3 },
      },

      android: {
        elevation: 2,
      },
    }),
  },
  // ------------- Product Column Style -------------
  columnShadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.GREYISH_BROWN_25,
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowRadius: 10,
        shadowOpacity: 1,
      },

      android: {
        elevation: 2,
      },
    }),
  },
  // ------------- Extra Column Style -------------
  product_column_box: {
    backgroundColor: "#fff",
    borderRightColor: "#EEEEEE",
    borderRightWidth: 1,
    borderLeftColor: "#EEEEEE",
    borderLeftWidth: 1,
    ...Platform.select({
      ios: {
        shadowRadius: 5,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 3 },
      },

      android: {
        elevation: 2,
      },
    }),
  },

  categoriesHeader: {
    height: scaleSize(38),
    // borderBottomWidth: 2,
    // borderColor: '#DDDDDD',
    justifyContent: "center",
    // alignItems: 'center',
    backgroundColor: "#F1F1F1",
    borderBottomColor: "#DDDDDD",
    borderBottomWidth: 1,
    paddingLeft: scaleSize(8),
  },

  textHeader: {
    fontSize: scaleSize(18),
    color: "#404040",
  },

  categoriesBody: {
    flex: 1,
  },
});
