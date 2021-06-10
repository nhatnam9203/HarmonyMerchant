import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { layouts, colors, fonts } from '@shared/themes';
import {
  FormFullName,
  FormTitle,
  FormPhoneNumber,
  FormAddress,
  FormContactEmail,
  FormBirthDay,
  FormGender,
  FormCustomerGroup,
  FormLabelSwitch,
  ButtonGradient,
  ButtonGradientWhite,
} from '@shared/components';
import { dateToString, BIRTH_DAY_DATE_FORMAT_STRING } from '@shared/utils';

export const Layout = ({ form, buttonCancelPress, isEdit, isNew }) => {
  const [t] = useTranslation();

  return (
    <View style={layouts.fill}>
      <View style={styles.headContent}>
        {isEdit && <Text style={styles.headTitle}>{t('Edit Customer')}</Text>}
        {isNew && <Text style={styles.headTitle}>{t('New Customer')}</Text>}
      </View>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.bottomContent}>
              <FormContactEmail
                onChangeEmail={form.handleChange('email')}
                defaultValue={form.values?.email}
              />

              <FormBirthDay
                defaultDateString={form.values?.birthDate}
                onChangeDate={(date) =>
                  form.setFieldValue(
                    'birthDate',
                    dateToString(date, BIRTH_DAY_DATE_FORMAT_STRING),
                  )
                }
              />

              <View style={layouts.horizontal}>
                <FormGender
                  defaultValue={form.values?.gender}
                  onChangeValue={form.handleChange('gender')}
                  height={scaleHeight(40)}
                  style={layouts.fill}
                />
                <View style={layouts.marginHorizontal} />
                <FormCustomerGroup
                  defaultValue={form.values?.IsVip}
                  onChangeValue={(value) => form.setFieldValue('IsVip', value)}
                  height={scaleHeight(40)}
                  style={layouts.fill}
                />
              </View>
            </View>

            <FormPhoneNumber
              phoneNumber={form.values?.phone}
              onChangePhoneNumber={form.handleChange('phone')}
            />

            <FormFullName
              firstName={form?.values?.firstName}
              lastName={form?.values?.lastName}
              onChangeFirstName={form?.handleChange('firstName')}
              onChangeLastName={form?.handleChange('lastName')}
            />

            <FormTitle label={t('General Informations')} />
          </View>
          <View style={styles.content}>
            <FormLabelSwitch
              defaultValue={form.values?.addressPost?.defaultShippingAddress}
              onValueChange={(value) =>
                form.setFieldValue('addressPost.defaultShippingAddress', value)
              }
              label={t('Default Shipping Address')}
            />

            <FormLabelSwitch
              defaultValue={form.values?.addressPost?.defaultBillingAddress}
              onValueChange={(value) =>
                form.setFieldValue('addressPost.defaultBillingAddress', value)
              }
              label={t('Default Billing Address')}
            />

            <FormPhoneNumber
              phoneNumber={form.values?.addressPost?.phone}
              onChangePhoneNumber={form.handleChange('addressPost.phone')}
            />

            <FormAddress
              onChangeCityValue={form.handleChange('addressPost.city')}
              onChangeStateValue={(value) =>
                form.setFieldValue('addressPost.state', value)
              }
              onChangeZipCodeValue={form.handleChange('addressPost.zip')}
              onChangeStreetValue={form.handleChange('addressPost.street')}
              defaultStateValue={form?.values?.addressPost?.state}
              defaultStreetValue={form?.values?.addressPost?.street}
              defaultCityValue={form?.values?.addressPost?.city}
              defaultZipCodeValue={form?.values?.addressPost?.zip}
            />

            <FormFullName
              firstName={form.values?.addressPost?.firstName}
              lastName={form.values?.addressPost?.lastName}
              onChangeFirstName={form.handleChange('addressPost.firstName')}
              onChangeLastName={form.handleChange('addressPost.lastName')}
            />

            <FormTitle label={t('Addresses')} />
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
          disable={!form?.isValid || !form?.dirty}
          onPress={form?.handleSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scaleWidth(0),
    paddingVertical: scaleHeight(16),
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

  bottomContent: {
    // flexDirection: 'column-reverse',
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
});
