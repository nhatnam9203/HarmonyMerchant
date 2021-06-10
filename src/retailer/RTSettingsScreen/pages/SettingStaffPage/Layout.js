import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SearchBar, FormTitle } from '@shared/components';
import { layouts } from '@shared/themes';
export const Layout = ({}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <SearchBar labelNewButton={t('New Staffs')} />
      <View style={layouts.formRow}>
        <Text style={layouts.formTitle}>{t('Staffs')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
