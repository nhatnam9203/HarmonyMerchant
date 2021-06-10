import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { fonts, colors } from '@shared/themes';
import { CustomInput } from './CustomInput';
import { useTranslation } from 'react-i18next';
import IMAGE from '@resources';
import { CustomDatePicker } from './CustomDatePicker';
import { dateToString, BIRTH_DAY_DATE_FORMAT_STRING } from '@shared/utils';

// !!  defaultDate: date type,
export const FormBirthDay = ({ onChangeDate, defaultDateString }) => {
  const [t] = useTranslation();
  const [value, setValue] = React.useState(defaultDateString);

  const onBirthdaySubmitError = (code, year) => {
    if (code === 'error_birthday_min') {
      alert(`${t('Date of birth cannot be least than present')} ${year} `);
    } else if (code === 'error_birthday_max') {
      alert(`${t('Date of birth cannot be greater than present')} ${year} `);
    } else if (code === 'error_select_date_min') {
      alert(`${t('Date select is wrong')}`);
    } else if (code) {
      alert(`${t('Date select is error with code')} ${code}`);
    }
  };

  const onHandleChangeDate = (date) => {
    const dateString = dateToString(date, BIRTH_DAY_DATE_FORMAT_STRING);
    setValue(dateString);
    if (onChangeDate && typeof onChangeDate === 'function') {
      onChangeDate(date); // format here if need
    }
  };

  return (
    <CustomDatePicker
      onChangeDate={onHandleChangeDate}
      defaultDateString={defaultDateString}
      editable={false}
      isBirthday={true}
      minimumYear={3}
      maximumYear={200}
      // minimumDate={new Date()}
      onSubmitError={onBirthdaySubmitError}
      renderBase={(date, showPicker) => (
        <View style={styles.container}>
          <Text style={styles.textStyle}>{t('Birthday')}</Text>
          <TouchableOpacity style={styles.content} onPress={showPicker}>
            <CustomInput
              style={styles.customInput}
              textInputProps={{
                placeholder: t('--/--/----'),
                fontSize: scaleFont(17),
                textAlign: 'left',
                defaultValue: value,
                pointerEvents: 'none',
              }}
            >
              <View style={styles.horizontalLine} />
              <Image
                source={IMAGE.customer_birthday}
                color={'#aaa'}
                size={scaleWidth(16)}
              />
            </CustomInput>
            <View style={styles.horizontalPadding} />
            <View style={[styles.customInput, { padding: scaleWidth(8) }]} />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleHeight(8),
  },

  content: {
    flexDirection: 'row',
    paddingVertical: scaleHeight(10),
    justifyContent: 'space-between',
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

  customInput: {
    flex: 1,
    height: scaleHeight(40),
  },

  horizontalLine: {
    width: scaleWidth(1),
    height: scaleHeight(32),
    borderRadius: scaleWidth(1),
    backgroundColor: '#ccc',
    marginHorizontal: scaleWidth(10),
  },

  horizontalPadding: {
    width: scaleWidth(16),
  },
});
