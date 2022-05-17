import { ButtonGradient, ButtonGradientWhite } from '@shared/components';
import { DialogLayout } from '@shared/layouts';
import { colors, fonts } from '@shared/themes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export const DialogAddNewPaymentMethod = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);

  const merchantID = useSelector(
    (state) => state.dataLocal?.profile?.merchantCode
  );
  const [value, setValue] = React.useState('');
  const onHandleChangeText = (value) => {
    setValue(value);
  };
  /**
  |--------------------------------------------------
  | CALL API

  |--------------------------------------------------
  */
  // !! call login staff
  React.useImperativeHandle(ref, () => ({
    show: () => {
      setValue('');
      dialogRef.current?.show();
    },
    hide: () => {
      dialogRef.current?.hide();
    },
  }));

  const onHandleSubmit = () => {
    dialogRef.current?.hide();
  };

  return (
    <View>
      <DialogLayout
        title={t('New payment method')}
        ref={dialogRef}
        bottomChildren={() => (
          <View style={styles.bottomStyle}>
            <ButtonGradientWhite
              label={t('cancel')}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              disable={value?.length === 0}
              onPress={onHandleSubmit}
            />
            <ButtonGradient
              label={t('confirm')}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              disable={value?.length === 0}
              onPress={onHandleSubmit}
            />
          </View>
        )}
        style={styles.dialog}
      >
        <View style={styles.container}>
          <View style={styles.marginVertical} />
          <Text style={styles.title}>
            {t('Enter the name of payment method')}
          </Text>
          <View style={styles.marginVertical} />
          <View style={styles.input}>
            <TextInput
              onChangeText={onHandleChangeText}
              value={value}
              style={styles.textInput}
              placeholder={t('Placeholder')}
              autoFocus={true}
            />
          </View>
        </View>
      </DialogLayout>
    </View>
  );
});

const styles = StyleSheet.create({
  dialog: {
    flex: 0,
    width: scaleWidth(500),
  },

  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  row: { flexDirection: 'row', alignItems: 'center' },

  bottomStyle: {
    width: '100%',
    height: scaleHeight(80),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },

  title: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.GREYISH_BROWN,
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.VERY_LIGHT_PINK_C_5,
  },

  input: {
    width: scaleWidth(440),
    height: scaleHeight(40),
    borderRadius: scaleWidth(3),
    backgroundColor: colors.WHITE,
    borderStyle: 'solid',
    borderWidth: scaleWidth(1),
    borderColor: '#cccccc',
    justifyContent: 'center',
    paddingHorizontal: scaleWidth(8),
    paddingVertical: 0,
  },

  textInput: {
    fontFamily: fonts.LIGHT,
    fontSize: scaleFont(17),
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#c5c5c5',
  },

  marginVertical: {
    height: scaleHeight(16),
  },

  flatList: { width: scaleWidth(236) },

  charButton: {
    width: scaleWidth(72),
    height: scaleHeight(54),
    borderRadius: scaleWidth(3),
    borderStyle: 'solid',
    borderWidth: scaleWidth(1),
    borderColor: '#eeeeee',
  },

  columnWrapper: {
    justifyContent: 'space-between',
  },

  itemSeparator: {
    width: scaleWidth(4),
    height: scaleHeight(10),
  },
});
