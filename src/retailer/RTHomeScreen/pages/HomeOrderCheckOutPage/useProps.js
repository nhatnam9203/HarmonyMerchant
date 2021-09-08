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
import {
  createSubmitAppointment,
  statusSuccess,
  PURCHASE_POINTS_STORE,
  PURCHASE_POINTS_ORDER,
} from "@shared/utils";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CUSTOM_LIST_TYPES } from "../../widget";
import { useFocusEffect } from "@react-navigation/native";
import { getInfoFromModelNameOfPrinter, formatWithMoment } from "@utils";
import PrintManager from "@lib/PrintManager";
import actions from "@actions";
import Configs from "@configs";

const log = (obj, message = "") => {
  Logger.log(`[CheckOutTabPage > useProps] ${message}`, obj);
};

export const useProps = ({
  params: { purchasePoint = PURCHASE_POINTS_STORE },
  navigation,
}) => {
  /**
  |--------------------------------------------------
  | CONSTANTS
  |--------------------------------------------------
  */
  const dispatch = useDispatch();

  const productDetailRef = React.useRef(null);
  const basketRef = React.useRef(null);
  const customerRef = React.useRef(null);
  const activeGiftCardRef = React.useRef(null);
  const modalBillRef = React.useRef(null);

  /**
  |--------------------------------------------------
  | REDUX variables
  |--------------------------------------------------
  */
  const customer = useSelector((state) => state.basketRetailer.customer);
  const appointmentId = useSelector(
    (state) => state.basketRetailer.appointmentId
  );
  const appointmentTempId = useSelector(
    (state) => state.basketRetailer.appointmentTempId
  );
  const appointment = useSelector((state) => state.basketRetailer.appointment);
  const appointmentTemp = useSelector(
    (state) => state.basketRetailer.appointmentTemp
  );
  const printerList = useSelector((state) => state.dataLocal.printerList);
  const printerSelect = useSelector((state) => state.dataLocal.printerSelect);
  const blockAppointments = useSelector(
    (state) => state.appointment.blockAppointments
  );
  const profileStaffLogin = useSelector(
    (state) => state.dataLocal.profileStaffLogin
  );
  const profile = useSelector((state) => state.dataLocal.profile);

  /**
  |--------------------------------------------------
  | STATE variables
  |--------------------------------------------------
  */
  const [activeTab, setActiveTab] = React.useState(CUSTOM_LIST_TYPES.CAT);
  const [categoryId, setCategoryId] = React.useState(null);
  const [subCategoryId, setSubCategoryId] = React.useState(null);
  const [selectedProductId, setSelectedProductId] = React.useState(null);
  const [categories, setCategories] = React.useState(null);
  const [subCategories, setSubCategories] = React.useState(null);
  const [products, setProducts] = React.useState(null);
  const [removeItemWaitingList, setRemoveItemWaitingList] = React.useState([]);

  /**
  |--------------------------------------------------
  | API Hooks
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
  const [updateAppointmentCustomerData, updateAppointmentCustomer] =
    useUpdateAppointmentCustomer();
  const [updateAppointmentTempCustomerData, updateAppointmentTempCustomer] =
    useUpdateAppointmentTempCustomer();
  const [appointmentItemAdd, addAppointmentItem] = useAppointmentAddItem();
  const [appointmentItemRemove, removeAppointmentItem] =
    useAppointmentRemoveItem();
  const [appointmentGet, getAppointment] = useGetAppointment();

  /**
  |--------------------------------------------------
  | Functional
  |--------------------------------------------------
  */

  const resetAll = async () => {
    setCategoryId(null);
    setActiveTab(CUSTOM_LIST_TYPES.CAT);
    setSubCategoryId(null);
    setSubCategories(null);
    setProducts(null);
  };

  const reloadAll = () => {
    getCategoriesList({ groupSubIntoMain: true });
    getCategoriesLabel();
  };

  const openCashDrawer = async (portName) => {
    await PrintManager.getInstance().openCashDrawer(portName);
  };

  /**
  |--------------------------------------------------
  | EFFECTS
  |--------------------------------------------------
  */

  /** FOCUS component */
  useFocusEffect(
    React.useCallback(() => {
      resetAll();
      reloadAll();

      if (
        appointment?.purchasePoint &&
        appointment.purchasePoint !== purchasePoint
      ) {
        console.log(purchasePoint);
        console.log(appointment);

        dispatch(basketRetailer.clearBasket());
      }
    }, [purchasePoint, appointment])
  );

  // React.useEffect(() => {
  //   const unsubscribeFocus = navigation.addListener("focus", () => {
  //     reloadAll();
  //   });

  //   const unsubscribeBlur = navigation.addListener("blur", () => {});

  //   return () => {
  //     unsubscribeFocus();
  //     unsubscribeBlur();
  //   };
  // }, [navigation]);

  /**
   * GET Categories effects
   */
  React.useEffect(() => {
    if (categoriesList?.data) {
      setActiveTab(CUSTOM_LIST_TYPES.CAT);
      setCategories(categoriesList?.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesList?.data]);

  /**
   * GET Products effects
   */
  React.useEffect(() => {
    if (productsList?.data) {
      setActiveTab(CUSTOM_LIST_TYPES.PRO);
      setProducts(
        productsList?.data?.filter((product) => product.visibility !== "web")
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsList?.data]);

  /**
   * Create appointment temp effects
   */
  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentTempCreate || {};

    if (statusSuccess(codeStatus)) {
      dispatch(basketRetailer.setAppointmentTempId(data));
      getAppointmentTemp(data);
    }
  }, [appointmentTempCreate]);

  /**
   * Add/Remove item in appointment temp effects
   * Update customer in appointment temp effects
   */
  React.useEffect(() => {
    const { codeStatus, message, data } =
      appointmentTempItemAdd || updateAppointmentTempCustomerData || {};
    if (statusSuccess(codeStatus)) {
      getAppointmentTemp(appointmentTempId);
    }
  }, [appointmentTempItemAdd, updateAppointmentTempCustomerData]);

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentTempItemRemove || {};
    if (statusSuccess(codeStatus)) {
      getAppointmentTemp(appointmentTempId);
      if (removeItemWaitingList?.length > 0) {
        setRemoveItemWaitingList(removeItemWaitingList.slice(1));
      }
    }
  }, [appointmentTempItemRemove]);

  /**
   * Add/Remove item in appointment  effects
   * Update customer in appointment  effects
   */
  React.useEffect(() => {
    const { codeStatus, message, data } =
      appointmentItemAdd || updateAppointmentCustomerData || {};
    if (statusSuccess(codeStatus)) {
      getAppointment(appointmentId);
    }
  }, [appointmentItemAdd, updateAppointmentCustomerData]);

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentItemRemove || {};
    if (statusSuccess(codeStatus)) {
      getAppointment(appointmentId);
      if (removeItemWaitingList?.length > 0) {
        setRemoveItemWaitingList(removeItemWaitingList.slice(1));
      }
    }
  }, [appointmentItemRemove]);

  /**
   * GET appointment effects
   */
  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentGet || {};
    if (statusSuccess(codeStatus)) {
      dispatch(basketRetailer.setAppointment(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentGet]);

  /**
   * CREATE appointment effects
   */
  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentCreate || {};
    if (statusSuccess(codeStatus)) {
      dispatch(basketRetailer.setAppointmentId(data));

      if (purchasePoint === PURCHASE_POINTS_ORDER) {
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

  /**
   * CREATE appointment TEMP effects
   */
  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentTempCreate || {};
    if (statusSuccess(codeStatus)) {
      getAppointmentTemp(data);
    }
  }, [appointmentTempCreate]);

  /**
   * GET product item effects
   */
  React.useEffect(() => {
    const { codeStatus, message, data } = productItemGet || {};
    if (statusSuccess(codeStatus)) {
      setTimeout(() => {
        productDetailRef.current?.show(data);
      }, 100);
    }
  }, [productItemGet]);

  /**
   * UPDATE category label effects
   */
  React.useEffect(() => {
    const { codeStatus, data } = categoriesLabel || {};
    if (statusSuccess(codeStatus)) {
      setCategoriesLabelData(data);
    }
  }, [categoriesLabel]);

  /**
   * Call update customer effects
   */
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

  React.useEffect(() => {
    if (removeItemWaitingList?.length <= 0) {
      return;
    }

    const removeItem = removeItemWaitingList[0];
    if (appointmentTempId) {
      removeItemAppointmentTemp(removeItem?.bookingProductId);
    } else if (appointmentId) {
      removeAppointmentItem(removeItem?.bookingProductId);
    }
  }, [removeItemWaitingList]);

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
    selectedProductId,
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
            purchasePoint,
            products: submitProducts,
          });
        } else {
          // add item to appointment
          addAppointmentItem(submitProducts[0]);
        }
      }
    },
    appointment: appointmentTemp ?? appointment,
    onRemoveItem: (items) => {
      if (items?.length > 0) {
        let clonePendingList = [...removeItemWaitingList];

        clonePendingList = clonePendingList.concat(items);

        setRemoveItemWaitingList(clonePendingList);
      }
    },
    customer,
    onResultScanCode: (data) => {
      // getProductsByBarcode(data ?? "8936101342225");
      if (!!data) getProductsByBarcode(data.trim());
      else {
        setTimeout(() => {
          alert(`No products with ${data}`);
        }, 100);
      }
    },
    categoriesLabelData,
    purchasePoint,
    checkStatusCashier: async () => {
      const { portName } = getInfoFromModelNameOfPrinter(
        printerList,
        printerSelect
      );
      if (portName) {
        openCashDrawer(portName);
      } else {
        alert("Please connect to your cash drawer.");
      }
    },
    onSelectGiftCard: () => {
      activeGiftCardRef.current?.setStateFromParent();
      dispatch(actions.appointment.handleVisibleActiveGiftCard());
      setCategoryId(1);
      setActiveTab(CUSTOM_LIST_TYPES.CAT);
      setSubCategories(null);
      setSubCategoryId(null);
      setProducts(null);
    },
    activeGiftCardRef,
    modalBillRef,
    closePopupActiveGiftCard: () => {
      dispatch(actions.appointment.handleVisibleActiveGiftCard(false));
      setCategoryId(null);
      setActiveTab(CUSTOM_LIST_TYPES.CAT);
      setSubCategories(null);
      setSubCategoryId(null);
      setProducts(null);
    },
    submitSerialCode: (code) => {
      if (blockAppointments.length > 0) {
        // this.addGiftCardIntoBlockAppointment(code);
        return;
      }

      const bodyAction = {
        merchantId: profile.merchantId,
        userId: customer?.userId || 0,
        status: "checkin",
        services: [],
        extras: [],
        products: [],
        fromTime: formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A"),
        staffId: profileStaffLogin?.staffId || 0,
        // customDiscountFixed: customDiscountFixedLocal,
        // customDiscountPercent: customDiscountPercentLocal,
        firstName: customer?.firstName || "",
        lastName: customer?.lastName || "",
        phoneNumber: customer?.phone || "",
        customerId: customer?.customerId || 0,
      };

      const optionAction = {
        method: "POST",
        token: true,
        api: `${Configs.API_URL}appointment`,
        isLoading: true,
        paidAmount: 0,
        creditCardInfo: false,
        merchantId: profile.merchantId,
        isPayment: false,
      };

      dispatch(
        actions.appointment.checkSerialNumber(code, bodyAction, optionAction)
      );
    },
  };
};
