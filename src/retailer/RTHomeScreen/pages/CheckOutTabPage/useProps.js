import NavigationServices from "@navigators/NavigatorServices";
import { basketRetailer } from "@redux/slices";
import {
  useCreateAppointment,
  useCreateAppointmentTemp,
  useGetCategoriesList,
  useGetProductsByCategory,
} from "@shared/services/api/retailer";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CUSTOM_LIST_TYPES } from "../../widget";

const log = (obj, message = "") => {
  Logger.log(`[CheckOutTabPage > useProps] ${message}`, obj);
};

export const useProps = ({ params: { reload }, navigation }) => {
  const productDetailRef = React.useRef(null);
  const basketRef = React.useRef(null);
  const customerRef = React.useRef(null);
  const dispatch = useDispatch();

  const customer = useSelector((state) => state.basketRetailer.customer);

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

  const resetAll = () => {
    setCategoryId(null);
    setActiveTab(CUSTOM_LIST_TYPES.CAT);
    setSubCategories(null);
    setSubCategoryId(null);
    setProducts(null);
  };

  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      getCategoriesList({ groupSubIntoMain: true });
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {});

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  React.useEffect(() => {
    // getCategoriesList({ groupSubIntoMain: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (appointmentTempCreate?.data) {
      createAppointment(appointmentTempCreate?.data);
    }
  }, [appointmentTempCreate?.data]);

  React.useEffect(() => {
    if (appointmentCreate?.data) {
      NavigationServices.navigate("retailer.home.order.detail", {
        orderId: appointmentCreate?.data,
      });
    }
  }, [appointmentCreate?.data]);

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
        createAppointmentTemp({
          customerId: customer?.customerId,
          purchasePoint: "Store",
          products: productValue,
        });

        dispatch(basketRetailer.clearBasket());

        resetAll();
      } else {
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
  };
};
