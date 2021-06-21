import IMAGE from '@resources';
import {
  ButtonGradient,
  ButtonGradientWhite,
  ExportModal,
  TableImageCell,
  DropdownMenu,
} from '@shared/components';
import { ButtonFilter } from '@shared/components/ButtonFilter';
import { Table } from '@shared/components/CustomTable';
import { getUniqueId } from '@shared/components/CustomTable/helpers';
import { HeaderToolBarTitle } from '@shared/components/HeaderToolBarTitle';
import { InputSearch } from '@shared/components/InputSearch';
import { colors, fonts, layouts } from '@shared/themes';
import {
  dateToString,
  DATE_SHOW_FORMAT_STRING,
  NEED_TO_ORDER,
} from '@shared/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { WithDialogRestock } from '@shared/HOC/withDialogRestock';
import { formatMoneyWithUnit } from '@utils';

const RestockButton = WithDialogRestock(ButtonGradientWhite);

const IMAGE_WIDTH = scaleWidth(120);
export const Layout = ({
  items,
  onButtonNewProductPress,
  onEditProduct,
  needToOrderRef,
  onLoadProductDetail,
  categories,
  onChangeValueSearch,
  onButtonSearchPress,
  category,
  setCategory,
  needToOrder,
  setNeedToOrder,
  onSubmitRestock,
  onCheckedRow,
  onRefresh,
}) => {
  const { t } = useTranslation();

  const onRenderTableCell = ({ item, columnKey, rowIndex }) => {
    if (columnKey === 'imageUrl') {
      const handleCheckRow = (val) => {
        onCheckedRow(item, val);
      };

      return (
        <TableImageCell
          width={IMAGE_WIDTH}
          imageUrl={item?.imageUrl}
          key={getUniqueId(columnKey, rowIndex, 'cell-image')}
          onPress={() => {}}
          // value={item?.checked}
          onValueChange={handleCheckRow}
        />
      );
    }

    if (columnKey === 'actions') {
      const onHandleEdit = () => {
        onEditProduct(item);
      };
      return (
        <View
          style={layouts.fill}
          key={getUniqueId(columnKey, rowIndex, 'cell-action')}
        >
          <ButtonGradient
            label={t('Edit')}
            width={scaleWidth(72)}
            height={scaleHeight(28)}
            fontSize={scaleFont(15)}
            textColor={colors.WHITE}
            fontWeight="normal"
            onPress={onHandleEdit}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <View
      style={styles.container}
      // onTouchStart={() => needToOrderRef.current?.closePicker()}
    >
      <View style={layouts.fill}>
        <Table
          items={items}
          headerKeyLabels={{
            imageUrl: t('Image'),
            name: t('Product Name'),
            categoryName: t('Category'),
            sku: t('SKU'),
            price: t('Price'),
            quantity: t('Qty'),
            needToorDer: t('Need To Order'),
            actions: t('Actions'),
          }}
          whiteListKeys={[
            'imageUrl',
            'name',
            'categoryName',
            'sku',
            'price',
            'quantity',
            'needToorDer',
            'actions',
          ]}
          primaryKey="productId"
          unitKeys={{ totalDuration: 'hrs' }}
          widthForKeys={{
            imageUrl: IMAGE_WIDTH,
            name: scaleWidth(220),
            categoryName: scaleWidth(100),
            sku: scaleWidth(130),
            price: scaleWidth(150),
            quantity: scaleWidth(60),
            needToorDer: scaleWidth(140),
          }}
          emptyDescription={t('No Products')}
          styleTextKeys={{ name: styles.textName }}
          formatFunctionKeys={{
            createdDate: (value) =>
              dateToString(value, DATE_SHOW_FORMAT_STRING),
            price: (value) => `${formatMoneyWithUnit(value)}`,
          }}
          renderCell={onRenderTableCell}
          onRowPress={onLoadProductDetail}
          onRefresh={onRefresh}
        />
      </View>

      <View style={styles.rowContent}>
        <HeaderToolBarTitle label={t('Products')} style={styles.textTitle} />
        <View style={layouts.horizontal}>
          <RestockButton
            label={t('Restock')}
            width={scaleWidth(100)}
            height={scaleHeight(32)}
            textColor={colors.BROWNISH_GREY}
            fontSize={scaleFont(15)}
            onPress={onSubmitRestock}
          />
          <View style={layouts.marginHorizontal} />
          <ExportModal />
        </View>
      </View>

      <View style={[styles.rowContent, { justifyContent: 'flex-start' }]}>
        <DropdownMenu
          items={categories}
          defaultIndex={0}
          onChangeValue={(item) => {
            setCategory(item?.value);
          }}
          width={scaleWidth(208)}
          placeholder={t('Select Category')}
        />
        <View style={layouts.marginHorizontal} />

        {/* <ButtonFilter
          ref={needToOrderRef}
          filterItems={NEED_TO_ORDER}
          defaultValue={null}
          onChangeValue={setNeedToOrder}
          placeholder={t('Need to order')}
          width={scaleWidth(160)}
        /> */}
        <DropdownMenu
          ref={needToOrderRef}
          items={NEED_TO_ORDER}
          defaultValue={needToOrder}
          onChangeValue={(item) => {
            setNeedToOrder(item?.value);
          }}
          placeholder={t('Need to order')}
          width={scaleWidth(160)}
        />
      </View>

      <View style={styles.rowContent}>
        <View style={styles.leftContent}>
          <InputSearch onSearch={onChangeValueSearch} width={scaleWidth(280)} />
          <View style={layouts.marginHorizontal} />
          <ButtonGradientWhite
            label={t('Search')}
            width={scaleWidth(120)}
            onPress={onButtonSearchPress}
          />
          <View style={layouts.marginHorizontal} />
          <ButtonGradientWhite
            label={t('Scan')}
            width={scaleWidth(160)}
            // onPress={onButtonSearchPress}
            leftChildren={() => (
              <Image
                source={IMAGE.scancode}
                style={{
                  width: scaleWidth(24),
                  height: scaleHeight(24),
                  marginHorizontal: scaleWidth(12),
                }}
              />
            )}
          />
        </View>
        <ButtonGradient
          onPress={onButtonNewProductPress}
          label={t('Add Product')}
          width={scaleWidth(140)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column-reverse',
  },

  rowContent: {
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

  textTitle: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(26),
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.OCEAN_BLUE,
  },

  textName: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(15),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },
});
