import Configs from "@configs";

export const getTerminalIds = () => {
  return [
    { label: "SUPPORT ONLY", value: "SUPPORT ONLY" },
    { label: "Terminal 1 (MAIN)", value: "Terminal 1 (MAIN)" },
    { label: "Terminal 2", value: "Terminal 2" },
    { label: "Terminal 3", value: "Terminal 3" },
    { label: "Terminal 4", value: "Terminal 4" },
    { label: "Terminal 5", value: "Terminal 5" },
    { label: "Terminal 6", value: "Terminal 6" },
    { label: "Terminal 7", value: "Terminal 7" },
    { label: "Terminal 8", value: "Terminal 8" },
    { label: "Terminal 9", value: "Terminal 9" },
    { label: "Terminal 10", value: "Terminal 10" },
    { label: "Terminal 11", value: "Terminal 11" },
    { label: "Terminal 12", value: "Terminal 12" },
    { label: "Terminal 13", value: "Terminal 13" },
    { label: "Terminal 14", value: "Terminal 14" },
    { label: "Terminal 15", value: "Terminal 15" },
    { label: "Terminal 16", value: "Terminal 16" },
    { label: "Terminal 17", value: "Terminal 17" },
    { label: "Terminal 18", value: "Terminal 18" },
    { label: "Terminal 19", value: "Terminal 19" },
    { label: "Terminal 20", value: "Terminal 20" },
    { label: "Terminal 21", value: "Terminal 21" },
    { label: "Terminal 22", value: "Terminal 22" },
    { label: "Terminal 23", value: "Terminal 23" },
    { label: "Terminal 24", value: "Terminal 24" },
    { label: "Terminal 25", value: "Terminal 25" },
    { label: "Terminal 26", value: "Terminal 26" },
    { label: "Terminal 27", value: "Terminal 27" },
    { label: "Terminal 28", value: "Terminal 28" },
    { label: "Terminal 29", value: "Terminal 29" },
    { label: "Terminal 30", value: "Terminal 30" },
  ];
};

export const isDevelopmentMode =
  Configs.ENV !== "Production" && __DEV__ && Configs.REACTOTRON;

const CodeStatus = {
  success: ["Success", "1", 1],
};

export const statusSuccess = (code) => CodeStatus.success.includes(code);

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const CustomerGroupTypes = [
  { label: "All", value: -1 },
  { label: "Normal", value: 0 },
  { label: "Vip", value: 1 },
  { label: "Blacklist", value: 2 },
];

export const INPUT_TYPE = {
  DROP_DOWN: "Dropdown",
  TEXT_SWATCH: "Textswatch",
  VISUAL_SWATCH: "Visualswatch",
};

export const VIP_TYPE = {
  ALL: -1,
  NORMAL: 0,
  VIP: 1,
  BLACK_LIST: 2,
};

export const AttributesInputTypes = [
  { label: "Dropdown", value: INPUT_TYPE.DROP_DOWN },
  { label: "Text swatch", value: INPUT_TYPE.TEXT_SWATCH },
  { label: "Visual swatch", value: INPUT_TYPE.VISUAL_SWATCH },
];

export const SORT_TYPE = {
  ASC: "asc",
  DESC: "desc",
};

export const NEED_TO_ORDER = [
  { label: "None", value: null },
  { label: "> 0", value: 0 },
  { label: "> 10", value: 10 },
  { label: "> 50", value: 50 },
  { label: ">100", value: 100 },
];

export const calcTotalPriceOfOption = (options) => {
  return options?.reduce((accumulator, currentItem) => {
    const totalValueAdd = currentItem?.values?.reduce(
      (acc, curr) => acc + curr.valueAdd,
      0
    );

    return accumulator + totalValueAdd;
  }, 0);
};

export const calcTotalPriceOfProduct = (product) => {
  if (!product) {
    return 0;
  }
  let price = product.price;
  price += calcTotalPriceOfOption(product.options);
  return parseFloat(price);
};

export const createSubmitAppointment = (products) => {
  return products?.map((product) => ({
    productId: product.productId,
    quantity: product.quantity,
    options: product.options?.map((option) => {
      if (option?.values?.length > 0) {
        return {
          productAttributeId: option?.values[0]?.productAttributeId,
          productAttributeValueId: option?.values[0]?.attributeValueId,
        };
      }
      return {};
    }),
  }));
};

export const getFullName = (customer) => {
  return `${customer.firstName} ${customer.lastName}`;
};

export const SHIPPING_CARRIER = [
  { label: "USPS", value: "USPS" },
  { label: "UPS", value: "UPS" },
  { label: "Fexdex", value: "Fexdex" },
  { label: "DHL", value: "DHL" },
  { label: "Other", value: "Other" },
];

export const STORE_PICKUPS = [{ label: "Store pickup", value: 0 }];

export const FLAT_RATE_SHIPPING = [
  { label: "1 - 2 days", value: 5 },
  { label: "2 - 4 days", value: 10 },
  { label: "5 - 10 days", value: 15 },
];

export const FREE_SHIPPING = [{ label: "Free shipping", value: 0 }];

export const PURCHASE_POINTS = [
  {
    label: "All Point",
    value: "",
  },
  {
    label: "Store",
    value: "Store",
  },
  {
    label: "Website",
    value: "Website",
  },
  {
    label: "PhoneCall",
    value: "PhoneCall",
  },
];

export const PAYMENTS = [
  {
    label: "All Payment",
    value: "",
  },
  {
    label: "HarmonyPay",
    value: "HarmonyPay",
  },
  {
    label: "Gift Card",
    value: "Gift Card",
  },
  {
    label: "Credit Card",
    value: "Credit Card",
  },
  {
    label: "Cash",
    value: "Cash",
  },
  {
    label: "Other",
    value: "Other",
  },
];

export const ORDER_STATUS = [
  {
    label: "All Status",
    value: "",
  },
  {
    label: "Canceled",
    value: "Canceled",
  },
  {
    label: "Completed",
    value: "Completed",
  },
  {
    label: "Pending",
    value: "Pending",
  },
  {
    label: "Processing",
    value: "Processing",
  },
  {
    label: "Shipped",
    value: "Shipped",
  },
  {
    label: "Returned",
    value: "Returned",
  },
];
