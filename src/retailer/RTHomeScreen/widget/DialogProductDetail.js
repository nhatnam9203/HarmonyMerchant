import { DialogLayout } from '@shared/layouts';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, fonts, layouts } from '@shared/themes';
import { ButtonGradient, FormInputAmount } from '@shared/components';
import FastImage from 'react-native-fast-image';
import {
  useGetProducts,
  useCreateAppointmentTemp,
} from '@shared/services/api/retailer';
import { INPUT_TYPE, calcTotalPriceOfOption } from '@shared/utils';
import { basketRetailer } from '@redux/slices';
import { map } from 'rxjs/operators';
import { useDispatch } from 'react-redux';

const log = (obj, message = '') => {
  Logger.log(`[DialogProductDetail] ${message}`, obj);
};

export const DialogProductDetail = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);

  const [product, setProduct] = React.useState(null);
  const [options, setOptions] = React.useState({});
  const [quantity, setQuantity] = React.useState(1);

  /**
  |--------------------------------------------------
  | API
  |--------------------------------------------------
  */
  const [products, getProducts] = useGetProducts();

  const calcTotalPrice = React.useCallback(() => {
    let price = parseFloat(product?.price);
    price += product?.options?.reduce((accumulator, currentItem) => {
      if (!options[currentItem.inputType]) return accumulator;

      const findItem = currentItem?.values?.find(
        (v) => v.id === options[currentItem.inputType],
      );
      if (findItem) {
        return accumulator + parseFloat(findItem.valueAdd);
      }
      return accumulator;
    }, 0);

    return parseFloat(price).toFixed(2);
  }, [options, product]);

  const onHandleAddBasket = () => {
    // product, options, quantity
    // !! tạm  dùng inputType
    const filterOptions = product?.options?.map((v) => {
      let temp;
      if (options && options[v.inputType]) {
        temp = v?.values.filter((i) => i.id === options[v.inputType]);
      }
      const { values, ...pro } = v;
      return Object.assign({}, pro, { values: temp });
    });

    dispatch(
      basketRetailer.addBasketItem(
        Object.assign({}, product, {
          id: Date.now(),
          options: filterOptions,
          quantity: quantity,
        }),
      ),
    );

    dialogRef.current?.hide();
  };

  React.useImperativeHandle(ref, () => ({
    show: (item) => {
      dialogRef.current?.show();
      setOptions({});
      setQuantity(1);
      setProduct(item);
      getProducts(item.productId);
    },
  }));

  React.useEffect(() => {
    if (products?.data) {
      setProduct(products?.data);
    }
  }, [products?.data]);

  const renderOption = (itemOption) => {
    const onHandlePress = (optionValue) => {
      setOptions((prev) =>
        Object.assign({}, prev, { [itemOption?.inputType]: optionValue.id }),
      );
    };

    const defaultOption = options[itemOption?.inputType];
    if (!defaultOption && itemOption?.values?.length > 0) {
      setOptions((prev) =>
        Object.assign({}, prev, {
          [itemOption?.inputType]: itemOption?.values[0].id,
        }),
      );
    }

    switch (itemOption?.inputType) {
      case INPUT_TYPE.TEXT_SWATCH:
        return (
          <View key={itemOption.id + ''}>
            <Text style={styles.itemText}>{itemOption?.label}</Text>
            <View style={layouts.marginVertical} />
            <View style={layouts.horizontal}>
              {itemOption?.values?.map((v, index) => (
                <TouchableOpacity
                  key={v.id + ''}
                  style={[
                    styles.buttonColor,
                    options[itemOption?.inputType] === v.id &&
                      styles.selectBorder,
                  ]}
                  onPress={() => onHandlePress(v)}
                >
                  <Text>{v.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.marginVertical} />
          </View>
        );
      case INPUT_TYPE.DROP_DOWN:
        return (
          <View key={itemOption.id + ''}>
            <Text style={styles.itemText}>{itemOption?.label}</Text>
            <View style={layouts.marginVertical} />
            <View style={layouts.horizontal}>
              {itemOption?.values?.map((v) => (
                <TouchableOpacity
                  key={v.id + ''}
                  style={[
                    styles.buttonSize,
                    options[itemOption?.inputType] === v.id &&
                      styles.selectBorder,
                  ]}
                  onPress={() => onHandlePress(v)}
                >
                  <Text>{v.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.marginVertical} />
          </View>
        );
      case INPUT_TYPE.VISUAL_SWATCH:
        return (
          <View key={itemOption.id + ''}>
            <Text style={styles.itemText}>{itemOption?.label}</Text>
            <View style={layouts.marginVertical} />
            <View style={layouts.horizontal}>
              {itemOption?.values?.map((v) => (
                <TouchableOpacity
                  key={v.id + ''}
                  style={[
                    styles.buttonColor,
                    { backgroundColor: v.value },
                    options[itemOption?.inputType] === v.id &&
                      styles.selectBorder,
                  ]}
                  onPress={() => onHandlePress(v)}
                />
              ))}
            </View>
            <View style={styles.marginVertical} />
          </View>
        );
      default:
        break;
    }
  };

  return (
    <View>
      <DialogLayout
        title={t('Product details')}
        ref={dialogRef}
        bottomChildren={() => (
          <View style={styles.bottomStyle}>
            <ButtonGradient
              label={t('Add to basket')}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              onPress={onHandleAddBasket}
            />
          </View>
        )}
        style={styles.dialog}
      >
        <View style={styles.container}>
          <FastImage
            style={styles.imageStyle}
            source={{
              uri: product?.imageUrl,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode="contain"
          />
          <View style={layouts.marginHorizontal} />
          <View style={styles.content}>
            <Text style={styles.title}>{product?.name}</Text>
            <View style={styles.marginVertical} />
            <Text style={styles.price}>{calcTotalPrice()}</Text>
            <View style={styles.marginVertical} />
            <View style={styles.line} />
            <View style={styles.marginVertical} />

            {product?.options?.map((item) => renderOption(item))}

            <FormInputAmount
              label={t('Amount')}
              defaultValue={quantity}
              onChangeValue={setQuantity}
            />
            <View style={styles.marginVertical} />
          </View>
        </View>
      </DialogLayout>
    </View>
  );
});

const styles = StyleSheet.create({
  dialog: {
    flex: 0,
    width: scaleWidth(600),
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  bottomStyle: {
    width: '100%',
    height: scaleHeight(80),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },

  title: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(23),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.OCEAN_BLUE,
  },

  price: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },

  list: {
    // height: scaleHeight(400),
    maxHeight: scaleHeight(400),
    minHeight: scaleHeight(100),
    width: '100%',
    marginVertical: scaleHeight(20),
  },

  item: {
    width: scaleWidth(440),
    height: scaleHeight(48),
    backgroundColor: colors.WHITE,
    borderStyle: 'solid',
    borderRightWidth: scaleWidth(1),
    borderLeftWidth: scaleWidth(1),
    borderColor: '#dddddd',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(16),
    justifyContent: 'space-between',
  },

  itemSeparator: {
    backgroundColor: '#dddddd',
    height: scaleHeight(1),
  },

  itemText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },

  imageStyle: {
    width: scaleWidth(200),
    height: scaleHeight(200),
  },

  content: { flex: 1 },

  line: {
    height: 1,
    backgroundColor: '#dddddd',
  },

  buttonColor: {
    width: scaleWidth(40),
    height: scaleHeight(40),
    marginRight: scaleWidth(15),
  },

  buttonSize: {
    width: scaleWidth(48),
    height: scaleHeight(32),
    marginRight: scaleWidth(15),
    backgroundColor: colors.WHITE,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectBorder: {
    borderStyle: 'solid',
    borderWidth: scaleWidth(2),
    borderColor: colors.OCEAN_BLUE,
  },

  marginVertical: {
    height: scaleHeight(18),
  },
});
