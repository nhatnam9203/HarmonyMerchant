import IMAGE from "@resources";
import { ButtonGradientWhite } from "@shared/components";
import { WithDialogPhone } from "@shared/HOC/withDialogPhone";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  BasketContentView,
  CustomList,
  CUSTOM_LIST_TYPES,
  DialogProductDetail,
  CheckOutCustomerInfo,
} from "../../widget";
import { WithDialogScanQR } from "@shared/HOC/withDialogScanQR";
import _ from "lodash";

const ButtonPhone = WithDialogPhone(ButtonGradientWhite);
const ScanQRButton = WithDialogScanQR(ButtonGradientWhite);

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
  productId,
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
  isOrder,
  categoriesLabelData,
}) => {
  const [t] = useTranslation();
  const labelColumn1 = _.get(categoriesLabelData, "column1") || t("Categories");
  const labelColumn2 =
    _.get(categoriesLabelData, "column2") || t("Subcategories");
  const labelColumn3 = _.get(categoriesLabelData, "column3") || t("Products");
  return (
    <View style={layouts.fill}>
      <View style={styles.headContent}>
        <CheckOutCustomerInfo
          ref={customerRef}
          customerInfo={customer}
          canDelete={true}
        />
        <View style={layouts.marginHorizontal} />

        <ScanQRButton
          label={t("Scan")}
          title={t("Scan Barcode")}
          width={scaleWidth(140)}
          height={scaleHeight(40)}
          onResultScanCode={onResultScanCode}
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

        {/* <ButtonGradientWhite
          width={scaleWidth(40)}
          height={scaleHeight(40)}
          fontSize={scaleFont(17)}
          textWeight="normal"
          onPress={() => {
            onResultScanCode("Pho");
          }}
        >
          <Image source={IMAGE.back} />
        </ButtonGradientWhite> */}
        {/*
        <ButtonGradientWhite
          width={scaleWidth(40)}
          height={scaleHeight(40)}
          fontSize={scaleFont(17)}
          textWeight="normal"
          onPress={() => {
            onResultScanCode("8936101342225");
          }}
        >
          <Image source={IMAGE.back} />
        </ButtonGradientWhite> */}

        <View style={styles.headerRightContent}>
          <View style={layouts.marginHorizontal} />
          {isOrder && (
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
        <View style={styles.listContent}>
          <CustomList
            title={labelColumn1}
            items={categories}
            type={CUSTOM_LIST_TYPES.CAT}
            isActive={activeTab === CUSTOM_LIST_TYPES.CAT}
            onPressRow={onPressCategoryItem}
            activeId={categoryId}
            refreshData={onRefreshCategory}
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
            activeId={productId}
            onPressRow={onPressProductItem}
          />
        </View>
        <View style={styles.basketContent}>
          <View style={styles.basketHeader}>
            <Text style={styles.basketTitle}>{t("Basket")}</Text>
          </View>

          <View style={styles.basketDetail}>
            <BasketContentView
              ref={basketRef}
              onHadSubmitted={onHadSubmitted}
              onRemoveItem={onRemoveItem}
            />
          </View>
        </View>
      </View>
      <DialogProductDetail ref={productDetailRef} onAddProduct={onAddProduct} />
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
});
