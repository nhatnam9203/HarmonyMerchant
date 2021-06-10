import {
  ButtonGradient,
  ButtonGradientRed,
  SearchBar,
} from '@shared/components';
import { Table } from '@shared/components/CustomTable';
import { getUniqueId } from '@shared/components/CustomTable/helpers';
import { colors, layouts } from '@shared/themes';
import { dateToString, DATE_SHOW_FORMAT_STRING } from '@shared/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { WithDialogConfirm } from '@shared/HOC/withDialogConfirm';

const DeleteConfirmButton = WithDialogConfirm(ButtonGradientRed);

export const Layout = ({
  items,
  sortLabel,
  onSortWithKey,
  onChangeValueSearch,
  onButtonSearchPress,
  onButtonNewAttributePress,
  onButtonEditAttributePress,
  onButtonDeleteAttributePress,
  onSelectRow,
}) => {
  const { t } = useTranslation();
  const onRenderCell = ({ columnKey, rowIndex, columnIndex, item }) => {
    const onHandleEdit = () => {
      onButtonEditAttributePress(item);
    };
    const onHandleDelete = () => {
      onButtonDeleteAttributePress(item);
    };
    if (columnKey === 'actions') {
      return (
        <View
          style={[layouts.fill, layouts.horizontal]}
          key={getUniqueId(columnKey, rowIndex, 'cell-action')}
        >
          <DeleteConfirmButton
            label={t('Delete')}
            width={scaleWidth(72)}
            height={scaleHeight(28)}
            fontSize={scaleFont(15)}
            textColor={colors.WHITE}
            borderRadius={scaleWidth(2)}
            fontWeight="normal"
            onPress={onHandleDelete}
          />
          <View style={layouts.marginHorizontal} />
          <ButtonGradient
            label={t('Edit')}
            width={scaleWidth(72)}
            height={scaleHeight(28)}
            fontSize={scaleFont(15)}
            textColor={colors.WHITE}
            borderRadius={scaleWidth(2)}
            fontWeight="normal"
            onPress={onHandleEdit}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <SearchBar
        labelNewButton={t('New Attributes')}
        onNewButtonPress={onButtonNewAttributePress}
        onButtonSearchPress={onButtonSearchPress}
        onChangeValueSearch={onChangeValueSearch}
      />
      <View style={layouts.formRow}>
        <Text style={layouts.formTitle}>{t('Attributes')}</Text>
      </View>
      <View style={layouts.fill}>
        <Table
          items={items}
          headerKeyLabels={{
            label: t('Attribute Label'),
            // inputType: t('Input Type'),
            actions: t('Actions'),
          }}
          whiteListKeys={['label', 'actions']}
          sortedKeys={{ label: sortLabel }}
          primaryKey="id"
          widthForKeys={{
            label: '75%',
          }}
          emptyDescription={t('No Attributes')}
          styleTextKeys={{ label: layouts.tableName }}
          onSortWithKey={onSortWithKey}
          renderCell={onRenderCell}
          onRowPress={onSelectRow}
          draggable={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
