import React from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { colors } from "@shared/themes";
import {
  Button,
  ButtonCustom,
  PopupActiveGiftCard,
  PopupChangeMoney,
  PopupChangePriceAmountProduct,
  PopupChangeStylist,
  PopupChangeTip,
  PopupCheckStaffPermission,
  PopupConfirm,
  PopupInvoicePrint,
  PopupProcessingCredit,
  PopupScanCode,
  PopupSendLinkInstall,
  ScrollableTabView,
  Text,
} from "@components";
import ICON from "@resources";
import { scaleSize, checkIsTablet } from "@utils";
import _ from "ramda";
import { useTranslation } from "react-i18next";
import { StaffItem } from "@src/screens/HomeScreen/widget/TabCheckout/widget/NewCheckoutComponent";
import {
  EnterCustomerPhonePopup,
  ErrorMessagePaxModal,
  ItemAmount,
  ItemBlockBasket,
  ItemCustomerBasket,
  ItemExtra,
  ItemPaymentMethod,
  ItemProductService,
  PopupAddEditCustomer,
  PopupAddItemIntoAppointments,
  PopupBill,
  PopupBlockDiscount,
  PopupDiscount,
  PopupDiscountLocal,
  PopupEnterAmountCustomService,
  PopupEnterAmountGiftCard,
  PopupGiftCardDetail,
  PopupPaymentDetails,
} from "@src/screens/HomeScreen/widget/TabCheckout/widget";
import { fonts } from "@shared/themes";
import { ItemCategory } from "../ItemCategory";
import { Header, StaffColumn, ColumnContainer } from "./components";

const TXT_COLOR = "#404040";
const BULE_SKY = "#0764B0";

export const Categories = React.forwardRef(
  (
    {
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
    },
    ref
  ) => {
    const { t } = useTranslation();

    const staffFlatListRef = React.useRef(null);

    React.useImperativeHandle(ref, () => ({
      scrollFlatListToStaffIndex: (staffId, isFirstPressCheckout) => {
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
          isHighlight={isShowCategoriesColumn}
          disable={isBlockBookingFromCalendar}
          flatListRef={staffFlatListRef}
          items={staffListCurrentDate}
          selectedStaff={selectedStaff}
          displayCategoriesColumn={displayCategoriesColumn}
        />
      );
    };

    const renderCategoriesCheckout = () => {
      let tempWidth = 180;
      tempWidth = isShowColProduct ? 100 : tempWidth;

      const temptColorHeader = isShowColProduct ? { color: "#6A6A6A" } : {};
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

      return (
        <ColumnContainer style={[{ width: scaleSize(tempWidth) }]}>
          {/* ------- Header ----- */}
          <Header label={t("Categories")} />

          {/* ------- Body ----- */}
          {isLoadingCategory ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="grey" />
            </View>
          ) : (
            <View style={styles.categoriesBody}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
              >
                {tempCategories.map((category, index) => (
                  <ItemCategory
                    key={index}
                    category={category}
                    onPressSelectCategory={onPressSelectCategory}
                    colorText={temptColorHeader}
                    categorySelected={categorySelected}
                  />
                ))}

                {/* --------- Gift Card --------  */}
                <ItemCategory
                  category={{
                    name: "Gift Card",
                    categoryId: 1,
                  }}
                  onPressSelectCategory={onSelectGiftCard}
                  colorText={temptColorHeader}
                  categorySelected={categorySelected}
                />
              </ScrollView>
            </View>
          )}
        </ColumnContainer>
      );
    };

    const renderCategoryItemCheckout = () => {
      let tempWidth = 200;
      tempWidth = isShowColAmount ? 120 : tempWidth;
      const temptColorHeader = isShowColAmount ? { color: "#6A6A6A" } : {};
      const data = getDataColProduct();
      const tempTitle =
        categorySelected?.categoryType === "Service" ? "Services" : "Products";

      return (
        <ColumnContainer
          style={[{ width: scaleSize(tempWidth) }, styles.product_column_box]}
        >
          {/* ----- Header ---- */}
          <Header label={t(tempTitle)} />

          {/* --------- List ------- */}
          <View style={{ flex: 1 }}>
            {isLoadingService ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="grey" />
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
              >
                {isCustomService &&
                  !isBookingFromCalendar &&
                  // !isBookingFromAppointmentTab &&
                  categoryTypeSelected != "Product" &&
                  blockAppointments.length == 0 &&
                  customService && (
                    <ItemProductService
                      key="custom_service"
                      index={-1}
                      item={Object.assign({}, customService, {
                        name: "Custom service",
                        category: categorySelected,
                      })}
                      defaultThumb={ICON.custom_service_thumb}
                      colorText={temptColorHeader}
                      itemSelected={productSeleted}
                      categoryTypeSelected={categoryTypeSelected}
                      isShowColAmount={isShowColAmount}
                      groupAppointment={groupAppointment}
                      showColAmount={showCustomServiceAmount}
                    />
                  )}

                {data.map((item, index) => (
                  <ItemProductService
                    key={index}
                    item={item}
                    showColAmount={showColAmount}
                    colorText={temptColorHeader}
                    itemSelected={productSeleted}
                    categoryTypeSelected={categoryTypeSelected}
                    isShowColAmount={isShowColAmount}
                    groupAppointment={groupAppointment}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </ColumnContainer>
      );
    };

    const renderAmountCheckout = () => {
      const temptHeader =
        categorySelected.categoryType === "Service" ? "Extra" : "Amount";

      return (
        <ColumnContainer>
          <View
            style={{
              flex: 1,
              borderLeftColor: "#DDDDDD",
              borderLeftWidth: 1,
              borderRightColor: "#DDDDDD",
              borderRightWidth: 1,
            }}
          >
            {/* ----- Header ---- */}
            <Header label={t(temptHeader)} />

            {/* ------- Content ----- */}
            <View style={{ flex: 1 }}>
              {categoryTypeSelected === "Product" ? (
                <ItemAmount ref={amountRef} price={productSeleted?.price} />
              ) : (
                <ScrollView keyboardShouldPersistTaps="always">
                  {getExtrasFromRedux(productSeleted).map((extra, index) => (
                    <ItemExtra
                      key={index}
                      extra={extra}
                      onPressSelectExtra={onPressSelectExtra}
                      arrSelectedExtra={arrSelectedExtra}
                      groupAppointment={groupAppointment}
                    />
                  ))}
                </ScrollView>
              )}
            </View>

            {/* ------- Footer -------- */}
            <View
              style={{
                height: scaleSize(52),
                paddingHorizontal: scaleSize(6),
                paddingBottom: scaleSize(8),
              }}
            >
              <ButtonCustom
                width={`100%`}
                backgroundColor="#F1F1F1"
                title={t("ADD")}
                textColor="#6A6A6A"
                onPress={addAmount}
                style={{
                  borderWidth: 1,
                  borderColor: "#C5C5C5",
                  backgroundColor: "#0764B0",
                  flex: 1,
                  borderRadius: 4,
                }}
                styleText={{
                  fontSize: scaleSize(19),
                  fontWeight: "bold",
                  color: "#fff",
                }}
              />
            </View>
          </View>
        </ColumnContainer>
      );
    };

    return (
      <View
        style={{ flex: 1, flexDirection: "row", backgroundColor: colors.WHITE }}
      >
        {renderStaffColumn()}
        {isShowCategoriesColumn && renderCategoriesCheckout()}
        {isShowColProduct && renderCategoryItemCheckout()}
        {isShowColAmount && renderAmountCheckout()}
        <View style={{ width: scaleSize(4) }} />
      </View>
    );
  }
);

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
