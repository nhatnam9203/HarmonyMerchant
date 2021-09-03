import NavigationServices from "@navigators/NavigatorServices";
import { useFocusEffect } from "@react-navigation/native";
import { ORDERED_STATUS } from "@shared/components/OrderStatusView";
import {
  useCancelAppointment,
  useCompleteAppointment,
  useConfirmAppointment,
  useEditNotes,
  useGetAppointment,
  useShippingAppointment,
} from "@shared/services/api/retailer";
import { statusSuccess, PURCHASE_POINTS_STORE } from "@shared/utils";
import React from "react";
import { useDispatch } from "react-redux";
import { basketRetailer } from "@redux/slices";

const log = (obj, message = "") => {
  Logger.log(`[HomeOrderDetail] ${message}`, obj);
};

export const useProps = ({
  params: {
    order,
    orderId,
    addressId,
    addressCreate,
    editShippingAddress,
    editBillingAddress,
    screenId,
    backScreenId,
  },
  navigation,
}) => {
  const formAddressRef = React.useRef(null);
  const dispatch = useDispatch();

  const [appointmentDetail, setAppointmentDetail] = React.useState(null);
  const [shippingMethod, setShippingMethod] = React.useState(null);

  const [shippingAddressId, setShippingAddressId] = React.useState(null);
  const [billingAddressId, setBillingAddressId] = React.useState(null);
  const [isDidNotPay, setDidNotPay] = React.useState(false);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [appointmentGet, getAppointment] = useGetAppointment();

  const [appointmentCancel, cancelAppointment] = useCancelAppointment();
  const [appointmentConfirm, confirmAppointment] = useConfirmAppointment();
  const [appointmentShipping, shippingAppointment] = useShippingAppointment();
  const [appointmentComplete, completeAppointment] = useCompleteAppointment();
  const [editNoteResponse, editNote] = useEditNotes();

  /**
  |--------------------------------------------------
  | USE EFFECT
  |--------------------------------------------------
  */
  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {});

    const unsubscribeBlur = navigation.addListener("blur", () => {});

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      if (orderId || order?.appointmentId) {
        getAppointment(orderId ?? order.appointmentId);
      }

      if (addressId && addressCreate) {
        if (editBillingAddress) {
          formAddressRef.current?.updateBillingAddress(
            addressId,
            addressCreate
          );

          setBillingAddressId(addressId);

          if (!shippingAddressId) {
            formAddressRef.current?.updateShippingAddress(
              addressId,
              addressCreate
            );

            setShippingAddressId(addressId);
          }
        } else if (editShippingAddress) {
          formAddressRef.current?.updateShippingAddress(
            addressId,
            addressCreate
          );

          setShippingAddressId(addressId);
          if (!billingAddressId) {
            formAddressRef.current?.updateBillingAddress(
              addressId,
              addressCreate
            );

            setBillingAddressId(addressId);
          }
        }
      }
    }, [
      orderId,
      order,
      addressId,
      addressCreate,
      editShippingAddress,
      editBillingAddress,
    ])
  );

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentGet || {};
    if (statusSuccess(codeStatus)) {
      const { status, didNotPay, payment, purchasePoint } = data || {};

      if (payment?.length <= 0) {
        dispatch(basketRetailer.setAppointmentId(data.appointmentId));
        dispatch(basketRetailer.setAppointment(data));

        if (
          (status === ORDERED_STATUS.PENDING ||
            status === ORDERED_STATUS.PROCESS) &&
          purchasePoint === PURCHASE_POINTS_STORE
        ) {
          NavigationServices.navigate("retailer.home.order.pay", {
            orderItem: data,
            screenId: screenId,
            backScreenId: backScreenId,
          });
          return;
        }
      }

      setAppointmentDetail(data);
      formAddressRef.current?.reload();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentGet]);

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentCancel || {};
    if (statusSuccess(codeStatus)) {
      NavigationServices.navigate("retailer.home.order.list", { reload: true });
    }
  }, [appointmentCancel]);

  React.useEffect(() => {
    const { codeStatus, message, data } =
      appointmentShipping || appointmentComplete || editNoteResponse || {};
    if (statusSuccess(codeStatus)) {
      getAppointment(appointmentDetail?.appointmentId);
    }
  }, [appointmentShipping, appointmentComplete, editNoteResponse]);

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentConfirm || {};
    if (statusSuccess(codeStatus)) {
      if (isDidNotPay) {
        dispatch(basketRetailer.clearBasket());
        NavigationServices.navigate("retailer.home.order.list", {
          reload: true,
        });
      } else {
        NavigationServices.navigate("retailer.home.order.pay", {
          orderItem: appointmentDetail,
          screenId: screenId ?? "retailer.home.order.list",
          backScreenId: backScreenId ?? "retailer.home.order.check_out",
        });
      }
    }
  }, [appointmentConfirm]);

  const getPaymentString = (type) => {
    let method = "";
    switch (type) {
      case "harmony":
        method = "HarmonyPay";
        break;
      case "cash":
        method = "Cash";
        break;
      case "credit_card":
        method = "Credit Cards";
        break;
      case "other":
        method = "Other - Check";
        break;
      case "giftcard":
        method = "Gift Card";
        break;
      default:
        method = "Debit Cards";
    }
    return method;
  };
  return {
    item: appointmentDetail,
    goBack: () => {
      if (backScreenId) {
        NavigationServices.navigate(backScreenId, {
          reload: true,
          reset: false,
          reloadAppointmentId: appointmentDetail?.appointmentId,
        });
      } else {
        dispatch(basketRetailer.clearBasket());
        NavigationServices.navigate("retailer.home.order.list", {
          reload: true,
        });
      }
    },
    cancel: () => {
      cancelAppointment(appointmentDetail?.appointmentId);
    },
    shipping: () => {
      shippingAppointment(appointmentDetail?.appointmentId);
    },
    confirm: () => {
      const params = Object.assign({}, shippingMethod, {
        shippingAmount: 0,
        billingAddressId:
          billingAddressId ?? appointmentDetail?.billingAddress?.id,
        shippingAddressId:
          shippingAddressId ?? appointmentDetail?.shippingAddress?.id,
        didNotPay: isDidNotPay,
      });
      confirmAppointment(params, appointmentDetail?.appointmentId);
    },
    complete: () => {
      completeAppointment(appointmentDetail?.appointmentId);
    },
    refund: () => {
      NavigationServices.navigate("retailer.home.order.return", {
        item: appointmentDetail,
      });
    },
    onChangeShippingMethod: (shipping) => {
      setShippingMethod(shipping);
    },
    onSubmitNotes: (noteText) => {
      editNote({ notes: noteText }, appointmentDetail?.appointmentId);
    },
    getPaymentString,
    onEditShippingAddress: (selectAddressId) => {
      setShippingAddressId(selectAddressId);
    },
    onEditBillingAddress: (selectAddressId) => {
      setBillingAddressId(selectAddressId);
    },
    formAddressRef,
    onDidNotPayCheck: (checked) => {
      setDidNotPay(checked);
    },
  };
};
