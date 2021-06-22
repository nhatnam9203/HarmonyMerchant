import { ButtonGradient, ButtonGradientWhite } from '@shared/components';
import { InputSearch } from '@shared/components/InputSearch';
import { layouts } from '@shared/themes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

export const SearchBar = ({
  onNewButtonPress,
  labelNewButton,
  onButtonSearchPress,
  onChangeValueSearch,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <InputSearch onSearch={onChangeValueSearch} width={scaleWidth(280)} />
        <View style={layouts.marginHorizontal} />
        <ButtonGradientWhite
          label={t('Search')}
          width={scaleWidth(120)}
          onPress={onButtonSearchPress}
        />
        <View style={layouts.marginHorizontal} />
      </View>
      <ButtonGradient
        onPress={onNewButtonPress}
        label={labelNewButton}
        width={scaleWidth(140)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: scaleHeight(10),
    marginBottom: scaleHeight(10),
    paddingHorizontal: scaleWidth(16),
    height: scaleHeight(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  leftContent: {
    flex: 1,
    flexDirection: 'row',
  },
});
