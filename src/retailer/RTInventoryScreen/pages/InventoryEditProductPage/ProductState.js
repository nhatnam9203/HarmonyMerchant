import actions from "@actions";
import { arrayIsEqual } from "@shared/utils";

export const PRODUCT_SET = "detail-product-set";
export const PRODUCT_UPDATE = "detail-product-update";
export const PRODUCT_UPDATE_OPTIONS = "product-update-options";
export const PRODUCT_CHANGE_OPTIONS = "product-change-options";
export const PRODUCT_ADD_OPTION = "product-add-options";
export const PRODUCT_REMOVE_OPTION = "product-remove-options";
export const PRODUCT_SET_OPTION_QTY = "product-set-options_qty";
export const PRODUCT_UPDATE_OPTION_QTY = "product-update-options_qty";
export const PRODUCT_UPDATE_NAME = "product-update-name";
export const PRODUCT_UPDATE_ATTRIBUTE = "product-update-attribute";
export const PRODUCT_REMOVE_VERSION = "product-remove-version";
export const GENERATE_PRODUCT_VERSION = "product-generate-version";
export const PRODUCT_CREATE_VERSION = "product-create-version";
export const PRODUCT_CHECK_VERSION = "product-check-version";

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
    if (!accumulator || accumulator?.length <= 0)
      return createOptionsValuesQty(
        currentValue?.values?.filter((x) => x.checked)
      );

    return combineOptionsValuesQty(
      accumulator,
      currentValue?.values?.filter((x) => x.checked)
    );
  }, []);

  return quantities?.map((quantity) =>
    Object.assign({}, quantity, {
      label: `${product?.name ?? "New product"} - ${quantity.label ?? ""}`,
      price: product?.price,
    })
  );
};

const createVersionFromItems = (product, items) => {
  const item = items?.reduce((accumulator, currentValue, index) => {
    return Object.assign({}, accumulator, {
      label: accumulator?.label
        ? `${accumulator.label ?? ""} - ${currentValue.label ?? ""}`
        : currentValue.label,
      attributeIds: [
        ...(accumulator.attributeIds || []),
        currentValue.attributeValueId,
      ],
    });
  }, {});

  return {
    label: `${product?.name ?? "New product"} - ${item.label ?? ""}`,
    price: item?.price,
    attributeIds: item.attributeIds,
  };
};

export const productReducer = (state = initState, action) => {
  switch (action.type) {
    case PRODUCT_SET:
      const product = action.payload;
      const list =
        product?.quantities?.map((x, index) =>
          Object.assign({}, x, { position: index })
        ) || [];

      return Object.assign({}, product, { quantities: list });
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

    case PRODUCT_CHANGE_OPTIONS:
      //!! dùng cho trường hợp cập nhật option bắt buộc renderer lại list versions
      const optionsItem = action.payload;

      let changeOpt = state?.options?.find(
        (x) => x.attributeId === optionsItem.attributeId
      );
      if (changeOpt) {
        changeOpt = Object.assign({}, changeOpt, {
          values: action.payload?.values,
        });
      } else {
        changeOpt = optionsItem;
      }

      const replaceIndex = state?.options?.findIndex(
        (x) => x.attributeId === changeOpt.attributeId
      );

      let options = state?.options;
      if (replaceIndex >= 0) {
        options[replaceIndex] = changeOpt;
      }

      const oldList = state?.quantities || [];

      let newList = createQuantitiesItem(state, options)?.map((x) => {
        const isExistItem = oldList?.find((f) =>
          arrayIsEqual(f?.attributeIds, x?.attributeIds)
        );

        if (isExistItem) {
          return Object.assign({}, x, {
            needToOrder: isExistItem.needToOrder,
            quantity: isExistItem.quantity,
            tempQuantity: isExistItem.tempQuantity,
            description: isExistItem.description,
            costPrice: isExistItem.costPrice,
            price: isExistItem.price,
            sku: isExistItem.sku,
            imageUrl: isExistItem.imageUrl,
            fileId: isExistItem.fileId,
            position: isExistItem.position ?? 0,
            id: isExistItem.id ?? 0,
          });
        }
        return x;
      });

      return Object.assign({}, state, {
        options: options,
        quantities: newList?.sort((a, b) => a.position - b.position),
      });
    case PRODUCT_UPDATE_OPTIONS:
      const opt = action.payload;

      let optUpdate = state?.options?.find(
        (x) => x.attributeId === opt.attributeId
      );
      if (optUpdate) {
        optUpdate = Object.assign({}, optUpdate, {
          values: action.payload?.values,
        });
      } else {
        optUpdate = opt;
      }

      const replaceOptIdx = state?.options?.findIndex(
        (x) => x.attributeId === optUpdate.attributeId
      );

      let optionsUpdate = state?.options;
      if (replaceOptIdx >= 0) {
        optionsUpdate[replaceOptIdx] = optUpdate;
      }

      return Object.assign({}, state, {
        options: optionsUpdate,
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

      if (key === "barCode") {
        return Object.assign({}, state, {
          barCode: value,
        });
      }
      return state;
    case PRODUCT_REMOVE_VERSION:
      const qtyItem = action.payload;
      const arr = state?.quantities?.filter(
        (f) => !arrayIsEqual(f?.attributeIds, qtyItem?.attributeIds)
      );
      return Object.assign({}, state, { quantities: arr });
    case GENERATE_PRODUCT_VERSION:
      let optionsList = state?.options;
      const quantityList = state?.quantities || [];

      let generateList = createQuantitiesItem(state, optionsList)?.map((x) => {
        const isExistItem = quantityList?.find((f) =>
          arrayIsEqual(f?.attributeIds, x?.attributeIds)
        );

        if (isExistItem) {
          return Object.assign({}, x, {
            needToOrder: isExistItem.needToOrder,
            quantity: isExistItem.quantity,
            tempQuantity: isExistItem.tempQuantity,
            description: isExistItem.description,
            costPrice: isExistItem.costPrice,
            price: isExistItem.price,
            sku: isExistItem.sku,
            imageUrl: isExistItem.imageUrl,
            fileId: isExistItem.fileId,
            position: isExistItem.position ?? 0,
            id: isExistItem.id ?? 0,
          });
        }
        return x;
      });

      return Object.assign({}, state, {
        quantities: generateList?.sort((a, b) => a.position - b.position),
      });
    case PRODUCT_CREATE_VERSION:
      let newQuantityList =
        state?.quantities?.length > 0 ? [...state?.quantities] : [];
      let temp = createVersionFromItems(state, action.payload);
      const isExistIndex = newQuantityList?.findIndex((f) =>
        arrayIsEqual(f?.attributeIds, temp?.attributeIds)
      );

      if (isExistIndex >= 0) {
        const isExistItem = newQuantityList[isExistIndex];
        temp = Object.assign({}, temp, {
          needToOrder: isExistItem.needToOrder,
          quantity: isExistItem.quantity,
          tempQuantity: isExistItem.tempQuantity,
          description: isExistItem.description,
          costPrice: isExistItem.costPrice,
          price: isExistItem.price,
          sku: isExistItem.sku,
          imageUrl: isExistItem.imageUrl,
          fileId: isExistItem.fileId,
          position: isExistItem.position ?? 0,
          id: isExistItem.id ?? 0,
        });

        newQuantityList[isExistIndex] = temp;
      } else {
        newQuantityList.push(temp);
      }

      return Object.assign({}, state, {
        quantities: newQuantityList,
        itemIsExisted: false,
        itemIsGenerated: temp,
      });

    case PRODUCT_CHECK_VERSION:
      let checkQuantities =
        state?.quantities?.length > 0 ? [...state?.quantities] : [];
      const listAttributeValueIds = action.payload?.map(
        (x) => x.attributeValueId
      );
      const findExistIndex = checkQuantities?.findIndex((f) =>
        arrayIsEqual(f?.attributeIds, listAttributeValueIds)
      );

      return Object.assign({}, state, {
        itemIsExisted: findExistIndex >= 0,
      });
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

export const changeOption = (optionsItem) => {
  return {
    type: PRODUCT_CHANGE_OPTIONS,
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

export const deleteProductVersion = (item) => {
  return {
    type: PRODUCT_REMOVE_VERSION,
    payload: item,
  };
};

export const generateProductVersion = () => {
  return {
    type: GENERATE_PRODUCT_VERSION,
  };
};

export const createProductVersion = (arrayOptions) => {
  return {
    type: PRODUCT_CREATE_VERSION,
    payload: arrayOptions,
  };
};

export const checkProductVersion = (arrayOptions) => {
  return {
    type: PRODUCT_CHECK_VERSION,
    payload: arrayOptions,
  };
};
