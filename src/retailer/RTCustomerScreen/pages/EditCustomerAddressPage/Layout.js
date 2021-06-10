import {
  ButtonGradient,
  ButtonGradientWhite,
  FormAddress,
  FormFullName,
  FormLabelSwitch,
  FormPhoneNumber,
  ButtonGradientRed,
} from '@shared/components';
import { colors, fonts, layouts } from '@shared/themes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { WithDialogConfirm } from '@shared/HOC/withDialogConfirm';

const DeleteConfirmButton = WithDialogConfirm(ButtonGradientRed);

export const Layout = ({
  isNew,
  isEdit,
  form,
  buttonCancelPress,
  onHandleDeleteAddress,
}) => {
  const [t] = useTranslation();

  return (
    <View style={layouts.fill}>
      <View style={styles.headContent}>
        {isEdit && <Text style={styles.headTitle}>{t('Edit Address')}</Text>}
        {isNew && <Text style={styles.headTitle}>{t('New Address')}</Text>}

        <DeleteConfirmButton
          backgroundColor={colors.ORANGEY_RED}
          label={t('Delete')}
          width={scaleWidth(120)}
          height={scaleHeight(40)}
          textColor={colors.WHITE}
          borderRadius={scaleWidth(2)}
          fontWeight="normal"
          onPress={onHandleDeleteAddress}
          description={t('Are you sure you want to Delete this Address ?')}
        />
      </View>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <View style={styles.content}>
            <FormLabelSwitch
              defaultValue={form.values?.defaultShippingAddress}
              onValueChange={(value) =>
                form.setFieldValue('defaultShippingAddress', value)
              }
              label={t('Default Shipping Address')}
            />

            <FormLabelSwitch
              defaultValue={form.values?.defaultBillingAddress}
              onValueChange={(value) =>
                form.setFieldValue('defaultBillingAddress', value)
              }
              label={t('Default Billing Address')}
            />

            <FormPhoneNumber
              phoneNumber={form.values?.phone ?? form.values?.addressPhone}
              onChangePhoneNumber={form.handleChange('phone')}
            />

            <FormAddress
              onChangeCityValue={form.handleChange('city')}
              onChangeStateValue={(value) => form.setFieldValue('state', value)}
              onChangeZipCodeValue={form.handleChange('zip')}
              onChangeStreetValue={form.handleChange('street')}
              defaultStateValue={form?.values?.state ?? form?.values?.stateId}
              defaultStreetValue={form?.values?.street}
              defaultCityValue={form?.values?.city}
              defaultZipCodeValue={form?.values?.zip ?? form?.values?.zipCode}
            />

            <FormFullName
              firstName={
                form.values?.firstName ?? form.values?.addressFirstName
              }
              lastName={form.values?.lastName ?? form.values?.addressLastName}
              onChangeFirstName={form.handleChange('firstName')}
              onChangeLastName={form.handleChange('lastName')}
            />

            {/* <FormTitle label={t('Addresses')} /> */}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(16),
    flexDirection: 'row',
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

  buttonContent: {
    height: scaleHeight(84),
    backgroundColor: colors.WHITE,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
