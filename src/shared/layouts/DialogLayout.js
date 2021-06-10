import IMAGE from '@resources';
import { colors, fonts, layouts } from '@shared/themes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

export const DialogLayout = React.forwardRef(
  ({ bottomChildren, children, title, style }, ref) => {
    const [t] = useTranslation();

    const [open, setOpen] = React.useState(false);
    const hideModal = () => {
      setOpen(false);
    };

    React.useImperativeHandle(ref, () => ({
      show: () => {
        setOpen(true);
      },
      hide: () => {
        setOpen(false);
      },
    }));

    return (
      <Modal style={styles.modal} visible={open} onRequestClose={hideModal}>
        <View style={[styles.container, style]}>
          <View style={styles.header}>
            {title && (
              <Text style={[layouts.fill, styles.txtTitle]}>{title}</Text>
            )}
            <TouchableOpacity style={styles.buttonClose} onPress={hideModal}>
              <Image source={IMAGE.closePopup} style={styles.iconButtonClose} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <View style={layouts.marginVertical} />
            {children}
            <View style={layouts.marginVertical} />

            {bottomChildren && (
              <View style={styles.bottomStyle}>{bottomChildren()}</View>
            )}
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: scaleWidth(480),
    borderRadius: scaleHeight(20),
    shadowColor: '#004080bf',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
  },

  content: {
    width: '100%',
    paddingHorizontal: scaleWidth(20),
    maxHeight: scaleHeight(640),
  },

  modal: {
    backgroundColor: '#40404050',
    margin: 0,
  },

  header: {
    height: scaleWidth(48),
    width: '100%',
    backgroundColor: colors.OCEAN_BLUE,
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
    color: colors.WHITE,
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
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 36,
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
  },
});
