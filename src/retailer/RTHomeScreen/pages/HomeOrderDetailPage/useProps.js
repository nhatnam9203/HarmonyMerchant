import React from "react";
import {
  useGetAppointment,
  useCancelAppointment,
  useConfirmAppointment,
  useShippingAppointment,
  useCompleteAppointment,
  useReturnAppointment,
  useEditNotes,
} from "@shared/services/api/retailer";
import { CustomerGroupTypes, NEED_TO_ORDER } from "@shared/utils/app";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import NavigationServices from "@navigators/NavigatorServices";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import {
  BIRTH_DAY_DATE_FORMAT_STRING,
  statusSuccess,
  dateToString,
} from "@shared/utils";

const log = (obj, message = "") => {
  Logger.log(`[HomeOrderDetail] ${message}`, obj);
};

export const useProps = ({ params: { order, orderId } }) => {
  const [appointmentDetail, setAppointmentDetail] = React.useState(null);
  const [shippingMethod, setShippingMethod] = React.useState(null);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [appointment, getAppointment] = useGetAppointment();

  const [appointmentCancel, cancelAppointment] = useCancelAppointment();
  const [appointmentConfirm, confirmAppointment] = useConfirmAppointment();
  const [appointmentShipping, shippingAppointment] = useShippingAppointment();
  const [appointmentComplete, completeAppointment] = useCompleteAppointment();
  const [, editNote] = useEditNotes();

  /**
  |--------------------------------------------------
  | USE EFFECT
  |--------------------------------------------------
  */

  useFocusEffect(
    React.useCallback(() => {
      if (orderId || order?.appointmentId)
        getAppointment(orderId || order.appointmentId);
    }, [orderId, order])
  );

  React.useEffect(() => {
    if (appointment?.data) {
      setAppointmentDetail(appointment?.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment]);

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentCancel || {};
    if (statusSuccess(codeStatus)) {
      NavigationServices.navigate("retailer.home.order.list", { reload: true });
    }
  }, [appointmentCancel]);

  React.useEffect(() => {
    const { codeStatus, message, data } =
      appointmentShipping || appointmentComplete || {};
    if (statusSuccess(codeStatus)) {
      getAppointment(appointmentDetail?.appointmentId);
    }
  }, [appointmentShipping, appointmentComplete]);

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentConfirm || {};
    if (statusSuccess(codeStatus)) {
      NavigationServices.navigate("retailer.home.order.pay", {
        orderItem: appointmentDetail,
      });
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
      NavigationServices.navigate("retailer.home.order.list", { reload: true });
    },
    cancel: () => {
      cancelAppointment(appointmentDetail?.appointmentId);
    },
    shipping: () => {
      shippingAppointment(appointmentDetail?.appointmentId);
    },
    confirm: () => {
      if (appointmentDetail?.payment?.length <= 0) {
        NavigationServices.navigate("retailer.home.order.pay", {
          orderItem: appointmentDetail,
        });
      } else {
        const params = Object.assign({}, shippingMethod, {
          shippingAmount: 0,
          billingAddressId: appointmentDetail?.billingAddress?.id,
          shippingAddressId: appointmentDetail?.shippingAddress?.id,
          didNotPay: false,
        });
        confirmAppointment(params, appointmentDetail?.appointmentId);
      }
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
  };
};
