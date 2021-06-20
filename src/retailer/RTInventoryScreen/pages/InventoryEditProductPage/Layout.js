import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { layouts, colors, fonts } from "@shared/themes";
import {
  FormTitle,
  ButtonGradient,
  ButtonGradientWhite,
  FormInput,
  FormSelect,
  FormUploadImage,
} from "@shared/components";
import { dateToString, BIRTH_DAY_DATE_FORMAT_STRING } from "@shared/utils";
import IMAGE from "@resources";
import { AddProductOptionDialog, FormProductOption } from "../../widget";

export const Layout = ({
  isEdit,
  isNew,
  buttonCancelPress,
  productItem,
  onNewCategory,
  form,
  listSelectCategories,
  onAddAttributes,
  updateAttributeOptions,
}) => {
  const [t] = useTranslation();

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
      <KeyboardAwareScrollView bounces={false}>
        <View style={styles.content}>
          <FormTitle label={t("General Details")} />
        </View>
        <View style={styles.container}>
          <View style={styles.content}>
            <FormInput
              label={t("Cost Price ($)")}
              placeholder={t("Enter cost price")}
              required={true}
              onChangeValue={(value) => {
                if (value) form.setFieldValue("costPrice", parseFloat(value));
              }}
              defaultValue={productItem?.costPrice}
            />

            <FormInput
              label={t("Price ($)")}
              placeholder={t("Enter price")}
              required={true}
              onChangeValue={(value) => {
                if (value) form.setFieldValue("price", parseFloat(value));
              }}
              defaultValue={productItem?.price}
            />

            <FormInput
              label={t("Barcode")}
              placeholder={t("Enter or scan barcode")}
              required={true}
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
              label={t("Subcategory")}
              filterItems={listSelectCategories}
              defaultValue={productItem?.categoryId}
              onChangeValue={(val) => form.setFieldValue("categoryId", val)}
            >
              <ButtonGradient
                label={t("New Category")}
                width={scaleWidth(120)}
                height={scaleHeight(40)}
                fontSize={scaleFont(17)}
                textColor={colors.WHITE}
                textWeight="normal"
                onPress={onNewCategory}
              />
            </FormSelect>

            <FormInput
              label={t("Product Name")}
              placeholder={t("Enter product name")}
              required={true}
              onChangeValue={form.handleChange("name")}
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

            <View style={[layouts.horizontal]}>
              <FormInput
                label={t("Low threshold")}
                placeholder={t("10")}
                required={true}
                style={layouts.fill}
                onChangeValue={(value) => {
                  if (value)
                    form.setFieldValue("minThreshold", parseInt(value));
                }}
                defaultValue={`${productItem?.minThreshold ?? ""}`}
              />
              <View style={layouts.marginHorizontal} />
              <FormInput
                label={t("High threshold")}
                placeholder={t("20")}
                required={true}
                style={layouts.fill}
                onChangeValue={(value) => {
                  if (value)
                    form.setFieldValue("maxThreshold", parseInt(value));
                }}
                defaultValue={`${productItem?.maxThreshold ?? ""}`}
              />
            </View>

            <FormInput
              label={t("Item in stock")}
              placeholder={t("100")}
              required={true}
              onChangeValue={(value) => {
                if (value) form.setFieldValue("quantity", parseInt(value));
              }}
              defaultValue={`${productItem?.quantity ?? ""}`}
            />
          </View>
        </View>
        <View style={styles.content}>
          {form.values?.options?.map((v) => (
            <FormProductOption
              key={v.attributeId + ""}
              item={v}
              onUpdateOptionValues={updateAttributeOptions}
            />
          ))}

          <FormTitle label={t("Product Options")}>
            <View style={styles.headerOptions}>
              <AddProductOptionDialog
                onApplyOptions={onAddAttributes}
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
          // disable={!form.isValid || !form.dirty}
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
});
