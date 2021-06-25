import { colors, fonts, layouts } from '@shared/themes';
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { ButtonGradientWhite } from './Button';
import { useTranslation } from 'react-i18next';

export const ExportLoading = ({ loading = false, onCancelLoading }) => {
  const [isLoading, setLoading] = React.useState(false);
  const [t] = useTranslation();

  React.useEffect(() => {
    setLoading(loading);
  }, [loading]);

  return (
    <Modal
      style={styles.modal}
      visible={isLoading}
      onRequestClose={onCancelLoading}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[layouts.fill, styles.txtTitle]}>
            {t('Please wait !')}
          </Text>
        </View>
        <View style={styles.content}>
          <View style={layouts.marginVertical} />
          <View style={layouts.marginVertical} />
          <Text style={styles.titleContent}>
            {t('CSV file is being created ...')}
          </Text>
          <View style={layouts.marginVertical} />
          <View style={styles.loadingContent}>
            <ActivityIndicator size={'large'} color={colors.OCEAN_BLUE} />
          </View>
        </View>
        <View style={styles.bottomStyle}>
          <ButtonGradientWhite
            label={t('cancel')}
            width={scaleWidth(140)}
            height={scaleHeight(40)}
            borderRadius={scaleWidth(3)}
            onPress={onCancelLoading}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
    width: scaleWidth(480),
    height: scaleHeight(301),
    borderRadius: scaleHeight(20),
    shadowColor: '#004080bf',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
  },

  content: { flex: 0, width: '100%', paddingHorizontal: scaleWidth(20) },

  modal: {
    backgroundColor: '#40404030',
    margin: 0,
  },

  header: {
    height: scaleWidth(48),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopLeftRadius: scaleHeight(20),
    borderTopRightRadius: scaleHeight(20),
  },

  txtTitle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(23),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.OCEAN_BLUE,
  },

  buttonClose: {
    width: scaleWidth(28),
    height: scaleHeight(28),
    borderRadius: scaleWidth(14),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: scaleWidth(10),
  },

  iconButtonClose: {
    width: scaleWidth(14),
    height: scaleHeight(14),
  },

  titleContent: {
    fontFamily: fonts.LIGHT,
    fontSize: scaleFont(20),
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.GREYISH_BROWN,
  },

  bottomStyle: {
    width: '100%',
    height: scaleHeight(80),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.WHITE_TWO,
  },
  loadingContent: {
    height: scaleHeight(90),
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 2 }],
  },
});
