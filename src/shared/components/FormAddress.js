import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts, colors } from '@shared/themes';
import { CustomInput, CustomInputMask } from './CustomInput';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ButtonFilter } from './ButtonFilter';
import { DropdownMenu } from './DropdownMenu';

export const FormAddress = ({
  onChangeCityValue,
  onChangeStateValue,
  onChangeZipCodeValue,
  onChangeStreetValue,
  defaultStateValue,
  defaultStreetValue,
  defaultCityValue,
  defaultZipCodeValue,
  reverse,
  useDropDownMenu,
  widthMenu = 223,
}) => {
  const [t] = useTranslation();

  const stateList = useSelector((state) => state.dataLocal?.stateCity);

  const [streetAddress, setStreetAddress] = React.useState(defaultStreetValue);
  const [city, setCity] = React.useState(defaultCityValue);
  const [zipCode, setZipCode] = React.useState(defaultZipCodeValue);

  const onHandleChangeCity = (value) => {
    setCity(value);
    if (onChangeCityValue && typeof onChangeCityValue === 'function') {
      onChangeCityValue(value);
    }
  };

  const onHandleChangeSate = (value) => {
    if (onChangeStateValue && typeof onChangeStateValue === 'function') {
      if (useDropDownMenu) {
        onChangeStateValue(value?.stateId);
      } else onChangeStateValue(value);
    }
  };

  const onHandleChangeZipCode = (value) => {
    setZipCode(value);
    if (onChangeZipCodeValue && typeof onChangeZipCodeValue === 'function') {
      onChangeZipCodeValue(value);
    }
  };

  const onHandleChangeStreet = (value) => {
    setStreetAddress(value);
    if (onChangeStreetValue && typeof onChangeStreetValue === 'function') {
      onChangeStreetValue(value);
    }
  };

  React.useEffect(() => {
    if (defaultCityValue) {
      setCity(defaultCityValue);
    }
  }, [defaultCityValue]);

  React.useEffect(() => {
    if (defaultStreetValue) {
      setStreetAddress(defaultStreetValue);
    }
  }, [defaultStreetValue]);

  React.useEffect(() => {
    if (defaultZipCodeValue) {
      setZipCode(defaultZipCodeValue);
    }
  }, [defaultZipCodeValue]);

  return reverse ? (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{t('Address')}</Text>
      <View style={[styles.content, { flexDirection: 'column' }]}>
        <CustomInput
          style={styles.customInput}
          textInputProps={{
            placeholder: t('Street Address'),
            fontSize: scaleFont(17),
            textAlign: 'left',
            defaultValue: streetAddress,
            onChangeText: onHandleChangeStreet,
          }}
        />
        <View style={styles.verticalPadding} />
        <View style={styles.rowContent}>
          <CustomInput
            style={styles.customInput}
            textInputProps={{
              placeholder: t('City'),
              fontSize: scaleFont(17),
              textAlign: 'left',
              defaultValue: city,
              onChangeText: onHandleChangeCity,
            }}
          />
          <View style={styles.horizontalPadding} />
          {!useDropDownMenu ? (
            <ButtonFilter
              filterItems={stateList.map((x) =>
                Object.assign({}, x, { label: x.name, value: x.stateId })
              )}
              defaultValue={defaultStateValue}
              onChangeValue={onHandleChangeSate}
              style={styles.customInput}
            />
          ) : (
            <DropdownMenu
              items={stateList.map((x) =>
                Object.assign({}, x, { label: x.name, value: x.stateId })
              )}
              onChangeValue={onHandleChangeSate}
              defaultIndex={defaultStateValue}
              style={styles.customInput}
              width={scaleWidth(widthMenu)}
              height={scaleHeight(40)}
              placeholder={t('Select State')}
            />
          )}
        </View>

        <View style={styles.verticalPadding} />

        <View style={styles.rowContent}>
          <CustomInputMask
            type={'zip-code'}
            style={styles.customInput}
            textInputProps={{
              placeholder: t('Zip Code'),
              fontSize: scaleFont(17),
              textAlign: 'left',
              defaultValue: zipCode,
              onChangeText: onHandleChangeZipCode,
            }}
          />
          <View style={[styles.customInput, { padding: scaleWidth(8) }]} />
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{t('Address')}</Text>
      <View style={styles.content}>
        <View style={styles.rowContent}>
          <CustomInputMask
            type={'zip-code'}
            style={styles.customInput}
            textInputProps={{
              placeholder: t('Zip Code'),
              fontSize: scaleFont(17),
              textAlign: 'left',
              defaultValue: zipCode,
              onChangeText: onHandleChangeZipCode,
            }}
          />
          <View style={[styles.customInput, { padding: scaleWidth(8) }]} />
        </View>

        <View style={styles.verticalPadding} />

        <View style={styles.rowContent}>
          <CustomInput
            style={styles.customInput}
            textInputProps={{
              placeholder: t('City'),
              fontSize: scaleFont(17),
              textAlign: 'left',
              defaultValue: city,
              onChangeText: onHandleChangeCity,
            }}
          />
          <View style={styles.horizontalPadding} />
          {!useDropDownMenu ? (
            <ButtonFilter
              filterItems={stateList.map((x) =>
                Object.assign({}, x, { label: x.name, value: x.stateId })
              )}
              defaultValue={defaultStateValue}
              onChangeValue={onHandleChangeSate}
              style={styles.customInput}
            />
          ) : (
            <DropdownMenu
              items={stateList.map((x) =>
                Object.assign({}, x, { label: x.name, value: x.stateId })
              )}
              onChangeValue={onHandleChangeSate}
              defaultIndex={defaultStateValue}
              style={styles.customInput}
              width={scaleWidth(widthMenu)}
              height={scaleHeight(40)}
              placeholder={t('Select State')}
            />
          )}
        </View>

        <View style={styles.verticalPadding} />

        <CustomInput
          style={styles.customInput}
          textInputProps={{
            placeholder: t('Street Address'),
            fontSize: scaleFont(17),
            textAlign: 'left',
            defaultValue: streetAddress,
            onChangeText: onHandleChangeStreet,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleHeight(8),
  },

  content: {
    paddingVertical: scaleHeight(10),
    flexDirection: 'column-reverse',
  },

  rowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  customInput: {
    flex: 1,
    height: scaleHeight(40),
    width: '100%',
  },

  verticalPadding: {
    height: scaleWidth(12),
  },

  horizontalPadding: {
    width: scaleWidth(16),
  },

  textStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },
});
