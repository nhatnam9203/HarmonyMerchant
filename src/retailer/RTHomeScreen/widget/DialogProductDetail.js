import IMAGE from "@resources";
import { ButtonGradient, FormInputAmount } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { useGetProducts } from "@shared/services/api/retailer";
import { colors, fonts, layouts } from "@shared/themes";
import { arrayIsEqual, INPUT_TYPE, statusSuccess } from "@shared/utils";
import { formatMoneyWithUnit } from "@utils";
import _ from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";

const log = (obj, message = "") => {
  Logger.log(`[DialogProductDetail] ${message}`, obj);
};

export const DialogProductDetail = React.forwardRef(({ onAddProduct, appointment }, ref) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);

  const { isCheckQty = false } =
    useSelector((state) => state.dataLocal.profile) || {};

  const [product, setProduct] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);
  const [imageUrl, setImageUrl] = React.useState(null);

  const [optionsQty, setOptionsQty] = React.useState(null); // array [optionsValueId]
  const [listFiltersOptionsQty, setListFiltersOptionsQty] =
    React.useState(null);
  const [optionsSelected, setOptionsSelected] = React.useState(null); // [{id: id, value: value}]
  const [codeSelected, setCodeSelected] = React.useState(null);

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

    if (optionsQty) {
      price = parseFloat(optionsQty?.price);
    }
    return formatMoneyWithUnit(price);
  }, [optionsQty, product]);

  const onHandleAddBasket = () => {
    // product, options, quantity
    const filterOptions = product?.options?.map((v) => {
      let temp;
      if (optionsSelected) {
        const findItem = optionsSelected?.find((x) => x.id === v.id);

        temp = v?.values.filter((i) => i.attributeValueId === findItem?.value);
      }
      const { values, ...pro } = v;
      return Object.assign({}, pro, { values: temp });
    });

    if (onAddProduct && typeof onAddProduct === "function") {
      onAddProduct(
        Object.assign({}, product, {
          id: Date.now(),
          options: filterOptions,
          quantity: quantity,
          productQuantityId: optionsQty?.id,
        })
      );
    }

    dialogRef.current?.hide();
  };

  /**
   * D??ng ????? l???y tr???ng th??i c?? th??? ch???n c???a option d???a v??o nh???ng options values ???? ch???n trc ????
   * @param {*} value
   */
  const canSelectOptionValue = (value, index) => {
    if (!listFiltersOptionsQty || listFiltersOptionsQty?.length <= 0)
      return false;

    if (optionsSelected) {
      if (index === 0) {
        const filterArr = product?.quantities; // not check qty
        for (const x of filterArr) {
          if (x.attributeIds?.includes(value)) {
            return true;
          }
        }
      }
    }

    for (const x of listFiltersOptionsQty) {
      if (x.attributeIds?.includes(value)) {
        return true;
      }
    }

    return false;
  };

  const disableAddBasket = React.useCallback(() => {

    if (isCheckQty && quantity <= 0) return true;
    if (!product) return true;
    if (product?.quantities?.length > 0 && !optionsQty) return true;
    if (product?.options?.length > 0 && listFiltersOptionsQty?.length <= 0)
      return true;

    if (
      listFiltersOptionsQty?.length > 0 &&
      optionsQty &&
      listFiltersOptionsQty.indexOf(optionsQty) < 0
    )
      return true;

    if (isCheckQty) {
      const productOrder = _.find(_.get(appointment, 'products'), item => {
        if (optionsQty) {
          return JSON.stringify(_.get(item, 'attributeIds')) == JSON.stringify(_.get(optionsQty, 'attributeIds'))
        } else {
          return _.get(item, 'productId') == _.get(product, 'productId')
        }
      } )
      let quantityTotal = quantity
      if(productOrder) {
        quantityTotal = quantityTotal + _.get(productOrder, 'quantity')
      } 

      if (optionsQty && optionsQty.quantity < quantityTotal) {
        return true;
      } else if (quantityTotal > _.get(product, "quantity", 0) && !optionsQty) {
        return true;
      } 
    }

    return false;
  }, [isCheckQty, quantity, optionsQty, listFiltersOptionsQty]);

  React.useImperativeHandle(ref, () => ({
    show: (item, selected) => {
      // selected : can barcode/ id/ ....

      dialogRef.current?.show();
      setOptionsQty(null);
      setImageUrl(null);
      setOptionsSelected(null);
      setQuantity(1);
      setProduct(item);
      getProducts(item.productId);
      setCodeSelected(selected);
    },
  }));

  React.useEffect(() => {
    const { codeStatus, data } = productsGet || {};
    if (statusSuccess(codeStatus)) {
      setProduct(data);
      setImageUrl(data?.imageUrl);

      if (codeSelected) {
        const tmp = data?.quantities?.find((x) => x.barCode === codeSelected);
        if (tmp?.attributeIds?.length) {
          if (isCheckQty && tmp.quantity <= 0) {
            return;
          }

          const selectedList = tmp?.attributeIds?.map((v) => {
            let findOpt = null;
            for (let i = 0; i < data?.options?.length; i++) {
              const opt = data?.options[i];
              findOpt = opt.values?.find((f) => f.attributeValueId == v);
              if (findOpt) {
                return {
                  id: opt?.id,
                  value: findOpt?.attributeValueId,
                };
              }
            }
            return null;
          });

          if (selectedList?.length > 0) {
            setOptionsSelected(selectedList);
            setOptionsQty(tmp);
          }
        }
      }
    }
  }, [productsGet]);

  React.useEffect(() => {
    if (product?.quantities)
      setListFiltersOptionsQty(
        product?.quantities?.filter((x) => {
          if (isCheckQty && x.quantity <= 0) return false;
          return true;
        })
      );
  }, [product]);

  React.useEffect(() => {
    if (optionsQty) {
      setImageUrl(optionsQty?.imageUrl ?? product?.imageUrl);
    } else {
      setImageUrl(product?.imageUrl);
    }
  }, [optionsQty]);

  const updateOptionsValue = (data, index, itemOption, optionValue) => {
    let opt = { id: itemOption?.id, value: optionValue?.attributeValueId };

    let newOptionsList = [];
    if (index === 0) {
      newOptionsList = [opt];
    } else if (index < optionsSelected?.length) {
      const temp = optionsSelected[index];
      if (temp.value === opt.value) {
        newOptionsList = [...optionsSelected.slice(0, index)];
      } else {
        newOptionsList = [...optionsSelected.slice(0, index), opt];
      }
    } else if (index > optionsSelected?.length) {
      return;
    } else if (optionsSelected?.length) {
      // index === length
      newOptionsList = [...optionsSelected, opt];
    }
    setOptionsSelected(newOptionsList);

    const filtersQuantities = data?.quantities?.filter((x) => {
      if (isCheckQty && x.quantity <= 0) return false;
      const temps = x?.attributeIds;
      for (let i = 0; i < newOptionsList?.length; i++) {
        if (!temps.includes(newOptionsList[i]?.value)) return false;
      }

      return true;
    });

    if (filtersQuantities?.length > 0) {
      const optionQtyItem = filtersQuantities.find((x) =>
        arrayIsEqual(
          x.attributeIds,
          newOptionsList?.map((x) => x.value)
        )
      );
      if (optionQtyItem) {
        setOptionsQty(optionQtyItem);
      } else {
        setListFiltersOptionsQty(filtersQuantities);
        setOptionsQty(null);
      }
    } else {
      // setListFiltersOptionsQty(null);
      setOptionsQty(null);
    }
  };

  const onModalWillHide = () => {
    setOptionsQty(null);
    setImageUrl(null);
    setQuantity(1);
    setProduct(null);
    setListFiltersOptionsQty(null);
  };

  const renderOption = (itemOption, index) => {
    if (
      !itemOption ||
      !itemOption?.values ||
      itemOption?.values?.length <= 0 ||
      !product
    )
      return null;

    const onHandleSelectedOption = (optionValue) => {
      updateOptionsValue(product, index, itemOption, optionValue);

      // if (optionValue?.imageUrl) {
      //   setImageUrl(optionValue?.imageUrl);
      // } else {
      //   setImageUrl(product?.imageUrl);
      // }
    };

    let defaultOptionId = null;
    if (optionsSelected && optionsSelected?.length >= index) {
      defaultOptionId = optionsSelected[index]?.value;
    }

    switch (itemOption?.inputType) {
      case INPUT_TYPE.TEXT_SWATCH:
        return (
          <View key={itemOption.id + ""}>
            <Text style={styles.itemText}>{itemOption?.label}</Text>
            <View style={layouts.marginVertical} />
            <View style={styles.optionsItemsLayout}>
              {itemOption?.values?.map((v) => {
                const onSelectOption = () => {
                  onHandleSelectedOption(v);
                };

                const disabled = !canSelectOptionValue(
                  v.attributeValueId,
                  index
                );

                return (
                  <Pressable
                    key={v?.id + ""}
                    onPress={onSelectOption}
                    disabled={disabled}
                  >
                    <View
                      style={[
                        styles.optionsItem,
                        disabled && styles.disabled,
                        defaultOptionId === v?.attributeValueId &&
                          styles.selectBorder,
                      ]}
                    >
                      <Text style={styles.itemText}>{v?.label}</Text>
                    </View>
                  </Pressable>
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
              {itemOption?.values?.map((v) => {
                const disabled = !canSelectOptionValue(
                  v.attributeValueId,
                  index
                );

                return (
                  <Pressable
                    key={v?.id + ""}
                    style={[
                      styles.optionsItem,
                      disabled && styles.disabled,
                      defaultOptionId === v?.attributeValueId &&
                        styles.selectBorder,
                    ]}
                    onPress={() => onHandleSelectedOption(v)}
                    disabled={disabled}
                  >
                    <Text style={styles.itemText}>{v?.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      case INPUT_TYPE.VISUAL_SWATCH:
        return (
          <View key={itemOption?.id + ""}>
            <Text style={styles.itemText}>{itemOption?.label}</Text>
            <View style={layouts.marginVertical} />
            <View style={styles.optionsItemsLayout}>
              {itemOption?.values?.map((v) => {
                const disabled = !canSelectOptionValue(
                  v.attributeValueId,
                  index
                );

                return (
                  <Pressable
                    key={v.id + ""}
                    style={[
                      styles.optionsItem,
                      disabled && styles.disabled,
                      { backgroundColor: v.value },
                      defaultOptionId === v.attributeValueId &&
                        styles.selectBorder,
                    ]}
                    onPress={() => onHandleSelectedOption(v)}
                    disabled={disabled}
                  />
                );
              })}
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
        title={t("Product details")}
        ref={dialogRef}
        onModalWillHide={onModalWillHide}
        bottomChildren={() => (
          <View style={styles.bottomStyle}>
            <ButtonGradient
              label={t("Add to basket")}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              onPress={onHandleAddBasket}
              disable={disableAddBasket()}
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
              <Text style={styles.price}>{`${calcTotalPrice()}`}</Text>
              <View style={styles.marginVertical} />
              <View style={styles.line} />
              <View style={styles.marginVertical} />

              {product?.options?.map(renderOption)}

              <FormInputAmount
                label={t("Amount")}
                defaultValue={quantity}
                onChangeValue={(value) => {
                  setQuantity(value);
                }}
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
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  bottomStyle: {
    width: "100%",
    height: scaleHeight(80),
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  title: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(23),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },

  price: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  list: {
    // height: scaleHeight(400),
    maxHeight: scaleHeight(400),
    minHeight: scaleHeight(100),
    width: "100%",
    marginVertical: scaleHeight(20),
  },

  item: {
    width: scaleWidth(440),
    height: scaleHeight(48),
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderRightWidth: scaleWidth(1),
    borderLeftWidth: scaleWidth(1),
    borderColor: "#dddddd",
    alignItems: "center",
    paddingHorizontal: scaleWidth(16),
    justifyContent: "space-between",
  },

  itemSeparator: {
    backgroundColor: "#dddddd",
    height: scaleHeight(1),
  },

  itemText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  imageStyle: {
    width: scaleWidth(200),
    height: scaleHeight(200),
  },

  content: { flex: 1 },

  line: {
    height: 1,
    backgroundColor: "#dddddd",
  },

  buttonSize: {
    backgroundColor: colors.WHITE,
  },

  selectBorder: {
    borderStyle: "solid",
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
    minWidth: scaleWidth(48),
    height: scaleHeight(32),
    marginRight: scaleWidth(15),
    marginBottom: scaleWidth(15),
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scaleWidth(6),
  },

  disabled: { opacity: 0.4 },
});
