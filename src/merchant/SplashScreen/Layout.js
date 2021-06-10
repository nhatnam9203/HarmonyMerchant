import { Text } from '@components';
import { layouts } from '@shared/themes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Bar } from 'react-native-progress';
import IMAGE from '../../resources';

export const Layout = ({ progress }) => {
  const { t } = useTranslation();

  return (
    <View style={layouts.fill}>
      <ImageBackground style={layouts.fill} source={IMAGE.splashScreen}>
        <View style={styles.container}>
          <View style={styles.loadingContent}>
            <Text style={styles.textLabel}>{t('Checking Version')}</Text>
            <Bar
              progress={progress}
              width={scaleWidth(250)}
              height={scaleHeight(14)}
              indeterminate={true}
              indeterminateAnimationDuration={1200}
              color="#fffd"
              unfilledColor="#fff2"
              style={styles.progressBackground}
              borderWidth={0}
            />
            <Text style={styles.textPercent}>{`${progress}%`}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  textLabel: {
    color: '#fff',
    fontSize: scaleFont(20),
    fontWeight: '500',
  },

  textPercent: {
    color: '#fff',
    fontSize: scaleFont(18),
    marginBottom: scaleHeight(6),
    marginTop: scaleHeight(10),
    fontWeight: '600',
  },

  progressBackground: {
    borderRadius: 0,
    margin: scaleWidth(8),
  },

  loadingContent: {
    marginTop: scaleHeight(250),
    alignItems: 'center',
  },
});
