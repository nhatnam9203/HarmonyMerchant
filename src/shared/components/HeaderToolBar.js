import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@shared/themes';

const BAR_HEIGHT = scaleHeight(48);
const CONTENT_HEIGHT = scaleHeight(47);

export const HeaderToolBar = ({ leftComponent, rightComponent, children }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.contentBar, styles.shadow]}>
        {leftComponent && leftComponent()}
        <View style={styles.center}>{children}</View>
        {rightComponent && rightComponent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: BAR_HEIGHT,
    backgroundColor: '#fff',
    width: '100%',
  },

  contentBar: {
    backgroundColor: colors.WHITE,
    height: CONTENT_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'row',
  },

  left: {
    flex: 0,
    backgroundColor: 'red',
  },

  right: {
    flex: 0,
    backgroundColor: 'red',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scaleWidth(16),
  },

  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2,

    elevation: 3,
  },
});
