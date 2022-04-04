import actions from "@actions";
import PrintManager from "@lib/PrintManager";
import NavigationServices from "@navigators/NavigatorServices";
import { useFocusEffect } from "@react-navigation/native";
import { basketRetailer } from "@redux/slices";
import {
  useAddItemAppointmentTemp,
  useAppointmentAddGiftCard,
  useAppointmentAddItem,
  useAppointmentRemoveGiftCard,
  useAppointmentRemoveItem,
  useAppointmentTempAddGiftCard,
  useAppointmentTempRemoveGiftCard,
  useAppointmentTempUpdateItem,
  useAppointmentUpdateItem,
  useCreateAppointment,
  useCreateAppointmentTemp,
  useGetAppointment,
  useGetAppointmentTemp,
  useGetCategoriesList,
  useGetLayout,
  useGetProductsByBarcode,
  useGetProductsByCategory,
  useGetProductsList,
  useRemoveItemAppointmentTemp,
  useUpdateAppointmentCustomer,
  useUpdateAppointmentTempCustomer,
} from "@shared/services/api/retailer";
import {
  createSubmitAppointment,
  PURCHASE_POINTS_ORDER,
  PURCHASE_POINTS_STORE,
  statusSuccess,
} from "@shared/utils";
import { getInfoFromModelNameOfPrinter } from "@utils";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CUSTOM_LIST_TYPES } from "../../widget";

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
  const popupEnterAmountGiftCardRef = React.useRef(null);
  const editProductItemRef = React.useRef(null);
  const inputSearchRef = React.useRef(null);
  const inputBarcodeDialogRef = React.useRef(null);

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
  const { isCheckQty = false } =
    useSelector((state) => state.dataLocal.profile) || {};
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
  const [searchData, setSearchData] = React.useState(null);
  const [searchVal, setSearchVal] = React.useState();
  const [scanCodeTemp, setScanCodeTemp] = React.useState(null);
  const [visiblePopupGiftCard, setVisiblePopupGiftCard] = React.useState(false);

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
  const [productItemByBarcodeGet, getProductsByBarcode] =
    useGetProductsByBarcode();
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
  const [appointmentGiftCardAdd, addAppointmentGiftCard] =
    useAppointmentAddGiftCard();
  const [appointmentTempGiftCardAdd, addAppointmentTempGiftCard] =
    useAppointmentTempAddGiftCard();
  const [appointmentGiftCardRemove, removeAppointmentGiftCard] =
    useAppointmentRemoveGiftCard();
  const [appointmentTempGiftCardRemove, removeAppointmentTempGiftCard] =
    useAppointmentTempRemoveGiftCard();

  const [productListData, getInventoryList] = useGetProductsList();
  const callGetProductList = React.useCallback(() => {
    getInventoryList({
      key: searchVal ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVal]);

  const [appointmentProductItemUpdate, appointmentUpdateProductItem] =
    useAppointmentUpdateItem();

  const [appointmentTempProductItemUpdate, appointmentTempUpdateProductItem] =
    useAppointmentTempUpdateItem();
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
    setSearchData(null);
  };

  const reloadAll = () => {
    getCategoriesList({ groupSubIntoMain: true });
    getCategoriesLabel();
  };

  const openCashDrawer = async () => {
    const { portName } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );

    if (portName) {
      await PrintManager.getInstance().openCashDrawer(portName);
    } else {
      setTimeout(() => {
        alert("Please connect to your cash drawer.");
      }, 700);
    }
  };

  const addProductToBasket = (productItem) => {
    inputSearchRef.current?.reset();
    const submitProducts = createSubmitAppointment([productItem]);

    if (appointmentTempId) {
      const findItem = appointmentTemp?.products?.find(
        (x) =>
          x.productQuantityId === productItem.productQuantityId ||
          (productItem?.quantities?.length <= 0 &&
            x.productId === productItem.productId)
      );

      if (findItem) {
        appointmentTempUpdateProductItem(
          appointmentTempId,
          findItem?.bookingProductId,
          {
            quantity:
              parseInt(findItem?.quantity) + parseInt(productItem?.quantity),
          }
        );
      } else {
        addItemAppointmentTemp(submitProducts[0]);
      }
    } else {
      if (!appointment) {
        createAppointmentTemp({
          customerId: customer?.customerId,
          purchasePoint,
          products: submitProducts,
        });
      } else {
        const findItem = appointment?.products?.find(
          (x) =>
            x.productQuantityId === productItem.productQuantityId ||
            (productItem?.quantities?.length <= 0 &&
              x.productId === productItem.productId)
        );
        if (findItem) {
          appointmentUpdateProductItem(
            appointmentId,
            findItem?.bookingProductId,
            { quantity: findItem?.quantity + productItem?.quantity }
          );
        } else {
          // add item to appointment
          addAppointmentItem(submitProducts[0]);
        }
      }
    }
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
        dispatch(basketRetailer.clearBasket());
      }
    }, [purchasePoint, appointment])
  );

  React.useEffect(() => {
    const { codeStatus, data } = productListData || {};
    if (statusSuccess(codeStatus)) {
      setSearchData(data?.filter((x) => x.visibility !== "web"));

      if (data?.length > 0) {
        setCategoryId(null);
        setSubCategories(null);
        setSubCategoryId(null);
        setActiveTab(CUSTOM_LIST_TYPES.PRO);
        setProducts(data);
        // !![feature] check if product trả về 1 item và tìm value search là 1 barcode và có trong sp con thì add luôn vào bastket
      } else {
        setSearchData(null);
        setProducts(null);
        if (activeTab === CUSTOM_LIST_TYPES.PRO) {
          setActiveTab(CUSTOM_LIST_TYPES.CAT);
        }

        //!![feature] Toast message no product found here!
      }

      inputSearchRef?.current.reset();
    }
  }, [productListData]);

  React.useEffect(() => {
    if (searchVal) callGetProductList();
    else {
      setSearchData(null);
      setProducts(null);
      if (activeTab === CUSTOM_LIST_TYPES.PRO) {
        setActiveTab(CUSTOM_LIST_TYPES.CAT);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVal]);

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
    const { codeStatus, message, data } = productsList || {};
    if (data) {
      setActiveTab(CUSTOM_LIST_TYPES.PRO);
      setProducts(
        productsList?.data?.filter((product) => product.visibility !== "web")
      );
    } else if (codeStatus === 7) {
      alert(message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsList]);

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
      appointmentTempItemAdd ||
      updateAppointmentTempCustomerData ||
      appointmentTempGiftCardAdd ||
      appointmentTempProductItemUpdate ||
      {};
    if (statusSuccess(codeStatus)) {
      getAppointmentTemp(appointmentTempId);
    }
  }, [
    appointmentTempItemAdd,
    updateAppointmentTempCustomerData,
    appointmentTempGiftCardAdd,
    appointmentTempProductItemUpdate,
  ]);

  React.useEffect(() => {
    const { codeStatus, message, data } =
      appointmentTempItemRemove || appointmentTempGiftCardRemove || {};
    if (statusSuccess(codeStatus)) {
      getAppointmentTemp(appointmentTempId);
      if (removeItemWaitingList?.length > 0) {
        setRemoveItemWaitingList(removeItemWaitingList.slice(1));
      }
    }
  }, [appointmentTempItemRemove, appointmentTempGiftCardRemove]);

  /**
   * Add/Remove item in appointment  effects
   * Update customer in appointment  effects
   */
  React.useEffect(() => {
    const { codeStatus } =
      appointmentItemAdd ||
      updateAppointmentCustomerData ||
      appointmentGiftCardAdd ||
      appointmentProductItemUpdate ||
      {};
    if (statusSuccess(codeStatus)) {
      if (appointmentId) getAppointment(appointmentId);
    }
  }, [
    appointmentItemAdd,
    updateAppointmentCustomerData,
    appointmentGiftCardAdd,
    appointmentProductItemUpdate,
  ]);

  React.useEffect(() => {
    const { codeStatus, message, data } =
      appointmentItemRemove || appointmentGiftCardRemove || {};
    if (statusSuccess(codeStatus)) {
      if (appointmentId) getAppointment(appointmentId);
      if (removeItemWaitingList?.length > 0) {
        setRemoveItemWaitingList(removeItemWaitingList.slice(1));
      }
    }
  }, [appointmentItemRemove, appointmentGiftCardRemove]);

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
    const { codeStatus, data } = appointmentCreate || {};
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

  // React.useEffect(() => {
  //   const { codeStatus, message, data } = productItemGet || {};
  //   if (statusSuccess(codeStatus)) {
  //     setTimeout(() => {
  //       productDetailRef.current?.show(data, scanCodeTemp);
  //       setScanCodeTemp(null);
  //     }, 100);
  //   }
  // }, [productItemGet]);

  React.useEffect(() => {
    if (!productItemByBarcodeGet?.data) return;

    const { codeStatus, data, message } = productItemByBarcodeGet?.data || {};
    if (statusSuccess(codeStatus)) {
      const tmp = data?.quantities?.find((x) => x.barCode === scanCodeTemp);

      if (tmp) {
        const attributeIds = tmp.attributeIds;

        const filterOptions = data?.options?.map((v) => {
          let temp = v?.values.filter((i) =>
            attributeIds.includes(i.attributeValueId)
          );
          const { values, ...pro } = v;
          return Object.assign({}, pro, { values: temp });
        });

        if (!isCheckQty || tmp.quantity >= 1) {
          setTimeout(() => {
            addProductToBasket(
              Object.assign({}, data, {
                id: Date.now(),
                quantity: 1,
                options: filterOptions,
                productQuantityId: tmp?.id,
              })
            );
          }, 100);
        } else {
          alert("Product is out of stock!");
        }
        setScanCodeTemp(null);
      } else {
        if (data?.quantities?.length > 0) {
          setTimeout(() => {
            productDetailRef.current?.show(data);
          }, 350);
        } else {
          if (!isCheckQty || data?.quantity >= 1) {
            setTimeout(() => {
              addProductToBasket(
                Object.assign({}, data, {
                  id: Date.now(),
                  quantity: 1,
                })
              );
            }, 100);
          } else {
            alert("Product is out of stock!");
          }

          setScanCodeTemp(null);
        }
      }

      // Hide dialog input barcode if it is showing
    } else if (codeStatus) {
      //  TODO: show input code here!
      alert(message);
      setScanCodeTemp(null);
    }
  }, [productItemByBarcodeGet?.data]);

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
      if (removeItem?.bookingProductId) {
        removeItemAppointmentTemp(removeItem?.bookingProductId);
      }

      if (removeItem?.bookingGiftCardId) {
        removeAppointmentTempGiftCard(removeItem?.bookingGiftCardId);
      }
    } else if (appointmentId) {
      if (removeItem?.bookingProductId) {
        removeAppointmentItem(removeItem?.bookingProductId);
      }

      if (removeItem?.bookingGiftCardId) {
        removeAppointmentGiftCard(removeItem?.bookingGiftCardId);
      }
    }
  }, [removeItemWaitingList]);

  return {
    inputBarcodeDialogRef,
    categories: categories,
    subCategories: subCategories,
    products: products,
    activeTab,
    visiblePopupGiftCard,
    appointment: appointmentTemp ?? appointment,
    categoryId,
    subCategoryId,
    selectedProductId,
    productDetailRef,
    basketRef,
    customerRef,
    customer,
    categoriesLabelData,
    purchasePoint,
    activeGiftCardRef,
    modalBillRef,
    popupEnterAmountGiftCardRef,
    searchProducts: productListData,
    editProductItemRef,
    inputSearchRef,
    getProductLoading: productItemByBarcodeGet?.loading,
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
      setSearchVal(null);
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
      inputSearchRef.current?.reset();

      productDetailRef.current?.show(productItem);
    },
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
    isCanGoBack: () => {
      return navigation.canGoBack();
    },
    onRefreshCategory: () => {
      getCategoriesList({ groupSubIntoMain: true });
    },
    onAddProduct: addProductToBasket,
    onRemoveItem: (removeItem) => {
      if (appointmentTempId) {
        if (removeItem?.bookingProductId) {
          removeItemAppointmentTemp(removeItem?.bookingProductId);
        }

        if (removeItem?.bookingGiftCardId) {
          removeAppointmentTempGiftCard(removeItem?.bookingGiftCardId);
        }
      } else if (appointmentId) {
        if (removeItem?.bookingProductId) {
          removeAppointmentItem(removeItem?.bookingProductId);
        }

        if (removeItem?.bookingGiftCardId) {
          removeAppointmentGiftCard(removeItem?.bookingGiftCardId);
        }
      }
    },
    onResultScanCode: (data) => {
      if (data?.trim()) {
        const code = data?.trim();
        setScanCodeTemp(code);
        getProductsByBarcode(code);
      } else {
        setTimeout(() => {
          alert(`Code input invalid ${data}`);
        }, 100);
      }
    },
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
    onSelectGiftCard: async () => {
      await activeGiftCardRef.current?.setStateFromParent();
      // await dispatch(actions.appointment.handleVisibleActiveGiftCard());
      setVisiblePopupGiftCard(true);
      setCategoryId(1);
      setActiveTab(CUSTOM_LIST_TYPES.CAT);
      setSubCategories(null);
      setSubCategoryId(null);
      setProducts(null);
    },
    onRequestCloseBillModal: () => {},
    closePopupActiveGiftCard: () => {
      // dispatch(actions.appointment.handleVisibleActiveGiftCard(false));
      setVisiblePopupGiftCard(false);
      setCategoryId(null);
      setActiveTab(CUSTOM_LIST_TYPES.CAT);
      setSubCategories(null);
      setSubCategoryId(null);
      setProducts(null);
    },
    submitSerialCode: async (code) => {
      // add giftcard to appointment
      setVisiblePopupGiftCard(false);

      await dispatch(
        actions.appointment.checkSerialNumber(code, false, false, false)
      );
    },
    onAddGiftCardToAppointment: (money, gitCardInfo) => {
      const giftCard = {
        Price: money,
        GiftCardId: gitCardInfo?.giftCardId,
      };

      if (appointmentTempId) {
        addAppointmentTempGiftCard(giftCard);
      } else if (appointmentId) {
        addAppointmentGiftCard(giftCard);
      } else {
        createAppointmentTemp({
          customerId: customer?.customerId,
          purchasePoint,
          giftCards: [
            {
              price: money,
              giftcardId: gitCardInfo?.giftCardId,
            },
          ],
        });
      }
    },
    onButtonSearchPress: (searchValue) => {
      console.log(searchValue);
    },
    onChangeValueSearch: (searchValue) => {
      setSearchVal(searchValue);
    },
    onShowDialogEditProductItem: (proItem) => {
      editProductItemRef.current?.show(proItem);
    },
    onSubmitEditProductItem: (proItem, params) => {
      if (appointmentTempId) {
        appointmentTempUpdateProductItem(
          appointmentTempId,
          proItem?.bookingProductId,
          params
        );
      } else {
        appointmentUpdateProductItem(
          appointmentId,
          proItem?.bookingProductId,
          params
        );
      }
    },
    clearBasket: () => {
      dispatch(basketRetailer.clearBasket());
    },
  };
};
