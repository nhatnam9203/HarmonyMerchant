import IMAGE from '@resources';
import {
  ButtonGradientRed,
  ButtonGradientWhite,
  FormInput,
  FormLabelSwitch,
  FormSelect,
  FormTitle,
  DialogColorPicker,
} from '@shared/components';
import { CustomInput } from '@shared/components/CustomInput';
import { Table } from '@shared/components/CustomTable';
import { getUniqueId } from '@shared/components/CustomTable/helpers';
import { WithDialogConfirm } from '@shared/HOC/withDialogConfirm';
import { EditPageLayout } from '@shared/layouts';
import { colors, fonts, layouts } from '@shared/themes';
import { AttributesInputTypes } from '@shared/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, View } from 'react-native';

const IMAGE_WIDTH = scaleWidth(120);

const DeleteConfirmButton = WithDialogConfirm(ButtonGradientRed);

export const Layout = ({ ...props }) => {
  const {
    form,
    getHeaderKeys,
    getTableKeys,
    onNewAttributeButtonPress,
    updateAttributes,
    editAttribute,
    deleteAttribute,
    onChangeInputType,
  } = props;
  const { t } = useTranslation();

  const onRenderTableCell = ({ item, columnKey, rowIndex, cellWidth }) => {
    if (columnKey === 'label') {
      const onHandleChange = (text) => {
        editAttribute(item.key, { label: text });
      };
      return (
        <View
          style={{ width: cellWidth }}
          key={getUniqueId(columnKey, rowIndex, 'cell-label')}
        >
          <CustomInput
            style={[styles.customInput, { width: scaleWidth(230) }]}
            textInputProps={{
              placeholder: 'Label',
              fontSize: scaleFont(17),
              textAlign: 'left',
              defaultValue: item?.label,
              onChangeText: onHandleChange,
            }}
          />
        </View>
      );
    }

    if (columnKey === 'value') {
      const onHandleUpdateSwatch = (color) => {
        editAttribute(item.key, { value: color });
      };
      return (
        <View
          style={{ width: cellWidth }}
          key={getUniqueId(columnKey, rowIndex, 'cell-label')}
        >
          <DialogColorPicker
            onApplyColor={onHandleUpdateSwatch}
            defaultValue={item?.value}
          />
        </View>
      );
    }

    if (columnKey === 'actions') {
      const onHandleDeleteAttribute = () => {
        deleteAttribute(item.key);
      };
      return (
        <View
          style={layouts.fill}
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
            onPress={onHandleDeleteAttribute}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <EditPageLayout
      {...props}
      contentStyle={{ flexDirection: 'column-reverse' }}
      pageName={t('Attributes')}
    >
      <View style={styles.content}>
        <Table
          items={form?.values?.values}
          setItems={updateAttributes}
          headerKeyLabels={getHeaderKeys()}
          whiteListKeys={getTableKeys()}
          primaryKey="key"
          unitKeys={{ totalDuration: 'hrs' }}
          widthForKeys={{
            value: '10%',
            label: '75%',
          }}
          emptyDescription={t('No Values')}
          renderCell={onRenderTableCell}
          onRowPress={() => {}}
          draggable={true}
        />
      </View>

      <View style={styles.content}>
        <FormTitle label={t('Values of Your Attribute')}>
          <View style={styles.headerOptions}>
            <ButtonGradientWhite
              width={scaleWidth(32)}
              height={scaleHeight(32)}
              fontSize={scaleFont(17)}
              textWeight="normal"
              onPress={onNewAttributeButtonPress}
            >
              <Image
                source={IMAGE.plus}
                style={{ width: scaleWidth(16), height: scaleHeight(16) }}
                resizeMode="contain"
              />
            </ButtonGradientWhite>
            <View style={layouts.marginHorizontal} />
            <Text style={styles.headerOptionsLabel}>{t('Add Value')}</Text>
          </View>
        </FormTitle>
      </View>

      <View style={styles.container}>
        <View style={styles.content}>
          {/* <FormLabelSwitch
            label={t('Required value')}
            style={[layouts.vertical, layouts.verticalCenterLeft]}
            textStyle={styles.textStyle}
            onValueChange={form?.handleChange('required')}
            defaultValue={form?.values?.required}
          /> */}

          <FormInput
            label={t('Attribute Label')}
            placeholder={t('Enter attribute label')}
            required={true}
            onChangeValue={form?.handleChange('label')}
            defaultValue={form?.values?.label}
          />
        </View>
        <View style={styles.content}>
          <FormLabelSwitch
            label={t('Update product image')}
            style={[layouts.vertical, layouts.verticalCenterLeft]}
            textStyle={styles.textStyle}
            onValueChange={(val) =>
              form?.setFieldValue('updateProductImage', val)
            }
            defaultValue={form?.values?.updateProductImage}
          />

          <FormSelect
            label={t('Input type')}
            filterItems={AttributesInputTypes}
            defaultValue={form?.values?.inputType}
            onChangeValue={onChangeInputType}
          />
        </View>
      </View>

      <View style={styles.content}>
        <FormTitle label={t('Attribute Properties')} />
      </View>
    </EditPageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scaleWidth(0),
    paddingVertical: scaleHeight(16),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  content: {
    flex: 1,
    marginHorizontal: scaleWidth(16),
    flexDirection: 'column-reverse',
  },

  textStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
    height: scaleHeight(24),
  },

  headerOptions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  headerOptionsLabel: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.OCEAN_BLUE,
  },

  customInput: {
    height: scaleHeight(40),
  },
});
