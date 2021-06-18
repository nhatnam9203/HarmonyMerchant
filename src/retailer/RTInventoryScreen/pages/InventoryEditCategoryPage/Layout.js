import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { layouts, colors, fonts } from '@shared/themes';
import {
  FormTitle,
  ButtonGradient,
  ButtonGradientWhite,
  FormInput,
  FormSelect,
  FormLabelSwitch,
} from '@shared/components';
import { dateToString, BIRTH_DAY_DATE_FORMAT_STRING } from '@shared/utils';
import IMAGE from '@resources';
import { filter } from 'rxjs/operators';

export const Layout = ({
  isEdit,
  isNew,
  buttonCancelPress,
  categoryItem,
  onIsSubcategory,
  isSubCategory,
  form,
  categories,
}) => {
  const [t] = useTranslation();

  return (
    <View style={layouts.fill}>
      <View style={styles.headContent}>
        {isEdit && (
          <Text style={styles.headTitle}>
            {t('Edit Category')}
            {
              <Text style={[styles.headTitle, { color: colors.OCEAN_BLUE }]}>
                {categoryItem?.name}
              </Text>
            }
          </Text>
        )}
        {isNew && <Text style={styles.headTitle}>{t('New Category')}</Text>}
      </View>

      <KeyboardAwareScrollView>
        <View style={styles.content}>
          <FormTitle label={t('Category Properties')} />
        </View>
        <View style={styles.container}>
          <View style={styles.content}>
            {isSubCategory ? (
              <>
                <FormSelect
                  label={t('Parent category')}
                  filterItems={categories
                    ?.filter((x) => x.parentId === 0)
                    .map((x) => ({
                      value: x.categoryId,
                      label: x.name,
                    }))}
                  defaultValue={null}
                  onChangeValue={(val) => {
                    form.setFieldValue('parentId', val);
                  }}
                />

                <FormInput
                  label={t('Category name')}
                  placeholder={t('Enter category name')}
                  required={true}
                  onChangeValue={form.handleChange('name')}
                  defaultValue={form.values?.name}
                />
              </>
            ) : (
              <>
                <FormInput
                  label={t('Category name')}
                  placeholder={t('Enter category name')}
                  required={true}
                  defaultValue={form.values?.name}
                  onChangeValue={form.handleChange('name')}
                />
                <View style={layouts.marginVertical} />
                <Text
                  style={[styles.noteProduct, { color: colors.ORANGEY_RED }]}
                >
                  {t('Note ')}
                  <Text
                    style={[
                      styles.noteProduct,
                      { color: colors.GREYISH_BROWN },
                    ]}
                  >
                    {t('Products can only be added to subcategories.')}
                  </Text>
                </Text>
              </>
            )}

            <FormLabelSwitch
              label={t('Is Subcategory')}
              style={[layouts.vertical, layouts.verticalCenterLeft]}
              textStyle={styles.textStyle}
              onValueChange={onIsSubcategory}
              defaultValue={isSubCategory}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.buttonContent}>
        <ButtonGradientWhite
          onPress={buttonCancelPress}
          label={t('Cancel').toUpperCase()}
          width={scaleWidth(400)}
          height={scaleHeight(60)}
          textColor={colors.GREYISH_BROWN}
          fontSize={scaleFont(25)}
          fontWeight="500"
        />
        <ButtonGradient
          label={t('Save').toUpperCase()}
          width={scaleWidth(400)}
          height={scaleHeight(60)}
          fontSize={scaleFont(25)}
          textColor={colors.WHITE}
          fontWeight="500"
          disable={!form.isValid || !form.dirty}
          onPress={form.handleSubmit}
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
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  content: {
    flex: 1,
    marginHorizontal: scaleWidth(16),
    flexDirection: 'column-reverse',
  },

  buttonContent: {
    height: scaleHeight(84),
    backgroundColor: colors.WHITE,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },

  headContent: {
    height: scaleHeight(50),
    backgroundColor: colors.WHITE,
    shadowColor: '#0000001a',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.32,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: scaleWidth(16),
  },

  headTitle: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(23),
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },

  textStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
    height: scaleHeight(24),
  },

  noteProduct: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
  },
});
