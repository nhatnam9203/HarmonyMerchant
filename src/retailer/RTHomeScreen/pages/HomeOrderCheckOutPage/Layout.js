import { PopupActiveGiftCard } from "@components";
import IMAGE from "@resources";
import { ButtonGradient, ButtonGradientWhite } from "@shared/components";
import { InputSearch } from "@shared/components/InputSearch";
import { PopupEnterAmountGiftCard } from "@shared/components/payment";
import { colors, fonts, layouts } from "@shared/themes";
import _ from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  BasketContentView,
  CheckOutCustomerInfo,
  CustomList,
  CUSTOM_LIST_TYPES,
  DialogEditProductOrder,
  DialogProductDetail,
} from "../../widget";
import { DialogScanQR } from "@shared/components/DialogScanQR";

export const Layout = ({
  activeTab,
  categories,
  subCategories,
  products,
  onPressCategoryItem,
  onPressSubCategoryItem,
  onPressProductItem,
  categoryId,
  subCategoryId,
  selectedProductId,
  productDetailRef,
  basketRef,
  onHadSubmitted,
  onGoBack,
  customerRef,
  onRefreshCategory,
  onAddProduct,
  onRemoveItem,
  customer,
  onResultScanCode,
  categoriesLabelData,
  checkStatusCashier,
  onSelectGiftCard,
  activeGiftCardRef,
  closePopupActiveGiftCard,
  submitSerialCode,
  onRequestCloseBillModal,
  popupEnterAmountGiftCardRef,
  onAddGiftCardToAppointment,
  onChangeValueSearch,
  editProductItemRef,
  onShowDialogEditProductItem,
  onSubmitEditProductItem,
  isCanGoBack,
  visiblePopupGiftCard,
  clearBasket,
  inputSearchRef,
  appointment,
  inputBarcodeDialogRef,
  showScanBarcode,
  scanCodeTemp,
  isApplyCostPrice,
  isTempAppointment,
  onChangeApplyCostPrice,
}) => {
  const { t } = useTranslation();

  const labelColumn1 = _.get(categoriesLabelData, "column1") || t("Categories");
  const labelColumn2 =
    _.get(categoriesLabelData, "column2") || t("Subcategories");
  const labelColumn3 = _.get(categoriesLabelData, "column3") || t("Products");

  const onRenderGiftCardItem = () => {
    // return null;
    return (
      <TouchableOpacity style={styles.itemContent} onPress={onSelectGiftCard}>
        <Text style={styles.itemText}>{t("Gift Card")}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={layouts.fill}>
      <View style={styles.headContent}>
        <CheckOutCustomerInfo
          ref={customerRef}
          customerInfo={customer}
          canDelete={true}
        />
        <View style={layouts.marginHorizontal} />

        <ButtonGradientWhite
          label={t("Scan")}
          title={t("Scan Barcode")}
          width={scaleWidth(140)}
          height={scaleHeight(40)}
          onPress={showScanBarcode}
          leftChildren={() => (
            <Image
              source={IMAGE.scancode}
              style={{
                width: scaleWidth(24),
                height: scaleHeight(24),
                marginHorizontal: scaleWidth(12),
              }}
            />
          )}
        />
        <View style={styles.rowContent}>
          <InputSearch
            ref={inputSearchRef}
            onSearch={onChangeValueSearch}
            width={scaleWidth(280)}
          />

          <View style={layouts.marginHorizontal} />
        </View>

        <View style={styles.headerRightContent}>
          <ButtonGradient
            // disable={true}
            width={scaleWidth(120)}
            height={scaleHeight(32)}
            fontSize={scaleFont(12)}
            textWeight="normal"
            label={t("Open Cashier")}
            onPress={checkStatusCashier}
            leftChildren={() => (
              <Image style={styles.icon} source={IMAGE.cashier_btn} />
            )}
          />
          <View style={layouts.marginHorizontal} />

          {isCanGoBack() && (
            <ButtonGradientWhite
              width={scaleWidth(40)}
              height={scaleHeight(40)}
              fontSize={scaleFont(17)}
              textWeight="normal"
              onPress={onGoBack}
            >
              <Image source={IMAGE.back} />
            </ButtonGradientWhite>
          )}
        </View>
      </View>

      <View style={styles.container}>
        {products?.length && !subCategories?.length ? (
          <View style={styles.listContent}>
            <CustomList
              title={labelColumn1}
              items={categories}
              type={CUSTOM_LIST_TYPES.CAT}
              isActive={activeTab === CUSTOM_LIST_TYPES.CAT}
              onPressRow={onPressCategoryItem}
              activeId={categoryId}
              refreshData={onRefreshCategory}
              renderMoreItem={onRenderGiftCardItem}
            />

            <CustomList
              title={labelColumn3}
              items={products}
              type={CUSTOM_LIST_TYPES.PRO}
              isActive={activeTab === CUSTOM_LIST_TYPES.PRO}
              activeId={selectedProductId}
              onPressRow={onPressProductItem}
            />

            <CustomList
              title={labelColumn2}
              items={subCategories}
              type={CUSTOM_LIST_TYPES.SUB}
              isActive={activeTab === CUSTOM_LIST_TYPES.SUB}
              onPressRow={onPressSubCategoryItem}
              activeId={subCategoryId}
            />
          </View>
        ) : (
          <View style={styles.listContent}>
            <CustomList
              title={labelColumn1}
              items={categories}
              type={CUSTOM_LIST_TYPES.CAT}
              isActive={activeTab === CUSTOM_LIST_TYPES.CAT}
              onPressRow={onPressCategoryItem}
              activeId={categoryId}
              refreshData={onRefreshCategory}
              renderMoreItem={onRenderGiftCardItem}
            />

            <CustomList
              title={labelColumn2}
              items={subCategories}
              type={CUSTOM_LIST_TYPES.SUB}
              isActive={activeTab === CUSTOM_LIST_TYPES.SUB}
              onPressRow={onPressSubCategoryItem}
              activeId={subCategoryId}
            />

            <CustomList
              title={labelColumn3}
              items={products}
              type={CUSTOM_LIST_TYPES.PRO}
              isActive={activeTab === CUSTOM_LIST_TYPES.PRO}
              activeId={selectedProductId}
              onPressRow={onPressProductItem}
            />
          </View>
        )}
        <View style={styles.basketContent}>
          <View style={styles.basketHeader}>
            <Text style={styles.basketTitle}>{t("Basket")}</Text>

            <TouchableOpacity
              style={{
                width: scaleWidth(45),
                height: scaleHeight(45),
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={clearBasket}
            >
              <Image
                source={IMAGE.trash_icon}
                style={{
                  tintColor: colors.GREYISH_BROWN,
                  width: scaleWidth(20),
                  height: scaleHeight(20),
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.basketDetail}>
            <BasketContentView
              ref={basketRef}
              onHadSubmitted={onHadSubmitted}
              onRemoveItem={onRemoveItem}
              onEditItem={onShowDialogEditProductItem}
              isApplyCostPrice={isApplyCostPrice}
              isTempAppointment={isTempAppointment}
              setIsApplyCostPrice={onChangeApplyCostPrice}
            />
          </View>
        </View>
      </View>
      <DialogProductDetail
        ref={productDetailRef}
        onAddProduct={onAddProduct}
        appointment={appointment}
      />
      <PopupActiveGiftCard
        key={"checkout"}
        ref={(ref) => (activeGiftCardRef.current = ref)}
        visiblePopupGiftCard={visiblePopupGiftCard}
        title={t("Active Gift Card")}
        onRequestClose={closePopupActiveGiftCard}
        submitSerialCode={submitSerialCode}
      />

      <PopupEnterAmountGiftCard
        ref={(ref) => (popupEnterAmountGiftCardRef.current = ref)}
        onRequestClose={onRequestCloseBillModal}
        onAddGiftCardToAppointment={onAddGiftCardToAppointment}
      />

      <DialogEditProductOrder
        ref={editProductItemRef}
        onEditProductItem={onSubmitEditProductItem}
      />

      {/* <PopupBill
        ref={modalBillRef}
        title={t("Enter Amount")}
        visible={visibleBillOfPayment}
        onRequestClose={onRequestCloseBillModal}
        extractBill={extractBill}
        doneBill={doneBill}
      /> */}

      <DialogScanQR onSuccess={onResultScanCode} ref={inputBarcodeDialogRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },

  headContent: {
    height: scaleHeight(72),
    backgroundColor: colors.WHITE,
    shadowColor: "#0000001a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.32,
    alignItems: "center",
    paddingLeft: scaleWidth(16),
    flexDirection: "row",
  },

  headerRightContent: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: scaleWidth(16),
  },

  basketContent: {
    flex: 4,
    paddingBottom: scaleHeight(16),
    backgroundColor: "#fff",
    justifyContent: "center",
  },

  listContent: {
    flex: 5,
    flexDirection: "row",
    zIndex: 100,
  },

  basketHeader: {
    height: scaleHeight(48),
    backgroundColor: colors.VERY_LIGHT_PINK_1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dddddd",
    justifyContent: "center",
    alignItems: "center",
  },

  basketTitle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.GREYISH_BROWN,
  },

  basketButton: {
    height: scaleHeight(60),
    borderRadius: scaleWidth(3),
    backgroundColor: colors.VERY_LIGHT_PINK_E_5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dddddd",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: scaleWidth(16),
  },

  basketButtonText: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(25),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: -0.6,
    textAlign: "center",
    color: colors.BROWNISH_GREY,
  },

  basketDetail: {
    flex: 1,
  },

  itemContent: {
    height: scaleHeight(80),
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: scaleWidth(10),
  },

  itemText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.BROWNISH_GREY,
  },

  rowContent: {
    marginTop: scaleHeight(10),
    marginBottom: scaleHeight(10),
    paddingHorizontal: scaleWidth(16),
    height: scaleHeight(40),
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
