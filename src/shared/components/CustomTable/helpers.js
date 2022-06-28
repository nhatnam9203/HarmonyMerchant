export const getUniqueId = (key, index, defaultPrefix = "key") =>
  defaultPrefix + key + "-index" + index;

export const SORT_TYPE = {
  ASC: "asc",
  DESC: "desc",
};

export const getValueForColumnKey = (item, colKey, index) => {
  if (!item) return "";

  if (!colKey || colKey.length <= 0) {
    return `${item[0]}-${index}`;
  }
  return `${item[colKey]}-${index}`;
};

export const TABLE_SPECIAL_KEYS = {
  ACTION: "actions",
};
