export const PRODUCT_SET = "detail-product-set";
export const PRODUCT_UPDATE = "detail-product-update";
export const PRODUCT_UPDATE_OPTIONS = "product-update-options";
export const PRODUCT_ADD_OPTION = "product-add-options";
export const PRODUCT_REMOVE_OPTION = "product-remove-options";

const initState = {};

export const productReducer = (state = initState, action) => {
  switch (action.type) {
    case PRODUCT_SET:
      if (action.payload) {
        const { items } = action.payload;
        if (items) {
          const arr = [...items];
          arr?.sort((a, b) => a.position - b.position);
          return Object.assign({}, action.payload, { items: arr });
        }
        return action.payload;
      }
      return action.payload;
    case PRODUCT_UPDATE:
      return Object.assign({}, state, action.payload);

    case PRODUCT_ADD_OPTION:
      const mergeOptions =
        state?.options?.length > 0
          ? state?.options.concat(action.payload)
          : action.payload;

      return Object.assign({}, state, { options: mergeOptions });

    case PRODUCT_REMOVE_OPTION:
      const filterOptions = state?.options.filter(
        (opt) => opt.attributeId !== action.payload?.attributeId
      );
      return Object.assign({}, state, { options: filterOptions });

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

      return Object.assign({}, state, { options: options });
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
