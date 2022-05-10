import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as CheckoutState from "./SalonCheckoutState";
import { useCallApis } from "./useCallApis";
import { useFocusEffect } from "@react-navigation/native";
import _ from "lodash";

export const useProps = ({ props }) => {
  const categoriesRef = React.useRef(null);

  const {
    customerInfoBuyAppointment,
    groupAppointment,
    paymentDetailInfo,
    blockAppointments,
    isBookingFromCalendar,
    isDonePayment,
    staffListCurrentDate,
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

  const [stateLocal, dispatchLocal] = React.useReducer(
    CheckoutState.reducer,
    CheckoutState.initState
  );
  // console.log(stateLocal);

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

  return {
    categoriesRef,

    ...stateLocal,
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
    showCustomServiceAmount: () => {},
    showColAmount: () => {},
    displayCategoriesColumn: (staff) => {
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
  };
};
