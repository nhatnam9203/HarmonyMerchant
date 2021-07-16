import NavigationServices from "@navigators/NavigatorServices";
import { basketRetailer } from "@redux/slices";
import {
  useCreateAppointment,
  useCreateAppointmentTemp,
  useGetCategoriesList,
  useGetProductsByCategory,
  useAddItemAppointment,
  useGetAppointmentTemp,
  useRemoveItemAppointment,
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
  const basketProducts = useSelector((state) => state.basketRetailer.products);
  // const purchasePoint = useSelector(
  //   (state) => state.basketRetailer.purchasePoint
  // );
  const appointmentId = useSelector(
    (state) => state.basketRetailer.appointmentId
  );
  const hasSubmit = useSelector((state) => state.basketRetailer.hasSubmit);
  const appointment = useSelector((state) => state.basketRetailer.appointment);

  const [activeTab, setActiveTab] = React.useState(CUSTOM_LIST_TYPES.CAT);
  const [categoryId, setCategoryId] = React.useState(null);
  const [subCategoryId, setSubCategoryId] = React.useState(null);
  const [productId, setProductId] = React.useState(null);
  const [categories, setCategories] = React.useState(null);
  const [subCategories, setSubCategories] = React.useState(null);
  const [products, setProducts] = React.useState(basketProducts);
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
  const [appointmentTempGet, getAppointmentTemp] = useGetAppointmentTemp();
  const [appointmentTempRemove, removeItemAppointment] =
    useRemoveItemAppointment();

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
      if (!customer) {
        customerRef.current?.showPhoneInput();
      }
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {});

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  React.useEffect(() => {
    if (basketProducts?.length > 0 && !customer) {
      customerRef.current?.showPhoneInput();
    }
  }, [basketProducts]);

  React.useEffect(() => {
    if (customer) {
      customerRef.current?.showPhoneInput();
    }
  }, [basketProducts]);

  React.useEffect(() => {
    if (basketProducts?.length > 0 && customer && !appointment) {
      const submitProducts = createSubmitAppointment(basketProducts);
      createAppointmentTemp({
        customerId: customer?.customerId,
        purchasePoint: getPurchasePoint(),
        products: submitProducts,
      });
    }
  }, [basketProducts, customer, appointment]);

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
      setProducts(productsList?.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsList?.data]);

  React.useEffect(() => {
    const { codeStatus, message, data } =
      appointmentTempCreate || appointmentAdd || {};
    if (statusSuccess(codeStatus)) {
      if (hasSubmit) {
        createAppointment(data);
      } else {
        dispatch(basketRetailer.setAppointmentId(data));
        getAppointmentTemp(data);
      }
    }
  }, [appointmentTempCreate, appointmentAdd]);

  React.useEffect(() => {
    const { codeStatus, message, data } =
      appointmentAdd || appointmentTempRemove || {};
    if (statusSuccess(codeStatus)) {
      getAppointmentTemp(appointmentId);
    }
  }, [appointmentAdd, appointmentTempRemove]);

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
      if (customer?.customerId) {
        createAppointment(appointmentId);

        dispatch(basketRetailer.clearBasket());
        resetAll();
      } else if (!customer?.customerId) {
        // !! show dialog input customer
        customerRef.current?.showPhoneInput();
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

      if (appointmentId) {
        addItemAppointment(submitProducts[0]);
      } else {
        if (!customer) {
          customerRef.current?.showPhoneInput();
          return;
        }

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
  };
};
