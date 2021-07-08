import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { layouts, colors, fonts } from "@shared/themes";
import {
  FormTitle,
  ButtonGradient,
  ButtonGradientWhite,
  FormInput,
  FormInputMask,
  FormSelect,
  FormUploadImage,
} from "@shared/components";
import { dateToString, BIRTH_DAY_DATE_FORMAT_STRING } from "@shared/utils";
import IMAGE from "@resources";
import { FormProductOption } from "./FormProductOption";
import { AddProductOptionDialog } from "./AddProductOptionDialog";
import { FormProductOptionQty } from "./FormProductOptionQty";

export const Layout = ({
  isEdit,
  isNew,
  errorMsg,
  buttonCancelPress,
  productItem,
  onNewCategory,
  form,
  filterCategoryRef,
  dispatchProduct,
  categoriesFilter,
  onHandleChangeProductName
}) => {
  const [t] = useTranslation();

  const renderOptionsItem = ({ item, index }) => {
    return (
      <FormProductOption
        key={item.attributeId + ""}
        item={item}
        dispatchProduct={dispatchProduct}
      />
    );
  };

  return (
    <View style={layouts.fill}>
      <View style={styles.headContent}>
        {isEdit && (
          <Text style={styles.headTitle}>
            {t("Edit Product")}
            {" - "}
            {
              <Text style={[styles.headTitle, { color: colors.OCEAN_BLUE }]}>
                {productItem?.name}
              </Text>
            }
          </Text>
        )}
        {isNew && <Text style={styles.headTitle}>{t("New Product")}</Text>}
      </View>
      <KeyboardAwareScrollView bounces={false} extraHeight={scaleHeight(150)}>
        <View style={styles.content}>
          <FormTitle label={t("General Details")} />
        </View>
        <View style={styles.container}>
          <View style={styles.content}>
            <FormInputMask
              label={t("Cost Price ($)")}
              placeholder={t("Enter cost price")}
              required={true}
              onChangeValue={(value) => {
                if (value) form.setFieldValue("costPrice", parseFloat(value));
              }}
              defaultValue={productItem?.costPrice}
              keyboardType="numeric"
            />

            <FormInputMask
              label={t("Price ($)")}
              placeholder={t("Enter price")}
              required={true}
              onChangeValue={(value) => {
                if (value) form.setFieldValue("price", parseFloat(value));
              }}
              defaultValue={productItem?.price}
              keyboardType="numeric"
            />

            <FormInput
              label={t("Barcode")}
              placeholder={t("Enter or scan barcode")}
              //required={true}
              onChangeValue={form.handleChange("barCode")}
              defaultValue={productItem?.barCode}
            />

            <FormInput
              label={t("SKU")}
              placeholder={t("Enter SKU number")}
              required={true}
              onChangeValue={form.handleChange("sku")}
              defaultValue={productItem?.sku}
            />

            <FormSelect
              //isDropdown={false}
              filterRef={filterCategoryRef}
              filterItems={categoriesFilter}
              label={t("Subcategory")}
              defaultValue={productItem?.categoryId}
              onChangeValue={(val) => form.setFieldValue("categoryId", val)}
              isDropdown
            >
              <View style={layouts.marginHorizontal} />
              <ButtonGradient
                label={t("New Category")}
                width={scaleWidth(120)}
                height={scaleHeight(40)}
                fontSize={scaleFont(17)}
                borderRadius={scaleWidth(3)}
                textColor={colors.WHITE}
                textWeight="normal"
                onPress={onNewCategory}
              />
            </FormSelect>

            <FormInput
              label={t("Product Name")}
              placeholder={t("Enter product name")}
              required={true}
              onChangeValue={onHandleChangeProductName}
              defaultValue={productItem?.name}
            />
          </View>
          <View style={styles.content}>
            <FormUploadImage
              label={t("Default Image")}
              onSetFileId={(fileId) =>
                form.setFieldValue("fileId", parseInt(fileId))
              }
              defaultValue={productItem?.imageUrl}
            />
            <Text style={styles.errorText}>{errorMsg}</Text>
            <View style={[layouts.horizontal]}>
              <FormInputMask
                label={t("Low threshold")}
                placeholder={t("10")}
                type={"only-numbers"}
                //required={true}
                style={layouts.fill}
                onChangeValue={(value) => {
                  form.setFieldValue("minThreshold", value);
                }}
                defaultValue={`${productItem?.minThreshold ?? ""}`}
                keyboardType="numeric"
              />
              <View style={layouts.marginHorizontal} />
              <FormInputMask
                label={t("High threshold")}
                placeholder={t("20")}
                type={"only-numbers"}
                //required={true}
                style={layouts.fill}
                onChangeValue={(value) => {
                  form.setFieldValue("maxThreshold", value);
                }}
                defaultValue={`${productItem?.maxThreshold ?? ""}`}
                keyboardType="numeric"
              />
            </View>

            <FormInput
              label={t("Item in stock")}
              placeholder={t("100")}
              required={true}
              onChangeValue={(value) => {
                form.setFieldValue("quantity", parseInt(value));
              }}
              defaultValue={`${productItem?.quantity ?? ""}`}
              keyboardType="number-pad"
            />
          </View>
        </View>
        <View style={styles.content}>
          <FormProductOptionQty
            items={productItem?.quantities}
            dispatchProduct={dispatchProduct}
          />

          <FlatList
            scrollEnabled={false}
            data={productItem?.options}
            style={layouts.fill}
            renderItem={renderOptionsItem}
          />

          <FormTitle label={t("Product Options")}>
            <View style={styles.headerOptions}>
              <AddProductOptionDialog
                dispatchProduct={dispatchProduct}
                defaultOptionsId={form.values?.options}
                renderButton={(onShowDialog) => (
                  <View
                    style={[layouts.horizontal, layouts.horizontalCenterRight]}
                  >
                    <ButtonGradientWhite
                      width={scaleWidth(32)}
                      height={scaleHeight(32)}
                      fontSize={scaleFont(17)}
                      textWeight="normal"
                      onPress={onShowDialog}
                    >
                      <Image
                        source={IMAGE.plus}
                        style={{
                          width: scaleWidth(16),
                          height: scaleHeight(16),
                        }}
                        resizeMode="contain"
                      />
                    </ButtonGradientWhite>
                    <View style={layouts.marginHorizontal} />
                    <Text style={styles.headerOptionsLabel}>
                      {t("Add new options")}
                    </Text>
                  </View>
                )}
              />
            </View>
          </FormTitle>
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.buttonContent}>
        <ButtonGradientWhite
          onPress={buttonCancelPress}
          label={t("Cancel").toUpperCase()}
          width={scaleWidth(400)}
          height={scaleHeight(60)}
          textColor={colors.GREYISH_BROWN}
          fontSize={scaleFont(25)}
          fontWeight="500"
        />
        <ButtonGradient
          label={t("Save").toUpperCase()}
          width={scaleWidth(400)}
          height={scaleHeight(60)}
          fontSize={scaleFont(25)}
          textColor={colors.WHITE}
          fontWeight="500"
          disable={!form.isValid}
          // disable={!form.isValid || !form.dirty} // doi option no ko tinh
          onPress={form?.handleSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: scaleWidth(16),
    // paddingVertical: scaleHeight(16),
    flexDirection: "row",
    alignItems: "flex-start",
  },

  content: {
    flex: 1,
    marginHorizontal: scaleWidth(16),
    flexDirection: "column-reverse",
  },

  buttonContent: {
    height: scaleHeight(84),
    backgroundColor: colors.WHITE,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },

  headContent: {
    height: scaleHeight(50),
    backgroundColor: colors.WHITE,
    shadowColor: "#0000001a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.32,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: scaleWidth(16),
  },

  bottomContent: {
    // flexDirection: 'column-reverse',
  },

  headTitle: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(23),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  headerOptions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  headerOptionsLabel: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },
  errorText: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(14),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: colors.ORANGEY_RED,
  },
});
