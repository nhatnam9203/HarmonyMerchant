import actions from "../../../../redux/actions";
import { arrayIsEqual } from "@shared/utils";

export const PRODUCT_SET = "detail-product-set";
export const PRODUCT_UPDATE = "detail-product-update";
export const PRODUCT_UPDATE_OPTIONS = "product-update-options";
export const PRODUCT_ADD_OPTION = "product-add-options";
export const PRODUCT_REMOVE_OPTION = "product-remove-options";
export const PRODUCT_SET_OPTION_QTY = "product-set-options_qty";
export const PRODUCT_UPDATE_OPTION_QTY = "product-update-options_qty";
export const PRODUCT_UPDATE_NAME = "product-update-name";
export const PRODUCT_UPDATE_ATTRIBUTE = "product-update-attribute";

const initState = {};

/**
 * Tạo một list quantities cho product  từ vaules của option đầu tiền
 * @param {*} optionValues options values của option đầu tiên
 * @returns quantities list
 */
const createOptionsValuesQty = (optionValues) => {
  if (!optionValues || optionValues?.length <= 0) return null;

  return optionValues?.map((item) => ({
    id: 0,
    label: item.label,
    attributeIds: [item.attributeValueId],
    quantity: 0,
    costPrice: 0,
    additionalPrice: 0,
  }));
};

/**
 * Append Options Values của options trong mảng vào
 * @param {*} qtyArr : mảng options quantities , not null
 * @param {*} optionValues : options values th, not null
 * @returns quantities list
 */
const combineOptionsValuesQty = (qtyArr, optionValues) => {
  if (!qtyArr || !optionValues || optionValues?.length <= 0) return qtyArr;

  var resultArray = [];

  for (var i = 0; i < optionValues?.length; i++) {
    const item = optionValues[i];

    const qtyArrOfOptions = qtyArr?.map((x) =>
      Object.assign({}, x, {
        label: `${x.label ?? ""} - ${item.label ?? ""}`,
        attributeIds: [...x.attributeIds, item.attributeValueId],
      })
    );

    resultArray = resultArray.concat(qtyArrOfOptions);
  }

  return resultArray;
};

const createQuantitiesItem = (product, options) => {
  if (!options || options?.length < 0) return null;

  const quantities = options?.reduce((accumulator, currentValue, index) => {
    if (index === 0) return createOptionsValuesQty(currentValue?.values);

    return combineOptionsValuesQty(accumulator, currentValue?.values);
  }, []);

  return quantities?.map((quantity) =>
    Object.assign({}, quantity, {
      label: `${product?.name ?? "New product"} - ${quantity.label ?? ""}`,
    })
  );
};

export const productReducer = (state = initState, action) => {
  switch (action.type) {
    case PRODUCT_SET:
      return action.payload;
    case PRODUCT_UPDATE:
      return Object.assign({}, state, action.payload);

    case PRODUCT_ADD_OPTION:
      const mergeOptions =
        state?.options?.length > 0
          ? state?.options.concat(action.payload)
          : action.payload;

      return Object.assign({}, state, {
        options: mergeOptions,
        quantities: createQuantitiesItem(state, mergeOptions),
      });

    case PRODUCT_REMOVE_OPTION:
      const filterOptions = state?.options?.filter(
        (opt) => opt.attributeId !== action.payload?.attributeId
      );
      return Object.assign({}, state, {
        options: filterOptions,
        quantities: createQuantitiesItem(state, filterOptions),
      });

    case PRODUCT_UPDATE_OPTIONS:
      const optionsItem = action.payload;
      const values = action.payload?.values;

      let updateOption = state?.options?.find(
        (x) => x.attributeId === optionsItem.attributeId
      );
      if (updateOption) {
        updateOption = Object.assign({}, updateOption, { values });
      } else {
        updateOption = optionsItem;
      }

      const replaceIndex = state?.options?.findIndex(
        (x) => x.attributeId === updateOption.attributeId
      );

      let options = state?.options;
      if (replaceIndex >= 0) {
        options[replaceIndex] = updateOption;
      }

      const oldList = state?.quantities || [];

      let newList = createQuantitiesItem(state, options)?.map((x) => {
        const isExistItem = oldList?.find((f) =>
          arrayIsEqual(f?.attributeIds, x?.attributeIds)
        );

        if (isExistItem) {
          // console.log(isExistItem);
          return Object.assign({}, x, {
            quantity: isExistItem.quantity,
            costPrice: isExistItem.costPrice,
            additionalPrice: isExistItem.additionalPrice,
          });
        }
        return x;
      });

      return Object.assign({}, state, {
        options: options,
        quantities: newList,
      });
    case PRODUCT_SET_OPTION_QTY:
      return Object.assign({}, state, { quantities: actions.payload });
    case PRODUCT_UPDATE_OPTION_QTY:
      const optionsQtyItem = action.payload;
      let quantities = state?.quantities;

      const replaceIdx = quantities?.findIndex(
        (x) => x.label === optionsQtyItem.label
      );

      if (replaceIdx >= 0) {
        const oldItem = quantities[replaceIdx];
        quantities[replaceIdx] = Object.assign({}, optionsQtyItem, {
          id: oldItem?.id,
        });
      }

      return Object.assign({}, state, { quantities: quantities });
    case PRODUCT_UPDATE_NAME:
      const quantitiesUpdateName = createQuantitiesItem(
        state,
        state?.options
      )?.map((x) => {
        const isExistItem = state?.quantities?.find((f) =>
          arrayIsEqual(f?.attributeIds, x?.attributeIds)
        );

        if (isExistItem) {
          return Object.assign({}, x, {
            quantity: isExistItem.quantity,
            costPrice: isExistItem.costPrice,
            additionalPrice: isExistItem.additionalPrice,
          });
        }
        return x;
      });

      return Object.assign({}, state, {
        name: action.payload,
        quantities: quantitiesUpdateName,
      });

    case PRODUCT_UPDATE_ATTRIBUTE:
      const { key, value } = action.payload;
      if (key === "description") {
        return Object.assign({}, state, {
          description: value,
        });
      }
      return state;
    default:
      break;
  }
};

export const setProduct = (item) => {
  return {
    type: PRODUCT_SET,
    payload: item,
  };
};

export const updateProduct = (item) => {
  return {
    type: PRODUCT_UPDATE,
    payload: item,
  };
};

export const updateOption = (optionsItem) => {
  return {
    type: PRODUCT_UPDATE_OPTIONS,
    payload: optionsItem,
  };
};

export const addOption = (optionsItem) => {
  return {
    type: PRODUCT_ADD_OPTION,
    payload: optionsItem,
  };
};

export const removeOption = (optionsItem) => {
  return {
    type: PRODUCT_REMOVE_OPTION,
    payload: optionsItem,
  };
};

export const updateOptionsQty = (optionsQtyItem) => {
  return {
    type: PRODUCT_UPDATE_OPTION_QTY,
    payload: optionsQtyItem,
  };
};

export const changeProductName = (productName) => {
  return {
    type: PRODUCT_UPDATE_NAME,
    payload: productName,
  };
};
export const changeProductAttribute = (key, value) => {
  return {
    type: PRODUCT_UPDATE_ATTRIBUTE,
    payload: { key: key, value: value },
  };
};
