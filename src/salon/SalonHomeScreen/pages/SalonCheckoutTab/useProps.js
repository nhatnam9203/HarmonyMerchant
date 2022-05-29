import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as CheckoutState from "./SalonCheckoutState";
import { useCallApis } from "./useCallApis";
import { useFocusEffect } from "@react-navigation/native";
import _ from "lodash";
import {
  getArrayProductsFromAppointment,
  getArrayServicesFromAppointment,
  getArrayExtrasFromAppointment,
  formatNumberFromCurrency,
  getStaffInfoById,
  formatWithMoment,
  getInfoFromModelNameOfPrinter,
  getArrayGiftCardsFromAppointment,
  requestAPI,
  localize,
  REMOTE_APP_ID,
  APP_NAME,
  POS_SERIAL,
  PaymentTerminalType,
  requestTransactionDejavoo,
  requestPreviousTransactionReportDejavoo,
  stringIsEmptyOrWhiteSpaces,
  handleResponseDejavoo,
} from "@utils";
import actions from "@actions";

export const useProps = ({ props }) => {
  const dispatch = useDispatch();

  const categoriesRef = React.useRef(null);
  const amountRef = React.useRef(null);
  const popupAddItemIntoAppointmentsRef = React.useRef(null);
  const modalBillRef = React.useRef(null);
  const blockAppointmentRef = React.useRef(null);
  const changePriceAmountProductRef = React.useRef(null);
  const popupDiscountRef = React.useRef(null);
  const popupDiscountLocalRef = React.useRef(null);
  const popupCheckDiscountPermissionRef = React.useRef(null);
  const changeTipRef = React.useRef(null);

  const {
    customerInfoBuyAppointment,
    groupAppointment,
    paymentDetailInfo,
    blockAppointments,
    isBookingFromCalendar,
    isDonePayment,
    staffListCurrentDate,
    bookingGroupId,
    fromTimeBlockAppointment,
    isOpenBlockAppointmentId,
  } = useSelector((state) => state.appointment);

  const categoriesByMerchant = useSelector(
    (state) => state.category.categoriesByMerchant
  );
  const { profileStaffLogin, profile } =
    useSelector((state) => state.dataLocal) || {};
  const isOfflineMode = useSelector((state) => state.network?.isOfflineMode);
  const extrasByMerchant = useSelector((state) => state.extra.extrasByMerchant);
  const { customService, servicesByMerchant } =
    useSelector((state) => state.service) || {};
  const { productsByMerchantId } = useSelector((state) => state.product) || {};
  const { connectionSignalR } = useSelector((state) => state.appointment) || {};

  const [stateLocal, dispatchLocal] = React.useReducer(
    CheckoutState.reducer,
    CheckoutState.initState
  );

  const {
    isGetCategoriesByStaff,
    getCategoriesByStaff,
    isGetServiceByStaff,
    getServiceByStaff,
    isGetProductByStaff,
    getProductByStaff,
  } = useCallApis({
    dispatchLocal,
  });

  const setSelectStaffFromCalendar = (staffId, isFirstPressCheckout = null) => {
    if (!staffId) return;
    dispatchLocal(CheckoutState.setSelectStaffFromCalendar(staffId));
    categoriesRef.current?.scrollFlatListToStaffIndex(
      staffId,
      isFirstPressCheckout
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      if (profileStaffLogin?.staffId && _.isEmpty(groupAppointment)) {
        if (!isOfflineMode)
          getCategoriesByStaff(profileStaffLogin?.staffId, () => {});
        setSelectStaffFromCalendar(profileStaffLogin?.staffId, true);
      }
    }, [profileStaffLogin?.staffId])
  );

  const addBlockAppointment = () => {};
  const getPriceOfline = (basket) => {
    let total = 0;
    for (let i = 0; i < basket?.length; i++) {
      if (basket[i].type === "Product") {
        total =
          total + parseFloat(basket[i].data.price) * basket[i].quanlitySet;
      } else {
        total = total + formatNumberFromCurrency(basket[i].data.price);
      }
    }
    return total;
  };

  const calculateTotalTaxLocal = (basket) => {
    const taxService = profile.taxService
      ? formatNumberFromCurrency(profile.taxService)
      : 0;
    const taxProduct = profile.taxProduct
      ? formatNumberFromCurrency(profile.taxProduct)
      : 0;
    let taxTotal = 0;
    for (let i = 0; i < basket?.length; i++) {
      if (basket[i].type === "Product") {
        taxTotal =
          taxTotal +
          (parseFloat(basket[i].data.price) *
            basket[i].quanlitySet *
            taxProduct) /
            100;
      } else if (basket[i].type === "Service") {
        taxTotal =
          taxTotal +
          (formatNumberFromCurrency(basket[i].data.price) * taxService) / 100;
      }
    }
    return Number(taxTotal).toFixed(2);
  };

  const createItemsAddBasket = (basket) => {
    const { selectedStaff } = stateLocal || {};

    const arrayProductBuy = [];
    const arryaServicesBuy = [];
    const arrayExtrasBuy = [];
    for (let i = 0; i < basket?.length; i++) {
      if (basket[i].type === "Product") {
        arrayProductBuy.push({
          ...basket[i],
          productId: basket[i].data.productId,
          quantity: basket[i].quanlitySet,
        });
      } else if (basket[i].type === "Service") {
        arryaServicesBuy.push({
          ...basket[i],
          serviceId: basket[i].data.serviceId,
          staffId: selectedStaff?.staffId,
          tipAmount: 0,
        });
      } else if (basket[i].type === "Extra") {
        arrayExtrasBuy.push({
          ...basket[i],
          extraId: basket[i].data.extraId,
        });
      }
    }
    return {
      arrayProductBuy,
      arryaServicesBuy,
      arrayExtrasBuy,
      staffId: selectedStaff?.staffId,
    };
  };

  const getBasketOnline = (appointments) => {
    const arrayProductBuy = [];
    const arryaServicesBuy = [];
    const arrayExtrasBuy = [];
    const arrayGiftCards = [];
    const promotionNotes = [];
    appointments.forEach((appointment) => {
      const note = appointment?.promotionNotes?.note || "";
      if (note) {
        promotionNotes.push(note);
      }
      // ------ Push Service -------
      appointment?.services.forEach((service) => {
        arryaServicesBuy.push({
          type: "Service",
          data: {
            name: service?.serviceName || "",
            price: service?.price || "",
          },
          staff: service?.staff || false,
          note: service?.note || "",
        });
      });

      // ------ Push Product -------
      appointment?.products.forEach((product) => {
        arrayProductBuy.push({
          type: "Product",
          data: {
            name: product?.productName || "",
            price: product?.price || "",
          },
          quanlitySet: product?.quantity || "",
        });
      });

      // ------ Push Product -------
      appointment?.extras.forEach((extra) => {
        arrayExtrasBuy.push({
          type: "Extra",
          data: {
            name: extra?.extraName || "",
            price: extra?.price || "",
          },
        });
      });

      // ------ Push Gift Card -------
      appointment?.giftCards.forEach((gift) => {
        arrayGiftCards.push({
          type: "GiftCards",
          data: {
            name: gift?.name || "Gift Card",
            price: gift?.price || "",
          },
          quanlitySet: gift?.quantity || "",
        });
      });
    });

    return {
      arryaServicesBuy,
      arrayProductBuy,
      arrayExtrasBuy,
      arrayGiftCards,
      promotionNotes,
    };
  };

  const getPaymentString = (type) => {
    let method = "";
    switch (type) {
      case "HarmonyPay":
        method = "harmony";
        break;
      case "Cash":
        method = "cash";
        break;
      case "Credit Card":
        method = "credit_card";
        break;
      case "Debit Card":
        method = "credit_card";
        break;
      case "Gift Card":
        method = "giftcard";
        break;
      case "Other":
        method = "other";
        break;
      default:
        method = "";
    }
    return method;
  };

  // const createAnymousAppointment = async () => {
  //   const {
  //     paymentSelected,
  //     customDiscountPercentLocal,
  //     customDiscountFixedLocal,
  //     selectedStaff,
  //   } = stateLocal || {};

  //   const dataAnymousAppoitment = getBasketOffline();

  //   const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy } =
  //     dataAnymousAppoitment;

  //   const moneyUserGiveForStaff = parseFloat(
  //     formatNumberFromCurrency(modalBillRef.current?.state.quality)
  //   );

  //   const method = getPaymentString(paymentSelected);
  //   dispatch(
  //     actions.appointment.createAnymousAppointment(
  //       profile.merchantId,
  //       customerInfoBuyAppointment?.userId || 0,
  //       customerInfoBuyAppointment?.customerId || 0,
  //       // profileStaffLogin.staffId,
  //       selectedStaff?.staffId,
  //       arrayProductBuy,
  //       arryaServicesBuy,
  //       arrayExtrasBuy,
  //       method,
  //       true,
  //       customDiscountFixedLocal,
  //       customDiscountPercentLocal,
  //       customerInfoBuyAppointment?.firstName || "",
  //       customerInfoBuyAppointment?.lastName || "",
  //       customerInfoBuyAppointment?.phone || "",
  //       moneyUserGiveForStaff,
  //       false,
  //       false
  //     )
  //   );

  //   dispatchLocal(
  //     CheckoutState.setBasket({
  //       basket: [],
  //       customDiscountPercentLocal: 0,
  //       customDiscountFixedLocal: 0,
  //     })
  //   );
  // };

  const createNewAppointment = async (basket) => {
    const {
      paymentSelected,
      customDiscountPercentLocal,
      customDiscountFixedLocal,
      selectedStaff,
    } = stateLocal || {};

    const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy } =
      createItemsAddBasket(basket);

    const moneyUserGiveForStaff = parseFloat(
      formatNumberFromCurrency(modalBillRef.current?.state.quality)
    );

    const method = getPaymentString(paymentSelected);

    dispatch(
      actions.appointment.createAnymousAppointment(
        profile.merchantId,
        customerInfoBuyAppointment?.userId || 0,
        customerInfoBuyAppointment?.customerId || 0,
        // profileStaffLogin.staffId,
        selectedStaff?.staffId,
        arrayProductBuy,
        arryaServicesBuy,
        arrayExtrasBuy,
        method,
        true,
        customDiscountFixedLocal,
        customDiscountPercentLocal,
        customerInfoBuyAppointment?.firstName || "",
        customerInfoBuyAppointment?.lastName || "",
        customerInfoBuyAppointment?.phone || "",
        moneyUserGiveForStaff,
        false,
        false
      )
    );

    dispatchLocal(
      CheckoutState.setBasket({
        basket: [],
        customDiscountPercentLocal: 0,
        customDiscountFixedLocal: 0,
      })
    );
  };

  const removeItemInBlockAppointment = (dataRemove) => {
    let isAppointmentIdOpen = "";
    for (let i = 0; i < blockAppointmentRef.length; i++) {
      if (!blockAppointmentRef[i].state.isCollapsed) {
        isAppointmentIdOpen =
          blockAppointmentRef[i].props.appointmentDetail.appointmentId;
        break;
      }
    }
    const appointmentId = isAppointmentIdOpen
      ? isAppointmentIdOpen
      : blockAppointments[0].appointmentId;

    dispatch(
      actions.appointment.removeItemIntoAppointment(
        dataRemove,
        appointmentId,
        false,
        true
      )
    );
  };

  return {
    categoriesRef,
    amountRef,
    popupDiscountRef,
    popupDiscountLocalRef,
    changeTipRef,
    popupCheckDiscountPermissionRef,

    isGetCategoriesByStaff,
    isLoadingService: isGetServiceByStaff || isGetProductByStaff,
    isCustomService: profile?.isCustomService,
    customerInfoBuyAppointment,
    groupAppointment,
    paymentDetailInfo,
    blockAppointments,
    isBookingFromCalendar,
    isDonePayment,
    categoriesByMerchant,
    isOfflineMode,
    customService,
    staffListCurrentDate,
    loginStaff: profileStaffLogin,
    ...stateLocal,

    displayCustomerInfoPopup: () => {},
    displayEnterUserPhonePopup: () => {},
    addAppointmentCheckout: () => {},
    cancelHarmonyPayment: () => {},
    payBasket: () => {},
    confimPayOfflinemode: () => {},
    bookAppointmentFromCalendar: () => {},
    selectPayment: () => {},
    bookBlockAppointment: () => {},
    checkBlockAppointment: () => {},
    onSelectGiftCard: () => {},
    displayCategoriesColumn: (staff) => {
      console.log(staff);
      if (!isOfflineMode) {
        getCategoriesByStaff(staff.staffId);
      }
      dispatchLocal(CheckoutState.selectStaff(staff));
    },
    getDataColProduct: () => {
      const {
        categoryTypeSelected,
        categorySelected,
        isBlockBookingFromCalendar,
        serviceStaff,
        productStaff,
      } = stateLocal || {};

      if (categoryTypeSelected === "Extra") {
        const dataExtra = extrasByMerchant?.filter(
          (extra, index) => extra?.isDisabled === 0
        );

        return dataExtra;
      } else {
        const data =
          categoryTypeSelected === "Service"
            ? servicesByMerchant
            : productsByMerchantId;

        if (data?.length > 0) {
          let temptData = data.filter((item) => {
            return (
              item?.categoryId === categorySelected?.categoryId &&
              item?.isDisabled === 0
            );
          });

          if (!isOfflineMode && !isBlockBookingFromCalendar) {
            if (categoryTypeSelected === "Service") {
              temptData = [...serviceStaff];
            } else if (categoryTypeSelected === "Product") {
              temptData = [...productStaff];
            }
          }

          return temptData;
        }

        return [];
      }
    },
    onPressSelectCategory: (category) => {
      if (_.isNil(category) || _.isEmpty(category)) return;

      const { categorySelected, isBlockBookingFromCalendar, selectedStaff } =
        stateLocal;
      const { categoryId, categoryType } = category;
      if (categorySelected?.categoryId !== categoryId) {
        if (!isOfflineMode && !isBlockBookingFromCalendar) {
          if (categoryType?.toString().toLowerCase() === "service") {
            getServiceByStaff({ categoryId, staffId: selectedStaff?.staffId });
          } else if (categoryType?.toString().toLowerCase() === "product") {
            getProductByStaff(categoryId);
          }
        }
        dispatchLocal(CheckoutState.selectCategory(category));
      } else {
        dispatchLocal(CheckoutState.selectCategory(null));
      }
    },
    showCustomServiceAmount: (item) => {
      const { selectedStaff } = stateLocal || {};
    },
    showColAmount: (item) => {
      const { categorySelected, productSeleted } = stateLocal || {};
      const categoryType = categorySelected?.categoryType;
      let isExist = false;

      if (
        categoryType === "Service" &&
        productSeleted?.serviceId == item?.serviceId
      ) {
        isExist = true;
      } else if (
        categoryType === "Product" &&
        productSeleted?.productId == item?.productId
      ) {
        isExist = true;
      }

      dispatchLocal(CheckoutState.selectCategoryItem(item, isExist));
    },
    getExtrasFromRedux: (product) => {
      const extrasBySort = [];

      for (let i = 0; i < extrasByMerchant.length; i++) {
        for (let j = 0; j < product?.extras?.length; j++) {
          const extraLocal = product?.extras[j];
          const extralGlobal = extrasByMerchant[i];
          if (
            extralGlobal.extraId === extraLocal.extraId &&
            extralGlobal.isDisabled === 0
          ) {
            extrasBySort.push(extralGlobal);
            break;
          }
        }
      }

      return extrasBySort;
    },
    onPressSelectExtra: (extra) => {
      const { arrSelectedExtra } = stateLocal || {};

      let tempArrSelectedExtra;
      let isExist = false;
      for (let i = 0; i < arrSelectedExtra?.length; i++) {
        if (arrSelectedExtra[i]?.extraId === extra?.extraId) {
          isExist = true;
          break;
        }
      }
      if (isExist) {
        tempArrSelectedExtra = arrSelectedExtra.filter(
          (selectedExtra) => selectedExtra?.extraId !== extra?.extraId
        );
      } else {
        tempArrSelectedExtra = [...arrSelectedExtra];
        tempArrSelectedExtra.push(extra);
      }

      dispatchLocal(CheckoutState.selectExtraItem(tempArrSelectedExtra));
    },
    // !! func add service/product/extra items to basket
    addAmount: async () => {
      const {
        categoryTypeSelected,
        productSeleted,
        arrSelectedExtra,
        selectedStaff,
        customServiceSelected,
      } = stateLocal || {};

      // ------------ Block Booking -------------
      if (blockAppointments.length > 0) {
        addBlockAppointment();
        return;
      }

      // -------------  Group Appointment  ------------
      if (!_.isEmpty(groupAppointment)) {
        const appointments = groupAppointment?.appointments || [];
        const mainAppointmentId = groupAppointment?.mainAppointmentId || 0;
        let body = {};
        // -------------  Add Product  ------------
        if (categoryTypeSelected === "Product") {
          body = {
            services: [],
            extras: [],
            products: [
              {
                productId: productSeleted?.productId,
                quantity: this.amountRef.current?.state.quanlity,
              },
            ],
            giftCards: [],
          };
        } else {
          //  -------------Add Extra , Service ---------
          const mainAppointment = appointments.find(
            (appointment) => appointment.appointmentId === mainAppointmentId
          );
          const temptExtra = [];
          for (let i = 0; i < arrSelectedExtra.length; i++) {
            temptExtra.push({ extraId: arrSelectedExtra[i]?.extraId });
          }

          body = {
            services: [
              {
                serviceId:
                  productSeleted?.serviceId ?? customServiceSelected.serviceId,
                // staffId: mainAppointment?.staff?.staffId || profileStaffLogin.staffId,
                staffId: selectedStaff?.staffId,
                ...(customServiceSelected && {
                  categoryId: customServiceSelected?.categoryId,
                  price: customServiceSelected?.price,
                }),
              },
            ],
            extras: temptExtra,
            products: [],
            giftCards: [],
          };
        }

        if (appointments.length > 1) {
          popupAddItemIntoAppointmentsRef.current?.setStateFromParent(
            body,
            mainAppointmentId
          );
        } else {
          dispatch(
            actions.appointment.addItemIntoAppointment(
              body,
              mainAppointmentId,
              true
            )
          );
        }
      }
      // ------------- Create  Group Appointment  ------------
      else {
        // Handle add from tab check out
        // -------------  Add Product  ------------
        if (categoryTypeSelected === "Product") {
          const temptBasket = [];
          temptBasket.unshift({
            type: "Product",
            id: `${productSeleted?.productId}_pro`,
            data: {
              name: productSeleted?.name || "",
              productId: productSeleted?.productId || 0,
              price: productSeleted?.price || 0,
            },
            quanlitySet: amountRef?.current?.state.quanlity || 1,
          });

          dispatchLocal(
            CheckoutState.setBasket({
              basket: temptBasket,
              subTotalLocal: getPriceOfline(temptBasket),
              taxLocal: calculateTotalTaxLocal(temptBasket),
            })
          );

          if (!isOfflineMode) {
            createNewAppointment(temptBasket);
          }
        } else {
          //  -------------Add Extra , Service ---------
          const temptBasket = [];
          temptBasket.unshift({
            type: "Service",
            id: `${
              productSeleted?.serviceId ?? customServiceSelected?.serviceId
            }_ser`,
            data: {
              name: productSeleted?.name ?? "Custom Service",
              serviceId:
                productSeleted?.serviceId ?? customServiceSelected?.serviceId,
              price: productSeleted?.price ?? customServiceSelected?.price,
            },
            serviceName: productSeleted?.name ?? "Custom Service",
            staff: {
              staffId: profileStaffLogin.staffId,
              imageUrl: profileStaffLogin.imageUrl,
              displayName: profileStaffLogin.displayName,
              tip: 0.0,
            },
            ...(customServiceSelected && {
              categoryId: customServiceSelected?.categoryId,
              price: customServiceSelected?.price,
            }),
          });

          for (let i = 0; i < arrSelectedExtra.length; i++) {
            temptBasket.unshift({
              type: "Extra",
              id: `${arrSelectedExtra[i]?.extraId}_extra`,
              data: {
                name: arrSelectedExtra[i]?.name,
                extraId: arrSelectedExtra[i]?.extraId,
                price: arrSelectedExtra[i]?.price,
              },
              serviceName: productSeleted?.name,
            });
          }

          dispatchLocal(
            CheckoutState.setBasket({
              basket: temptBasket,
              subTotalLocal: getPriceOfline(temptBasket),
              taxLocal: calculateTotalTaxLocal(temptBasket),
            })
          );

          if (!isOfflineMode) {
            createNewAppointment(temptBasket);
          }
        }
      }

      dispatchLocal(CheckoutState.selectCategory(null)); // reset
    },
    removeItemBasket: (item, appointmentId = -1, isGroup = false) => {
      const { basket } = stateLocal || {};

      if (appointmentId !== -1) {
        // ----- Remove With Appointmnet
        let dataRemove = {};
        switch (item.type) {
          case "Product":
            dataRemove = {
              services: [],
              extras: [],
              products: [{ bookingProductId: item.data.bookingProductId }],
            };
            break;
          case "Service":
            dataRemove = {
              services: [{ bookingServiceId: item.data.bookingServiceId }],
              extras: [],
              products: [],
            };
            break;
          case "Extra":
            dataRemove = {
              services: [],
              extras: [{ bookingExtraId: item.data.bookingExtraId }],
              products: [],
            };
            break;
          case "GiftCards":
            dataRemove = {
              services: [],
              extras: [{ bookingExtraId: item.data.bookingExtraId }],
              products: [],
              giftCards: [{ bookingGiftCardId: item.data.bookingGiftCardId }],
            };
            break;
        }
        if (blockAppointments.length > 0) {
          removeItemInBlockAppointment(dataRemove);
        } else {
          dispatch(
            actions.appointment.removeItemIntoAppointment(
              dataRemove,
              appointmentId,
              isGroup
            )
          );
        }
      } else {
        // -------- Remove Offline --------
        const temptBasket = basket.filter(
          (itemBasket) => itemBasket.id !== item.id
        );

        dispatchLocal(
          CheckoutState.setBasket({
            basket: temptBasket,
            subTotalLocal: getPriceOfline(temptBasket),
            taxLocal: calculateTotalTaxLocal(temptBasket),
          })
        );
      }
    },
    changeStylist: async (service, appointmentId) => {
      const { fromTime = new Date() } =
        groupAppointment?.appointments?.find(
          (appointment) => appointment.appointmentId === appointmentId
        ) || {};

      changeStylistRef.current?.setStateFromParent(service, appointmentId);

      if (!isOfflineMode) {
        dispatch(
          actions.staff.getStaffService(
            service?.data?.serviceId,
            formatWithMoment(fromTime, "MM/DD/YYYY"), // Fix for case custom service not contains by staff, so get staff no data here!
            this.callBackGetStaffService
          )
        );
      } else {
        // this.setState({ visibleChangeStylist: true });
      }
    },
    toggleCollapses: (appointmentIdSelection) => {
      for (let i = 0; i < blockAppointmentRef.length; i++) {
        const appointmentDetail =
          blockAppointmentRef[i].props.appointmentDetail;
        if (
          appointmentDetail &&
          appointmentDetail.appointmentId === appointmentIdSelection
        ) {
          dispatch(
            actions.appointment.updateIdBlockAppointmentOpen(
              appointmentDetail.appointmentId
            )
          );
          blockAppointmentRef[i].setStateFromParent(false);
        } else {
          blockAppointmentRef[i].setStateFromParent(true);
        }
      }
    },
    changeProduct: (product, appointmentId) => {
      changePriceAmountProductRef.current?.setStateFromParent(
        product,
        appointmentId
      );

      dispatchLocal(CheckoutState.visibleEditProductForm(true));
    },
    removeBlockAppointment: () => {
      const customerId = customerInfoBuyAppointment.customerId
        ? customerInfoBuyAppointment.customerId
        : 0;

      dispatch(
        actions.appointment.cancleAppointment(
          appointmentId,
          profile.merchantId,
          customerId,
          true,
          false
        )
      );
    },
    createABlockAppointment: () => {
      const { selectedStaff } = stateLocal || {};

      let fromTime = fromTimeBlockAppointment;
      if (blockAppointments && blockAppointments.length > 0) {
        fromTime = l.get(blockAppointments, "0.fromTime")
          ? moment(l.get(blockAppointments, "0.fromTime")).local().format()
          : new Date();
      }

      const firstAppointment = blockAppointments[0];

      if (
        firstAppointment &&
        firstAppointment.status &&
        firstAppointment.status === "waiting"
      ) {
        dispatch(
          actions.appointment.createAppointmentWaiting(
            profile.merchantId,
            fromTime,
            customerInfoBuyAppointment?.userId || 0,
            customerInfoBuyAppointment?.customerId || 0,
            customerInfoBuyAppointment?.firstName || "",
            customerInfoBuyAppointment?.lastName || "",
            customerInfoBuyAppointment?.phone || "",
            bookingGroupId,
            selectedStaff?.staffId ?? 0
          )
        );
      } else {
        dispatch(
          actions.appointment.createBlockAppointment(
            profile.merchantId,
            fromTime,
            customerInfoBuyAppointment?.userId || 0,
            customerInfoBuyAppointment?.customerId || 0,
            customerInfoBuyAppointment?.firstName || "",
            customerInfoBuyAppointment?.lastName || "",
            customerInfoBuyAppointment?.phone || "",
            bookingGroupId,
            selectedStaff?.staffId ?? 0
          )
        );
      }
    },
    addBlockAppointment: async () => {
      const {
        categoryTypeSelected,
        productSeleted,
        arrSelectedExtra,
        customServiceSelected,
        selectedStaff,
      } = stateLocal || {};

      let isAppointmentIdOpen = "";

      for (let i = 0; i < blockAppointmentRef.length; i++) {
        if (!blockAppointmentRef[i].state.isCollapsed) {
          isAppointmentIdOpen =
            blockAppointmentRef[i].props.appointmentDetail.appointmentId;
          break;
        }
      }

      const appointmentId = isAppointmentIdOpen
        ? isAppointmentIdOpen
        : isOpenBlockAppointmentId;

      if (categoryTypeSelected === "Product") {
        dispatch(
          actions.appointment.addItemIntoAppointment(
            {
              services: [],
              extras: [],
              products: [
                {
                  productId: productSeleted?.productId,
                  quantity: this.amountRef.current?.state.quanlity,
                },
              ],
              giftCards: [],
            },
            appointmentId,
            false,
            true
          )
        );
      } else {
        // ------------- Buy online Extra , Service ---------

        const temptExtra = [];
        for (let i = 0; i < arrSelectedExtra.length; i++) {
          temptExtra.push({ extraId: arrSelectedExtra[i]?.extraId });
        }
        dispatch(
          actions.appointment.addItemIntoAppointment(
            {
              services: [
                {
                  serviceId:
                    productSeleted?.serviceId ??
                    customServiceSelected?.serviceId,
                  ...(selectedStaff?.staffId && {
                    staffId: selectedStaff?.staffId,
                  }),
                  ...(customServiceSelected && {
                    categoryId: customServiceSelected?.categoryId,
                    price: customServiceSelected?.price,
                  }),
                },
              ],
              extras: temptExtra,
              products: [],
              giftCards: [],
            },
            appointmentId,
            false,
            true
          )
        );
      }

      dispatchLocal(CheckoutState.selectCategory(null)); // reset
    },
    onRequestClosePopupDiscountLocal: async () => {
      dispatchLocal(CheckoutState.visiblePopupDiscountLocal(false)); // reset
    },

    showModalDiscount: (appointmentId) => {
      if (_.isEmpty(connectionSignalR)) {
        const {
          subTotalLocal,
          discountTotalLocal,
          customDiscountPercentLocal,
          customDiscountFixedLocal,
        } = stateLocal || {};

        if (appointmentId !== -1) {
          const appointment = groupAppointment?.appointments?.find(
            (appointment) => appointment.appointmentId === appointmentId
          );
          const { services, products, extras, giftCards } = appointment;
          const arrayProducts = getArrayProductsFromAppointment(products);
          const arryaServices = getArrayServicesFromAppointment(services);
          const arrayExtras = getArrayExtrasFromAppointment(extras);
          const arrayGiftCards = getArrayGiftCardsFromAppointment(giftCards);
          const temptBasket = arrayProducts.concat(
            arryaServices,
            arrayExtras,
            arrayGiftCards
          );

          if (temptBasket.length > 0) {
            dispatch(
              actions.marketing.getPromotionByAppointment(appointmentId)
            );
          }
        } else {
          popupDiscountLocalRef.current?.setStateFromParent(
            subTotalLocal,
            discountTotalLocal,
            customDiscountPercentLocal,
            customDiscountFixedLocal
          );

          dispatchLocal(CheckoutState.visiblePopupDiscountLocal(true)); // reset
        }
      } else {
        alert("You are paying by Harmony Payment!");
      }
    },
    showModalTipAppointment: (appointmentId, tip, subTotal, tipPercent) => {
      if (_.isEmpty(connectionSignalR)) {
        changeTipRef.current?.setStateFromParent(
          appointmentId,
          tip,
          subTotal,
          tipPercent
        );
        dispatchLocal(CheckoutState.visibleChangeTip(true)); // reset
      } else {
        alert("You are paying by Harmony Payment!");
      }
    },
    showModalCheckPermission: () => {
      popupCheckDiscountPermissionRef?.current?.setStateFromParent(
        "",
        appointmentId,
        isBlock
      );
      dispatch(actions.marketing.switchPopupCheckDiscountPermission(true));
    },
    closePopupCheckDiscountPermission: () => {
      dispatch(actions.marketing.switchPopupCheckDiscountPermission(false));
    },
  };
};
