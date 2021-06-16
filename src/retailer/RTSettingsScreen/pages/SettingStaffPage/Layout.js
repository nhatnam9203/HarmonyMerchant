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
  sortLabel,
  onSortWithKey,
  onChangeValueSearch,
  onButtonSearchPress,
  onButtonNewStaffPress,
  onButtonEditStaffPress,
  onSelectRow,
  getStaffListByMerchant,
  items,
}) => {
  const { t } = useTranslation();
  const onRenderCell = ({ columnKey, rowIndex, columnIndex, item }) => {
    const onHandleEdit = () => {
      onButtonEditStaffPress(item);
    };
    if (columnKey === 'actions') {
      return (
        <View
          style={[layouts.fill, layouts.horizontal]}
          key={getUniqueId(columnKey, rowIndex, 'cell-action')}
        >
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
        labelNewButton={t('New Staff')}
        onNewButtonPress={onButtonNewStaffPress}
        onButtonSearchPress={onButtonSearchPress}
        onChangeValueSearch={(value) => onChangeValueSearch('keySearch', value)}
      />
      <View style={layouts.formRow}>
        <Text style={layouts.formTitle}>{t('Staffs')}</Text>
      </View>
      <View style={layouts.fill}>
        <Table
          items={items}
          headerKeyLabels={{
            displayName: t('Staff name'),
            phone: t('Phone Number'),
            email: t('Email'),
            // inputType: t('Input Type'),
            actions: t('Actions'),
          }}
          whiteListKeys={['displayName', 'phone', 'email', 'actions']}
          sortedKeys={{ displayName: sortLabel }}
          primaryKey="staffId"
          widthForKeys={{
            displayName: '25%',
            phone: '30%',
            email: '30%',
          }}
          emptyDescription={t('No Staffs')}
          styleTextKeys={{ displayName: layouts.tableName }}
          onSortWithKey={onSortWithKey}
          renderCell={onRenderCell}
          onRowPress={onSelectRow}
          draggable={true}
          onRefresh={getStaffListByMerchant}
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
