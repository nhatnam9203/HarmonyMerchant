import NavigationServices from "@navigators/NavigatorServices";
import { basketRetailer, appMerchant } from "@redux/slices";
import {
  useAddItemAppointmentTemp,
  useCreateAppointment,
  useCreateAppointmentTemp,
  useGetAppointmentTemp,
  useGetCategoriesList,
  useGetProductsByBarcode,
  useGetLayout,
  useUpdateAppointmentCustomer,
  useGetProductsByCategory,
  useRemoveItemAppointmentTemp,
  useUpdateAppointmentTempCustomer,
  useAppointmentAddItem,
  useAppointmentRemoveItem,
  useGetAppointment,
} from "@shared/services/api/retailer";
import { createSubmitAppointment, statusSuccess } from "@shared/utils";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CUSTOM_LIST_TYPES } from "../../widget";
import { useFocusEffect } from "@react-navigation/native";

const log = (obj, message = "") => {
  Logger.log(`[CheckOutTabPage > useProps] ${message}`, obj);
};

export const useProps = ({
  params: { reload, isOrder = false, reset, reloadAppointmentId },
  navigation,
}) => {
  const productDetailRef = React.useRef(null);
  const basketRef = React.useRef(null);
  const customerRef = React.useRef(null);
  const dispatch = useDispatch();

  const customer = useSelector((state) => state.basketRetailer.customer);
  // const basketProducts = useSelector((state) => state.basketRetailer.products);

  const appointmentId = useSelector(
    (state) => state.basketRetailer.appointmentId
  );

  const appointmentTempId = useSelector(
    (state) => state.basketRetailer.appointmentTempId
  );

  const appointment = useSelector((state) => state.basketRetailer.appointment);

  const [activeTab, setActiveTab] = React.useState(CUSTOM_LIST_TYPES.CAT);
  const [categoryId, setCategoryId] = React.useState(null);
  const [subCategoryId, setSubCategoryId] = React.useState(null);
  const [productId, setProductId] = React.useState(null);
  const [categories, setCategories] = React.useState(null);
  const [subCategories, setSubCategories] = React.useState(null);
  const [products, setProducts] = React.useState(null);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [categoriesList, getCategoriesList] = useGetCategoriesList();
  const [productsList, getProductsByCategory] = useGetProductsByCategory();
  const [appointmentTempCreate, createAppointmentTemp] =
    useCreateAppointmentTemp();
  const [appointmentCreate, createAppointment] = useCreateAppointment();
  const [appointmentTempItemAdd, addItemAppointmentTemp] =
    useAddItemAppointmentTemp();
  const [, getAppointmentTemp] = useGetAppointmentTemp();
  const [appointmentTempItemRemove, removeItemAppointmentTemp] =
    useRemoveItemAppointmentTemp();
  const [productItemGet, getProductsByBarcode] = useGetProductsByBarcode();
  const [categoriesLabel, getCategoriesLabel] = useGetLayout();
  const [categoriesLabelData, setCategoriesLabelData] = React.useState({});
  // const [updateAppointmentCustomerData, updateAppointmentCustomer] =
  //   useUpdateAppointmentCustomer();
  const [updateAppointmentCustomerData, updateAppointmentCustomer] =
    useUpdateAppointmentCustomer();
  const [updateAppointmentTempCustomerData, updateAppointmentTempCustomer] =
    useUpdateAppointmentTempCustomer();
  const [appointmentItemAdd, addAppointmentItem] = useAppointmentAddItem();
  const [appointmentItemRemove, removeAppointmentItem] =
    useAppointmentRemoveItem();
  const [appointmentGet, getAppointment] = useGetAppointment();

  const resetAll = () => {
    setCategoryId(null);
    setActiveTab(CUSTOM_LIST_TYPES.CAT);
    setSubCategoryId(null);
    setSubCategories(null);
    setProducts(null);
  };

  const getPurchasePoint = () => {
    if (isOrder) return "CallOrder";
    return "Store";
  };

  /** useEffect */
  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      resetAll();
      getCategoriesList({ groupSubIntoMain: true });
      // dispatch(basketRetailer.clearBasket());
      // customerRef.current?.showPhoneInput();

      getCategoriesLabel();
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {});

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      console.log(reset);
      console.log(reload);
      console.log(reloadAppointmentId);

      if (reset) {
        dispatch(basketRetailer.clearBasket());
        resetAll();
        getCategoriesList({ groupSubIntoMain: true });
      } else if (reload) {
        if (reloadAppointmentId) getAppointment(reloadAppointmentId);
      }
    }, [reload, reset, reloadAppointmentId])
  );

  React.useEffect(() => {
    if (categoriesList?.data) {
      setActiveTab(CUSTOM_LIST_TYPES.CAT);
      setCategories(categoriesList?.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesList?.data]);

  React.useEffect(() => {
    if (productsList?.data) {
      setActiveTab(CUSTOM_LIST_TYPES.PRO);
      setProducts(
        productsList?.data?.filter((product) => product.visibility !== "web")
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsList?.data]);

  React.useEffect(() => {
    const { codeStatus, message, data } =
      appointmentTempCreate || appointmentTempItemAdd || {};

    if (statusSuccess(codeStatus)) {
      dispatch(basketRetailer.setAppointmentTempId(data));
      getAppointmentTemp(data);
    }
  }, [appointmentTempCreate, appointmentTempItemAdd]);

  React.useEffect(() => {
    const { codeStatus, message, data } =
      appointmentTempItemAdd ||
      appointmentTempItemRemove ||
      updateAppointmentTempCustomerData ||
      {};
    if (statusSuccess(codeStatus)) {
      getAppointmentTemp(appointmentTempId);
    }
  }, [
    appointmentTempItemAdd,
    appointmentTempItemRemove,
    updateAppointmentTempCustomerData,
  ]);

  React.useEffect(() => {
    const { codeStatus, message, data } =
      appointmentItemAdd ||
      appointmentItemRemove ||
      updateAppointmentCustomerData ||
      {};
    if (statusSuccess(codeStatus)) {
      getAppointment(appointmentId);
    }
  }, [
    appointmentItemAdd,
    appointmentItemRemove,
    updateAppointmentCustomerData,
  ]);

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentGet || {};
    if (statusSuccess(codeStatus)) {
      dispatch(basketRetailer.setAppointment(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentGet]);

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentCreate || {};
    if (statusSuccess(codeStatus)) {
      dispatch(basketRetailer.setAppointmentId(data));

      if (isOrder) {
        NavigationServices.navigate("retailer.home.order.detail", {
          orderId: data,
          screenId: "retailer.home.order.list",
          backScreenId: "retailer.home.order.check_out",
        });
      } else {
        NavigationServices.navigate("retailer.home.order.pay", {
          appointmentId: data,
          screenId: "retailer.home.order.check_out",
          backScreenId: "retailer.home.order.check_out",
        });
      }
    }
  }, [appointmentCreate]);

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentTempCreate || {};
    if (statusSuccess(codeStatus)) {
      getAppointmentTemp(data);
    }
  }, [appointmentTempCreate]);

  React.useEffect(() => {
    const { codeStatus, message, data } = productItemGet || {};
    if (statusSuccess(codeStatus)) {
      productDetailRef.current?.show(data);
    }
  }, [productItemGet]);

  React.useEffect(() => {
    const { codeStatus, data } = categoriesLabel || {};
    if (statusSuccess(codeStatus)) {
      setCategoriesLabelData(data);
    }
  }, [categoriesLabel]);

  React.useEffect(() => {
    // Effect use  update customer for appointment
    if (!customer) {
      return;
    }

    if (appointmentId) {
      updateAppointmentCustomer(
        { customerId: customer.customerId },
        appointmentId
      );
    } else if (appointmentTempId) {
      updateAppointmentTempCustomer(
        { customerId: customer.customerId },
        appointmentTempId
      );
    }
  }, [customer, appointmentTempId, appointmentId]);

  return {
    categories: categories,
    subCategories: subCategories,
    products: products,
    activeTab,
    onPressCategoryItem: (categoryItem) => {
      if (!categoryItem) {
        return;
      }

      if (categoryItem?.categoryId === categoryId) {
        setCategoryId(null);
        setActiveTab(CUSTOM_LIST_TYPES.CAT);
        setSubCategories(null);
      } else {
        setCategoryId(categoryItem?.categoryId);
        setActiveTab(CUSTOM_LIST_TYPES.SUB);
        setSubCategories(categoryItem?.subCategories);
      }

      setSubCategoryId(null);
      setProducts(null);
    },
    onPressSubCategoryItem: (subCategoryItem) => {
      if (!subCategoryItem) {
        return;
      }

      if (subCategoryItem?.categoryId === subCategoryId) {
        setSubCategoryId(null);
        setActiveTab(CUSTOM_LIST_TYPES.SUB);
        setProducts(null);
      } else {
        setSubCategoryId(subCategoryItem?.categoryId);
        getProductsByCategory(subCategoryItem?.categoryId);
      }
    },
    onPressProductItem: (productItem) => {
      if (!productItem) {
        return;
      }

      productDetailRef.current?.show(productItem);
    },
    categoryId,
    subCategoryId,
    productId,
    productDetailRef,
    basketRef,
    onHadSubmitted: () => {
      if (appointmentTempId) {
        createAppointment(appointmentTempId);
        resetAll();
      } else if (appointmentId) {
        if (appointment?.purchasePoint === "CallOrder") {
          NavigationServices.navigate("retailer.home.order.detail", {
            orderId: appointmentId,
            screenId: "retailer.home.order.list",
            backScreenId: "retailer.home.order.check_out",
          });
        } else {
          NavigationServices.navigate("retailer.home.order.pay", {
            appointmentId: appointmentId,
            screenId: "retailer.home.order.check_out",
            backScreenId: "retailer.home.order.check_out",
          });
        }
      }
    },
    onGoBack: () => {
      NavigationServices.navigate("retailer.home.order.list", {});
    },
    customerRef,
    onRefreshCategory: () => {
      getCategoriesList({ groupSubIntoMain: true });
    },
    onAddProduct: (productItem) => {
      const submitProducts = createSubmitAppointment([productItem]);

      if (appointmentTempId) {
        addItemAppointmentTemp(submitProducts[0]);
      } else {
        if (!appointment) {
          createAppointmentTemp({
            customerId: customer?.customerId,
            purchasePoint: getPurchasePoint(),
            products: submitProducts,
          });
        } else {
          // add item to appointment
          addAppointmentItem(submitProducts[0]);
        }
      }
    },
    appointment,
    onRemoveItem: (item) => {
      if (appointmentTempId) {
        removeItemAppointmentTemp(item?.bookingProductId);
      } else if (appointmentId) {
        removeAppointmentItem(item?.bookingProductId);
      }
    },
    customer,
    onResultScanCode: (data) => {
      // getProductsByBarcode("8936101342225");
      if (data) getProductsByBarcode(data);
    },
    categoriesLabelData,
    isOrder,
  };
};
