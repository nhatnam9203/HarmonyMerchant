import IMAGE from "@resources";
import { ButtonGradient, FormInputAmount } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { useGetProducts } from "@shared/services/api/retailer";
import { colors, fonts, layouts } from "@shared/themes";
import { INPUT_TYPE, statusSuccess } from "@shared/utils";
import { formatMoneyWithUnit } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import FastImage from "react-native-fast-image";
import { useDispatch } from "react-redux";

const log = (obj, message = "") => {
  Logger.log(`[DialogProductDetail] ${message}`, obj);
};

export const DialogProductDetail = React.forwardRef(({ onAddProduct }, ref) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);

  const [product, setProduct] = React.useState(null);
  const [options, setOptions] = React.useState({});
  const [quantity, setQuantity] = React.useState(1);
  const [imageUrl, setImageUrl] = React.useState(null);

  /**
  |--------------------------------------------------
  | API
  |--------------------------------------------------
  */
  const [productsGet, getProducts] = useGetProducts();

  const calcTotalPrice = React.useCallback(() => {
    if (!product) return 0;

    const productPrice = product?.price ?? 0;

    let price = parseFloat(productPrice);
    if (options?.length > 0) {
      price += product?.options?.reduce((accumulator, currentItem) => {
        if (!options[currentItem?.id]) return accumulator;

        const findItem = currentItem?.values?.find(
          (v) => v.id === options[currentItem?.id]
        );
        if (findItem) {
          return accumulator + parseFloat(findItem?.valueAdd ?? 0);
        }

        return accumulator;
      }, 0);
    }

    return formatMoneyWithUnit(price);
  }, [options, product]);

  const onHandleAddBasket = () => {
    // product, options, quantity
    // !! tạm  dùng inputType
    const filterOptions = product?.options?.map((v) => {
      let temp;
      if (options && options[v?.id]) {
        temp = v?.values.filter((i) => i.id === options[v?.id]);
      }
      const { values, ...pro } = v;
      return Object.assign({}, pro, { values: temp });
    });

    if (onAddProduct && typeof onAddProduct === 'function') {
      onAddProduct(
        Object.assign({}, product, {
          id: Date.now(),
          options: filterOptions,
          quantity: quantity,
        })
      );
    }

    dialogRef.current?.hide();
  };

  React.useImperativeHandle(ref, () => ({
    show: (item) => {
      dialogRef.current?.show();
      setOptions({});
      setImageUrl(null);
      setQuantity(1);
      setProduct(item);
      getProducts(item.productId);
    },
  }));

  React.useEffect(() => {
    const { codeStatus, data } = productsGet || {};
    if (statusSuccess(codeStatus)) {
      setProduct(data);
      setImageUrl(data?.imageUrl);

      data?.options?.map((item) => {
        const defaultOptionId = options[item?.id];
        if (!defaultOptionId && item?.values?.length > 0) {
          setOptions((prev) =>
            Object.assign({}, prev, {
              [item?.id]: item?.values[0].id,
            })
          );
        }
      });
    }
  }, [productsGet]);

  const ItemRowOptions = ({ rows, pagination, onPress, itemOption }) => {
    return rows?.map((row, index) => {
      const page = index + 1;
      const data = pagination(page);
      return (
        <View key={row} style={layouts.horizontal}>
          {data?.map((v) => (
            <TouchableOpacity
              key={v.id + ''}
              style={[
                styles.buttonSize,
                options[itemOption?.id] === v.id && styles.selectBorder,
                index > 0 && { marginTop: scaleHeight(15) },
              ]}
              onPress={() => onPress(v)}
            >
              <Text>{v.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    });
  };

  const renderOption = (itemOption) => {
    if (
      !itemOption ||
      !itemOption?.values ||
      itemOption?.values?.length <= 0 ||
      !product
    )
      return null;

    const onHandlePress = (optionValue) => {
      setOptions((prev) =>
        Object.assign({}, prev, { [itemOption?.id]: optionValue?.id })
      );

      if (optionValue?.imageUrl) {
        setImageUrl(optionValue?.imageUrl);
      } else {
        setImageUrl(product?.imageUrl);
      }
    };

    const defaultOptionId = options[itemOption?.id];

    switch (itemOption?.inputType) {
      case INPUT_TYPE.TEXT_SWATCH:
        return (
          <View key={itemOption.id + ''}>
            <Text style={styles.itemText}>{itemOption?.label}</Text>
            <View style={layouts.marginVertical} />
            <View style={styles.optionsItemsLayout}>
              {itemOption?.values?.map((v) => {
                const onSelectOption = () => {
                  onHandlePress(v);
                };

                return (
                  <TouchableOpacity key={v?.id + ""} onPress={onSelectOption}>
                    <View
                      style={[
                        styles.optionsItem,
                        defaultOptionId === v?.id && styles.selectBorder,
                      ]}
                    >
                      <Text style={styles.itemText}>{v?.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      case INPUT_TYPE.DROP_DOWN:
        return (
          <View key={itemOption?.id + ""}>
            <Text style={styles.itemText}>{itemOption?.label}</Text>
            <View style={layouts.marginVertical} />
            <View style={styles.optionsItemsLayout}>
              {itemOption?.values?.map((v) => (
                <TouchableOpacity
                  key={v?.id + ""}
                  style={[
                    styles.optionsItem,
                    defaultOptionId === v?.id && styles.selectBorder,
                  ]}
                  onPress={() => onHandlePress(v)}
                >
                  <Text style={styles.itemText}>{v?.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case INPUT_TYPE.VISUAL_SWATCH:
        return (
          <View key={itemOption?.id + ""}>
            <Text style={styles.itemText}>{itemOption?.label}</Text>
            <View style={layouts.marginVertical} />
            <View style={styles.optionsItemsLayout}>
              {itemOption?.values?.map((v) => (
                <TouchableOpacity
                  key={v.id + ""}
                  style={[
                    styles.optionsItem,
                    { backgroundColor: v.value },
                    defaultOptionId === v.id && styles.selectBorder,
                  ]}
                  onPress={() => onHandlePress(v)}
                />
              ))}
              {/* <ItemRowOptions
                rows={rows}
                pagination={pagination}
                onPress={onHandlePress}
                itemOption={itemOption}
              /> */}
            </View>
          </View>
        );
      default:
        return null;
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
        <ScrollView>
          <View style={styles.container}>
            <FastImage
              style={styles.imageStyle}
              source={
                imageUrl
                  ? {
                      uri: imageUrl,
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }
                  : IMAGE.product_holder
              }
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

              {product?.options?.map(renderOption)}

              <FormInputAmount
                label={t("Amount")}
                defaultValue={quantity}
                onChangeValue={setQuantity}
              />
              <View style={styles.marginVertical} />
            </View>
          </View>
        </ScrollView>
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

  buttonSize: {
    backgroundColor: colors.WHITE,
  },

  selectBorder: {
    borderStyle: 'solid',
    borderWidth: scaleWidth(2),
    borderColor: colors.OCEAN_BLUE,
  },

  marginVertical: {
    height: scaleHeight(15),
  },

  optionsItemsLayout: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  optionsItem: {
    width: scaleWidth(48),
    height: scaleHeight(32),
    marginRight: scaleWidth(15),
    marginBottom: scaleWidth(15),
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc",
    justifyContent: "center",
    alignItems: "center",
  },
});
