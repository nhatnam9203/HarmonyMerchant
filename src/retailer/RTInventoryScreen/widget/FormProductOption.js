import IMAGE from '@resources';
import {
  CustomCheckBox,
  DialogColorPicker,
  FormUploadImage,
} from '@shared/components';
import { CustomInput } from '@shared/components/CustomInput';
import { Table } from '@shared/components/CustomTable';
import { getUniqueId } from '@shared/components/CustomTable/helpers';
import {
  useCreateAttributes,
  useEditAttributes,
  useGetAttributes,
} from '@shared/services/api/retailer';
import { colors, fonts, layouts } from '@shared/themes';
import { AttributesInputTypes, INPUT_TYPE } from '@shared/utils';
import { useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup';

const log = (obj, message = '') => {
  Logger.log(`[FormProductOption] ${message}`, obj);
};

export const FormProductOption = React.forwardRef(
  ({ item, onUpdateOptionValues }, ref) => {
    const [t] = useTranslation();

    const form = useFormik({
      initialValues: item ?? {
        inputType: AttributesInputTypes[0].value,
        updateProductImage: false,
      },
      validationSchema: Yup.object().shape({
        label: Yup.string().required(t('Label Value is required')),
        inputType: Yup.string(),
        updateProductImage: Yup.boolean(),
        values: Yup.array().of(
          Yup.object().shape({
            label: Yup.string(),
            value: Yup.string(),
            position: Yup.number(),
          }),
        ),
      }),
      onSubmit: (values) => {
        // alert(JSON.stringify(values));
      },
    });

    /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
    // new
    const [attributes, createAttributes] = useCreateAttributes();
    // edit
    const [attributeEdit, editAttributes] = useEditAttributes();
    const [attributesGet, getAttributes] = useGetAttributes();

    /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */

    React.useImperativeHandle(ref, () => ({
      getOptions: () => {
        return form.values;
      },
    }));

    React.useEffect(() => {
      if (attributesGet?.data) {
        const options = attributesGet?.data?.values.map((v) =>
          Object.assign({}, v, { attributeValueId: v.id, id: 0 }),
        );
        form.setFieldValue('inputType', attributesGet?.data?.inputType);
        form.setFieldValue(
          'updateProductImage',
          attributesGet?.data?.updateProductImage,
        );
        form.setFieldValue('attributeId', attributesGet?.data?.id);

        if (item) {
          let values =
            form?.values.values?.map((v) => {
              const existItem = options?.find(
                (x) => x.attributeValueId === v.attributeValueId,
              );
              if (existItem) {
                return Object.assign({}, v, {
                  position: existItem.position,
                  checked: true,
                });
              }
            }) || [];

          const arr = options?.filter(
            (x) =>
              values?.findIndex(
                (val) => x.attributeValueId === val.attributeValueId,
              ) < 0,
          );

          values = values?.concat(arr);
          log(values, 'values');
          form.setFieldValue('values', values);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attributesGet?.data]);

    React.useEffect(() => {
      if (item && !attributesGet?.data) {
        form.setValues(item);
        getAttributes(item.attributeId ?? item.id);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      if (onUpdateOptionValues && typeof onUpdateOptionValues === 'function') {
        onUpdateOptionValues(form.values);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.values]);

    const updateAttributes = (attributes) => {
      // update lai thu tu options
    };

    const getHeaderKeys = () => {
      return form.values?.inputType === INPUT_TYPE.VISUAL_SWATCH
        ? {
            active: t('Active'),
            value: t('Swatch'),
            label: t('Value Label'),
            valueAdd: t('Value Add'),
          }
        : {
            active: t('Active'),
            label: t('Value Label'),
            valueAdd: t('Value Add'),
          };
    };

    const getTableKeys = () => {
      return form.values?.inputType === INPUT_TYPE.VISUAL_SWATCH
        ? ['active', 'value', 'label', 'valueAdd']
        : ['active', 'label', 'valueAdd'];
    };

    const onRenderTableCell = ({
      item: cellItem,
      columnKey,
      rowIndex,
      cellWidth,
    }) => {
      if (columnKey === 'active') {
        const setToggleCheckBox = (val) => {
          let values = form.values.values?.map((v) => {
            if (v.attributeValueId === cellItem.attributeValueId) {
              return Object.assign({}, v, { checked: val });
            } else {
              return v;
            }
          });
          form.setFieldValue('values', values);
          // onUpdateOptionValues(form.values);
        };
        return (
          <View
            style={[{ width: cellWidth }, layouts.center]}
            key={getUniqueId(columnKey, rowIndex, 'cell-checkbox')}
          >
            <CustomCheckBox
              defaultValue={cellItem?.checked}
              onValueChange={setToggleCheckBox}
              selectedColor={colors.OCEAN_BLUE}
              onCheckColor="#fff"
            />
          </View>
        );
      }

      if (columnKey === 'label') {
        const onHandleChange = (text) => {};
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
                defaultValue: cellItem?.label,
                onChangeText: onHandleChange,
                editable: false,
              }}
            />
          </View>
        );
      }

      if (columnKey === 'value') {
        const onHandleUpdateSwatch = (color) => {};
        return (
          <View
            style={{ width: cellWidth }}
            key={getUniqueId(columnKey, rowIndex, 'cell-value')}
          >
            <DialogColorPicker
              onApplyColor={onHandleUpdateSwatch}
              defaultValue={cellItem?.value}
              disabled={true}
            />
          </View>
        );
      }

      if (columnKey === 'valueAdd') {
        const onHandleChange = (text) => {
          let values = form.values.values?.map((v) => {
            if (v.attributeValueId === cellItem.attributeValueId) {
              return Object.assign({}, v, { valueAdd: parseFloat(text, 2) });
            } else {
              return v;
            }
          });
          form.setFieldValue('values', values);
          // onUpdateOptionValues(form.values);
        };
        return (
          <View
            style={{ width: cellWidth }}
            key={getUniqueId(columnKey, rowIndex, 'cell-value-add')}
          >
            <CustomInput
              style={[styles.customInput, { width: scaleWidth(230) }]}
              textInputProps={{
                placeholder: 'Label',
                fontSize: scaleFont(17),
                textAlign: 'left',
                defaultValue: cellItem?.valueAdd,
                onChangeText: onHandleChange,
              }}
            />
          </View>
        );
      }
      return null;
    };

    const onRenderOptionsImage = ({ item: cellItem }) => {
      const onChangeFile = (fileId) => {
        if (fileId) {
          log(form.values, 'form.values');

          let values = form.values.values?.map((v) => {
            if (v.attributeValueId === cellItem.attributeValueId) {
              return Object.assign({}, v, { fileId: fileId });
            } else {
              return v;
            }
          });

          form.setFieldValue('values', values);
          // onUpdateOptionValues(form.values);
        }
      };
      return (
        <FormUploadImage
          style={styles.optionImage}
          label={cellItem?.label}
          onSetFileId={onChangeFile}
          defaultValue={cellItem?.imageUrl}
        />
      );
    };

    return (
      <View style={styles.container}>
        <InfoHeading label={form.values?.label}>
          <TouchableOpacity
          // onPress={onPress}
          >
            <Image
              style={{
                width: scaleWidth(22),
                height: scaleHeight(22),
              }}
              source={IMAGE.remove_color_row}
            />
          </TouchableOpacity>
        </InfoHeading>
        <View style={styles.content}>
          <Table
            items={form.values?.values}
            headerKeyLabels={getHeaderKeys()}
            whiteListKeys={getTableKeys()}
            primaryKey="id"
            unitKeys={{ totalDuration: 'hrs' }}
            widthForKeys={{
              active: scaleWidth(100),
              value: '10%',
              label: '45%',
            }}
            emptyDescription={t('No Values')}
            renderCell={onRenderTableCell}
            onRowPress={() => {}}
            draggable={true}
            setItems={updateAttributes}
          />
        </View>
        {form.values?.updateProductImage && (
          <View>
            <InfoHeading label={t('Option Image')} fontSize={scaleWidth(17)} />

            <View style={styles.content}>
              <FlatList
                style={styles.flatList}
                numColumns={10}
                data={form.values?.values}
                renderItem={onRenderOptionsImage}
                keyExtractor={(v) => v?.id}
                contentContainerStyle={styles.flatListContainer}
                // ListHeaderComponent={() => <View style={styles.itemSeparator} />}
                // ListFooterComponent={() => <View style={styles.itemSeparator} />}
                ItemSeparatorComponent={() => (
                  <View style={styles.itemSeparator} />
                )}
                // ListEmptyComponent={() => (
                //   <EmptyList description={emptyDescription} />
                // )}
                // refreshControl={
                //   <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                // }
              />
            </View>
          </View>
        )}
      </View>
    );
  },
);

let InfoHeading = ({ label, children, fontSize }) => {
  return (
    <View style={styles.infoLineContent}>
      {!!label && (
        <Text style={[styles.infoHeaderText, fontSize && { fontSize }]}>
          {label}
        </Text>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleHeight(8),
  },

  content: {
    flex: 1,
  },

  infoHeaderText: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(20),
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
    marginRight: scaleWidth(10),
  },

  infoLineContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleHeight(7),
  },

  flatList: {
    width: '100%',
    height: scaleHeight(200),
  },

  flatListContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    // flexWrap: 'wrap',
  },

  itemSeparator: {
    width: scaleWidth(5),
  },

  optionImage: {
    marginHorizontal: scaleWidth(15),
  },
});
