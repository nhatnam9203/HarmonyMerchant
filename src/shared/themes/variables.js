/*
 * Provides universal color configs used in the app.
 * Provides universal fonts used in the app.
 */
import { StyleSheet } from 'react-native';

export const colors = {
  WEIRD_GREEN: '#4cd964',
  ICE_BLUE: '#dcf7ff',
  GREYISH_BROWN: '#404040',
  VERY_LIGHT_PINK_C_5: '#c5c5c5',
  INACTIVE: '#a9a9a9',
  WHITE: '#ffffff',
  WHITE_F_6: '#f6f6f6',
  VERY_LIGHT_PINK_1: '#f1f1f1',
  LIGHT_BLUE_GREY: '#bbd4e9',
  ORANGEY_RED: '#ff3b30',
  BROWNISH_GREY: '#6a6a6a',
  VERY_LIGHT_PINK_E_5: '#e5e5e5',
  DARKISH_BLUE: '#003680',
  FLAT_BLUE: '#3e70b3',
  LIGHT_PERIWINKLE: '#bfdaff',
  BLUEY_GREY: '#8fa3bf',
  MACARONI_AND_CHEESE: '#ffc130',
  SUNFLOWER_YELLOW: '#ffde00',
  WHITE_FA: '#fafafa',
  ROBIN_S_EGG: '#5ac8fa',
  CERULEAN: '#0872c9',
  PEACOCK_BLUE: '#065596',
  OCEAN_BLUE: '#0764b0',
  TOMATO: '#e6362b',
  PALE_GREY: '#f1f1f2',
  WHITE_FA: '#fafafa',
  WHITE_TWO: '#eeeeee',
};

export const fonts = {
  REGULAR: 'Roboto-Regular',
  MEDIUM: 'Roboto-Medium',
  LIGHT: 'Roboto-Light',
  ITALIC: 'Roboto-Italic',
  BOLD: 'Roboto-Bold',
};

export const layouts = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fullSize: {
    height: '100%',
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  horizontalSpaceBetween: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verticalCenterLeft: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  horizontalCenterLeft: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  horizontalCenterRight: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  marginVertical: {
    height: scaleHeight(8),
  },
  marginHorizontal: {
    width: scaleWidth(16),
  },
  formTitle: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(23),
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },
  formRow: {
    marginTop: scaleHeight(10),
    marginBottom: scaleHeight(10),
    paddingHorizontal: scaleWidth(16),
    height: scaleHeight(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableName: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(15),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },
  fontLightBrown: {
    fontSize: scaleFont(17),
    color: colors.GREYISH_BROWN,
    fontFamily: fonts.LIGHT,
  },
  fontMediumBlue: {
    fontSize: scaleFont(24),
    color: colors.OCEAN_BLUE,
    fontFamily: fonts.MEDIUM,
  },
  fontLightBlue: {
    fontSize: scaleFont(20),
    color: colors.OCEAN_BLUE,
    fontFamily: fonts.LIGHT,
  },
});
