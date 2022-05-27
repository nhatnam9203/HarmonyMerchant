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
    getDataColProduct,
    isCustomService = false,
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
  } = ctx || {};

  React.useImperativeHandle(ref, () => ({
    scrollFlatListToStaffIndex: (staffId, isFirstPressCheckout) => {
      if (!staffListCurrentDate?.length) {
        console.log(staffListCurrentDate);
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
        flatListRef={staffFlatListRef}
        items={staffListCurrentDate}
        selectedStaff={selectedStaff}
        displayCategoriesColumn={displayCategoriesColumn}
      />
    );
  };

  const renderCategoriesCheckout = () => {
    const categoriesFilter = categoriesByMerchant?.filter(
      (category, index) => category.isDisabled === 0
    );

    const appointments = groupAppointment?.appointments || [];
    let tempIdCategoriesList = [];
    for (let appointment of appointments) {
      let categories = appointment?.categories || [];
      for (let category of categories) {
        tempIdCategoriesList.push(category?.categoryId || 0);
      }
    }

    const IdCategoriesList = [...new Set(tempIdCategoriesList)];
    let selectCategories = [];
    let notSelectCategories = [];
    let tempCategories = [];

    if (IdCategoriesList.length > 0) {
      for (let i = 0; i < IdCategoriesList.length; i++) {
        for (let j = 0; j < categoriesFilter.length; j++) {
          if (IdCategoriesList[i] === categoriesFilter[j].categoryId) {
            selectCategories.push({
              ...categoriesFilter[j],
              isSelect: true,
            });
            break;
          }
        }
      }
      if (isOfflineMode || isBlockBookingFromCalendar) {
        notSelectCategories = categoriesFilter.filter((category, index) =>
          checkCategoryIsNotExist(category, IdCategoriesList)
        );
        tempCategories = [...selectCategories, ...notSelectCategories];
      } else {
        let categoriesStaffFilter = [];

        for (let i = 0; i < categoryStaff.length; i++) {
          const findItem = l.find(selectCategories, (item) => {
            return item.categoryId == categoryStaff[i].categoryId;
          });
          if (!findItem) {
            categoriesStaffFilter.push(categoryStaff[i]);
          }
        }
        tempCategories = [...selectCategories, ...categoriesStaffFilter];
      }
    } else {
      if (isOfflineMode || isBlockBookingFromCalendar) {
        tempCategories = [...categoriesFilter];
      } else {
        tempCategories = [...categoryStaff];
      }
    }

    return <CategoriesColumn items={tempCategories} />;
  };

  const renderCategoryItemCheckout = () => {
    const data = getDataColProduct();
    return (
      <ItemsColumn
        items={data}
        isShowCustomService={
          isCustomService &&
          !isBookingFromCalendar &&
          categoryTypeSelected != "Product" &&
          blockAppointments.length == 0 &&
          customService
        }
        isShowColAmount={isShowColAmount}
        productSeleted={productSeleted}
        categoryTypeSelected={categoryTypeSelected}
        categorySelected={categorySelected}
        groupAppointment={groupAppointment}
        showCustomServiceAmount={showCustomServiceAmount}
        showColAmount={showColAmount}
        customService={customService}
      />
    );
  };

  const renderAmountCheckout = () => {
    return (
      <ExtraAmountColumn
        productSeleted={productSeleted}
        isShowColAmount={isShowColAmount}
        categoryTypeSelected={categoryTypeSelected}
        categorySelected={categorySelected}
        groupAppointment={groupAppointment}
        getExtrasFromRedux={getExtrasFromRedux}
        onPressSelectExtra={onPressSelectExtra}
        arrSelectedExtra={arrSelectedExtra}
        addAmount={addAmount}
      />
    );
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", zIndex: 100 }}>
      {renderStaffColumn()}
      {isShowCategoriesColumn && renderCategoriesCheckout()}
      {isShowColProduct && renderCategoryItemCheckout()}
      {isShowColAmount && renderAmountCheckout()}
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
