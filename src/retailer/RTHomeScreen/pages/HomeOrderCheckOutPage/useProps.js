import NavigationServices from "@navigators/NavigatorServices";
import { basketRetailer, appMerchant } from "@redux/slices";
import {
  useCreateAppointment,
  useCreateAppointmentTemp,
  useGetCategoriesList,
  useGetProductsByCategory,
  useAddItemAppointment,
  useGetAppointmentTemp,
  useRemoveItemAppointment,
  useGetProductsByBarcode,
  useGetLayout,
  useUpdateAppointmentCustomer,
  useUpdateAppointmentTempCustomer,
} from "@shared/services/api/retailer";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CUSTOM_LIST_TYPES } from "../../widget";
import {
  calcTotalPriceOfProduct,
  createSubmitAppointment,
} from "@shared/utils";
import {
  BIRTH_DAY_DATE_FORMAT_STRING,
  statusSuccess,
  dateToString,
  PRODUCT_VISIBLE_TYPE,
} from "@shared/utils";

const log = (obj, message = "") => {
  Logger.log(`[CheckOutTabPage > useProps] ${message}`, obj);
};

export const useProps = ({
  params: { reload, isOrder = false },
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
  const appointment = useSelector((state) => state.basketRetailer.appointment);

  const [activeTab, setActiveTab] = React.useState(CUSTOM_LIST_TYPES.CAT);
  const [categoryId, setCategoryId] = React.useState(null);
  const [subCategoryId, setSubCategoryId] = React.useState(null);
  const [productId, setProductId] = React.useState(null);
  const [categories, setCategories] = React.useState(null);
  const [subCategories, setSubCategories] = React.useState(null);
  const [products, setProducts] = React.useState(null);
  // const [products, setProducts] = React.useState(basketProducts);

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
  const [appointmentAdd, addItemAppointment] = useAddItemAppointment();
  const [, getAppointmentTemp] = useGetAppointmentTemp();
  const [appointmentTempRemove, removeItemAppointment] =
    useRemoveItemAppointment();
  const [productItemGet, getProductsByBarcode] = useGetProductsByBarcode();
  const [categoriesLabel, getCategoriesLabel] = useGetLayout();
  const [categoriesLabelData, setCategoriesLabelData] = React.useState({});
  // const [updateAppointmentCustomerData, updateAppointmentCustomer] =
  //   useUpdateAppointmentCustomer();
  const [updateAppointmentTempCustomerData, updateAppointmentTempCustomer] =
    useUpdateAppointmentTempCustomer();

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

  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      resetAll();
      getCategoriesList({ groupSubIntoMain: true });
      
      dispatch(basketRetailer.clearBasket());
      // customerRef.current?.showPhoneInput();

      getCategoriesLabel();
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {});

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  // React.useEffect(() => {
  //   if (basketProducts?.length > 0 && !customer) {
  //     customerRef.current?.showPhoneInput();
  //   }
  // }, [basketProducts]);

  // React.useEffect(() => {
  //   if (customer) {
  //     customerRef.current?.showPhoneInput();
  //   }
  // }, [basketProducts]);

  // React.useEffect(() => {
  //   if (basketProducts?.length > 0 && customer && !appointment) {
  //     const submitProducts = createSubmitAppointment(basketProducts);
  //     createAppointmentTemp({
  //       customerId: customer?.customerId,
  //       purchasePoint: getPurchasePoint(),
  //       products: submitProducts,
  //     });
  //   }
  // }, [basketProducts, customer, appointment]);

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
      appointmentTempCreate || appointmentAdd || {};

    if (statusSuccess(codeStatus)) {
      dispatch(basketRetailer.setAppointmentId(data));
      getAppointmentTemp(data);
    }
  }, [appointmentTempCreate, appointmentAdd]);

  React.useEffect(() => {
    const { codeStatus, message, data } =
      appointmentAdd ||
      appointmentTempRemove ||
      updateAppointmentTempCustomerData ||
      {};
    if (statusSuccess(codeStatus)) {
      getAppointmentTemp(appointmentId);
    }
  }, [
    appointmentAdd,
    appointmentTempRemove,
    updateAppointmentTempCustomerData,
  ]);

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentCreate || {};
    if (statusSuccess(codeStatus)) {
      if (isOrder) {
        NavigationServices.navigate("retailer.home.order.detail", {
          orderId: data,
        });
      } else {
        NavigationServices.navigate("retailer.home.order.pay", {
          appointmentId: data,
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
    if (!customer || !appointmentId) {
      return;
    }

    updateAppointmentTempCustomer(
      { customerId: customer.customerId },
      appointmentId
    );
  }, [customer, appointmentId]);

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
    onHadSubmitted: (productValue) => {
      createAppointment(appointmentId);
      dispatch(basketRetailer.clearBasket());
      resetAll();
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

      if (appointmentId) {
        addItemAppointment(submitProducts[0]);
      } else {
        if (!appointment) {
          createAppointmentTemp({
            customerId: customer?.customerId,
            purchasePoint: getPurchasePoint(),
            products: submitProducts,
          });
        }
      }
    },
    appointment,
    onRemoveItem: (item) => {
      removeItemAppointment(item?.bookingProductId);
    },
    customer,
    onResultScanCode: (data) => {
      // getProductsByBarcode("8934588063060");
      if (data) getProductsByBarcode(data);
    },
    categoriesLabelData,
  };
};
