import NavigationServices from "@navigators/NavigatorServices";
import { useFocusEffect } from "@react-navigation/native";
import {
  useGetProductsList,
  useRestockProducts,
  useExportProducts,
} from "@shared/services/api/retailer";
import { NEED_TO_ORDER, statusSuccess } from "@shared/utils/app";

import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const DEFAULT_PAGE = 1;

export const useProps = ({ params: { reload } }) => {
  const { t } = useTranslation();
  const exportRef = React.useRef(null);
  const needToOrderRef = React.useRef(null);
  const categories = useSelector(
    (state) => state.inventoryRetailer?.categories
  );
  const merchant = useSelector((state) => state.dataLocal.profile);
  const [searchVal, setSearchVal] = React.useState();
  const [category, setCategory] = React.useState(-1);
  const [needToOrder, setNeedToOrder] = React.useState(NEED_TO_ORDER[0].value);
  const [page, setPage] = React.useState(DEFAULT_PAGE);
  const [itemSelected, setItemSelected] = React.useState(null);
  const [items, setItems] = React.useState(null);
  const [pagination, setPagination] = React.useState({
    pages: 0,
    count: 0,
  });
  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [productListData, getInventoryList] = useGetProductsList();
  const callGetProductList = React.useCallback(() => {
    getInventoryList({
      key: searchVal ?? "",
      page: page,
      sort: {},
      ...((category >= 0 || needToOrder) && {
        filters: {
          ...(category >= 0 && { categoryId: category }),
          ...(needToOrder && { needToOrder }),
        },
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, page, needToOrder, searchVal, productsRestock?.data]);
  const [productsRestock, restockProducts] = useRestockProducts();

  /**
  |--------------------------------------------------
  |  API EXPORT
  |--------------------------------------------------
  */
  const [productsExport, exportProducts] = useExportProducts();
  const callExportProduct = (values) => {
    const params = Object.assign({}, values, {
      merchantId: merchant?.merchantId,
      key: searchVal ?? "",
      page: page,
      sort: {},
      ...((category >= 0 || needToOrder) && {
        filters: {
          ...(category >= 0 && { categoryId: category }),
          ...(needToOrder && { needToOrder }),
        },
      }),
    });
    exportProducts(params);
  };

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */
  React.useEffect(() => {
    const { codeStatus, data, pages = 0, count = 0 } = productListData || {};
    if (statusSuccess(codeStatus)) {
      setItems(data);
      setPagination({
        pages,
        count,
      });
    }
  }, [productListData]);

  React.useEffect(() => {
    const { codeStatus, data } = productsExport || {};
    if (statusSuccess(codeStatus)) {
      exportRef.current?.onCreateFile(data?.path);
    }
  }, [productsExport]);

  React.useEffect(() => {
    callGetProductList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    callGetProductList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, page, searchVal, needToOrder, productsRestock?.data]);

  useFocusEffect(
    React.useCallback(() => {
      if (reload) callGetProductList();
    }, [reload])
  );

  const onChangeValueSearch = (text) => {
    setSearchVal(text);
  };

  const onButtonSearchPress = () => {
    callGetProductList();
  };

  const onCheckedRow = (item, selected) => {
    const cloneList =
      itemSelected?.filter((v) => v.productId !== item.productId) || [];
    if (selected) {
      setItemSelected([...cloneList, item]);
    } else {
      setItemSelected(cloneList);
    }
  };

  return {
    items,
    onButtonNewProductPress: () => {
      NavigationServices.navigate("retailer.inventory.product.edit", {
        isNew: true,
      });
    },
    onEditProduct: (item) => {
      NavigationServices.navigate("retailer.inventory.product.edit", {
        isEdit: true,
        item,
      });
    },
    onLoadProductDetail: ({ item }) => {
      NavigationServices.navigate("retailer.inventory.product.detail", {
        item,
      });
    },
    needToOrderRef,
    categories: categories
      ? [
          { value: -1, label: "All Categories" },
          ...categories?.map((x) => ({
            value: x.categoryId,
            label: x.name,
          })),
        ]
      : [{ value: -1, label: "All Categories" }],
    onChangeValueSearch,
    onButtonSearchPress,
    category,
    setCategory,
    needToOrder,
    setNeedToOrder,
    onSubmitRestock: (value, reason = t("New stock")) => {
      if (itemSelected?.length > 0) {
        const productIds = itemSelected.map((v) => v.productId);
        restockProducts({
          ids: productIds,
          quantity: value || 0,
          reason: reason,
        });
      }
    },
    onCheckedRow,
    onRefresh: () => callGetProductList(),
    callExportProduct,
    exportRef,
    setPage,
    DEFAULT_PAGE,
    pagination
  };
};