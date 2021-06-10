import React from 'react';
import {
  useGetAppointment,
  useCancelAppointment,
  useConfirmAppointment,
  useShippingAppointment,
  useCompleteAppointment,
  useReturnAppointment,
  useEditNotes,
} from '@shared/services/api/retailer';
import { CustomerGroupTypes, NEED_TO_ORDER } from '@shared/utils/app';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import NavigationServices from '@navigators/NavigatorServices';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import {
  BIRTH_DAY_DATE_FORMAT_STRING,
  statusSuccess,
  dateToString,
} from '@shared/utils';

const log = (obj, message = '') => {
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
  const [appointmentReturn, returnAppointment] = useReturnAppointment();
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
    }, [orderId, order]),
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
      NavigationServices.navigate('retailer.home.order.list', { reload: true });

      return;
    }
  }, [appointmentCancel]);

  React.useEffect(() => {
    const { codeStatus, message, data } =
      appointmentConfirm || appointmentShipping || appointmentComplete || {};
    if (statusSuccess(codeStatus)) {
      getAppointment(appointmentDetail?.appointmentId);
    }
  }, [appointmentShipping, appointmentConfirm, appointmentComplete]);

  return {
    item: appointmentDetail,
    goBack: () => {
      NavigationServices.navigate('retailer.home.order.list', { reload: true });
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
        billingAddressId: appointmentDetail?.billingAddress?.id,
        shippingAddressId: appointmentDetail?.shippingAddress?.id,
        didNotPay: false,
      });
      confirmAppointment(params, appointmentDetail?.appointmentId);
    },
    complete: () => {
      completeAppointment(appointmentDetail?.appointmentId);
    },
    onChangeShippingMethod: (shipping) => {
      setShippingMethod(shipping);
    },
    onSubmitNotes: (noteText) => {
      editNote({ notes: noteText }, appointmentDetail?.appointmentId);
    },
  };
};
